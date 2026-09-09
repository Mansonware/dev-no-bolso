import { NextRequest, NextResponse } from "next/server";
import { getPaymentDetails, validatePayment } from "@/lib/mercadopago";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ paymentId: string }> }
) {
  try {
    const { paymentId } = await context.params;

    if (!paymentId || paymentId.trim() === "" || paymentId === "undefined" || paymentId === "null") {
      return NextResponse.json(
        {
          valid: false,
          error: "ID de pagamento inválido ou ausente.",
        },
        { status: 400 }
      );
    }

    const cleanPaymentId = paymentId.trim();

    // Consulta na API do Mercado Pago
    const payment = await getPaymentDetails(cleanPaymentId);

    // Validação rígida das regras de negócio
    const validation = validatePayment(payment);

    if (!validation.valid) {
      return NextResponse.json(
        {
          valid: false,
          status: validation.status,
          paymentId: validation.paymentId,
          reason: validation.reason,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      valid: true,
      status: "approved",
      paymentId: validation.paymentId,
      amount: validation.transactionAmount,
      currency: validation.currencyId,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[API /api/payment/[paymentId]] Erro ao consultar pagamento:", err?.message || err);

    return NextResponse.json(
      {
        valid: false,
        error: "Não foi possível validar o pagamento junto ao processador.",
      },
      { status: 404 }
    );
  }
}
