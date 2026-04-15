// Structured logger with Sentry integration.
// captureError() wraps Sentry in try/catch so a Sentry outage never breaks
// the response path — falls back to console.error.

const REDACT_KEYS = new Set([
  "password",
  "access_token",
  "refresh_token",
  "authorization",
  "cookie",
  "session_secret",
]);

function redact(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = REDACT_KEYS.has(k.toLowerCase()) ? "[redacted]" : v;
  }
  return out;
}

export function log(
  level: "info" | "warn" | "error",
  message: string,
  context?: Record<string, unknown>
) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context ? redact(context) : {}),
  };
  console[level](JSON.stringify(entry));
}

export async function captureError(
  err: unknown,
  context?: Record<string, unknown>
) {
  log("error", err instanceof Error ? err.message : String(err), context);
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureException(err, { extra: context });
  } catch {
    // Sentry itself threw — don't let it break the caller
  }
}
