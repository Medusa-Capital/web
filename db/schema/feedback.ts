import {
  pgSchema,
  uuid,
  text,
  timestamp,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { postStatus } from "./enums";

// ---------------------------------------------------------------------------
// feedback schema
// All feedback tables live in a dedicated Postgres schema "feedback" to keep
// public clean. Drizzle generates `CREATE SCHEMA IF NOT EXISTS feedback;` in
// the migration alongside these table definitions.
// ---------------------------------------------------------------------------

export const feedbackSchema = pgSchema("feedback");

// ---------------------------------------------------------------------------
// feedback.posts
// ---------------------------------------------------------------------------
// author_id is nullable (SET NULL) — when a user is soft-deleted, their posts
// remain; the UI shows "Miembro anterior". CHECK constraints are added via a
// manual SQL migration (Drizzle doesn't emit check() from TS yet):
//   char_length(title) BETWEEN 10 AND 100
//   char_length(body)  BETWEEN 50 AND 2000
// ---------------------------------------------------------------------------

export const feedbackPosts = feedbackSchema.table(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    authorId: uuid("author_id").references(() => users.id, {
      onDelete: "set null",
    }),

    title: text("title").notNull(),
    body: text("body").notNull(),

    status: postStatus("status").notNull().default("open"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("posts_author_id_idx").on(t.authorId),
    // Used for status-filtered list view, sorted by newest first
    index("posts_status_created_idx").on(t.status, t.createdAt),
  ]
);

// ---------------------------------------------------------------------------
// feedback.votes
// ---------------------------------------------------------------------------
// Composite PK (post_id, user_id) enforces one vote per user per post at the
// DB level — idempotent upsert "INSERT ... ON CONFLICT DO NOTHING" in the
// toggleVote action. The PK covers the (post_id) lookup for vote counts, so
// no extra index needed.
// ---------------------------------------------------------------------------

export const feedbackVotes = feedbackSchema.table(
  "votes",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => feedbackPosts.id, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.postId, t.userId] })]
);

// ---------------------------------------------------------------------------
// feedback.comments
// ---------------------------------------------------------------------------
// author_id is nullable (SET NULL) — same policy as posts.author_id.
// CHECK constraint added via manual SQL: char_length(body) BETWEEN 1 AND 5000
// ---------------------------------------------------------------------------

export const feedbackComments = feedbackSchema.table(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    postId: uuid("post_id")
      .notNull()
      .references(() => feedbackPosts.id, { onDelete: "cascade" }),

    authorId: uuid("author_id").references(() => users.id, {
      onDelete: "set null",
    }),

    body: text("body").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("comments_author_id_idx").on(t.authorId),
    // Used for chronological comment list on post detail page
    index("comments_post_id_created_idx").on(t.postId, t.createdAt),
  ]
);

// ---------------------------------------------------------------------------
// feedback.post_status_history
// ---------------------------------------------------------------------------
// Append-only audit log of status transitions. changed_by is nullable (SET NULL)
// for consistency (internal users can also be soft-deleted).
// ---------------------------------------------------------------------------

export const postStatusHistory = feedbackSchema.table(
  "post_status_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    postId: uuid("post_id")
      .notNull()
      .references(() => feedbackPosts.id, { onDelete: "cascade" }),

    changedBy: uuid("changed_by").references(() => users.id, {
      onDelete: "set null",
    }),

    fromStatus: postStatus("from_status").notNull(),
    toStatus: postStatus("to_status").notNull(),
    reason: text("reason"),

    changedAt: timestamp("changed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("post_status_history_post_id_idx").on(t.postId, t.changedAt),
  ]
);
