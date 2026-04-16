// CSRF check for server actions.
//
// Next.js server actions are POST requests; require Origin matches our app
// OR Sec-Fetch-Site indicates same-origin. Reject if both signals are missing.

import { headers } from "next/headers";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set`);
  return val;
}

export async function assertSameOrigin(): Promise<void> {
  const h = await headers();
  const origin = h.get("origin");
  const fetchSite = h.get("sec-fetch-site");

  if (origin && origin === requireEnv("NEXT_PUBLIC_APP_URL")) return;
  if (fetchSite === "same-origin") return;

  throw new Error("CSRF: cross-site request rejected");
}
