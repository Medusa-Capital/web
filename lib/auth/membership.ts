// Whop membership verification.
//
// At login: list the user's memberships scoped to our company, then
// client-side-filter by product_id. Accept if any row is active/trialing
// under our configured product. For multiple overlapping rows (renewals,
// plan changes) pick deterministically by max expires_at.
//
// Endpoint:
//   GET https://api.whop.com/api/v1/memberships
//   Query: company_id=biz_xxx, user_ids[]=user_xxx, statuses[]=active, statuses[]=trialing
//   Auth: Bearer $WHOP_API_KEY (NOT the user access_token)
//
// Param names verified against the official Whop SDK (/whopio/whop-sdk-ts).
// Filtering by product_ids[] is NOT supported by the REST endpoint —
// product membership is derived from the product_id field on each row.

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
  const companyId = requireEnv("WHOP_COMPANY_ID");
  const productId = requireEnv("WHOP_MEDUSA_PRODUCT_ID");

  const url = new URL(WHOP_MEMBERSHIPS_URL);
  url.searchParams.set("company_id", companyId);
  url.searchParams.append("user_ids[]", whopUserId);
  for (const status of VALID_STATUSES) {
    url.searchParams.append("statuses[]", status);
  }

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

  const activeRows = parsed.data.filter(
    (m) =>
      (VALID_STATUSES as readonly string[]).includes(m.status) &&
      m.product_id === productId
  );

  if (activeRows.length === 0) {
    return { isActive: false, productIds: [], activeMembership: null };
  }

  const best = activeRows.reduce((acc, cur) => {
    const accExp = acc.expires_at ?? Infinity;
    const curExp = cur.expires_at ?? Infinity;
    return curExp > accExp ? cur : acc;
  });

  const productIds = activeRows.map((m) => m.product_id);

  return { isActive: true, productIds, activeMembership: best };
}
