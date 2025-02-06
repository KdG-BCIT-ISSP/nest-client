import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.get("token");
  console.log(isAuthenticated, "isAuth");

  if (req.nextUrl.pathname.startsWith("/admin") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  const url = req.nextUrl.clone();

  if (url.pathname.startsWith("/api/")) {
    url.hostname = "localhost";
    url.port = "8080";
    url.pathname = url.pathname.replace(/^\/api/, "/api/v1");
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// access - private
// refresh - cookie

export const config = {
  matcher: ["/admin/:path*", "/api/:path*", "/oauth2/:path*"],
};
