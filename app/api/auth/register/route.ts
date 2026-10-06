import { NextRequest } from "next/server";
import { createSession, hashEmail, hashPassword, isAuthConfigured, normalizeEmail } from "@/lib/auth";
import {
  AUTH_UNAVAILABLE_MESSAGE,
  asString,
  authError,
  authOk,
  isSameOrigin,
  readJsonObject,
} from "@/lib/authHttp";
import { isValidPaymentId, verifyPurchaseForSignup } from "@/lib/mercadopago";
import { RedisUnavailableError, createUserClaimingPayment, hitRateLimit } from "@/lib/redis";
import { cleanName, hasErrors, validateSignup } from "@/lib/validateAuthForm";

// Limite por pagamento: impede adivinhar o e-mail do pagador por força bruta.
const REGISTER_ATTEMPTS_PER_PAYMENT = 10;
const REGISTER_WINDOW_SECONDS = 15 * 60;

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return authError(403, "forbidden_origin", "Requisição recusada.");
  }

  // Sem Redis não há onde guardar a conta: falha fechada antes de qualquer coisa.
  if (!isAuthConfigured()) {
    console.error("[API /api/auth/register] Redis não configurado — cadastro desativado.");
    return authError(503, "auth_unavailable", AUTH_UNAVAILABLE_MESSAGE);
  }

  const body = await readJsonObject(req);
  if (!body) return authError(400, "invalid_request", "Requisição inválida.");

  const paymentId = asString(body.paymentId).trim();
  if (!isValidPaymentId(paymentId)) {
    return authError(
      400,
      "payment_required",
      "O cadastro é liberado depois do pagamento. Abra o link de criar conta da página de confirmação da compra."
    );
  }

  const values = {
    name: asString(body.name),
    email: asString(body.email),
    password: asString(body.password),
    confirmPassword: asString(body.confirmPassword),
  };
  const fieldErrors = validateSignup(values);
  if (hasErrors(fieldErrors)) {
    return authError(400, "invalid_input", "Confira os campos destacados.", fieldErrors);
  }

  try {
    if (await hitRateLimit("register", paymentId, REGISTER_ATTEMPTS_PER_PAYMENT, REGISTER_WINDOW_SECONDS)) {
      return authError(429, "too_many_attempts", "Muitas tentativas. Aguarde alguns minutos e tente de novo.");
    }

    // Prova de compra: consulta direta ao Mercado Pago, nunca dados vindos do navegador.
    const purchase = await verifyPurchaseForSignup(paymentId);
    if (!purchase.ok) {
      switch (purchase.code) {
        case "not_found":
          return authError(400, "payment_not_found", "Não encontramos esse pagamento no Mercado Pago.");
        case "not_eligible":
          return authError(
            403,
            "payment_not_eligible",
            "Esse pagamento ainda não está aprovado para liberar o acesso. Se pagou por Pix ou boleto, aguarde alguns minutos e tente de novo."
          );
        case "payer_email_missing":
          return authError(
            422,
            "payer_email_missing",
            "Não conseguimos confirmar o e-mail desta compra automaticamente. Fale com o suporte e informe o número do pagamento para liberarmos sua conta."
          );
        default:
          return authError(
            503,
            "payment_unavailable",
            "Não conseguimos falar com o Mercado Pago agora. Tente de novo em alguns minutos."
          );
      }
    }

    const email = normalizeEmail(values.email);
    if (email !== purchase.payerEmail) {
      return authError(
        403,
        "email_mismatch",
        "Use o mesmo e-mail que você informou no pagamento do Mercado Pago.",
        { email: "Este e-mail não é o da compra." }
      );
    }

    const emailHash = hashEmail(email);
    const result = await createUserClaimingPayment(emailHash, {
      name: cleanName(values.name),
      email,
      password: await hashPassword(values.password),
      paymentId: purchase.paymentId,
      createdAt: new Date().toISOString(),
    });

    if (result === "payment_claimed") {
      return authError(409, "payment_already_claimed", "Este pagamento já foi usado para criar uma conta. Entre com seu e-mail e senha.");
    }
    if (result === "user_exists") {
      return authError(409, "account_exists", "Já existe uma conta com este e-mail. Entre com seu e-mail e senha.");
    }

    await createSession(emailHash);
    return authOk("/aluno");
  } catch (error) {
    if (error instanceof RedisUnavailableError) {
      return authError(503, "auth_unavailable", AUTH_UNAVAILABLE_MESSAGE);
    }
    console.error("[API /api/auth/register] Falha ao criar conta:", error instanceof Error ? error.message : error);
    return authError(503, "auth_unavailable", AUTH_UNAVAILABLE_MESSAGE);
  }
}
