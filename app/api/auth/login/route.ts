import { NextRequest } from "next/server";
import {
  burnPasswordCheck,
  createSession,
  hashEmail,
  isAuthConfigured,
  safeNextPath,
  verifyPassword,
} from "@/lib/auth";
import {
  AUTH_UNAVAILABLE_MESSAGE,
  asString,
  authError,
  authOk,
  isSameOrigin,
  readJsonObject,
} from "@/lib/authHttp";
import { RedisUnavailableError, clearRateLimit, getStoredUser, hitRateLimit } from "@/lib/redis";
import { hasErrors, validateLogin } from "@/lib/validateAuthForm";

const LOGIN_ATTEMPTS_PER_EMAIL = 10;
const LOGIN_WINDOW_SECONDS = 15 * 60;

// Mesma mensagem para e-mail inexistente e senha errada: não revela quem tem conta.
const INVALID_CREDENTIALS = "E-mail ou senha incorretos.";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return authError(403, "forbidden_origin", "Requisição recusada.");
  }

  if (!isAuthConfigured()) {
    console.error("[API /api/auth/login] Redis não configurado — login desativado.");
    return authError(503, "auth_unavailable", AUTH_UNAVAILABLE_MESSAGE);
  }

  const body = await readJsonObject(req);
  if (!body) return authError(400, "invalid_request", "Requisição inválida.");

  const values = { email: asString(body.email), password: asString(body.password) };
  const fieldErrors = validateLogin(values);
  if (hasErrors(fieldErrors)) {
    return authError(400, "invalid_input", "Confira os campos destacados.", fieldErrors);
  }

  const emailHash = hashEmail(values.email);

  try {
    if (await hitRateLimit("login", emailHash, LOGIN_ATTEMPTS_PER_EMAIL, LOGIN_WINDOW_SECONDS)) {
      return authError(429, "too_many_attempts", "Muitas tentativas. Aguarde alguns minutos e tente de novo.");
    }

    const user = await getStoredUser(emailHash);
    if (!user) {
      await burnPasswordCheck(values.password);
      return authError(401, "invalid_credentials", INVALID_CREDENTIALS);
    }

    if (!(await verifyPassword(values.password, user.password))) {
      return authError(401, "invalid_credentials", INVALID_CREDENTIALS);
    }

    await clearRateLimit("login", emailHash);
    await createSession(emailHash);
    return authOk(safeNextPath(body.next));
  } catch (error) {
    if (!(error instanceof RedisUnavailableError)) {
      console.error("[API /api/auth/login] Falha no login:", error instanceof Error ? error.message : error);
    }
    return authError(503, "auth_unavailable", AUTH_UNAVAILABLE_MESSAGE);
  }
}
