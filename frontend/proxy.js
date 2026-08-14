import { NextResponse } from 'next/server';

export function proxy(request) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const hrToken = request.cookies.get('hr_token')?.value;

  const hasToken = Boolean(accessToken || refreshToken || hrToken);
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  if (isProtectedRoute && !hasToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
