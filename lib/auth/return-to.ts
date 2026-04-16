// returnTo allowlist + sanitization.
//
// Only paths matching ALLOWED_PATHS are treated as valid redirect targets.
// Everything else falls back to /ideas. Absolute URLs to other origins are
// always rejected, even if the path matches.
//
// Argos will extend ALLOWED_PATHS when feat/argos merges (add /argos routes).

const ALLOWED_PATHS =
  /^\/(ideas(\/[a-zA-Z0-9-]+)?)?$/;
//  ↑ matches: "" (root), "/ideas", "/ideas/<uuid-or-slug>"

/**
 * Sanitizes a raw returnTo value from the OAuth flow or query string.
 *
 * @param raw      The raw returnTo string (may be null/undefined/malicious)
 * @param appOrigin  e.g. "https://medusacapital.xyz"
 * @returns A safe, same-origin pathname, defaulting to "/ideas"
 */
export function sanitizeReturnTo(
  raw: string | null | undefined,
  appOrigin: string
): string {
  if (!raw) return "/ideas";

  try {
    // Parse against the app origin so relative paths resolve correctly and
    // absolute URLs to other hosts are caught via origin comparison.
    const u = new URL(raw, appOrigin);

    // Reject cross-origin targets (e.g. "https://evil.com/ideas")
    if (u.origin !== appOrigin) return "/ideas";

    // Reject paths not in the allowlist
    if (!ALLOWED_PATHS.test(u.pathname)) return "/ideas";

    // Safe: return only the pathname (drop query/hash for simplicity)
    return u.pathname || "/ideas";
  } catch {
    return "/ideas";
  }
}
