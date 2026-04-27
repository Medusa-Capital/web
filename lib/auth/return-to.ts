// returnTo allowlist + sanitization.
//
// Only paths matching ALLOWED_PATHS are treated as valid redirect targets.
// Everything else falls back to /ideas. Absolute URLs to other origins are
// always rejected, even if the path matches.
//
// Argos will extend ALLOWED_PATHS when feat/argos merges (add /argos routes).

const ALLOWED_PATHS =
  /^\/(ideas(\/[a-zA-Z0-9-]+)?|sistema-medusa(\/[a-z0-9-]+)?)?$/;
const SISTEMA_MEDUSA_DETAIL_PATH = /^\/sistema-medusa\/[a-z0-9-]+$/;
const VERSION_QUERY = /^\d{1,4}$/;
//  ↑ matches: "" (root), "/ideas", "/ideas/<uuid-or-slug>",
//    "/sistema-medusa", "/sistema-medusa/<ticker>"

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

    if (SISTEMA_MEDUSA_DETAIL_PATH.test(u.pathname)) {
      const entries = [...u.searchParams.entries()];
      const version = u.searchParams.get("v");
      if (entries.length === 1 && version && VERSION_QUERY.test(version)) {
        return `${u.pathname}?v=${version}`;
      }
    }

    // Safe: return only the pathname. Queries are preserved only for vetted
    // Sistema Medusa detail version deep links.
    return u.pathname || "/ideas";
  } catch {
    return "/ideas";
  }
}
