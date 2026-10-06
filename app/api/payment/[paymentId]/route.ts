import { NextResponse, type NextRequest } from "next/server";
import { recordFunnelEvent } from "@/lib/analytics";
import { isValidPaymentId, lookupPayment } from "@/lib/mercadopago";
import { maskEmail, type PaymentState } from "@/lib/paymentCore";
import { hitRateLimit, isPaymentClaimed, recordApprovedPayment } from "@/lib/redis";

// Consulta o estado de um pagamento para as páginas de retorno do Mercado Pago.
// A confirmação vem SEMPRE da API do Mercado Pago (lib/mercadopago.ts) — nunca dos query params.
//
// Resposta: { state, paymentId, accountCreated?, payerEmailHint? }
//   accountCreated  → o pagamento já virou conta (mostrar "Entrar" em vez de "Criar conta")
//   payerEmailHint  → e-mail da compra mascarado (ma•••@gmail.com) para o cadastro

const LOOKUPS_PER_IP = 120;
const LOOKUP_WINDOW_SECONDS = 10 * 60;

type Body = { state: PaymentState; paymentId?: string; accountCreated?: boolean; payerEmailHint?: string | null };

function respond(body: Body, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function GET(req: NextRequest, context: { params: Promise<{ paymentId: string }> }) {
  const { paymentId: raw } = await context.params;
  const paymentId = raw?.trim() ?? "";
  if (!isValidPaymentId(paymentId)) return respond({ state: "not_found" }, 400);

  // Limite por IP contra varredura de números de pagamento. Sem Redis, segue sem limite.
  try {
    if (await hitRateLimit("payment_lookup", clientIp(req), LOOKUPS_PER_IP, LOOKUP_WINDOW_SECONDS)) {
      return respond({ state: "unavailable", paymentId }, 429);
    }
  } catch {
    // Redis indisponível: não bloqueia a confirmação do pagamento.
  }

  const lookup = await lookupPayment(paymentId);
  if (lookup.state !== "approved") {
    return respond({ state: lookup.state, paymentId: lookup.paymentId }, lookup.state === "unavailable" ? 503 : 200);
  }

  // Registra a venda de forma idempotente; o evento do funil só conta na primeira validação.
  if (await recordApprovedPayment(lookup.paymentId)) {
    await recordFunnelEvent("payment_success");
  }

  let accountCreated = false;
  try {
    accountCreated = await isPaymentClaimed(lookup.paymentId);
  } catch {
    accountCreated = false;
  }

  return respond({
    state: "approved",
    paymentId: lookup.paymentId,
    accountCreated,
    payerEmailHint: accountCreated ? null : maskEmail(lookup.payerEmail),
  });
}
