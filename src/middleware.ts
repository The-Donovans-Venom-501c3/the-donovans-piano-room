import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_BASE_URL = process.env.BE_PROD_BASE_URL;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets and paths starting with _next, favicon.ico, etc.
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

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const verifyResponse = await fetch(`${BACKEND_BASE_URL}/api/user/`, {
      method: "GET",
      headers: {
        Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
      },
      credentials: "include",
    });

    if (verifyResponse.status !== 200) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // const response = await fetch(`${BACKEND_BASE_URL}/api/membership/user`);
    // let guestUser = false;

    // if (response.status === 410) {
    //   guestUser = true; // Set the guestUser flag to true
    // }

    // // Logic for redirecting guest users
    // if (guestUser) {
    //   console.log("Seeing it working everytime anta");
    //   // Guest users should only be allowed to visit /dashboard, /login, and /account
    //   if (pathname.includes("/lessons") || pathname.includes("/games")) {
    //     // Redirect guest users to the dashboard with a query parameter to show the modal
    //     const redirectUrl = new URL("/dashboard", request.url);
    //     redirectUrl.searchParams.set("paymentPending", "true"); // Add query parameter
    //     return NextResponse.redirect(redirectUrl);
    //   }
    // }
  } catch (error) {
    console.error("Error verifying session:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/settings/:path*",
    "/lessons/:path*",
    "/games/:path*",
  ],
};
