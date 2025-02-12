import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  const isProtectedRoute =
    req.nextUrl.pathname.startsWith("/admin") ||
    req.nextUrl.pathname.startsWith("/profile") ||
    req.nextUrl.pathname.startsWith("/create-post");

  if (isProtectedRoute && !accessToken) {
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

export const config = {
  matcher: [
    "/(admin|profile|create-post)/:path*",
    "/api/:path*",
    "/oauth2/:path*",
  ],
};
