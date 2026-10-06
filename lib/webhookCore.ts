// Processamento de notificação do Mercado Pago e sincronização do acesso.
// Puro e testável: Mercado Pago e Redis são injetados.
//
// Garantias:
//   - Nunca confia no corpo da notificação: o estado vem de uma consulta nova à API (deps.lookup).
//   - Idempotente: venda contada 1x (Set), acesso só muda quando o status muda.
//   - Replay: a mesma notificação assinada (mesmo x-request-id + ts) já processada é só confirmada.
//   - Ordem fora de sequência não importa: sempre vale o estado ATUAL do pagamento no Mercado Pago.
//   - Falha temporária do MP → 500 para o Mercado Pago reenviar; pagamento inexistente → 200.

import { nextEntitlement, type Entitlement, type EntitlementTransition } from "./entitlementCore.ts";
import { isValidPaymentId, type PaymentLookup, type PaymentState } from "./paymentCore.ts";

export type AccessDeps = {
  lookup: (paymentId: string) => Promise<PaymentLookup>;
  recordApprovedPayment: (paymentId: string) => Promise<boolean>;
  getEntitlement: (paymentId: string) => Promise<Entitlement | null>;
  setEntitlement: (paymentId: string, entitlement: Entitlement) => Promise<void>;
  onEvent?: (event: "payment_success" | "access_revoked" | "access_restored") => Promise<void> | void;
  now?: () => Date;
};

export type SyncResult = { state: PaymentState; transition: EntitlementTransition | null };

/** Consulta o pagamento e alinha a venda registrada e o acesso com o estado real dele. */
export async function syncPaymentAccess(deps: AccessDeps, paymentId: string): Promise<SyncResult> {
  const lookup = await deps.lookup(paymentId);
  if (lookup.state === "unavailable") return { state: lookup.state, transition: null };

  if (lookup.state === "approved" && (await deps.recordApprovedPayment(lookup.paymentId))) {
    await deps.onEvent?.("payment_success");
  }

  const current = await deps.getEntitlement(lookup.paymentId);
  const change = nextEntitlement(current, lookup, (deps.now ?? (() => new Date()))());
  if (!change) return { state: lookup.state, transition: null };

  await deps.setEntitlement(lookup.paymentId, change.next);
  if (change.transition === "revoked") await deps.onEvent?.("access_revoked");
  if (change.transition === "restored") await deps.onEvent?.("access_restored");
  return { state: lookup.state, transition: change.transition };
}

export type WebhookDeps = AccessDeps & {
  /** true se essa notificação assinada já foi processada com sucesso antes. */
  wasProcessed: (replayKey: string) => Promise<boolean>;
  markProcessed: (replayKey: string) => Promise<void>;
  /** Limite de consultas por pagamento vindas do webhook. true = pode seguir. */
  allowPaymentLookup: (paymentId: string) => Promise<boolean>;
};

export type WebhookInput = {
  eventType: string;
  resourceId: string;
  /** Identifica a notificação assinada (x-request-id + ts). null quando não há assinatura. */
  replayKey: string | null;
};

export type WebhookOutcome = { status: 200 | 429 | 500; body: Record<string, unknown> };

export async function handlePaymentNotification(deps: WebhookDeps, input: WebhookInput): Promise<WebhookOutcome> {
  // Só interessam notificações de pagamento com ID numérico. O resto (merchant_order, testes) é ignorado.
  if (!input.eventType.startsWith("payment") || !isValidPaymentId(input.resourceId)) {
    return { status: 200, body: { received: true, ignored: true } };
  }

  if (input.replayKey && (await deps.wasProcessed(input.replayKey))) {
    return { status: 200, body: { received: true, duplicate: true } };
  }

  if (!(await deps.allowPaymentLookup(input.resourceId))) {
    // Excesso de notificações para o mesmo pagamento: o Mercado Pago reenvia mais tarde.
    return { status: 429, body: { received: false, retry: true } };
  }

  const result = await syncPaymentAccess(deps, input.resourceId);
  if (result.state === "unavailable") {
    return { status: 500, body: { received: false, retry: true } };
  }

  if (input.replayKey) await deps.markProcessed(input.replayKey);
  return { status: 200, body: { received: true, state: result.state } };
}
