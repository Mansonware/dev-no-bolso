import { NextRequest, NextResponse } from "next/server";
import { verifyMercadoPagoWebhookSignature, webhookReplayKey } from "@/lib/mercadopago-webhook";
import { webhookDeps } from "@/lib/paymentAccess";
import { handlePaymentNotification } from "@/lib/webhookCore";

// Webhook do Mercado Pago. Aqui só a parte HTTP (assinatura e leitura da notificação);
// a regra (reconsulta, venda, acesso, replay, idempotência) está em lib/webhookCore.ts.

let warnedMissingSecret = false;

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const queryType = searchParams.get("type") || searchParams.get("topic");
  const queryDataId = searchParams.get("data.id") || searchParams.get("id");
  const xSignature = req.headers.get("x-signature");
  const xRequestId = req.headers.get("x-request-id");

  const signature = verifyMercadoPagoWebhookSignature({ xSignature, xRequestId, dataId: queryDataId });

  if (signature.configured && !signature.valid) {
    console.warn("[MercadoPago Webhook] Assinatura inválida ou com timestamp no futuro.");
    return NextResponse.json({ received: false }, { status: 401 });
  }
  if (!signature.configured && !warnedMissingSecret && process.env.NODE_ENV === "production") {
    warnedMissingSecret = true;
    console.warn("[MercadoPago Webhook] MERCADOPAGO_WEBHOOK_SECRET ausente: assinatura não verificada.");
  }

  let bodyData: Record<string, unknown> = {};
  try {
    bodyData = await req.json();
  } catch {
    bodyData = {};
  }

  // Com assinatura válida, o ID vem da query assinada; sem assinatura, aceita o do corpo também.
  const bodyId = (bodyData.data as { id?: string | number } | undefined)?.id ?? bodyData.id;
  const resourceId = String(queryDataId || (!signature.configured ? bodyId : "") || "");
  const eventType = String(queryType || bodyData.type || bodyData.action || "unknown");

  const replayKey =
    signature.configured && signature.valid && xSignature && xRequestId ? webhookReplayKey(xRequestId, xSignature) : null;

  try {
    const outcome = await handlePaymentNotification(webhookDeps, { eventType, resourceId, replayKey });
    console.log("[MercadoPago Webhook]", { event: eventType, resourceId: resourceId || "unknown", status: outcome.status, ...outcome.body });
    return NextResponse.json(outcome.body, { status: outcome.status });
  } catch (error) {
    // Redis fora do ar, por exemplo: 500 faz o Mercado Pago reenviar depois.
    console.error("[MercadoPago Webhook] Falha ao processar:", error instanceof Error ? error.message : error);
    return NextResponse.json({ received: false, retry: true }, { status: 500 });
  }
}
