import { describe, expect, test } from "bun:test";
import { getTableColumns, getTableName } from "drizzle-orm";

import {
  analyses,
  analysisVersions,
  publishEvents,
  sistemaMedusaSchema,
} from "@/db/schema/sistema-medusa";
import * as schema from "@/db/schema";

describe("Sistema Medusa Drizzle schema", () => {
  test("defines the sistema_medusa schema and table names", () => {
    expect(sistemaMedusaSchema.schemaName).toBe("sistema_medusa");
    expect(getTableName(analyses)).toBe("analyses");
    expect(getTableName(analysisVersions)).toBe("analysis_versions");
    expect(getTableName(publishEvents)).toBe("publish_events");
  });

  test("defines the analyses parent columns", () => {
    expect(Object.keys(getTableColumns(analyses))).toEqual([
      "id",
      "ticker",
      "projectName",
      "chain",
      "category",
      "contractAddress",
      "coingeckoId",
      "defillamaSlug",
      "latestVersionId",
      "currentVerdict",
      "createdAt",
      "updatedAt",
    ]);
  });

  test("defines append-only version columns", () => {
    expect(Object.keys(getTableColumns(analysisVersions))).toEqual([
      "id",
      "analysisId",
      "versionNumber",
      "payloadSchemaVersion",
      "methodologyVersion",
      "payload",
      "payloadHash",
      "verdict",
      "dataDate",
      "analysisDate",
      "revisionNote",
      "publishedAt",
      "unpublishedAt",
      "createdByUserId",
    ]);
  });

  test("defines transactional outbox columns", () => {
    expect(Object.keys(getTableColumns(publishEvents))).toEqual([
      "id",
      "analysisId",
      "analysisVersionId",
      "versionNumber",
      "eventType",
      "verdict",
      "occurredAt",
      "dispatchedAt",
    ]);
  });

  test("barrel-exports the Sistema Medusa tables", () => {
    expect(schema.analyses).toBe(analyses);
    expect(schema.analysisVersions).toBe(analysisVersions);
    expect(schema.publishEvents).toBe(publishEvents);
  });
});
