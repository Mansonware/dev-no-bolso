import type { NextConfig } from "next";

// Headers de segurança aplicados a todas as rotas.
// Sem CSP estrita de script de propósito: o Next injeta scripts inline e uma CSP com nonce
// exigiria renderização dinâmica em todas as páginas. frame-ancestors cobre clickjacking.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // Esconde o indicador "N" do modo dev (atrapalha em live/gravação).
  devIndicators: false,
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Respostas com dados do aluno ou de pagamento nunca vão para cache compartilhado.
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default nextConfig;
