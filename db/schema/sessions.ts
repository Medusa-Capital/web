import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

// ---------------------------------------------------------------------------
// public.sessions
// ---------------------------------------------------------------------------
// One row per issued iron-session. Revoked via:
//   - logout route (immediate)
//   - Whop webhook (membership cancelled / expired)
//   - Future: automatic purge where revoked_at < now() - interval '90 days'
// ---------------------------------------------------------------------------

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // null = active. Set to now() on logout or webhook revocation.
    revokedAt: timestamp("revoked_at", { withTimezone: true }),

    // Optional metadata for audit logs / anomaly detection
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    // Hot path for requireMember(): find active sessions for a user.
    // Partial index keeps it small — only non-revoked rows.
    index("sessions_active_user_idx")
      .on(t.userId)
      .where(sql`revoked_at IS NULL`),
  ]
);
