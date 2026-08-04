import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BACKEND_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.BE_PROD_BASE_URL
    : process.env.BE_BASE_URL;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Ignore static assets & Next.js system files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.woff2') ||
    pathname.endsWith('.ttf')
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // Check backend session validity helper
  let isSessionValid = false;

  if (accessToken) {
    try {
      const verifyResponse = await fetch(`${BACKEND_BASE_URL}/api/user/`, {
        method: 'GET',
        headers: {
          Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
        },
        credentials: 'include',
      });

      if (verifyResponse.status === 200) {
        isSessionValid = true;
      }
    } catch (error) {
      console.error('Error verifying session:', error);
      isSessionValid = false;
    }
  }

  // --- SCENARIO A: User is trying to access Auth pages (/login, /signup) ---
  if (pathname === '/login' || pathname === '/signup') {
    // If user is ALREADY logged in and presses BACK arrow to /login -> redirect to /dashboard
    if (isSessionValid) {
      const response = NextResponse.redirect(new URL('/dashboard', request.url));
      response.headers.set(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      );
      return response;
    }
    return NextResponse.next();
  }

  // --- SCENARIO B: User is trying to access Protected routes (/dashboard, /account) ---
  if (!isSessionValid) {
    // If user logged out and presses FORWARD arrow -> redirect to /login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    return response;
  }

  // Allow normal access with no-cache headers to prevent bfcache issues
  const response = NextResponse.next();
  response.headers.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );
  return response;
}

// Ensure middleware runs for auth pages AND protected pages
export const config = {
  matcher: ['/login', '/signup', '/dashboard/:path*', '/account/:path*'],
};