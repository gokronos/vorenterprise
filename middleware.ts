import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function buildCsp(allowFraming: boolean) {
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    allowFraming ? "frame-ancestors 'self'" : "frame-ancestors 'none'",
    "object-src 'none'",
    "form-action 'self'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline'",
    "connect-src 'self'",
  ];

  if (process.env.NODE_ENV === 'production') {
    directives.push('upgrade-insecure-requests');
  }

  return directives.join('; ');
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const response = NextResponse.next();
  const mode = request.nextUrl.searchParams.get('mode');
  const allowFraming =
    pathname.startsWith('/sagrilaft') ||
    pathname.startsWith('/organigrama') ||
    pathname.startsWith('/politica-datos') ||
    (pathname.startsWith('/api/compliance-document/') && mode !== 'download');

  response.headers.set('X-Frame-Options', allowFraming ? 'SAMEORIGIN' : 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  response.headers.set('Content-Security-Policy', buildCsp(allowFraming));

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, max-age=0');
  }

  if (
    !pathname.startsWith('/api/') &&
    !pathname.startsWith('/_next/') &&
    !pathname.includes('.')
  ) {
    response.headers.append('Link', '</brand-theme.css>; rel=stylesheet');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
