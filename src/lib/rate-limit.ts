type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function cleanup(now: number) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

function getUpstashConfig(): { baseUrl: string; token: string } | null {
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL?.trim() || '';
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || '';

  if (!baseUrl || !token) {
    return null;
  }

  return { baseUrl, token };
}

export function getRequestIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for') || '';
  const first = forwarded.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();

  if (first) {
    return first;
  }

  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

function memoryRateLimit(params: {
  request: Request;
  scope: string;
  max: number;
  windowMs: number;
}): { limited: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  cleanup(now);

  const ip = getRequestIp(params.request);
  const key = `${params.scope}:${ip}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + params.windowMs });
    return { limited: false, retryAfterSeconds: 0 };
  }

  if (bucket.count >= params.max) {
    return {
      limited: true,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { limited: false, retryAfterSeconds: 0 };
}

async function upstashRateLimit(params: {
  request: Request;
  scope: string;
  max: number;
  windowMs: number;
}): Promise<{ limited: boolean; retryAfterSeconds: number } | null> {
  const config = getUpstashConfig();
  if (!config) {
    return null;
  }

  const now = Date.now();
  const windowSeconds = Math.max(1, Math.ceil(params.windowMs / 1000));
  const bucketId = Math.floor(now / params.windowMs);
  const bucketKey = `rl:${params.scope}:${getRequestIp(params.request)}:${bucketId}`;

  try {
    const endpoint = `${config.baseUrl.replace(/\/$/, '')}/pipeline`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', bucketKey],
        ['EXPIRE', bucketKey, windowSeconds],
      ]),
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as Array<{ result?: number | string }>;
    const countRaw = data?.[0]?.result;
    const count = typeof countRaw === 'string' ? Number.parseInt(countRaw, 10) : Number(countRaw || 0);

    if (!Number.isFinite(count) || count <= 0) {
      return null;
    }

    const elapsedInWindow = now % params.windowMs;
    const retryAfterSeconds = Math.max(1, Math.ceil((params.windowMs - elapsedInWindow) / 1000));

    return {
      limited: count > params.max,
      retryAfterSeconds,
    };
  } catch {
    return null;
  }
}

export async function isRateLimited(params: {
  request: Request;
  scope: string;
  max: number;
  windowMs: number;
}): Promise<{ limited: boolean; retryAfterSeconds: number }> {
  const distributed = await upstashRateLimit(params);
  if (distributed) {
    return distributed;
  }

  return memoryRateLimit(params);
}
