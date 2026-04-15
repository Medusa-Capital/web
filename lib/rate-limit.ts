// Upstash Ratelimit — fail-closed helper.
//
// "Fail closed" means: if Upstash is unreachable, we BLOCK the request
// (return 503) rather than allow it through. Applied on:
//   - /api/auth/* — 20 req/min per IP
//   - Server actions (createPost, addComment) — 30 req/min per user
//
// /api/webhooks/whop uses HMAC + replay window as its guard; no Upstash limit.

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set`);
  return val;
}

// Lazy singleton — we only instantiate when first used so the build doesn't
// fail if env vars aren't set (they won't be at build time on Vercel).
let _redis: Redis | null = null;
function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: requireEnv("UPSTASH_REDIS_REST_URL"),
      token: requireEnv("UPSTASH_REDIS_REST_TOKEN"),
    });
  }
  return _redis;
}

let _authLimiter: Ratelimit | null = null;
let _actionLimiter: Ratelimit | null = null;

function getAuthLimiter(): Ratelimit {
  if (!_authLimiter) {
    _authLimiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(20, "1 m"),
      prefix: "rl:auth",
    });
  }
  return _authLimiter;
}

function getActionLimiter(): Ratelimit {
  if (!_actionLimiter) {
    _actionLimiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(30, "1 m"),
      prefix: "rl:action",
    });
  }
  return _actionLimiter;
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfter?: number };

/**
 * Rate-limit for /api/auth/* routes — 20 req/min per IP.
 * Fail-closed: if Upstash is unreachable, returns allowed=false.
 */
export async function checkAuthRateLimit(
  identifier: string
): Promise<RateLimitResult> {
  try {
    const { success, reset } = await getAuthLimiter().limit(identifier);
    if (success) return { allowed: true };
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return { allowed: false, retryAfter };
  } catch {
    // Upstash unreachable — fail closed
    return { allowed: false };
  }
}

/**
 * Rate-limit for server actions — 30 req/min per user.
 * Fail-closed: if Upstash is unreachable, returns allowed=false.
 */
export async function checkActionRateLimit(
  identifier: string
): Promise<RateLimitResult> {
  try {
    const { success, reset } = await getActionLimiter().limit(identifier);
    if (success) return { allowed: true };
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return { allowed: false, retryAfter };
  } catch {
    // Upstash unreachable — fail closed
    return { allowed: false };
  }
}
