import { NextResponse } from "next/server";
import { getSpotsStatus } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const status = await getSpotsStatus();

    return NextResponse.json(status, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: unknown) {
    console.error("[API /api/spots] Erro:", error);
    return NextResponse.json(
      {
        total: 15,
        approved: 0,
        remaining: 15,
        soldOut: false,
      },
      { status: 200 }
    );
  }
}
