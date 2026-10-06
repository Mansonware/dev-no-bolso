import "server-only";

import { recordFunnelEvent } from "@/lib/analytics";
import { lookupPayment } from "@/lib/mercadopago";
import { createGuardedLookup, type GuardedLookup } from "@/lib/paymentGuardCore";
import {
  getEntitlement,
  hitRateLimit,
  markWebhookProcessed,
  recordApprovedPayment,
  redisLimiterStore,
  setEntitlement,
  wasWebhookProcessed,
} from "@/lib/redis";
import { syncPaymentAccess, type AccessDeps, type WebhookDeps } from "@/lib/webhookCore";

// Ligação das regras puras (paymentGuardCore, webhookCore) com Redis e Mercado Pago.
// Toda consulta de pagamento disparada por um visitante passa por guardedPaymentLookup.

const guarded = createGuardedLookup({
  store: redisLimiterStore,
  lookup: lookupPayment,
  onStoreError: (error) =>
    console.error("[PaymentGuard] Redis indisponível, consulta segue sem limite:", error instanceof Error ? error.message : error),
});

/** Consulta de pagamento com limite por IP, por números distintos por IP e por pagamento. */
export function guardedPaymentLookup(paymentId: string, ip: string | null): Promise<GuardedLookup> {
  return guarded(paymentId, ip);
}

/** IP do visitante atrás do proxy da Vercel. */
export function clientIpFrom(headers: Headers): string | null {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || null;
}

const accessDeps: AccessDeps = {
  lookup: lookupPayment,
  recordApprovedPayment,
  getEntitlement,
  setEntitlement,
  onEvent: (event) => recordFunnelEvent(event),
};

/** Reconfere o pagamento no Mercado Pago e alinha o acesso (usado pela revisão diária). */
export function syncAccessForPayment(paymentId: string) {
  return syncPaymentAccess(accessDeps, paymentId);
}

const WEBHOOK_LOOKUPS_PER_PAYMENT = 30;
const WEBHOOK_WINDOW_SECONDS = 10 * 60;

export const webhookDeps: WebhookDeps = {
  ...accessDeps,
  wasProcessed: wasWebhookProcessed,
  markProcessed: markWebhookProcessed,
  async allowPaymentLookup(paymentId) {
    try {
      return !(await hitRateLimit("webhook", paymentId, WEBHOOK_LOOKUPS_PER_PAYMENT, WEBHOOK_WINDOW_SECONDS));
    } catch {
      return true;
    }
  },
};
