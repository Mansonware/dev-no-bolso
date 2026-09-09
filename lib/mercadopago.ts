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
  [key: string]: unknown;
}

export const PRODUCT_CONFIG = {
  id: "DEV_NO_BOLSO_TURMA_01",
  title: "DEV NO BOLSO — Turma Fundadora #01",
  unitPrice: 20,
  currencyId: "BRL",
  quantity: 1,
  externalReference: "DEV_NO_BOLSO_TURMA_01",
} as const;

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
        description: "Acesso à Turma Fundadora #01 do DEV NO BOLSO - 3 aulas, gravações, prompts e suporte.",
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
    throw new Error(`Pagamento ${cleanPaymentId} não encontrado ou inválido.`);
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
  if (amount !== PRODUCT_CONFIG.unitPrice) {
    return {
      valid: false,
      paymentId: paymentIdStr,
      status: payment.status,
      transactionAmount: amount,
      reason: `Valor pago (R$ ${amount}) diverge do valor oficial (R$ ${PRODUCT_CONFIG.unitPrice}).`,
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
