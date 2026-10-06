// Analytics first-party mínimo do funil (server-side).
//
// Grava apenas contadores agregados no Upstash Redis — nada de IP, user agent,
// cookie, e-mail ou qualquer identificador de pessoa.
//
// Layout das chaves (consultáveis direto no console do Upstash):
//   dev_no_bolso:funnel:total            HASH  campo -> contagem acumulada
//   dev_no_bolso:funnel:day:YYYY-MM-DD   HASH  campo -> contagem do dia (UTC)
// Campo = "<evento>" e, quando houver, também "<evento>:<posicao>" (ex.: checkout_click:hero).
//
// Sem Redis configurado, ou com Redis fora do ar, tudo vira no-op silencioso.

import { getRedisClient } from "@/lib/redis";

export const FUNNEL_EVENTS = [
  "landing_view",
  "experimentar_start",
  "experimentar_complete",
  "checkout_click",
  "checkout_created",
  "payment_success",
  "signup_complete",
  "student_area_view",
  "first_lesson_start",
  "first_lesson_complete",
  "course_complete",
] as const;

export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];

// Eventos que o navegador pode enviar. Pagamento e cadastro só são gravados pelo servidor,
// depois das validações correspondentes.
export const CLIENT_EVENTS: readonly FunnelEvent[] = [
  "landing_view",
  "experimentar_start",
  "experimentar_complete",
  "checkout_click",
  "checkout_created",
  "student_area_view",
  "first_lesson_start",
];

// Lista fechada para não deixar o cliente criar campos arbitrários no Redis.
export const PLACEMENTS = ["hero", "offer", "final", "sticky", "mission", "nav"] as const;
export type Placement = (typeof PLACEMENTS)[number];

const KEY_PREFIX = "dev_no_bolso:funnel";
const DAY_TTL_SECONDS = 60 * 60 * 24 * 400;

export function isClientEvent(value: unknown): value is FunnelEvent {
  return typeof value === "string" && (CLIENT_EVENTS as readonly string[]).includes(value);
}

export function isPlacement(value: unknown): value is Placement {
  return typeof value === "string" && (PLACEMENTS as readonly string[]).includes(value);
}

export async function recordFunnelEvent(event: FunnelEvent, placement?: Placement): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  const day = new Date().toISOString().slice(0, 10);
  const totalKey = `${KEY_PREFIX}:total`;
  const dayKey = `${KEY_PREFIX}:day:${day}`;
  const fields = placement ? [event, `${event}:${placement}`] : [event];

  try {
    const pipeline = redis.pipeline();
    for (const field of fields) {
      pipeline.hincrby(totalKey, field, 1);
      pipeline.hincrby(dayKey, field, 1);
    }
    pipeline.expire(dayKey, DAY_TTL_SECONDS);
    await pipeline.exec();
  } catch (error) {
    // Analytics nunca pode quebrar a experiência.
    console.error("[Analytics] Falha ao registrar evento:", event, error);
  }
}
