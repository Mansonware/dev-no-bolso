import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Validação da assinatura x-signature do Mercado Pago (HMAC-SHA256 do manifest com o segredo do webhook).
// Formato do header: "ts=<milissegundos>,v1=<hex>". Manifest: "id:<data.id>;request-id:<x-request-id>;ts:<ts>;".
//
// Sobre replay: o Mercado Pago reenvia notificações a cada 15 min por bastante tempo e não documenta
// janela de validade do ts, então NÃO recusamos ts antigo (perderíamos reenvios legítimos). Em vez disso:
//   - ts no futuro (além de 5 min de tolerância de relógio) é recusado;
//   - a mesma notificação assinada já processada é só confirmada (ver webhookReplayKey + webhookCore).
// Um replay também não causa dano: o webhook sempre reconsulta o pagamento e é idempotente.

const MAX_FUTURE_SKEW_MS = 5 * 60 * 1000;

type SignatureCheck = {
  configured: boolean;
  valid: boolean;
  /** ts da assinatura em milissegundos, quando presente e válido. */
  timestampMs?: number;
};

function safeEqualHex(left: string, right: string) {
  try {
    const a = Buffer.from(left, "hex");
    const b = Buffer.from(right, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** A documentação usa milissegundos; aceita segundos por segurança (valores com 10 dígitos). */
function tsToMs(ts: string): number | null {
  if (!/^\d{9,14}$/.test(ts)) return null;
  const n = Number(ts);
  return ts.length <= 10 ? n * 1000 : n;
}

export function verifyMercadoPagoWebhookSignature(
  input: { xSignature: string | null; xRequestId: string | null; dataId: string | null },
  now: number = Date.now()
): SignatureCheck {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim();
  if (!secret) return { configured: false, valid: true };

  if (!input.xSignature || !input.xRequestId || !input.dataId) {
    return { configured: true, valid: false };
  }

  const parts = new Map<string, string>();
  for (const part of input.xSignature.split(",")) {
    const [key, value] = part.split("=", 2);
    if (key && value) parts.set(key.trim(), value.trim());
  }

  const ts = parts.get("ts");
  const v1 = parts.get("v1");
  if (!ts || !v1) return { configured: true, valid: false };

  const timestampMs = tsToMs(ts);
  if (timestampMs === null || timestampMs - now > MAX_FUTURE_SKEW_MS) {
    return { configured: true, valid: false };
  }

  const manifest = `id:${input.dataId.toLowerCase()};request-id:${input.xRequestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  return { configured: true, valid: safeEqualHex(expected, v1), timestampMs };
}

/** Identificador estável de UMA notificação assinada (para descartar reenvio idêntico já processado). */
export function webhookReplayKey(xRequestId: string, xSignature: string): string {
  return createHash("sha256").update(`${xRequestId}|${xSignature}`).digest("hex");
}
