import { Redis } from "@upstash/redis";

export const REDIS_KEYS = {
  // Set com IDs de pagamentos aprovados (sem dados pessoais) — registro idempotente de vendas.
  APPROVED_PAYMENTS: "dev_no_bolso:v2:approved_payments",
} as const;

/**
 * Retorna uma instância do Upstash Redis se as credenciais estiverem disponíveis.
 * Suporta as variáveis padrão do Upstash (UPSTASH_REDIS_REST_URL) ou Vercel KV (KV_REST_API_URL).
 */
export function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  try {
    return new Redis({
      url: url.trim(),
      token: token.trim(),
    });
  } catch (error) {
    console.error("[Redis Error] Falha ao inicializar cliente Redis:", error);
    return null;
  }
}

/**
 * Registra um pagamento aprovado de forma estritamente idempotente.
 * Se o mesmo paymentId for consultado várias vezes (ex: refresh da página de sucesso),
 * o Redis Set garante que ele só é contado uma vez. Retorna true apenas no primeiro registro.
 */
export async function recordApprovedPayment(paymentId: string | number): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) return false;

  const cleanId = String(paymentId).trim();
  if (!cleanId) return false;

  try {
    // sadd retorna 1 se foi um novo elemento inserido, ou 0 se já existia
    const added = await redis.sadd(REDIS_KEYS.APPROVED_PAYMENTS, cleanId);
    return added === 1;
  } catch (error) {
    console.error(`[Redis Error] Falha ao registrar pagamento ${cleanId}:`, error);
    return false;
  }
}
