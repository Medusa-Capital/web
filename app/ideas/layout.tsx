// /ideas layout — server component gate.
// requireMember() reads iron-session, checks DB for revoked session,
// and runs lazy Whop re-check if >10 min stale. Redirects to /entrar on failure.

import { requireMember } from "@/lib/auth/require";

export default async function IdeasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireMember();
  return <>{children}</>;
}
