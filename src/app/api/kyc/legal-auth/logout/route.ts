import { NextResponse } from 'next/server';
import { KYC_LEGAL_AUTH_COOKIE_NAME } from '@/lib/kyc-legal-auth';
import { buildAppUrl } from '@/lib/app-url';

export async function POST(request: Request) {
  const response = NextResponse.redirect(buildAppUrl(request, '/kyc?rol=juridicos&saved=logout'), 303);
  response.cookies.set(KYC_LEGAL_AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}
