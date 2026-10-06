import { OFFER, OFFER_PRICE } from "@/lib/offer";
import { classifyPayment, isValidPaymentId, type PaymentLookup } from "@/lib/paymentCore";

export { isValidPaymentId, type PaymentLookup };

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
 * Consulta o pagamento direto no Mercado Pago e devolve um estado único, já conferido contra o
 * produto (valor em centavos, moeda, referência). Nunca lança: falhas viram "unavailable".
 * Chamadas vindas do navegador devem passar por guardedPaymentLookup (lib/paymentAccess.ts).
 */
export async function lookupPayment(paymentId: string): Promise<PaymentLookup> {
  if (!isValidPaymentId(paymentId)) return { state: "not_found", paymentId };
  if (!isCheckoutConfigured()) return { state: "unavailable", paymentId };

  let payment: MercadoPagoPaymentResponse;
  try {
    payment = await getPaymentDetails(paymentId);
  } catch (error) {
    if (error instanceof PaymentLookupError && (error.status === 404 || error.status === 400)) {
      return { state: "not_found", paymentId };
    }
    return { state: "unavailable", paymentId };
  }

  const lookup = classifyPayment(payment, {
    priceCents: PRODUCT_CONFIG.priceCents,
    currencyId: PRODUCT_CONFIG.currencyId,
    externalReference: PRODUCT_CONFIG.externalReference,
  });
  if (lookup.state === "invalid") {
    console.warn(`[MercadoPago] Pagamento ${lookup.paymentId} não é do produto: ${lookup.reason}`);
  }
  return lookup;
}
