import { NextRequest, NextResponse } from "next/server";
import { getPaymentDetails, validatePayment } from "@/lib/mercadopago";
import { recordApprovedPayment } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const queryType = searchParams.get("type") || searchParams.get("topic");
    const queryDataId = searchParams.get("data.id") || searchParams.get("id");

    let bodyData: Record<string, unknown> = {};
    try {
      bodyData = await req.json();
    } catch {
      // Nem todas as notificações do Mercado Pago enviam JSON válido no body (algumas usam apenas query params)
      bodyData = {};
    }

    const eventType = queryType || bodyData.type || bodyData.action || "unknown";
    const paymentOrResourceId = queryDataId || (bodyData.data as { id?: string })?.id || bodyData.id || "unknown";

    // Registro seguro de log sem dados de cartão, tokens ou informações confidenciais
    console.log("[MercadoPago Webhook] Notificação recebida com sucesso:", {
      event: eventType,
      resourceId: paymentOrResourceId,
      receivedAt: new Date().toISOString(),
    });

    // Conta a vaga mesmo se o comprador não voltar para /pagamento/sucesso.
    // Não confia no corpo da notificação: reconsulta o pagamento na API do Mercado Pago.
    if (String(eventType).startsWith("payment") && paymentOrResourceId !== "unknown") {
      const validation = validatePayment(await getPaymentDetails(String(paymentOrResourceId)));
      if (validation.valid) {
        await recordApprovedPayment(validation.paymentId);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[MercadoPago Webhook] Erro ao processar notificação:", err?.message || err);
    // Webhook deve sempre responder 200/204 para evitar reenvios infinitos do provedor
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
