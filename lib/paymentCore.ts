// Regras puras do pagamento (sem dependências do Next): classificação do retorno do Mercado Pago,
// elegibilidade para cadastro e máscara de e-mail. Testável com `node --test`.
// É a ÚNICA fonte dessas regras — página, API, cadastro e webhook passam por aqui.

/**
 * Estado do pagamento do ponto de vista do comprador.
 *   approved    → aprovado e válido para o Dev no Bolso
 *   pending     → Pix/boleto aguardando, ou em análise
 *   rejected    → recusado ou cancelado
 *   refunded    → devolvido ou contestado (chargeback)
 *   invalid     → não é uma compra do Dev no Bolso (valor/moeda/referência)
 *   not_found   → número de pagamento inexistente
 *   unavailable → não conseguimos falar com o Mercado Pago agora
 */
export type PaymentState = "approved" | "pending" | "rejected" | "refunded" | "invalid" | "not_found" | "unavailable";

/** Estado entregue às telas: inclui o bloqueio por excesso de consultas. */
export type ClientPaymentState = PaymentState | "rate_limited";

export type PaymentLookup =
  | { state: "approved"; paymentId: string; mpStatus: string; payerEmail: string | null }
  | { state: Exclude<PaymentState, "approved">; paymentId: string; mpStatus?: string; reason?: string };

/** Campos do pagamento do Mercado Pago que as regras usam. */
export type MercadoPagoPaymentLike = {
  id: number | string;
  status?: string;
  transaction_amount?: number;
  currency_id?: string;
  external_reference?: string;
  payer?: { email?: string | null } | null;
};

export type ExpectedProduct = { priceCents: number; currencyId: string; externalReference: string };

// IDs de pagamento do Mercado Pago são numéricos; qualquer outra coisa nem chega à API.
const PAYMENT_ID_PATTERN = /^\d{1,20}$/;

export function isValidPaymentId(value: unknown): value is string {
  return typeof value === "string" && PAYMENT_ID_PATTERN.test(value);
}

export function stateFromMercadoPagoStatus(
  status: string | undefined | null
): Exclude<PaymentState, "invalid" | "not_found" | "unavailable"> {
  switch (status) {
    case "approved":
      return "approved";
    case "rejected":
    case "cancelled":
      return "rejected";
    case "refunded":
    case "charged_back":
      return "refunded";
    // pending, in_process, authorized, in_mediation e qualquer status novo: tratar como "ainda não".
    default:
      return "pending";
  }
}

/**
 * Classifica o pagamento retornado pela API do Mercado Pago.
 * Primeiro confere se é o produto (valor em centavos, moeda, referência) — vale para qualquer
 * status, então reembolso de outro produto nunca mexe em acesso do Dev no Bolso. Depois o status.
 */
export function classifyPayment(payment: MercadoPagoPaymentLike, expected: ExpectedProduct): PaymentLookup {
  const paymentId = String(payment.id);
  const mpStatus = String(payment.status ?? "");

  const amount = Number(payment.transaction_amount);
  if (!Number.isFinite(amount) || Math.round(amount * 100) !== expected.priceCents) {
    return { state: "invalid", paymentId, mpStatus, reason: `valor ${amount} diverge do oficial` };
  }
  if (payment.currency_id !== expected.currencyId) {
    return { state: "invalid", paymentId, mpStatus, reason: `moeda ${payment.currency_id} diverge` };
  }
  if (payment.external_reference !== expected.externalReference) {
    return { state: "invalid", paymentId, mpStatus, reason: `referência ${payment.external_reference} diverge` };
  }

  const state = stateFromMercadoPagoStatus(mpStatus);
  if (state !== "approved") return { state, paymentId, mpStatus };

  const email = typeof payment.payer?.email === "string" ? payment.payer.email.trim().toLowerCase() : "";
  return { state: "approved", paymentId, mpStatus, payerEmail: email || null };
}

export type SignupEligibility =
  | { ok: true; paymentId: string; email: string }
  | {
      ok: false;
      code: "pending" | "not_eligible" | "not_found" | "unavailable" | "rate_limited" | "payer_email_missing" | "email_mismatch";
    };

/**
 * Regras para uma compra virar conta. Só passa com pagamento aprovado, do produto, com
 * e-mail do pagador e o e-mail digitado igual ao da compra. Nada vindo do navegador libera sozinho.
 */
export function checkSignupEligibility(
  lookup: PaymentLookup | { state: "rate_limited"; paymentId: string },
  typedEmail: string
): SignupEligibility {
  switch (lookup.state) {
    case "approved": {
      if (!lookup.payerEmail) return { ok: false, code: "payer_email_missing" };
      const email = typedEmail.trim().toLowerCase();
      if (email !== lookup.payerEmail) return { ok: false, code: "email_mismatch" };
      return { ok: true, paymentId: lookup.paymentId, email };
    }
    case "pending":
      return { ok: false, code: "pending" };
    case "not_found":
      return { ok: false, code: "not_found" };
    case "unavailable":
      return { ok: false, code: "unavailable" };
    case "rate_limited":
      return { ok: false, code: "rate_limited" };
    default:
      return { ok: false, code: "not_eligible" };
  }
}

/**
 * "manson.dev@gmail.com" → "ma•••••••@gmail.com". Ajuda o comprador a lembrar qual e-mail usou
 * sem expor o endereço completo para quem tiver só o número do pagamento.
 */
export function maskEmail(email: string | null | undefined): string | null {
  if (typeof email !== "string") return null;
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf("@");
  if (at < 1 || at === trimmed.length - 1) return null;

  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  const visible = local.length <= 2 ? local.slice(0, 1) : local.slice(0, 2);
  return `${visible}${"•".repeat(Math.max(3, local.length - visible.length))}@${domain}`;
}
