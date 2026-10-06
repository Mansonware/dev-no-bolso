import { Redis } from "@upstash/redis";
import { parseEntitlement, type Entitlement } from "@/lib/entitlementCore";
import type { LimiterStore } from "@/lib/paymentGuardCore";
import { CREATE_USER_SCRIPT, type CreateUserResult } from "@/lib/redisScripts";

export type { CreateUserResult };

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

// ---------------------------------------------------------------------------
// Autenticação (usuários, reivindicação de pagamento e sessões).
//
// Layout das chaves:
//   dev_no_bolso:auth:user:<sha256(email)>      JSON StoredUser (sem TTL)
//   dev_no_bolso:auth:payment:<paymentId>       sha256(email) do dono — 1 conta por pagamento
//   dev_no_bolso:auth:session:<sha256(token)>   JSON StoredSession (TTL = duração da sessão)
//   dev_no_bolso:auth:rl:<balde>:<id>           contador de tentativas (TTL = janela)
//
// Diferente do analytics, aqui não existe modo silencioso: sem Redis, as funções lançam
// RedisUnavailableError e a autenticação falha fechada.

const AUTH_PREFIX = "dev_no_bolso:auth";

export const AUTH_KEYS = {
  user: (emailHash: string) => `${AUTH_PREFIX}:user:${emailHash}`,
  paymentClaim: (paymentId: string) => `${AUTH_PREFIX}:payment:${paymentId}`,
  session: (tokenHash: string) => `${AUTH_PREFIX}:session:${tokenHash}`,
  rateLimit: (bucket: string, id: string) => `${AUTH_PREFIX}:rl:${bucket}:${id}`,
} as const;

export class RedisUnavailableError extends Error {
  constructor() {
    super("Redis não está configurado neste ambiente.");
    this.name = "RedisUnavailableError";
  }
}

function requireRedis(): Redis {
  const redis = getRedisClient();
  if (!redis) throw new RedisUnavailableError();
  return redis;
}

export type StoredPassword = {
  algo: "scrypt";
  N: number;
  r: number;
  p: number;
  salt: string;
  hash: string;
};

export type StoredUser = {
  name: string;
  email: string;
  password: StoredPassword;
  paymentId: string;
  createdAt: string;
};

export type StoredSession = {
  emailHash: string;
  createdAt: string;
  expiresAt: string;
};

function isStoredUser(value: unknown): value is StoredUser {
  const v = value as StoredUser | null;
  return (
    typeof v === "object" &&
    v !== null &&
    typeof v.name === "string" &&
    typeof v.email === "string" &&
    typeof v.paymentId === "string" &&
    typeof v.password === "object" &&
    v.password !== null &&
    v.password.algo === "scrypt" &&
    typeof v.password.salt === "string" &&
    typeof v.password.hash === "string"
  );
}

function isStoredSession(value: unknown): value is StoredSession {
  const v = value as StoredSession | null;
  return typeof v === "object" && v !== null && typeof v.emailHash === "string" && typeof v.expiresAt === "string";
}

export async function getStoredUser(emailHash: string): Promise<StoredUser | null> {
  const value = await requireRedis().get<unknown>(AUTH_KEYS.user(emailHash));
  return isStoredUser(value) ? value : null;
}

export async function createUserClaimingPayment(
  emailHash: string,
  user: StoredUser,
  entitlement: Entitlement
): Promise<CreateUserResult> {
  const result = await requireRedis().eval<string[], string>(
    CREATE_USER_SCRIPT,
    [AUTH_KEYS.paymentClaim(user.paymentId), AUTH_KEYS.user(emailHash), ENTITLEMENT_KEY(user.paymentId)],
    [`user:${emailHash}`, JSON.stringify(user), JSON.stringify(entitlement)]
  );
  if (result === "ok" || result === "payment_claimed" || result === "user_exists") return result;
  throw new Error(`Resposta inesperada ao criar usuário: ${String(result)}`);
}

export async function saveSession(tokenHash: string, session: StoredSession, ttlSeconds: number): Promise<void> {
  await requireRedis().set(AUTH_KEYS.session(tokenHash), session, { ex: ttlSeconds });
}

