import { NextRequest, NextResponse } from "next/server";
import { recordFunnelEvent } from "@/lib/analytics";
import { getPaymentDetails, validatePayment } from "@/lib/mercadopago";
import { verifyMercadoPagoWebhookSignature } from "@/lib/mercadopago-webhook";
import { recordApprovedPayment } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
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

    const eventType = queryType || bodyData.type || bodyData.action || "unknown";
    const paymentOrResourceId =
      queryDataId ||
      (bodyData.data as { id?: string })?.id ||
      bodyData.id ||
      "unknown";

    console.log("[MercadoPago Webhook] Notificação recebida:", {
      event: eventType,
      resourceId: paymentOrResourceId,
      signatureChecked: signature.configured,
      receivedAt: new Date().toISOString(),
    });

    if (
      String(eventType).startsWith("payment") &&
      paymentOrResourceId !== "unknown"
    ) {
      const validation = validatePayment(
        await getPaymentDetails(String(paymentOrResourceId))
      );

      if (validation.valid) {
        const isNewPurchase = await recordApprovedPayment(validation.paymentId);
        if (isNewPurchase) {
          await recordFunnelEvent("payment_success");
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[MercadoPago Webhook] Erro ao processar notificação:", err?.message || err);

    return NextResponse.json(
      { received: false, retry: true },
      { status: 500 }
    );
  }
}
