// /ideas layout — auth gate + Featurebase-style header shell.
// requireMember() reads iron-session, checks DB for revoked session,
// and runs lazy Whop re-check if >10 min stale. Redirects to /entrar on failure.

import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/auth/session";
import { requireMember } from "@/lib/auth/require";
import { IdeasHeader } from "@/components/ideas/IdeasHeader";

export default async function IdeasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireMember();

  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );
  const userName = session.displayName ?? session.email ?? "Miembro";

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <IdeasHeader userName={userName} />
      {children}
    </div>
  );
}
