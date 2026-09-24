import { getToken } from "next-auth/jwt";
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({ req });
  console.log("toekn: ",token);
  const { pathname } = req.nextUrl;
  
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
