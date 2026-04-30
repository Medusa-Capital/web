-- Sistema Medusa: extend enums to support new project categories and chains.
--
-- Adds:
--   - category: LENDING, INFRASTRUCTURE
--   - chain:    Hyperliquid_L1
--
-- Native pg ALTER TYPE ADD VALUE is non-transactional, so each statement runs
-- on its own. IF NOT EXISTS keeps the migration idempotent.

ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'LENDING';
--> statement-breakpoint
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'INFRASTRUCTURE';
--> statement-breakpoint
ALTER TYPE "chain" ADD VALUE IF NOT EXISTS 'Hyperliquid_L1';
