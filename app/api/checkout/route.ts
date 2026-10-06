import { NextRequest, NextResponse } from "next/server";
import { createCheckoutPreference, isCheckoutConfigured } from "@/lib/mercadopago";

const UNAVAILABLE_MESSAGE =
  "O pagamento está indisponível no momento. Tente novamente em alguns minutos.";

export async function POST(req: NextRequest) {
  // Sem credencial do Mercado Pago no ambiente: falha segura, sem tentar a API.
  if (!isCheckoutConfigured()) {
    console.error("[API /api/checkout] MERCADOPAGO_ACCESS_TOKEN ausente — checkout desativado.");
    return NextResponse.json(
      { success: false, code: "checkout_not_configured", error: UNAVAILABLE_MESSAGE },
      { status: 503 }
    );
  }

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
        error: process.env.NODE_ENV === "development" ? err?.message : UNAVAILABLE_MESSAGE,
      },
      { status: 500 }
    );
  }
}
