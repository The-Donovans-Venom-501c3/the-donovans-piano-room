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

  let isSessionValid = false;
  let newSetCookieHeader: string | null = null;

  // 2. Step 1: Check if current access token is valid
  if (accessToken) {
    try {
      const verifyResponse = await fetch(`${BACKEND_BASE_URL}/api/user/`, {
        method: 'GET',
        headers: {
          Cookie: `access_token=${accessToken}`,
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

  // 3. Step 2: 🔑 FIX HERE - If access_token failed/expired, attempt refresh!
  if (!isSessionValid && refreshToken) {
    try {
      const refreshResponse = await fetch(`${BACKEND_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          Cookie: `refresh_token=${refreshToken}`,
        },
        credentials: 'include',
      });

      if (refreshResponse.status === 200) {
        isSessionValid = true;
        // Capture the new set-cookie header sent back by the backend refresh route
        newSetCookieHeader = refreshResponse.headers.get('set-cookie');
      }
    } catch (error) {
      console.error('Error refreshing token in middleware:', error);
      isSessionValid = false;
    }
  }

  // --- SCENARIO A: User is trying to access Auth pages (/login, /signup) ---
  if (pathname === '/login' || pathname === '/signup') {
    if (isSessionValid) {
      const response = NextResponse.redirect(new URL('/dashboard', request.url));
      response.headers.set(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      );
      if (newSetCookieHeader) {
        response.headers.set('Set-Cookie', newSetCookieHeader);
      }
      return response;
    }
    return NextResponse.next();
  }

  // --- SCENARIO B: User is trying to access Protected routes (/dashboard, /account) ---
  if (!isSessionValid) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    return response;
  }

  // Allow normal access, forwarding newly refreshed cookies if updated
  const response = NextResponse.next();
  response.headers.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );
  if (newSetCookieHeader) {
    response.headers.set('Set-Cookie', newSetCookieHeader);
  }

  return response;
}

export const config = {
  matcher: ['/login', '/signup', '/dashboard/:path*', '/account/:path*'],
};