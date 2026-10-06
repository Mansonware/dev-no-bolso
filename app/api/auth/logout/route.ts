import { NextRequest } from "next/server";
import { revokeCurrentSession } from "@/lib/auth";
import { authError, authOk, isSameOrigin } from "@/lib/authHttp";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return authError(403, "forbidden_origin", "Requisição recusada.");
  }

  try {
    await revokeCurrentSession();
  } catch (error) {
    // O cookie já foi expirado antes da chamada ao Redis; a sessão restante expira pelo TTL.
    console.error("[API /api/auth/logout] Falha ao apagar sessão:", error instanceof Error ? error.message : error);
  }

  return authOk("/login");
}
