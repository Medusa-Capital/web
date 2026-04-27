import { pgEnum } from "drizzle-orm/pg-core";
import {
  CATEGORY_VALUES,
  CHAIN_VALUES,
  CONFIDENCE_LEVEL_VALUES,
  FILTER_STATUS_VALUES,
  ITA_ANSWER_VALUES,
  PILLAR_STATUS_VALUES,
  VERDICT_VALUES,
} from "@/lib/sistema-medusa/enum-values";

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

export const verdictPgEnum = pgEnum("verdict", VERDICT_VALUES);
export const categoryPgEnum = pgEnum("category", CATEGORY_VALUES);
export const chainPgEnum = pgEnum("chain", CHAIN_VALUES);
export const filterStatusPgEnum = pgEnum(
  "filter_status",
  FILTER_STATUS_VALUES
);
export const pillarStatusPgEnum = pgEnum(
  "pillar_status",
  PILLAR_STATUS_VALUES
);
export const itaAnswerPgEnum = pgEnum("ita_answer", ITA_ANSWER_VALUES);
export const confidenceLevelPgEnum = pgEnum(
  "confidence_level",
  CONFIDENCE_LEVEL_VALUES
);
