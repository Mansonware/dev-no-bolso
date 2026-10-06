// Núcleo puro da autenticação: e-mail, senha, token de sessão e redirect seguro.
// Sem imports do Next.js nem aliases — dá para testar direto com o Node.

import { createHash, randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

export const SESSION_COOKIE = "dnb_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 dias
export const DEFAULT_AFTER_LOGIN = "/aluno";
export const REQUEST_PATH_HEADER = "x-dnb-path";

// Parâmetros do scrypt (padrão recomendado pelo Node: ~16 MB de memória por hash).
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 } as const;
const SCRYPT_KEYLEN = 64;
const SCRYPT_MAXMEM = 64 * 1024 * 1024;
const SALT_BYTES = 16;
const SESSION_TOKEN_BYTES = 32;

export type PasswordRecord = {
  algo: "scrypt";
  N: number;
  r: number;
  p: number;
  salt: string;
  hash: string;
};

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Identificador do usuário no Redis: SHA-256 do e-mail normalizado (o e-mail cru não vai no nome da chave). */
export function hashEmail(email: string): string {
  return createHash("sha256").update(normalizeEmail(email)).digest("hex");
}

function scryptAsync(password: string, salt: Buffer, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, SCRYPT_KEYLEN, options, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<PasswordRecord> {
  const salt = randomBytes(SALT_BYTES);
  const hash = await scryptAsync(password, salt, { ...SCRYPT_PARAMS, maxmem: SCRYPT_MAXMEM });
  return {
    algo: "scrypt",
    ...SCRYPT_PARAMS,
    salt: salt.toString("base64"),
    hash: hash.toString("base64"),
  };
}

export async function verifyPassword(password: string, record: PasswordRecord): Promise<boolean> {
  if (record.algo !== "scrypt") return false;
  const expected = Buffer.from(record.hash, "base64");
  if (expected.length !== SCRYPT_KEYLEN) return false;

  const actual = await scryptAsync(password, Buffer.from(record.salt, "base64"), {
    N: record.N,
    r: record.r,
    p: record.p,
    maxmem: SCRYPT_MAXMEM,
  });
  return timingSafeEqual(actual, expected);
}

// Hash calculado uma vez para equalizar o tempo de resposta quando o e-mail não existe.
let dummyRecord: Promise<PasswordRecord> | null = null;

export async function burnPasswordCheck(password: string): Promise<void> {
  dummyRecord ??= hashPassword(randomBytes(16).toString("hex"));
  await verifyPassword(password, await dummyRecord);
}

/** Token opaco que vai no cookie. No Redis fica só o hash dele. */
export function generateSessionToken(): string {
  return randomBytes(SESSION_TOKEN_BYTES).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

const SESSION_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export function isWellFormedSessionToken(token: string | undefined): token is string {
  return typeof token === "string" && SESSION_TOKEN_PATTERN.test(token);
}

/**
 * Aceita só caminhos internos ("/aluno/trilha"). Bloqueia "//host", "/\host",
 * URLs absolutas e caracteres de controle — nada de redirect para fora do site.
 */
export function safeNextPath(value: unknown, fallback: string = DEFAULT_AFTER_LOGIN): string {
  if (typeof value !== "string") return fallback;
  if (value.length === 0 || value.length > 512) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  if (/[\\\u0000-\u001f\u007f]/.test(value)) return fallback;
  return value;
}
