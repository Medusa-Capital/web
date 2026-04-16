import { pgEnum } from "drizzle-orm/pg-core";

// Native Postgres enums — enforced at the DB level even for direct SQL inserts
// (seeds, migrations, admin scripts). Never use Drizzle string unions for these.

export const userRole = pgEnum("user_role", ["member", "internal"]);

export const postStatus = pgEnum("post_status", [
  "open",
  "planned",
  "in_progress",
  "shipped",
  "declined",
]);
