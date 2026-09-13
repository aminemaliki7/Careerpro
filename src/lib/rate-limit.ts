// src/lib/rate-limit.ts
// Lightweight in-memory sliding-window rate limiter.
//
// NOTE: On stateless serverless deployments (Vercel), the map is per warm
// instance, so this is a first-line defense rather than a hard guarantee.
// Production hardening should swap this for a shared store (Upstash, etc.).

const buckets = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function rateLimit(
  key: string,
  options: { limit?: number; windowMs?: number } = {}
): RateLimitResult {
  const { limit = 30, windowMs = 60_000 } = options;
  const now = Date.now();

  const timestamps = (buckets.get(key) ?? []).filter(
    (ts) => now - ts < windowMs
  );

  if (timestamps.length >= limit) {
    buckets.set(key, timestamps);
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((windowMs - (now - timestamps[0])) / 1000)
    );
    return { allowed: false, retryAfterSeconds };
  }

  timestamps.push(now);
  buckets.set(key, timestamps);
  return { allowed: true, retryAfterSeconds: 0 };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}