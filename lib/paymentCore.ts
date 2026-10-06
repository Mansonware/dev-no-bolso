// Regras puras do pós-pagamento (sem imports): traduz o status do Mercado Pago para o que a
// tela precisa mostrar e mascara o e-mail do pagador. Testável com `node --test`.

/**
 * Estado do pagamento do ponto de vista do comprador.
 *   approved    → aprovado e válido para o Dev no Bolso
 *   pending     → Pix/boleto aguardando, ou em análise
 *   rejected    → recusado ou cancelado
 *   refunded    → devolvido ou contestado
 *   invalid     → aprovado, mas não é uma compra do Dev no Bolso (valor/moeda/referência)
 *   not_found   → número de pagamento inexistente
 *   unavailable → não conseguimos falar com o Mercado Pago agora
 */
export type PaymentState = "approved" | "pending" | "rejected" | "refunded" | "invalid" | "not_found" | "unavailable";

export function stateFromMercadoPagoStatus(status: string | undefined | null): Exclude<PaymentState, "invalid" | "not_found" | "unavailable"> {
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
