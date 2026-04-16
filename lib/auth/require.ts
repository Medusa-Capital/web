// Auth guards for server components and server actions.
//
// Two forms for each guard:
//   - Core (Result-returning): for unit testing and server actions
//   - RSC wrapper: calls redirect() on failure — for server components / layouts
//
// Design principles:
//   - requireInternal() ALWAYS re-reads role from DB — never trusts session cache.
//     Prevents privilege persistence for demoted internal users.
//   - requireMember() reads iron-session then does a single DB round-trip to
//     check sessions.revoked_at via the partial index (~1ms).
//     If membershipCheckedAt is stale (>10 min), it re-calls the Whop API
//     inline before returning. This is ~200ms but keeps the session fresh.
//   - requireEntitlement() trusts session.tiers (kept fresh by the re-check).

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getIronSession } from "iron-session";
import { eq, and, isNull } from "drizzle-orm";
import { db } from "@/db";
import { users, sessions } from "@/db/schema";
import { sessionOptions, type SessionData } from "./session";
import { verifyMembership } from "./membership";
import { deriveTiers } from "./tiers";
import type { ActionResult } from "@/lib/result";

const MEMBERSHIP_CHECK_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  if (!session.userId) return null;
  return session as SessionData;
}

/**
 * Checks that the session's sessionId has a non-revoked row in the DB.
 * Uses the partial index `sessions_active_user_idx` (~1ms).
 */
async function isSessionActive(sessionId: string): Promise<boolean> {
  const rows = await db
    .select({ id: sessions.id })
    .from(sessions)
    .where(and(eq(sessions.id, sessionId), isNull(sessions.revokedAt)))
    .limit(1);
  return rows.length > 0;
}

/**
 * Lazy Whop membership re-check.
 * Called when membershipCheckedAt is >10 min old.
 * Updates the session cookie and the DB tiers if they changed.
 * Returns false if the membership is no longer active.
 */
async function recheckMembership(session: SessionData): Promise<boolean> {
  const cookieStore = await cookies();
  const ironSession = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );

  let membership;
  try {
    membership = await verifyMembership(session.externalId);
  } catch {
    // Network failure: fail closed — revoke session
    await db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(eq(sessions.id, session.sessionId));
    ironSession.destroy();
    await ironSession.save();
    return false;
  }

  if (!membership.isActive) {
    await db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(eq(sessions.id, session.sessionId));
    ironSession.destroy();
    await ironSession.save();
    return false;
  }

  const newTiers = deriveTiers(membership.productIds);

  // Update DB if tiers changed
  if (JSON.stringify(newTiers.sort()) !== JSON.stringify([...session.tiers].sort())) {
    await db
      .update(users)
      .set({ tiers: newTiers, updatedAt: new Date() })
      .where(eq(users.id, session.userId));
  }

  // Refresh session cookie
  Object.assign(ironSession, {
    ...session,
    tiers: newTiers,
    membershipCheckedAt: Date.now(),
  });
  await ironSession.save();

  return true;
}

// ---------------------------------------------------------------------------
// requireMember — core (Result-returning)
// ---------------------------------------------------------------------------

export async function requireMemberCore(): Promise<
  ActionResult<SessionData>
> {
  const session = await getSession();

  if (!session) {
    return { ok: false, error: "No session", code: "UNAUTHORIZED" };
  }

  const active = await isSessionActive(session.sessionId);
  if (!active) {
    return { ok: false, error: "Session revoked", code: "UNAUTHORIZED" };
  }

  // Lazy membership re-check
  if (Date.now() - session.membershipCheckedAt > MEMBERSHIP_CHECK_INTERVAL_MS) {
    const stillActive = await recheckMembership(session);
    if (!stillActive) {
      return {
        ok: false,
        error: "Membership no longer active",
        code: "UNAUTHORIZED",
      };
    }
  }

  return { ok: true, data: session };
}

// ---------------------------------------------------------------------------
// requireMember — RSC wrapper (redirects on failure)
// ---------------------------------------------------------------------------

export async function requireMember(): Promise<SessionData> {
  const result = await requireMemberCore();
  if (!result.ok) {
    redirect("/login");
  }
  return result.data;
}

// ---------------------------------------------------------------------------
// requireInternal — core (Result-returning)
// ---------------------------------------------------------------------------

/**
 * Always reads role from DB — never trusts session.role.
 */
export async function requireInternalCore(): Promise<
  ActionResult<SessionData>
> {
  const memberResult = await requireMemberCore();
  if (!memberResult.ok) return memberResult;

  const session = memberResult.data;

  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!user || user.role !== "internal") {
    return { ok: false, error: "Not an internal user", code: "UNAUTHORIZED" };
  }

  return { ok: true, data: session };
}

// ---------------------------------------------------------------------------
// requireInternal — RSC wrapper
// ---------------------------------------------------------------------------

export async function requireInternal(): Promise<SessionData> {
  const result = await requireInternalCore();
  if (!result.ok) {
    redirect("/login");
  }
  return result.data;
}

// ---------------------------------------------------------------------------
// requireEntitlement — core (Result-returning)
// ---------------------------------------------------------------------------

export async function requireEntitlementCore(
  tier: string
): Promise<ActionResult<SessionData>> {
  const memberResult = await requireMemberCore();
  if (!memberResult.ok) return memberResult;

  const session = memberResult.data;

  if (!session.tiers.includes(tier)) {
    return {
      ok: false,
      error: `Missing entitlement: ${tier}`,
      code: "UNAUTHORIZED",
    };
  }

  return { ok: true, data: session };
}

// ---------------------------------------------------------------------------
// requireEntitlement — RSC wrapper
// ---------------------------------------------------------------------------

export async function requireEntitlement(tier: string): Promise<SessionData> {
  const result = await requireEntitlementCore(tier);
  if (!result.ok) {
    redirect("/not-a-member");
  }
  return result.data;
}
