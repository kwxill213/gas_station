// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { TokenPayload } from './lib/types';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

const protectedPaths = ['/profile', '/order', '/api/user'];
const adminPaths = ['/admin', '/api/admin'];
const employeePaths = ['/employee', '/api/employee'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  const isAdminRoute = adminPaths.some(path => pathname.startsWith(path));
  const isEmployeeRoute = employeePaths.some(path => pathname.startsWith(path));

  if (!isProtected && !isAdminRoute && !isEmployeeRoute) {
    return NextResponse.next();
  }

  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      if (!pathname.startsWith('/api')) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
      }
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Authentication failed' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }

    const { payload } = await jwtVerify<TokenPayload>(token, SECRET);

    if (isAdminRoute && payload.roleId !== 1) {
      if (!pathname.startsWith('/api')) {
        return NextResponse.redirect(new URL('/forbidden', request.url));
      }
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Доступ запрещён' }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }

    if (isEmployeeRoute && payload.roleId !== 2) {
      if (!pathname.startsWith('/api')) {
        return NextResponse.redirect(new URL('/forbidden', request.url));
      }
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Доступ запрещён' }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }

    if (pathname.startsWith('/api')) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.id.toString());
      requestHeaders.set('x-user-email', payload.email);
      requestHeaders.set('x-user-role-id', payload.roleId.toString());

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
  } catch (err) {
    console.error('Authentication error:', err);

    if (!pathname.startsWith('/api')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return new NextResponse(
      JSON.stringify({ success: false, message: 'Authentication failed' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};