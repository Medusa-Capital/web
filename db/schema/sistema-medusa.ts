import { sql } from "drizzle-orm";
import {
  date,
  index,
  integer,
  jsonb,
  pgSchema,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { categoryPgEnum, chainPgEnum, verdictPgEnum } from "./enums";
import { users } from "./users";

// ---------------------------------------------------------------------------
// sistema_medusa schema
// Append-only research library. The parent row holds filterable fields and a
// nullable pointer to the latest published version; the payload lives in the
// immutable version row and is re-parsed at read boundaries.
// ---------------------------------------------------------------------------

export const sistemaMedusaSchema = pgSchema("sistema_medusa");

export const analyses = sistemaMedusaSchema.table(
  "analyses",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    ticker: text("ticker").notNull(),
    projectName: text("project_name").notNull(),
    chain: chainPgEnum("chain").notNull(),
    category: categoryPgEnum("category").notNull(),
    contractAddress: text("contract_address"),
    coingeckoId: text("coingecko_id"),
    defillamaSlug: text("defillama_slug"),

    latestVersionId: uuid("latest_version_id").references(
      (): AnyPgColumn => analysisVersions.id,
      { onDelete: "restrict" }
    ),
    currentVerdict: verdictPgEnum("current_verdict"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("analyses_ticker_idx").on(t.ticker),
    index("analyses_filter_idx").on(t.currentVerdict, t.category, t.chain),
  ]
);

export const analysisVersions = sistemaMedusaSchema.table(
  "analysis_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    analysisId: uuid("analysis_id")
      .notNull()
      .references(() => analyses.id, { onDelete: "restrict" }),
    versionNumber: integer("version_number").notNull(),
    payloadSchemaVersion: integer("payload_schema_version")
      .notNull()
      .default(1),
    methodologyVersion: text("methodology_version").notNull(),
    payload: jsonb("payload").notNull().$type<Record<string, unknown>>(),
    payloadHash: text("payload_hash").notNull(),
    verdict: verdictPgEnum("verdict").notNull(),
    dataDate: date("data_date").notNull(),
    analysisDate: date("analysis_date").notNull(),
    revisionNote: text("revision_note"),
    publishedAt: timestamp("published_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    unpublishedAt: timestamp("unpublished_at", { withTimezone: true }),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
  },
  (t) => [
    uniqueIndex("analysis_versions_analysis_id_version_number_idx").on(
      t.analysisId,
      t.versionNumber
    ),
    index("analysis_versions_analysis_id_version_number_desc_idx").on(
      t.analysisId,
      t.versionNumber.desc()
    ),
  ]
);

export const publishEvents = sistemaMedusaSchema.table(
  "publish_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    analysisId: uuid("analysis_id")
      .notNull()
      .references(() => analyses.id, { onDelete: "restrict" }),
    analysisVersionId: uuid("analysis_version_id")
      .notNull()
      .references(() => analysisVersions.id, { onDelete: "restrict" }),
    versionNumber: integer("version_number").notNull(),
    eventType: text("event_type").notNull(),
    verdict: text("verdict").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    dispatchedAt: timestamp("dispatched_at", { withTimezone: true }),
  },
  (t) => [
    index("publish_events_analysis_id_idx").on(t.analysisId),
    index("publish_events_undispatched_idx")
      .on(t.dispatchedAt)
      .where(sql`${t.dispatchedAt} is null`),
  ]
);
