import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BACKEND_BASE_URL = process.env.NODE_ENV=="production"?process.env.BE_PROD_BASE_URL:process.env.BE_BASE_URL;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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
    if (!accessToken) {      
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {       
        const verifyResponse = await fetch(`${BACKEND_BASE_URL}/api/user/`, {
          method: 'GET',
          headers: {
            Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
          },
          credentials: 'include',
        });         
        if (verifyResponse.status !==200) {           
          return NextResponse.redirect(new URL('/login', request.url));
        }
    
      } catch (error) {
        console.error('Error verifying session:', error);
        return NextResponse.redirect(new URL('/login', request.url));
      }
  return NextResponse.next();
}



export const config = {
  matcher: ['/dashboard/:path*', '/account/:path*'],
};
