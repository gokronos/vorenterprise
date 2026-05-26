import { NextResponse } from 'next/server';
import { createAdminUser, type AdminRole, getSessionUser } from '@/lib/admin-auth';
import { buildAppUrl } from '@/lib/app-url';

export async function POST(request: Request) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return NextResponse.redirect(buildAppUrl(request, '/admin/login?error=auth'), 303);
  }

  if (sessionUser.role !== 'admin') {
    return NextResponse.redirect(buildAppUrl(request, '/admin?userSaved=forbidden'), 303);
  }

  const formData = await request.formData();
  const username = String(formData.get('username') || '');
  const password = String(formData.get('password') || '');
  const roleRaw = String(formData.get('role') || 'editor');
  const role: AdminRole = roleRaw === 'admin' ? 'admin' : 'editor';

  const result = createAdminUser({ username, password, role });

  if (!result.ok) {
    return NextResponse.redirect(buildAppUrl(request, `/admin?userSaved=0&msg=${encodeURIComponent(result.message)}`), 303);
  }

  return NextResponse.redirect(buildAppUrl(request, '/admin?userSaved=1'), 303);
}
