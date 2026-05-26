import { NextResponse } from 'next/server';
import { createKycToken, KYC_AUTH_COOKIE_NAME, verifyKycCredentials } from '@/lib/kyc-auth';
import { isRateLimited } from '@/lib/rate-limit';
import { buildAppUrl } from '@/lib/app-url';

export async function POST(request: Request) {
  const limit = await isRateLimited({ request, scope: 'kyc-natural-login', max: 10, windowMs: 10 * 60 * 1000 });
  if (limit.limited) {
    return NextResponse.redirect(buildAppUrl(request, '/kyc?error=Demasiados+intentos.+Espera+unos+minutos'), 303);
  }

  const formData = await request.formData();
  const cedula = String(formData.get('cedula') || '');
  const password = String(formData.get('password') || '');

  const user = verifyKycCredentials(cedula, password);

  if (!user) {
    return NextResponse.redirect(buildAppUrl(request, '/kyc?error=Credenciales+invalidas'), 303);
  }

  const response = NextResponse.redirect(buildAppUrl(request, '/kyc?saved=login'), 303);
  response.cookies.set(KYC_AUTH_COOKIE_NAME, createKycToken(user.cedula), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
    priority: 'high',
  });

  return response;
}
