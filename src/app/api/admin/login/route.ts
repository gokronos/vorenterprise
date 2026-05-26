import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, createAdminToken, verifyAdminCredentials } from '@/lib/admin-auth';
import { buildAppUrl } from '@/lib/app-url';
import { isRateLimited } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const limit = await isRateLimited({ request, scope: 'admin-login', max: 8, windowMs: 10 * 60 * 1000 });
  if (limit.limited) {
    return NextResponse.redirect(buildAppUrl(request, '/admin/login?error=rate-limit'), 303);
  }

  const formData = await request.formData();
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '').trim();

  const user = verifyAdminCredentials(username, password);

  if (!user) {
    return NextResponse.redirect(buildAppUrl(request, '/admin/login?error=1'), 303);
  }

  const response = NextResponse.redirect(buildAppUrl(request, '/admin'), 303);

  response.cookies.set(AUTH_COOKIE_NAME, createAdminToken(user.username), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
    priority: 'high',
  });

  return response;
}
