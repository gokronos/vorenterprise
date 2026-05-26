import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/admin-auth';
import { buildAppUrl } from '@/lib/app-url';

export async function POST(request: Request) {
  const response = NextResponse.redirect(buildAppUrl(request, '/admin/login'), 303);

  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}
