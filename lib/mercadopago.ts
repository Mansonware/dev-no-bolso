import { OFFER, OFFER_PRICE } from "@/lib/offer";

export interface MercadoPagoPreferenceItem {
  id: string;
  title: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
  description?: string;
}

export interface MercadoPagoPreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
  [key: string]: unknown;
}

export interface MercadoPagoPaymentResponse {
  id: number | string;
  status: string;
  status_detail?: string;
  transaction_amount: number;
  currency_id: string;
  external_reference?: string;
  date_approved?: string;
  // Só o e-mail do pagador é lido — usado para vincular a conta à compra.
  payer?: { email?: string | null } | null;
  [key: string]: unknown;
}

/**
 * Erro de consulta ao Mercado Pago com o status HTTP da API (404 = pagamento inexistente).
 */
export class PaymentLookupError extends Error {
  constructor(public readonly status: number) {
    super(`Consulta de pagamento falhou: HTTP ${status}`);
    this.name = "PaymentLookupError";
  }
}

export const PRODUCT_CONFIG = {
  id: "DEV_NO_BOLSO_V2",
  title: "Dev no Bolso — acesso ao curso",
  unitPrice: OFFER_PRICE,
  priceCents: OFFER.priceCents,
  currencyId: OFFER.currencyId,
  quantity: 1,
  externalReference: "DEV_NO_BOLSO_V2",
} as const;

/**
 * Indica se o checkout real está configurado neste ambiente (sem expor o token).
 */
export function isCheckoutConfigured(): boolean {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN?.trim());
}

/**
 * Retorna o Access Token do Mercado Pago configurado server-side
 */
export function getMercadoPagoAccessToken(): string {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "MERCADOPAGO_ACCESS_TOKEN não está definido nas variáveis de ambiente do servidor."
    );
  }
  return token.trim();
}

/**
 * Cria a preferência de checkout no Mercado Pago Checkout Pro
 */
export async function createCheckoutPreference(siteUrl: string): Promise<MercadoPagoPreferenceResponse> {
  const token = getMercadoPagoAccessToken();

  const cleanSiteUrl = siteUrl.replace(/\/+$/, "");

  const preferencePayload: Record<string, unknown> = {
    items: [
      {
        id: PRODUCT_CONFIG.id,
        title: PRODUCT_CONFIG.title,
        quantity: PRODUCT_CONFIG.quantity,
        currency_id: PRODUCT_CONFIG.currencyId,
        unit_price: PRODUCT_CONFIG.unitPrice,
        description: "Acesso ao curso Dev no Bolso: trilha prática para publicar seu primeiro projeto pelo celular.",
      },
    ],
    back_urls: {
      success: `${cleanSiteUrl}/pagamento/sucesso`,
      pending: `${cleanSiteUrl}/pagamento/pendente`,
      failure: `${cleanSiteUrl}/pagamento/falhou`,
    },
    auto_return: "approved",
    external_reference: PRODUCT_CONFIG.externalReference,
    statement_descriptor: "DEV NO BOLSO",
  };

  // Webhook só pode ser configurado em HTTPS público (não em localhost)
  if (cleanSiteUrl.startsWith("https://") && !cleanSiteUrl.includes("localhost")) {
    preferencePayload.notification_url = `${cleanSiteUrl}/api/webhooks/mercadopago`;
  }

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preferencePayload),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("[MercadoPago API Error] Failed to create preference:", response.status, errorBody);
    throw new Error(`Falha ao criar preferência no Mercado Pago: HTTP ${response.status}`);
  }

  const data: MercadoPagoPreferenceResponse = await response.json();
  return data;
}

/**
 * Consulta um pagamento diretamente na API do Mercado Pago
 */
