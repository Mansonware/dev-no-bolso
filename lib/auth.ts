import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  DEFAULT_AFTER_LOGIN,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  generateSessionToken,
  hashSessionToken,
  isWellFormedSessionToken,
  safeNextPath,
} from "@/lib/authCore";
import { deleteSession, getStoredSession, getStoredUser, getRedisClient, saveSession } from "@/lib/redis";

export {
  REQUEST_PATH_HEADER,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  burnPasswordCheck,
  hashEmail,
  hashPassword,
  normalizeEmail,
  safeNextPath,
  verifyPassword,
} from "@/lib/authCore";

/** O que as telas recebem do usuário logado — nunca hash, salt ou token. */
export type CurrentUser = {
  name: string;
  firstName: string;
};

export function isAuthConfigured(): boolean {
  return getRedisClient() !== null;
}

function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

/**
 * Cria a sessão no Redis (chave = hash do token) e grava o token no cookie HttpOnly.
 * Só pode ser chamada em Route Handler ou Server Function.
 */
export async function createSession(emailHash: string): Promise<void> {
  const token = generateSessionToken();
  const now = Date.now();
  await saveSession(
    hashSessionToken(token),
    {
      emailHash,
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + SESSION_TTL_SECONDS * 1000).toISOString(),
    },
    SESSION_TTL_SECONDS
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions(SESSION_TTL_SECONDS));
}

/** Apaga a sessão no Redis (se houver) e expira o cookie. */
export async function revokeCurrentSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  cookieStore.set(SESSION_COOKIE, "", sessionCookieOptions(0));

  if (isWellFormedSessionToken(token) && isAuthConfigured()) {
    await deleteSession(hashSessionToken(token));
  }
}

function firstNameOf(name: string): string {
  return name.split(/\s+/)[0] || name;
}

/**
 * Usuário da sessão atual, validado no Redis. Memoizado por requisição.
 * Sem cookie, sessão expirada/inexistente ou Redis indisponível → null (falha fechada).
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!isWellFormedSessionToken(token) || !isAuthConfigured()) return null;

  try {
    const session = await getStoredSession(hashSessionToken(token));
    if (!session || Date.parse(session.expiresAt) <= Date.now()) return null;

    const user = await getStoredUser(session.emailHash);
    if (!user) return null;

    return { name: user.name, firstName: firstNameOf(user.name) };
  } catch (error) {
    console.error("[Auth] Falha ao validar sessão:", error instanceof Error ? error.message : error);
    return null;
  }
});

/** Exige sessão válida; sem ela, manda para /login?next=<rota atual>. */
export async function requireUser(currentPath: string = DEFAULT_AFTER_LOGIN): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(safeNextPath(currentPath))}`);
  }
  return user;
}
