import { NextRequest, NextResponse } from "next/server";
import {
  COURSE_ACCESS_COOKIE,
  COURSE_ACCESS_MAX_AGE,
  createCourseAccessToken,
  extractPaymentIdFromRecoveryCode,
  verifyCourseRecoveryCode,
} from "@/lib/course-access";
import { getPaymentDetails, validatePayment } from "@/lib/mercadopago";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const code = String(body?.code ?? "").trim().toUpperCase();
    const paymentId = extractPaymentIdFromRecoveryCode(code);

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: "Código de acesso inválido." },
        { status: 400 }
      );
    }

    const payment = await getPaymentDetails(paymentId);
    const validation = validatePayment(payment);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: "Este código não está ligado a um pagamento aprovado." },
        { status: 403 }
      );
    }

    const payerEmail = payment.payer?.email?.trim();
    if (!payerEmail || !verifyCourseRecoveryCode(code, paymentId, payerEmail)) {
      return NextResponse.json(
        { success: false, error: "Código de acesso inválido." },
        { status: 403 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(COURSE_ACCESS_COOKIE, createCourseAccessToken(paymentId), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COURSE_ACCESS_MAX_AGE,
    });

    return response;
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[API /api/access/recover] Falha ao recuperar acesso:", err?.message || err);

    return NextResponse.json(
      { success: false, error: "Não foi possível validar o código agora. Tente novamente." },
      { status: 502 }
    );
  }
}
