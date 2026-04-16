import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { userRole } from "./enums";

// ---------------------------------------------------------------------------
// public.users
// ---------------------------------------------------------------------------
// Users are NEVER hard-deleted. When a Whop webhook fires (membership.cancelled
// / membership.expired / payment_failed / membership.went_invalid), we set
// deleted_at = now() and email_notifications_enabled = false. The user's posts
// and comments stay; the author renders as "Miembro anterior" in the UI.
// ---------------------------------------------------------------------------

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Provider-agnostic identity — use external_id + provider as the lookup key
    // instead of a Whop-specific column name. When we add a second provider,
    // we add a row, not a column.
    externalId: text("external_id").notNull(),
    provider: text("provider").notNull().default("whop"),

    email: text("email").notNull(),
    displayName: text("display_name"),
    avatarUrl: text("avatar_url"),

    role: userRole("role").notNull().default("member"),

    // text[] — NOT jsonb. Drizzle maps this to text[]. Forward-compatible for
    // Pro / Mastermind tiers: just add a string to the array, no schema migration.
    tiers: text("tiers")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),

    emailNotificationsEnabled: boolean("email_notifications_enabled")
      .notNull()
      .default(true),

    // null = active. Set to now() on membership cancellation via webhook.
    deletedAt: timestamp("deleted_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    // Lookup key for OAuth callback — must be unique per provider
    uniqueIndex("users_external_id_provider_idx").on(t.externalId, t.provider),
    // Unique email (users.email is NOT NULL, so duplicates would cause FK hell
    // and confuse the membership check)
    uniqueIndex("users_email_idx").on(t.email),
    // Soft-delete scan for email fanout queries
    index("users_deleted_at_idx").on(t.deletedAt),
  ]
);
