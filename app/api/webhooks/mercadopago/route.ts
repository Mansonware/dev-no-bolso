import { NextRequest, NextResponse } from "next/server";
import { recordFunnelEvent } from "@/lib/analytics";
import { isValidPaymentId, lookupPayment } from "@/lib/mercadopago";
import { verifyMercadoPagoWebhookSignature } from "@/lib/mercadopago-webhook";
import { recordApprovedPayment } from "@/lib/redis";

// Webhook do Mercado Pago. Nunca confia no corpo da notificação: reconsulta o pagamento na API
// (lookupPayment) e só registra venda aprovada e válida. Registro idempotente (Redis Set), então
// notificações duplicadas ou reenviadas não contam duas vezes.
//
// Respostas: 200 = processado ou ignorado de propósito (MP não reenvia);
//            401 = assinatura inválida; 500 = falha temporária (MP reenvia depois).

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const queryType = searchParams.get("type") || searchParams.get("topic");
  const queryDataId = searchParams.get("data.id") || searchParams.get("id");

  const signature = verifyMercadoPagoWebhookSignature({
    xSignature: req.headers.get("x-signature"),
    xRequestId: req.headers.get("x-request-id"),
    dataId: queryDataId,
  });

  if (signature.configured && !signature.valid) {
    console.warn("[MercadoPago Webhook] Assinatura inválida.");
    return NextResponse.json({ received: false }, { status: 401 });
  }

  let bodyData: Record<string, unknown> = {};
  try {
    bodyData = await req.json();
  } catch {
    bodyData = {};
  }

  const eventType = String(queryType || bodyData.type || bodyData.action || "unknown");
  const resourceId = String(queryDataId || (bodyData.data as { id?: string | number } | undefined)?.id || bodyData.id || "");

  console.log("[MercadoPago Webhook] Notificação recebida:", {
    event: eventType,
    resourceId: resourceId || "unknown",
    signatureChecked: signature.configured,
  });

  // Só interessam notificações de pagamento com ID numérico. O resto (merchant_order, testes) é ignorado.
  if (!eventType.startsWith("payment") || !isValidPaymentId(resourceId)) {
    return NextResponse.json({ received: true, ignored: true }, { status: 200 });
  }

  const lookup = await lookupPayment(resourceId);

  if (lookup.state === "unavailable") {
    // Falha temporária ao falar com o Mercado Pago: 500 faz o MP tentar de novo mais tarde.
    return NextResponse.json({ received: false, retry: true }, { status: 500 });
  }

  if (lookup.state === "approved" && (await recordApprovedPayment(lookup.paymentId))) {
    await recordFunnelEvent("payment_success");
  }

  return NextResponse.json({ received: true, state: lookup.state }, { status: 200 });
}
