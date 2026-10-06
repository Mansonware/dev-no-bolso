// Limite de consultas de pagamento vindas do navegador (página de retorno, /cadastro e cadastro).
// Um único guarda para todos os caminhos: ninguém consulta o Mercado Pago a partir de um pedido
// de visitante sem passar por aqui. Puro e testável — o armazenamento (Redis) é injetado.

import { isValidPaymentId, type PaymentLookup } from "./paymentCore.ts";

export type LimiterStore = {
  /** Soma 1 ao contador da chave na janela e devolve o total. */
  count(key: string, windowSeconds: number): Promise<number>;
  /** Registra o membro no conjunto da chave na janela e devolve quantos membros distintos há. */
  distinct(key: string, member: string, windowSeconds: number): Promise<number>;
};

export type LookupLimits = {
  /** Consultas por IP (cobre o polling de um Pix pendente com folga). */
  perIp: { max: number; windowSeconds: number };
  /** Números de pagamento DIFERENTES por IP — é isso que denuncia varredura. */
  distinctPaymentsPerIp: { max: number; windowSeconds: number };
  /** Consultas por pagamento, de qualquer IP — protege a cota da API do Mercado Pago. */
  perPayment: { max: number; windowSeconds: number };
};

// Um comprador real consulta 1 ou 2 números. O polling do Pix faz ~60 consultas em 10 min no pior caso.
export const LOOKUP_LIMITS: LookupLimits = {
  perIp: { max: 120, windowSeconds: 10 * 60 },
  distinctPaymentsPerIp: { max: 10, windowSeconds: 60 * 60 },
  perPayment: { max: 90, windowSeconds: 10 * 60 },
};

export type GuardedLookup = PaymentLookup | { state: "rate_limited"; paymentId: string };

type Deps = {
  store: LimiterStore;
  lookup: (paymentId: string) => Promise<PaymentLookup>;
  limits?: LookupLimits;
  onStoreError?: (error: unknown) => void;
};

/**
 * Devolve a função de consulta protegida. Ordem: formato do ID → limites → Mercado Pago.
 * Se o Redis falhar, a consulta segue (falha aberta): sem Redis o cadastro já fica fechado,
 * e bloquear aqui só impediria um comprador de ver que o pagamento foi aprovado.
 */
export function createGuardedLookup({ store, lookup, limits = LOOKUP_LIMITS, onStoreError }: Deps) {
  return async function guardedLookup(paymentId: string, ip: string | null): Promise<GuardedLookup> {
    if (!isValidPaymentId(paymentId)) return { state: "not_found", paymentId };

    try {
      const perPayment = await store.count(`payment:${paymentId}`, limits.perPayment.windowSeconds);
      if (perPayment > limits.perPayment.max) return { state: "rate_limited", paymentId };

      if (ip) {
        const perIp = await store.count(`ip:${ip}`, limits.perIp.windowSeconds);
        if (perIp > limits.perIp.max) return { state: "rate_limited", paymentId };

        const distinct = await store.distinct(`ip-ids:${ip}`, paymentId, limits.distinctPaymentsPerIp.windowSeconds);
        if (distinct > limits.distinctPaymentsPerIp.max) return { state: "rate_limited", paymentId };
      }
    } catch (error) {
      onStoreError?.(error);
    }

    return lookup(paymentId);
  };
}
