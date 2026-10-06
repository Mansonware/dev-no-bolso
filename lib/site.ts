// URL pública canônica do site (metadata, Open Graph, sitemap, back_urls do Mercado Pago).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://dev-no-bolso.vercel.app").replace(/\/+$/, "");

export const SITE_NAME = "Dev no Bolso";
export const SITE_TITLE = "Dev no Bolso — seu primeiro site no ar, pelo celular";
export const SITE_DESCRIPTION =
  "Curso prático para quem nunca programou: em 4 aulas você cria e publica seu primeiro site usando só o celular. R$ 45,99, pagamento único.";
