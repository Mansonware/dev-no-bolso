import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import {
  getMercadoPagoAccessToken,
  getPaymentDetails,
  validatePayment,
} from "@/lib/mercadopago";

export const COURSE_ACCESS_COOKIE = "dnb_course_access";
export const COURSE_ACCESS_MAX_AGE = 60 * 60 * 24 * 180;

type CourseAccessPayload = {
  version: 1;
  paymentId: string;
  issuedAt: number;
  expiresAt: number;
};

function getCourseAccessKey() {
  const secret =
    process.env.COURSE_ACCESS_SECRET?.trim() || getMercadoPagoAccessToken();

  return createHmac("sha256", secret)
    .update("dev-no-bolso/course-access/v1")
    .digest();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function createCourseAccessToken(paymentId: string) {
  const now = Math.floor(Date.now() / 1000);
  const payload: CourseAccessPayload = {
    version: 1,
    paymentId,
    issuedAt: now,
    expiresAt: now + COURSE_ACCESS_MAX_AGE,
  };

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getCourseAccessKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [
    "v1",
    iv.toString("base64url"),
    encrypted.toString("base64url"),
    tag.toString("base64url"),
  ].join(".");
}

export function verifyCourseAccessToken(
  token: string | null | undefined
): CourseAccessPayload | null {
  if (!token) return null;

  try {
    const [version, ivPart, encryptedPart, tagPart] = token.split(".");
    if (version !== "v1" || !ivPart || !encryptedPart || !tagPart) return null;

    const decipher = createDecipheriv(
      "aes-256-gcm",
      getCourseAccessKey(),
      Buffer.from(ivPart, "base64url")
    );
    decipher.setAuthTag(Buffer.from(tagPart, "base64url"));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedPart, "base64url")),
      decipher.final(),
    ]);

    const payload = JSON.parse(decrypted.toString("utf8")) as CourseAccessPayload;
    const now = Math.floor(Date.now() / 1000);

    if (
      payload.version !== 1 ||
      !payload.paymentId ||
      !/^\d+$/.test(payload.paymentId) ||
      !Number.isFinite(payload.expiresAt) ||
      payload.expiresAt <= now
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function verifyLiveCourseAccessToken(
  token: string | null | undefined
): Promise<CourseAccessPayload | null> {
  const payload = verifyCourseAccessToken(token);
  if (!payload) return null;

  try {
    const validation = validatePayment(await getPaymentDetails(payload.paymentId));
    return validation.valid ? payload : null;
  } catch (error) {
    console.warn(
      "[Course Access] Mercado Pago indisponível; mantendo sessão local já assinada.",
      error
    );
    return payload;
  }
}

export function createCourseRecoveryCode(paymentId: string, payerEmail: string) {
  const normalizedEmail = normalizeEmail(payerEmail);
  if (!/^\d+$/.test(paymentId) || !normalizedEmail) {
    throw new Error("Dados inválidos para gerar código de acesso.");
  }

  const mac = createHmac("sha256", getCourseAccessKey())
    .update(`recovery:v1:${paymentId}:${normalizedEmail}`)
    .digest("hex")
    .slice(0, 20)
    .toUpperCase();

  return `DNB-${paymentId}-${mac}`;
}

export function extractPaymentIdFromRecoveryCode(code: string) {
  const match = code.trim().toUpperCase().match(/^DNB-(\d+)-([A-F0-9]{20})$/);
  return match?.[1] ?? null;
}

export function verifyCourseRecoveryCode(
  code: string,
  paymentId: string,
  payerEmail: string
) {
  const provided = code.trim().toUpperCase();
  const expected = createCourseRecoveryCode(paymentId, payerEmail).toUpperCase();

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);

  return a.length === b.length && timingSafeEqual(a, b);
}
