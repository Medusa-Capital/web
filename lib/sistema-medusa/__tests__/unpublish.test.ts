import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { eq } from "drizzle-orm";

import { analyses, analysisVersions, publishEvents } from "@/db/schema";
import { ingestAnalysis } from "@/scripts/sistema-medusa/ingest";
import { transformAeroInput } from "@/scripts/sistema-medusa/seed-aero";
import { unpublishAnalysis } from "@/scripts/sistema-medusa/unpublish";

let db: typeof import("@/db").db;
const createdTickers: string[] = [];

function loadEnvLocal() {
  const env = readFileSync(join(process.cwd(), ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex < 1) continue;
    process.env[trimmed.slice(0, eqIndex).trim()] ??= trimmed
      .slice(eqIndex + 1)
      .trim();
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

describe("unpublishAnalysis", () => {
  test("soft-deletes a version and writes an unpublished event", async () => {
    const ticker = `U${Date.now().toString(36).toUpperCase()}`;
    createdTickers.push(ticker);
    await cleanupTicker(ticker);

    const payload = transformAeroInput(rawAero());
    payload.ticker = ticker;
    payload.project_name = "Test Unpublish";

    const dir = mkdtempSync(join(tmpdir(), "sistema-medusa-unpublish-"));
    const filePath = join(dir, `${ticker.toLowerCase()}.json`);
    writeFileSync(filePath, JSON.stringify(payload, null, 2));

    await ingestAnalysis(filePath);

    const result = await unpublishAnalysis(ticker, 1, {
      reason: "test cleanup",
    });
    expect(result).toMatchObject({
      ok: true,
      action: "unpublished",
      ticker,
      version_number: 1,
      reason: "test cleanup",
    });

    const [parent] = await db
      .select({
        id: analyses.id,
        latestVersionId: analyses.latestVersionId,
        currentVerdict: analyses.currentVerdict,
      })
      .from(analyses)
      .where(eq(analyses.ticker, ticker));
    expect(parent.latestVersionId).toBeNull();
    expect(parent.currentVerdict).toBeNull();

    const [version] = await db
      .select({ unpublishedAt: analysisVersions.unpublishedAt })
      .from(analysisVersions)
      .where(eq(analysisVersions.analysisId, parent.id));
    expect(version.unpublishedAt).toBeInstanceOf(Date);

    const events = await db
      .select({
        eventType: publishEvents.eventType,
        versionNumber: publishEvents.versionNumber,
      })
      .from(publishEvents)
      .where(eq(publishEvents.analysisId, parent.id))
      .orderBy(publishEvents.occurredAt);
    expect(events).toEqual([
      { eventType: "published", versionNumber: 1 },
      { eventType: "unpublished", versionNumber: 1 },
    ]);
  });
});
