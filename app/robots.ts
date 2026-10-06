import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/aluno", "/api/", "/cadastro", "/login", "/pagamento/", "/acesso-suspenso"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
