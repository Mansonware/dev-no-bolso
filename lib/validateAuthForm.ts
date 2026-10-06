// Validação dos formulários de login e cadastro.
// Roda no navegador (feedback imediato) e de novo nas rotas /api/auth/* — o servidor nunca confia no cliente.

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
const EMAIL_MAX_LENGTH = 254;
const NAME_MAX_LENGTH = 80;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LoginValues = { email: string; password: string };
export type SignupValues = { name: string; email: string; password: string; confirmPassword: string };
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

function emailError(email: string): string | undefined {
  const trimmed = email.trim();
  if (!trimmed) return "Digite seu e-mail.";
  if (trimmed.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(trimmed)) return "Digite um e-mail válido.";
}

export function validateLogin(values: LoginValues): FieldErrors<LoginValues> {
  const errors: FieldErrors<LoginValues> = {};
  const email = emailError(values.email);
  if (email) errors.email = email;
  if (!values.password) errors.password = "Digite sua senha.";
  else if (values.password.length > PASSWORD_MAX_LENGTH) errors.password = "A senha é longa demais.";
  return errors;
}

export function validateSignup(values: SignupValues): FieldErrors<SignupValues> {
  const errors: FieldErrors<SignupValues> = {};
  const name = cleanName(values.name);

  if (!name) errors.name = "Digite seu nome.";
  else if (name.length < 2 || name.length > NAME_MAX_LENGTH) errors.name = "Digite um nome válido.";

  const email = emailError(values.email);
  if (email) errors.email = email;

  if (!values.password) errors.password = "Crie uma senha.";
  else if (values.password.length < PASSWORD_MIN_LENGTH)
    errors.password = `A senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  else if (values.password.length > PASSWORD_MAX_LENGTH) errors.password = "A senha é longa demais.";

  if (!values.confirmPassword) errors.confirmPassword = "Confirme sua senha.";
  else if (values.confirmPassword !== values.password) errors.confirmPassword = "As senhas não são iguais.";

  return errors;
}

/** Nome como será salvo: sem caracteres de controle e com espaços colapsados. */
export function cleanName(name: string): string {
  return name.replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}

export function hasErrors<T>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
