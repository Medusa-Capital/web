// Whop membership verification.
//
// At login: call GET /api/v1/memberships?user_id=X&product_ids[]=Y
// Accept if any membership has status in ['active', 'trialing'].
// If multiple memberships (renewals / overlapping products), pick deterministically:
//   max expires_at among active/trialing rows.
//
// Endpoint verified 2026-04-15:
//   GET https://api.whop.com/api/v1/memberships
//   Query: user_id=X, product_ids[]=Y
//   Auth: Bearer $WHOP_API_KEY (NOT the user access_token)

import { z } from "zod";

const WHOP_MEMBERSHIPS_URL = "https://api.whop.com/api/v1/memberships";
const VALID_STATUSES = ["active", "trialing"] as const;

const MembershipRowSchema = z.object({
  id: z.string(),
  status: z.string(),
  product_id: z.string(),
  expires_at: z.number().nullable().optional(), // unix timestamp or null (lifetime)
  valid: z.boolean().optional(),
});

const MembershipsResponseSchema = z.object({
  data: z.array(MembershipRowSchema),
});

export type MembershipRow = z.infer<typeof MembershipRowSchema>;

export interface MembershipResult {
  isActive: boolean;
  /** All product IDs from valid active/trialing memberships */
  productIds: string[];
  /** The single deterministic membership row we acted on, or null if none */
  activeMembership: MembershipRow | null;
}

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set`);
  return val;
}

/**
 * Verifies whether a Whop user holds an active Medusa Capital membership.
 *
 * @param whopUserId  The Whop `sub` claim from the id_token
 */
export async function verifyMembership(
  whopUserId: string
): Promise<MembershipResult> {
  const apiKey = requireEnv("WHOP_API_KEY");
  const productId = requireEnv("WHOP_MEDUSA_PRODUCT_ID");

  const url = new URL(WHOP_MEMBERSHIPS_URL);
  url.searchParams.set("user_id", whopUserId);
  url.searchParams.append("product_ids[]", productId);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "(no body)");
    throw new Error(
      `Whop memberships API error: ${res.status} — ${text}`
    );
  }

  const json = await res.json();
  const parsed = MembershipsResponseSchema.parse(json);

  const activeMemberships = parsed.data.filter((m) =>
    (VALID_STATUSES as readonly string[]).includes(m.status)
  );

  if (activeMemberships.length === 0) {
    return { isActive: false, productIds: [], activeMembership: null };
  }

  // Deterministic tie-break: max expires_at (null = lifetime → treat as Infinity)
  const best = activeMemberships.reduce((acc, cur) => {
    const accExp = acc.expires_at ?? Infinity;
    const curExp = cur.expires_at ?? Infinity;
    return curExp > accExp ? cur : acc;
  });

  const productIds = activeMemberships.map((m) => m.product_id);

  return { isActive: true, productIds, activeMembership: best };
}
