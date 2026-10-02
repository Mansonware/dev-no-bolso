import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";
import { getMercadoPagoAccessToken } from "@/lib/mercadopago";

export const COURSE_ACCESS_COOKIE = "dnb_course_access";
export const COURSE_ACCESS_MAX_AGE = 60 * 60 * 24 * 180;

type CourseAccessPayload = {
  version: 1;
  paymentId: string;
  issuedAt: number;
  expiresAt: number;
};

function getCourseAccessKey() {
  return createHmac("sha256", getMercadoPagoAccessToken())
    .update("dev-no-bolso/course-access/v1")
    .digest();
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

export function verifyCourseAccessToken(token: string | null | undefined): CourseAccessPayload | null {
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
