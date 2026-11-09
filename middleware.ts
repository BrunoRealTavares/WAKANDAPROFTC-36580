import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware do painel.
 * - Protege todas as rotas sob /painel/* (exceto /painel/login e /painel/logout).
 * - Sem sessão válida -> redireciona para /painel/login.
 * - Com sessão válida -> permite acesso (a verificação de papel fica nas pages/actions).
 * Sem cookies no prerender: o middleware roda no edge antes de chegar na página.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas do painel (login/logout) não exigem sessão
  if (pathname === "/painel/login" || pathname === "/painel/logout") {
    return NextResponse.next();
  }

  // Qualquer outra rota sob /painel exige sessão
  if (pathname.startsWith("/painel")) {
    const session = request.cookies.get("wp_session");
    if (!session) {
      const loginUrl = new URL("/painel/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/painel/:path*"],
};
