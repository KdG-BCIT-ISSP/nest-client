import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.get("token");
  console.log(isAuthenticated, "isAuth");

  if (req.nextUrl.pathname.startsWith("/admin") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
