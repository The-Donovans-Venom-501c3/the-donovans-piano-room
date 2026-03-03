import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internals and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".woff") ||
    pathname.endsWith(".woff2") ||
    pathname.endsWith(".ttf")
  ) {
    return NextResponse.next();
  }

  // Only protect dashboard/account routes (config matcher already limits this,
  // but keeping this guard is harmless)
  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/account");
  if (!isProtected) return NextResponse.next();

  const refreshToken = request.cookies.get("refresh_token")?.value;

  // ✅ Key fix:
  // If refresh token is missing, user is not authenticated -> redirect to login.
  // If refresh token exists, allow navigation even if access token expired.
  if (!refreshToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*"],
};