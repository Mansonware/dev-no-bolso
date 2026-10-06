import { NextResponse, type NextRequest } from "next/server";
import { REQUEST_PATH_HEADER, SESSION_COOKIE } from "@/lib/authCore";

// Checagem otimista: sem cookie de sessão, nem renderiza a área do aluno e já manda para o login
// lembrando a rota pedida. A validação de verdade (sessão no Redis) acontece em lib/auth.ts.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (request.cookies.has(SESSION_COOKIE)) {
    // Repassa a rota pedida para o layout montar o ?next= caso a sessão tenha expirado.
    const headers = new Headers(request.headers);
    headers.set(REQUEST_PATH_HEADER, `${pathname}${search}`);
    return NextResponse.next({ request: { headers } });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/aluno", "/aluno/:path*"],
};
