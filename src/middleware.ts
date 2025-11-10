import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authPaths = ['/dashboard', '/appointments', '/profile'];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  const isAuthPath = authPaths.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  const authToken = request.cookies.get('auth_token')?.value;
  const hasUser = !!authToken;

  if (isAuthPath && !hasUser) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === '/login' || pathname === '/register') && hasUser) {
    const redirectParam = searchParams.get('redirect');
    if (!redirectParam) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
