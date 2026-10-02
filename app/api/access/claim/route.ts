import { NextRequest, NextResponse } from "next/server";
import {
  createCourseAccessToken,
  createCourseRecoveryCode,
  COURSE_ACCESS_COOKIE,
  COURSE_ACCESS_MAX_AGE,
} from "@/lib/course-access";
import { getPaymentDetails, validatePayment } from "@/lib/mercadopago";
import { recordApprovedPayment } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const paymentId = String(body?.paymentId ?? "").trim();

    if (!/^\d+$/.test(paymentId)) {
      return NextResponse.json(
        { success: false, error: "Identificador de pagamento inválido." },
        { status: 400 }
      );
    }

    const payment = await getPaymentDetails(paymentId);
    const validation = validatePayment(payment);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          status: validation.status,
          error: validation.reason || "Pagamento ainda não aprovado.",
        },
        { status: 409 }
      );
    }

    await recordApprovedPayment(validation.paymentId);

    const payerEmail = payment.payer?.email?.trim();
    const accessCode = payerEmail
      ? createCourseRecoveryCode(validation.paymentId, payerEmail)
      : null;

    const response = NextResponse.json({
      success: true,
      amount: validation.transactionAmount,
      currency: validation.currencyId,
      accessCode,
    });

    response.cookies.set(
      COURSE_ACCESS_COOKIE,
      createCourseAccessToken(validation.paymentId),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: COURSE_ACCESS_MAX_AGE,
      }
    );

    return response;
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[API /api/access/claim] Falha ao liberar acesso:", err?.message || err);

    return NextResponse.json(
      { success: false, error: "Não foi possível validar o pagamento agora. Tente novamente." },
      { status: 502 }
    );
  }
}
