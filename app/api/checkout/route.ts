import { NextRequest, NextResponse } from "next/server";
import { createCheckoutPreference } from "@/lib/mercadopago";

export async function POST(req: NextRequest) {
  try {
    // Determina a URL base do site
    const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    let siteUrl = envSiteUrl?.trim() || "";

    if (!siteUrl || siteUrl.includes("localhost")) {
      const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
      const proto = req.headers.get("x-forwarded-proto") || "http";
      if (host) {
        siteUrl = `${proto}://${host}`;
      }
    }

    if (!siteUrl) {
      siteUrl = "http://localhost:3000";
    }

    // Garante que o preço ou parâmetros arbitrários não venham do cliente
    const preference = await createCheckoutPreference(siteUrl);

    return NextResponse.json({
      success: true,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
      preference_id: preference.id,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[API /api/checkout] Erro ao criar preferência:", err?.message || err);

    return NextResponse.json(
      {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? err?.message
            : "Não foi possível iniciar o checkout no momento. Tente novamente mais tarde.",
      },
      { status: 500 }
    );
  }
}
