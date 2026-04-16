import {
  pgTable,
  uuid,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sessions } from "./sessions";

// ---------------------------------------------------------------------------
// public.user_tokens
// ---------------------------------------------------------------------------
// Stores Whop OAuth tokens AES-256-GCM encrypted at rest. One row per session
// (unique on session_id). In v1 we make no Whop-as-user API calls after login,
// so decryption paths are unreachable — but tokens are stored ready for future
// features (e.g. Whop community API calls on the member's behalf).
// ---------------------------------------------------------------------------

export const userTokens = pgTable(
  "user_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // One token row per session — enforced by unique index
    sessionId: uuid("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),

    // AES-256-GCM encrypted; key derived from SESSION_SECRET via HKDF
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token").notNull(),

    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex("user_tokens_session_id_idx").on(t.sessionId)]
);
