import { NextResponse, type NextRequest } from "next/server";
import { recordFunnelEvent } from "@/lib/analytics";
import { clientIpFrom, guardedPaymentLookup } from "@/lib/paymentAccess";
import { maskEmail, type ClientPaymentState } from "@/lib/paymentCore";
import { isPaymentClaimed, recordApprovedPayment } from "@/lib/redis";

// Estado de um pagamento para as páginas de retorno do Mercado Pago.
// A confirmação vem SEMPRE da API do Mercado Pago — nunca dos query params — e passa pelo
// mesmo limite de consultas do /cadastro (lib/paymentAccess.ts).
//
// Resposta: { state, paymentId, accountCreated?, payerEmailHint? }

type Body = { state: ClientPaymentState; paymentId?: string; accountCreated?: boolean; payerEmailHint?: string | null };

function respond(body: Body, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(req: NextRequest, context: { params: Promise<{ paymentId: string }> }) {
  const { paymentId: raw } = await context.params;
  const lookup = await guardedPaymentLookup(raw?.trim() ?? "", clientIpFrom(req.headers));

  if (lookup.state === "rate_limited") return respond({ state: "rate_limited", paymentId: lookup.paymentId }, 429);
  if (lookup.state !== "approved") {
    const status = lookup.state === "unavailable" ? 503 : lookup.state === "not_found" && !/^\d+$/.test(raw ?? "") ? 400 : 200;
    return respond({ state: lookup.state, paymentId: lookup.paymentId }, status);
  }

  // Registra a venda de forma idempotente; o evento do funil só conta na primeira validação.
  try {
    if (await recordApprovedPayment(lookup.paymentId)) await recordFunnelEvent("payment_success");
  } catch {
    // Registro de venda é contabilidade: não pode impedir o comprador de seguir.
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
