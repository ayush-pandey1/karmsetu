import { getToken } from "next-auth/jwt";
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({ req });
  //console.log(token);
  const { pathname } = req.nextUrl;
  //console.log('Middleware triggered for:', req.nextUrl.pathname);

  // If user is not logged in and tries to access protected routes, redirect to /auth/signin
  if (!token && (pathname.startsWith('/cl') || pathname.startsWith('/fl'))) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // If the user is logged in and tries to access signin or signup, redirect based on role
  if (token && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
    const redirectUrl = token.role === 'client' ? '/cl' : '/fl';
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // If user is a client and trying to access freelancer routes, redirect them to client dashboard
  if (token?.role === 'client' && pathname.startsWith('/fl')) {
    return NextResponse.redirect(new URL('/cl', req.url));
  }

  // If user is a freelancer and trying to access client routes, redirect them to freelancer dashboard
  if (token?.role === 'freelancer' && pathname.startsWith('/cl')) {
    return NextResponse.redirect(new URL('/fl', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/cl/:path*',  // Client protected routes
    '/fl/:path*',  // Freelancer protected routes
    '/auth/signin',  // Protect signin page from logged-in users
    '/auth/signup',  // Protect signup page from logged-in users
  ],
};
