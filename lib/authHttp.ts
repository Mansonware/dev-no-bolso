import "server-only";

import { NextRequest, NextResponse } from "next/server";

// Formato estável de todas as respostas de /api/auth/*:
//   sucesso → { ok: true, redirectTo }
//   erro    → { ok: false, code, error, fieldErrors? }

export type AuthErrorCode =
  | "invalid_request"
  | "invalid_input"
  | "invalid_credentials"
  | "forbidden_origin"
  | "payment_required"
  | "payment_not_found"
  | "payment_not_eligible"
  | "payer_email_missing"
  | "email_mismatch"
  | "payment_already_claimed"
  | "account_exists"
  | "too_many_attempts"
  | "auth_unavailable"
  | "payment_unavailable";

export function authOk(redirectTo: string) {
  return NextResponse.json({ ok: true, redirectTo }, { headers: { "Cache-Control": "no-store" } });
}

export function authError(
  status: number,
  code: AuthErrorCode,
  error: string,
  fieldErrors?: Record<string, string | undefined>
) {
  return NextResponse.json(
    { ok: false, code, error, ...(fieldErrors ? { fieldErrors } : {}) },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

export const AUTH_UNAVAILABLE_MESSAGE =
  "O acesso à plataforma está indisponível no momento. Tente de novo em alguns minutos.";

/**
 * Bloqueia POST vindo de outro site (CSRF de login/cadastro). Navegadores sempre enviam Origin
 * em POST via fetch; sem o header (ex.: curl) a requisição segue, pois não carrega cookie de vítima.
 */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Lê o corpo JSON como objeto; qualquer outra coisa vira null. */
export async function readJsonObject(req: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await req.json();
    return typeof body === "object" && body !== null && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}
