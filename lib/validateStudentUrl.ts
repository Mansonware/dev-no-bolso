// Validação dos dados que o aluno entrega nas aulas (usuário do GitHub, link do repositório, link do site).
// Roda no navegador (feedback imediato) e de novo em POST /api/progress — o servidor nunca confia no cliente.
// Sem imports: dá para testar direto com `node --test`.

export const STUDENT_URL_MAX_LENGTH = 2048;

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export const STUDENT_URL_ERRORS = {
  empty: "Digite a URL do seu projeto.",
  invalid: "Digite uma URL válida começando com http:// ou https://.",
  protocol: "Use apenas links http:// ou https://.",
} as const;

export type StudentUrlResult = { ok: true; url: string } | { ok: false; error: string };
export type FieldResult = { ok: true; value: string } | { ok: false; error: string };

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

// Regras do GitHub: até 39 caracteres, letras, números e hífen, sem começar ou terminar com hífen.
const GITHUB_USER_PATTERN = /^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/i;

/** Aceita "maria-dev", "@maria-dev" ou "github.com/maria-dev" e devolve só "maria-dev". */
export function validateGithubUser(value: string): FieldResult {
  let user = value.trim();
  if (!user) return { ok: false, error: "Digite o seu nome de usuário do GitHub." };

  user = user.replace(/^https?:\/\//i, "").replace(/^(www\.)?github\.com\//i, "").replace(/^@/, "").replace(/\/+$/, "");

  if (!GITHUB_USER_PATTERN.test(user)) {
    return { ok: false, error: "Use só o nome de usuário: letras, números e hífen, sem espaços." };
  }
  return { ok: true, value: user };
}

/** Link de repositório no formato https://github.com/<usuario>/<repositorio>. */
export function validateRepoUrl(value: string): FieldResult {
  const trimmed = value.trim();
  if (!trimmed) return { ok: false, error: "Cole o link do seu repositório." };

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const result = validateStudentUrl(withProtocol);
  if (!result.ok) return { ok: false, error: "Esse link não parece válido. Copie da barra de endereço do navegador." };

  const url = new URL(result.url);
  const parts = url.pathname.split("/").filter(Boolean);
  const host = url.hostname.toLowerCase();
  if ((host !== "github.com" && host !== "www.github.com") || parts.length < 2) {
    return { ok: false, error: "O link precisa ser do GitHub, no formato github.com/seu-usuario/nome-do-repositorio." };
  }
  if (!GITHUB_USER_PATTERN.test(parts[0]) || !/^[\w.-]{1,100}$/.test(parts[1])) {
    return { ok: false, error: "O link precisa ser do GitHub, no formato github.com/seu-usuario/nome-do-repositorio." };
  }

  return { ok: true, value: `https://github.com/${parts[0]}/${parts[1].replace(/\.git$/i, "")}` };
}

/** Endereço público do site (http/https). Normalmente <usuario>.github.io/<repositorio>. */
export function validateSiteUrl(value: string): FieldResult {
  const trimmed = value.trim();
  if (!trimmed) return { ok: false, error: "Cole o endereço do seu site." };

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const result = validateStudentUrl(withProtocol);
  if (!result.ok) return { ok: false, error: "Esse endereço não parece válido. Copie o link que o GitHub mostrou." };

  const host = new URL(result.url).hostname;
  if (!host.includes(".")) return { ok: false, error: "Esse endereço não parece válido. Copie o link que o GitHub mostrou." };

  return { ok: true, value: result.url };
}
