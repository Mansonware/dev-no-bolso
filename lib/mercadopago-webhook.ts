import { createHmac, timingSafeEqual } from "node:crypto";

type SignatureCheck = {
  configured: boolean;
  valid: boolean;
};

function safeEqualHex(left: string, right: string) {
  try {
    const a = Buffer.from(left, "hex");
    const b = Buffer.from(right, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyMercadoPagoWebhookSignature(input: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
}): SignatureCheck {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim();
  if (!secret) return { configured: false, valid: true };

  if (!input.xSignature || !input.xRequestId || !input.dataId) {
    return { configured: true, valid: false };
  }

  const parts = new Map<string, string>();
  for (const part of input.xSignature.split(",")) {
    const [key, value] = part.split("=", 2);
    if (key && value) parts.set(key.trim(), value.trim());
  }

  const ts = parts.get("ts");
  const v1 = parts.get("v1");
  if (!ts || !v1) return { configured: true, valid: false };

  const manifest = `id:${input.dataId.toLowerCase()};request-id:${input.xRequestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  return {
    configured: true,
    valid: safeEqualHex(expected, v1),
  };
}
