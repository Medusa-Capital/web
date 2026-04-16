// Whop product ID → internal tier string mapping.
// At login, we look up the user's active product IDs against this map to
// populate session.tiers and users.tiers in the DB.
//
// In v1 all members have tiers: ['foundations'].
// Adding Pro / Mastermind is a config-only change — no session migration needed.

export const WHOP_PRODUCT_TO_TIER: Record<string, string> = {
  // Set via WHOP_MEDUSA_PRODUCT_ID env var — undefined at build time is safe
  // because this map is only read at runtime during the OAuth callback.
  ...(process.env.WHOP_MEDUSA_PRODUCT_ID
    ? { [process.env.WHOP_MEDUSA_PRODUCT_ID]: "foundations" }
    : {}),
  // Future tiers (add env var + product ID when ready):
  // [process.env.WHOP_PRO_PRODUCT_ID!]: 'pro',
  // [process.env.WHOP_MASTERMIND_PRODUCT_ID!]: 'mastermind',
};

/**
 * Given a list of active product IDs from Whop, returns the union of all
 * mapped tier strings. Unknown product IDs are silently ignored.
 */
export function deriveTiers(productIds: string[]): string[] {
  const tiers = new Set<string>();
  for (const id of productIds) {
    const tier = WHOP_PRODUCT_TO_TIER[id];
    if (tier) tiers.add(tier);
  }
  return Array.from(tiers);
}
