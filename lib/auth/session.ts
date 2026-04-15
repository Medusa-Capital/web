// Session shape + iron-session configuration.
// SessionData is the canonical cookie payload — keep it lean.
// Tokens (access/refresh) live in user_tokens table, NOT here.

import type { SessionOptions } from "iron-session";

export interface SessionData {
  /** Internal UUID from public.users */
  userId: string;
  /** Internal UUID from public.sessions — used for fast revocation lookup */
  sessionId: string;
  /** Whop `sub` claim — provider-agnostic field name for forward compatibility */
  externalId: string;
  provider: "whop";
  /** Cached to avoid round-trip on common reads. Source of truth is DB. */
  email: string;
  displayName: string | null;
  /**
   * NEVER trusted for requireInternal() — role is always re-read from DB on
   * each privileged check. Cached here for display purposes only.
   */
  role: "member" | "internal";
  /**
   * Kept fresh by the 10-min lazy re-check in requireMember(). Acceptable
   * skew for non-privileged entitlement checks.
   */
  tiers: string[];
  /** epoch ms — triggers lazy Whop membership re-check after 10 minutes */
  membershipCheckedAt: number;
}

// Module augmentation so every getIronSession() call is typed without generics.
declare module "iron-session" {
  interface IronSessionData extends SessionData {}
}

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is not set");
}

/**
 * iron-session cookie options.
 *
 * Cookie name uses __Host- prefix to prevent subdomain injection
 * (https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Cookie_prefixes).
 *
 * sameSite: 'lax' — NOT 'strict'. 'strict' breaks the OAuth callback because
 * the browser returns from api.whop.com and the cookie would not be sent.
 */
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "__Host-medusa-session",
  ttl: 60 * 60 * 24 * 7, // 7 days rolling
  cookieOptions: {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  },
};
