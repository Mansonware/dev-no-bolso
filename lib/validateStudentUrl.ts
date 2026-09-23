// Validação local (somente interface) das URLs informadas pelo aluno nas aulas.
// Não substitui validação server-side: o valor não sai do navegador do aluno.

export const STUDENT_URL_MAX_LENGTH = 2048;

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export const STUDENT_URL_ERRORS = {
  empty: "Digite a URL do seu projeto.",
  invalid: "Digite uma URL válida começando com http:// ou https://.",
  protocol: "Use apenas links http:// ou https://.",
} as const;

export type StudentUrlResult = { ok: true; url: string } | { ok: false; error: string };

export function validateStudentUrl(value: string): StudentUrlResult {
  const trimmed = value.trim();

  if (!trimmed) return { ok: false, error: STUDENT_URL_ERRORS.empty };
  if (trimmed.length > STUDENT_URL_MAX_LENGTH) return { ok: false, error: STUDENT_URL_ERRORS.invalid };

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, error: STUDENT_URL_ERRORS.invalid };
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) return { ok: false, error: STUDENT_URL_ERRORS.protocol };
  if (!parsed.hostname) return { ok: false, error: STUDENT_URL_ERRORS.invalid };

  return { ok: true, url: parsed.href };
}
