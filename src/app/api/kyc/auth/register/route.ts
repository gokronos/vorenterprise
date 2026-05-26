import { NextResponse } from 'next/server';
import { createKycToken, KYC_AUTH_COOKIE_NAME, registerKycUser } from '@/lib/kyc-auth';
import { isRateLimited } from '@/lib/rate-limit';
import { buildAppUrl } from '@/lib/app-url';

export async function POST(request: Request) {
  const limit = await isRateLimited({ request, scope: 'kyc-natural-register', max: 5, windowMs: 15 * 60 * 1000 });
  if (limit.limited) {
    return NextResponse.redirect(buildAppUrl(request, '/kyc?error=Demasiados+intentos+de+registro.+Intenta+mas+tarde'), 303);
  }

  const formData = await request.formData();
  const cedula = String(formData.get('cedula') || '');
  const password = String(formData.get('password') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');

  const result = registerKycUser({ cedula, password, confirmPassword });

  if (!result.ok || !result.user) {
    return NextResponse.redirect(buildAppUrl(request, `/kyc?error=${encodeURIComponent(result.message)}`), 303);
  }

  const response = NextResponse.redirect(buildAppUrl(request, '/kyc?saved=registered'), 303);
  response.cookies.set(KYC_AUTH_COOKIE_NAME, createKycToken(result.user.cedula), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
    priority: 'high',
  });

  return response;
}
