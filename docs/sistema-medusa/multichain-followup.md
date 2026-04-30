# Multichain Follow-Up — Sistema Medusa Library

**Status:** Pending. Tracked here so it isn't forgotten.
**Created:** 2026-04-30 (during HYPE/META/MORPHO/SYRUP token ingest)

## Context

The `analyses.chain` column is a **single-value Postgres `chain` enum**. Real protocols are increasingly multichain (Morpho on Ethereum + Base; Maple/syrupUSDC on Ethereum + Base + Solana; Aerodrome on Base; Hyperliquid on its own L1).

Chosen interim approach: pick a **primary chain** for the `chain` field (the deepest / canonical deployment) and record secondaries as `multichain:<Chain>` tag entries.

| Ticker | Primary | Multichain tags |
|---|---|---|
| AERO | Base | — |
| HYPE | Hyperliquid_L1 | — |
| META | Solana | — |
| MORPHO | Ethereum | `multichain:Base` |
| SYRUP | Ethereum | `multichain:Base`, `multichain:Solana` |

This works for v1 — chain filter still functions, secondaries are scannable in tags — but it has friction:
- You can't filter by secondary chain ("show all Base deployments")
- Tag UI doesn't visually surface chains the way the chain filter does
- Encoding chains-as-strings inside tags is a smell (chains have a typed enum; we're working around it)

## Proposed refactor

Change `chain` to an **array of `Chain` enum values** with `min(1)`. Primary is `chain[0]`; the rest are deployments. Filter by ANY-match.

### Scope

**Schema (Zod):**
```ts
chain: z.array(chainEnum).min(1).max(8)  // was: chainEnum
```

**Database:**
- Migrate `analyses.chain` from `chain NOT NULL` → `chain[] NOT NULL` (or normalize to a `analyses_chains` join table — decide based on query patterns).
- Backfill: `UPDATE analyses SET chain = ARRAY[chain]::chain[]` then `ALTER COLUMN chain TYPE chain[]`.
- Index strategy: `GIN` on the array column for fast ANY-membership filter.

**Backfill JSON payloads:**
- All existing `analysis_versions.payload->>'chain'` strings need to become arrays. Either re-ingest or run a one-shot UPDATE that wraps the value in an array.

**UI:**
- `ListControls` chain filter — change "is" to "contains" semantics.
- `AnalysisCard` — render multiple chain badges (cap at 3 + "+N more").
- Detail page sidebar (ficha técnica) — show all chains as a row of badges.
- `getTokenBrand` is per-ticker not per-chain, no change needed.

**Tag cleanup:**
- After migration, strip `multichain:*` tags from existing payloads (they're now redundant).

### Estimate

~4–6 hours of focused work + a careful migration. Not blocking new analyses since the interim tag approach is honest and visible.

## When to do this

Pick this up when one of the following happens:
1. ≥ 6 multichain analyses are published and the tag workaround is creating UX friction.
2. A member asks "show me all analyses on Base" and the answer requires reading tags by hand.
3. We start surfacing chains in cards/tables and the inconsistency between `chain` (single) and `multichain:*` tags is visible.

Until then: **interim tag approach stays**.