export async function getPaymentDetails(paymentId: string): Promise<MercadoPagoPaymentResponse> {
  const token = getMercadoPagoAccessToken();

  const cleanPaymentId = encodeURIComponent(paymentId.trim());
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${cleanPaymentId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[MercadoPago API Error] Payment ${cleanPaymentId} lookup failed:`, response.status, errorBody);
    throw new PaymentLookupError(response.status);
  }

  const data: MercadoPagoPaymentResponse = await response.json();
  return data;
}

/**
 * Validação rigorosa dos dados do pagamento contra as regras de negócio
 */
export interface PaymentValidationResult {
  valid: boolean;
  paymentId: string;
  status: string;
  reason?: string;
  transactionAmount?: number;
  currencyId?: string;
}

export function validatePayment(payment: MercadoPagoPaymentResponse): PaymentValidationResult {
  const paymentIdStr = String(payment.id);

  if (payment.status !== "approved") {
    return {
      valid: false,
      paymentId: paymentIdStr,
      status: payment.status,
      reason: `Status do pagamento é '${payment.status}', esperado 'approved'.`,
    };
  }

  const amount = Number(payment.transaction_amount);
  // Compara em centavos para não depender de arredondamento de ponto flutuante (45.99).
  if (!Number.isFinite(amount) || Math.round(amount * 100) !== PRODUCT_CONFIG.priceCents) {
    return {
      valid: false,
      paymentId: paymentIdStr,
      status: payment.status,
      transactionAmount: amount,
      reason: `Valor pago (R$ ${amount}) diverge do valor oficial (${OFFER.priceLabel}).`,
    };
  }

  if (payment.currency_id !== PRODUCT_CONFIG.currencyId) {
    return {
      valid: false,
      paymentId: paymentIdStr,
      status: payment.status,
      currencyId: payment.currency_id,
      reason: `Moeda '${payment.currency_id}' diverge do esperado '${PRODUCT_CONFIG.currencyId}'.`,
    };
  }

  if (payment.external_reference !== PRODUCT_CONFIG.externalReference) {
    return {
      valid: false,
      paymentId: paymentIdStr,
      status: payment.status,
      reason: `Referência externa '${payment.external_reference}' não corresponde a '${PRODUCT_CONFIG.externalReference}'.`,
    };
  }

  return {
    valid: true,
    paymentId: paymentIdStr,
    status: "approved",
    transactionAmount: amount,
    currencyId: payment.currency_id,
  };
}

// IDs de pagamento do Mercado Pago são numéricos; qualquer outra coisa nem chega à API.
const PAYMENT_ID_PATTERN = /^\d{1,20}$/;

export function isValidPaymentId(value: unknown): value is string {
  return typeof value === "string" && PAYMENT_ID_PATTERN.test(value);
}

export type PurchaseVerification =
  | { ok: true; paymentId: string; payerEmail: string }
  | { ok: false; code: "not_found" | "not_eligible" | "payer_email_missing" | "unavailable" };

/**
 * Prova de compra para criar conta: consulta o pagamento direto no Mercado Pago, aplica a
 * validação de status/valor/moeda/referência e devolve o e-mail do pagador normalizado.
 * Sem payer.email não há como vincular a compra a uma pessoa — falha em vez de liberar.
 */
export async function verifyPurchaseForSignup(paymentId: string): Promise<PurchaseVerification> {
  if (!isCheckoutConfigured()) return { ok: false, code: "unavailable" };

  let payment: MercadoPagoPaymentResponse;
  try {
    payment = await getPaymentDetails(paymentId);
  } catch (error) {
    if (error instanceof PaymentLookupError && (error.status === 404 || error.status === 400)) {
      return { ok: false, code: "not_found" };
    }
    return { ok: false, code: "unavailable" };
  }

  const validation = validatePayment(payment);
  if (!validation.valid) {
    console.warn(`[MercadoPago] Pagamento ${validation.paymentId} recusado para cadastro: ${validation.reason}`);
    return { ok: false, code: "not_eligible" };
  }

  const payerEmail = typeof payment.payer?.email === "string" ? payment.payer.email.trim().toLowerCase() : "";
  if (!payerEmail) return { ok: false, code: "payer_email_missing" };

  return { ok: true, paymentId: validation.paymentId, payerEmail };
}
