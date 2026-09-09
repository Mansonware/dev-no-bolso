import { Redis } from "@upstash/redis";

export const TOTAL_SPOTS = 15;
export const MANUAL_APPROVED_SPOTS = 1;

export const REDIS_KEYS = {
  APPROVED_PAYMENTS: "dev_no_bolso:turma_01:approved_payments",
} as const;

export interface SpotsStatus {
  total: number;
  approved: number;
  remaining: number;
  soldOut: boolean;
}

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
 * Consulta a contagem de vagas em tempo real no Upstash Redis.
 * Soma vendas online aprovadas + vendas confirmadas manualmente (ex.: dinheiro físico).
 */
export async function getSpotsStatus(): Promise<SpotsStatus> {
  const redis = getRedisClient();

  if (!redis) {
    const approved = MANUAL_APPROVED_SPOTS;
    const remaining = Math.max(0, TOTAL_SPOTS - approved);
    return {
      total: TOTAL_SPOTS,
      approved,
      remaining,
      soldOut: remaining <= 0,
    };
  }

  try {
    const onlineApprovedCount = await redis.scard(REDIS_KEYS.APPROVED_PAYMENTS);
    const approvedCount = onlineApprovedCount + MANUAL_APPROVED_SPOTS;
    const remaining = Math.max(0, TOTAL_SPOTS - approvedCount);
    return {
      total: TOTAL_SPOTS,
      approved: approvedCount,
      remaining,
      soldOut: remaining <= 0,
    };
  } catch (error) {
    console.error("[Redis Error] Falha ao consultar vagas:", error);
    const approved = MANUAL_APPROVED_SPOTS;
    const remaining = Math.max(0, TOTAL_SPOTS - approved);
    return {
      total: TOTAL_SPOTS,
      approved,
      remaining,
      soldOut: remaining <= 0,
    };
  }
}

/**
 * Registra um pagamento aprovado de forma estritamente idempotente.
 * Se o mesmo paymentId for consultado várias vezes (ex: refresh da página de sucesso),
 * o Redis Set garante que a contagem NÃO será debitada novamente.
 */
export async function recordApprovedPayment(paymentId: string | number): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) return false;

  const cleanId = String(paymentId).trim();
  if (!cleanId) return false;

  try {
    // sadd retorna 1 se foi um novo elemento inserido, ou 0 se já existia
    const added = await redis.sadd(REDIS_KEYS.APPROVED_PAYMENTS, cleanId);
    if (added === 1) {
      console.log(`[Spots] Pagamento ${cleanId} registrado! Vaga debitada com sucesso.`);
    }
    return added === 1;
  } catch (error) {
    console.error(`[Redis Error] Falha ao registrar pagamento ${cleanId}:`, error);
    return false;
  }
}
