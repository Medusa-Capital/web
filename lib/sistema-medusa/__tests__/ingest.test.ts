import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { eq } from "drizzle-orm";

import { analyses, analysisVersions, publishEvents } from "@/db/schema";
import { ingestAnalysis } from "@/scripts/sistema-medusa/ingest";
import { transformAeroInput } from "@/scripts/sistema-medusa/seed-aero";

const createdTickers: string[] = [];
let db: typeof import("@/db").db;

function loadEnvLocal() {
  const env = readFileSync(join(process.cwd(), ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex < 1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    process.env[key] ??= value;
  }
}

const rawAero = () =>
  JSON.parse(
    readFileSync(
      join(process.cwd(), "sistema-medusa/medusa-web-example-aero.json"),
      "utf8"
    )
  );

async function cleanupTicker(ticker: string) {
  const rows = await db
    .select({ id: analyses.id })
    .from(analyses)
    .where(eq(analyses.ticker, ticker));

  for (const row of rows) {
    await db.delete(publishEvents).where(eq(publishEvents.analysisId, row.id));
    await db
      .update(analyses)
      .set({ latestVersionId: null, currentVerdict: null })
      .where(eq(analyses.id, row.id));
    await db
      .delete(analysisVersions)
      .where(eq(analysisVersions.analysisId, row.id));
    await db.delete(analyses).where(eq(analyses.id, row.id));
  }
}

beforeAll(async () => {
  loadEnvLocal();
  db = (await import("@/db")).db;
});

afterAll(async () => {
  for (const ticker of createdTickers) {
    await cleanupTicker(ticker);
  }
});

describe("ingestAnalysis", () => {
  test("creates version 1 and no-ops unchanged payloads", async () => {
    const ticker = `T${Date.now().toString(36).toUpperCase()}`;
    createdTickers.push(ticker);
    await cleanupTicker(ticker);

    const payload = transformAeroInput(rawAero());
    payload.ticker = ticker;
    payload.project_name = "Test Core Ingest";

    const dir = mkdtempSync(join(tmpdir(), "sistema-medusa-ingest-"));
    const filePath = join(dir, `${ticker.toLowerCase()}.json`);
    writeFileSync(filePath, JSON.stringify(payload, null, 2));

    const created = await ingestAnalysis(filePath);
    expect(created).toMatchObject({
      ok: true,
      action: "created",
      ticker,
      version_number: 1,
    });
    expect(created.payload_hash).toHaveLength(64);

    const [parent] = await db
      .select({
        id: analyses.id,
        latestVersionId: analyses.latestVersionId,
        currentVerdict: analyses.currentVerdict,
      })
      .from(analyses)
      .where(eq(analyses.ticker, ticker));

    expect(parent.currentVerdict).toBe("AVANZA_A_AT");
    expect(parent.latestVersionId).toBeTruthy();

    const versions = await db
      .select({ versionNumber: analysisVersions.versionNumber })
      .from(analysisVersions)
      .where(eq(analysisVersions.analysisId, parent.id));
    expect(versions).toEqual([{ versionNumber: 1 }]);

    const events = await db
      .select({ eventType: publishEvents.eventType })
      .from(publishEvents)
      .where(eq(publishEvents.analysisId, parent.id));
    expect(events).toEqual([{ eventType: "published" }]);

    const noop = await ingestAnalysis(filePath);
    expect(noop).toMatchObject({
      ok: true,
      action: "noop",
      ticker,
      version_number: 1,
      payload_hash: created.payload_hash,
    });
  });
});
