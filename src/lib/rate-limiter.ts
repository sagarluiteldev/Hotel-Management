/**
 * Thread-safe sliding window in-memory rate limiter for Next.js API routes.
 * Tracks requests per identifier (e.g. client IP or user ID) with automatic cleanup.
 */

type RateLimitRecord = {
  timestamps: number[];
};

const store = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes to prevent memory growth
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 15 * 60 * 1000);
      if (record.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
};

/**
 * Check if a given key has exceeded the rate limit.
 * @param key Unique identifier (e.g. IP address or action:IP)
 * @param limit Maximum allowed requests within window
 * @param windowSeconds Window length in seconds
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  let record = store.get(key);
  if (!record) {
    record = { timestamps: [] };
    store.set(key, record);
  }

  // Filter timestamps outside current window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  const resetSeconds =
    record.timestamps.length > 0
      ? Math.max(1, Math.ceil((record.timestamps[0] + windowMs - now) / 1000))
      : windowSeconds;

  if (record.timestamps.length >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetSeconds
    };
  }

  record.timestamps.push(now);

  return {
    success: true,
    limit,
    remaining: limit - record.timestamps.length,
    resetSeconds
  };
}

/**
 * Extract client IP from Next.js request headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim();
  }
  return "127.0.0.1";
}
