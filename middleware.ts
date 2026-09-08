import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.AUTH_SECRET || 'smart-internship-allocation-aoa-secret-key-32chars-min';
const encodedKey = new TextEncoder().encode(SECRET_KEY);
const COOKIE_NAME = 'internship_session';

interface SessionPayload {
  id: string;
  role: 'ADMIN' | 'STUDENT' | 'COMPANY';
}

export async function middleware(request: any) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isStudentRoute = pathname.startsWith('/student');
  const isCompanyRoute = pathname.startsWith('/company');

  if (!isAdminRoute && !isStudentRoute && !isCompanyRoute) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(COOKIE_NAME);

  if (!sessionCookie?.value) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(sessionCookie.value, encodedKey, {
      algorithms: ['HS256'],
    });
    const userRole = (payload as unknown as SessionPayload).role;

    if (isAdminRoute && userRole !== 'ADMIN') {
      const target = userRole === 'STUDENT' ? '/student/dashboard' : '/company/dashboard';
      return NextResponse.redirect(new URL(target, request.url));
    }

    if (isStudentRoute && userRole !== 'STUDENT') {
      const target = userRole === 'ADMIN' ? '/admin/dashboard' : '/company/dashboard';
      return NextResponse.redirect(new URL(target, request.url));
    }

    if (isCompanyRoute && userRole !== 'COMPANY') {
      const target = userRole === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';
      return NextResponse.redirect(new URL(target, request.url));
    }

    return NextResponse.next();
  } catch (err) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*', '/student/:path*', '/company/:path*'],
};
