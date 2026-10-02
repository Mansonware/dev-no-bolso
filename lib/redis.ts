import { Redis } from "@upstash/redis";
import { OFFER } from "./offer";
import { getApprovedOfferPaymentCount } from "./mercadopago";

export const TOTAL_SPOTS = OFFER.spots;
export const MANUAL_APPROVED_SPOTS = 0;

export const REDIS_KEYS = {
  APPROVED_PAYMENTS: "dev_no_bolso:fundadora_97:approved_payments",
} as const;

export interface SpotsStatus {
  total: number;
  approved: number;
  remaining: number;
  soldOut: boolean;
}

export function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) return null;

  try {
    return new Redis({ url: url.trim(), token: token.trim() });
  } catch (error) {
    console.error("[Redis Error] Falha ao inicializar cliente Redis:", error);
    return null;
  }
}

function buildSpotsStatus(approved: number): SpotsStatus {
  const remaining = Math.max(0, TOTAL_SPOTS - approved);
  return {
    total: TOTAL_SPOTS,
    approved,
    remaining,
    soldOut: remaining <= 0,
  };
}

export async function getSpotsStatus(): Promise<SpotsStatus> {
  try {
    const mercadoPagoApproved = await getApprovedOfferPaymentCount();
    return buildSpotsStatus(mercadoPagoApproved + MANUAL_APPROVED_SPOTS);
  } catch (error) {
    console.error("[Spots] Falha ao consultar Mercado Pago; tentando cache Redis:", error);
  }

  const redis = getRedisClient();
  if (redis) {
    try {
      const onlineApprovedCount = await redis.scard(REDIS_KEYS.APPROVED_PAYMENTS);
      return buildSpotsStatus(onlineApprovedCount + MANUAL_APPROVED_SPOTS);
    } catch (error) {
      console.error("[Redis Error] Falha ao consultar vagas:", error);
    }
  }

  return buildSpotsStatus(MANUAL_APPROVED_SPOTS);
}

export async function recordApprovedPayment(paymentId: string | number): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) return false;

  const cleanId = String(paymentId).trim();
  if (!cleanId) return false;

  try {
    const added = await redis.sadd(REDIS_KEYS.APPROVED_PAYMENTS, cleanId);
    if (added === 1) {
      console.log(`[Spots] Pagamento ${cleanId} registrado no cache de contingência.`);
    }
    return added === 1;
  } catch (error) {
    console.error(`[Redis Error] Falha ao registrar pagamento ${cleanId}:`, error);
    return false;
  }
}