export async function getStoredSession(tokenHash: string): Promise<StoredSession | null> {
  const value = await requireRedis().get<unknown>(AUTH_KEYS.session(tokenHash));
  return isStoredSession(value) ? value : null;
}

export async function deleteSession(tokenHash: string): Promise<void> {
  await requireRedis().del(AUTH_KEYS.session(tokenHash));
}

/**
 * Conta uma tentativa numa janela fixa. Retorna true quando o limite foi ultrapassado.
 */
export async function hitRateLimit(bucket: string, id: string, limit: number, windowSeconds: number): Promise<boolean> {
  const redis = requireRedis();
  const key = AUTH_KEYS.rateLimit(bucket, id);
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, windowSeconds);
  return count > limit;
}

export async function clearRateLimit(bucket: string, id: string): Promise<void> {
  await requireRedis().del(AUTH_KEYS.rateLimit(bucket, id));
}

/** Indica se o pagamento já foi usado para criar uma conta (sem revelar de quem). */
export async function isPaymentClaimed(paymentId: string): Promise<boolean> {
  return (await requireRedis().exists(AUTH_KEYS.paymentClaim(paymentId))) === 1;
}

// ---------------------------------------------------------------------------
// Progresso do aluno.
//   dev_no_bolso:progress:<sha256(email)>   HASH  done:<lessonId> -> ISO, github, repo, site
// Só o que o próprio aluno informou nas entregas das aulas — nada de dado de pagamento.

const PROGRESS_PREFIX = "dev_no_bolso:progress";

export async function getProgressHash(emailHash: string): Promise<Record<string, unknown> | null> {
  return requireRedis().hgetall<Record<string, unknown>>(`${PROGRESS_PREFIX}:${emailHash}`);
}

export async function saveProgressFields(emailHash: string, fields: Record<string, string>): Promise<void> {
  await requireRedis().hset(`${PROGRESS_PREFIX}:${emailHash}`, fields);
}

// ---------------------------------------------------------------------------
// Acesso ao conteúdo pago (entitlement), por pagamento.
//   dev_no_bolso:entitlement:<paymentId>   JSON { status, reason?, updatedAt, checkedAt }

const ENTITLEMENT_KEY = (paymentId: string) => `dev_no_bolso:entitlement:${paymentId}`;

export async function getEntitlement(paymentId: string): Promise<Entitlement | null> {
  return parseEntitlement(await requireRedis().get<unknown>(ENTITLEMENT_KEY(paymentId)));
}

export async function setEntitlement(paymentId: string, entitlement: Entitlement): Promise<void> {
  await requireRedis().set(ENTITLEMENT_KEY(paymentId), JSON.stringify(entitlement));
}

// ---------------------------------------------------------------------------
// Limites de consulta de pagamento e replay do webhook.
//   dev_no_bolso:lookup:<chave>            contador / conjunto com TTL
//   dev_no_bolso:webhook:done:<hash>       notificação assinada já processada (TTL 7 dias)

const LOOKUP_PREFIX = "dev_no_bolso:lookup";
const WEBHOOK_DONE_TTL_SECONDS = 7 * 24 * 60 * 60;

export const redisLimiterStore: LimiterStore = {
  async count(key, windowSeconds) {
    const redis = requireRedis();
    const fullKey = `${LOOKUP_PREFIX}:${key}`;
    const total = await redis.incr(fullKey);
    if (total === 1) await redis.expire(fullKey, windowSeconds);
    return total;
  },
  async distinct(key, member, windowSeconds) {
    const fullKey = `${LOOKUP_PREFIX}:${key}`;
    const pipeline = requireRedis().pipeline();
    pipeline.sadd(fullKey, member);
    pipeline.expire(fullKey, windowSeconds);
    pipeline.scard(fullKey);
    const [, , size] = await pipeline.exec<[number, number, number]>();
    return size;
  },
};

export async function wasWebhookProcessed(replayKey: string): Promise<boolean> {
  return (await requireRedis().exists(`dev_no_bolso:webhook:done:${replayKey}`)) === 1;
}

export async function markWebhookProcessed(replayKey: string): Promise<void> {
  await requireRedis().set(`dev_no_bolso:webhook:done:${replayKey}`, "1", { ex: WEBHOOK_DONE_TTL_SECONDS });
}
