function normalizeForwardedHost(value: string | null): string {
  if (!value) {
    return '';
  }

  return value.split(',')[0]?.trim().toLowerCase() || '';
}

function isInternalHost(hostname: string): boolean {
  const hostOnly = hostname.split(':')[0]?.trim().toLowerCase() || '';

  return hostOnly === '0.0.0.0' || hostOnly === '127.0.0.1' || hostOnly === '::1' || hostOnly === 'localhost';
}

export function buildAppUrl(request: Request, pathname: string): URL {
  const configuredBase = process.env.PUBLIC_BASE_URL?.trim();
  if (configuredBase) {
    return new URL(pathname, configuredBase);
  }

  const forwardedProto = request.headers.get('x-forwarded-proto')?.trim();
  const forwardedHost = normalizeForwardedHost(request.headers.get('x-forwarded-host'));
  const host = request.headers.get('host')?.trim().toLowerCase() || '';

  const proto = forwardedProto || 'https';
  const domain = !isInternalHost(forwardedHost) && forwardedHost ? forwardedHost : !isInternalHost(host) && host ? host : '';

  if (domain) {
    return new URL(pathname, `${proto}://${domain}`);
  }

  return new URL(pathname, 'https://vorenterprise.com');
}
