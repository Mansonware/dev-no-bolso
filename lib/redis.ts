import { Redis } from "@upstash/redis";

export const REDIS_KEYS = {
  APPROVED_PAYMENTS: "dev_no_bolso:fundadora_97:approved_payments",
} as const;

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

export async function recordApprovedPayment(paymentId: string | number): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) return false;

  const cleanId = String(paymentId).trim();
  if (!cleanId) return false;

  try {
    const added = await redis.sadd(REDIS_KEYS.APPROVED_PAYMENTS, cleanId);
    if (added === 1) {
      console.log(`[Payments] Pagamento ${cleanId} registrado no cache de contingência.`);
    }
    return added === 1;
  } catch (error) {
    console.error(`[Redis Error] Falha ao registrar pagamento ${cleanId}:`, error);
    return false;
  }
}
