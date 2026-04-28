import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { eq } from "drizzle-orm";

import { analyses, analysisVersions, publishEvents } from "@/db/schema";
import { ingestAnalysis } from "@/scripts/sistema-medusa/ingest";
import { transformAeroInput } from "@/scripts/sistema-medusa/seed-aero";

const createdTickers: string[] = [];
const cleanupPaths: string[] = [];
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
  for (const path of cleanupPaths) {
    rmSync(path, { force: true, recursive: true });
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

    const forced = await ingestAnalysis(filePath, { force: true });
    expect(forced).toMatchObject({
      ok: true,
      action: "force_created",
      ticker,
      version_number: 2,
      payload_hash: created.payload_hash,
    });

    const versionRows = await db
      .select({
        versionNumber: analysisVersions.versionNumber,
        unpublishedAt: analysisVersions.unpublishedAt,
      })
      .from(analysisVersions)
      .where(eq(analysisVersions.analysisId, parent.id))
      .orderBy(analysisVersions.versionNumber);
    expect(versionRows).toHaveLength(2);
    expect(versionRows[0]?.unpublishedAt).toBeInstanceOf(Date);
    expect(versionRows[1]?.unpublishedAt).toBeNull();

    const eventRows = await db
      .select({
        eventType: publishEvents.eventType,
        versionNumber: publishEvents.versionNumber,
      })
      .from(publishEvents)
      .where(eq(publishEvents.analysisId, parent.id))
      .orderBy(publishEvents.occurredAt);
    expect(eventRows).toEqual([
      { eventType: "published", versionNumber: 1 },
      { eventType: "superseded", versionNumber: 1 },
      { eventType: "published", versionNumber: 2 },
    ]);
  });

  test("recovers archive move failures without duplicating DB rows", async () => {
    const ticker = `R${Date.now().toString(36).toUpperCase()}`;
    const slug = ticker.toLowerCase();
    createdTickers.push(ticker);
    await cleanupTicker(ticker);

    const inboxDir = join(process.cwd(), "content/sistema-medusa/inbox", slug);
    const publishedDir = join(
      process.cwd(),
      "content/sistema-medusa/published",
      slug
    );
    const publishedParent = join(process.cwd(), "content/sistema-medusa/published");
    cleanupPaths.push(inboxDir, publishedDir);
    rmSync(inboxDir, { force: true, recursive: true });
    rmSync(publishedDir, { force: true, recursive: true });

    mkdirSync(inboxDir, { recursive: true });
    mkdirSync(publishedParent, { recursive: true });
    writeFileSync(publishedDir, "blocks archive mkdir");

    const payload = transformAeroInput(rawAero());
    payload.ticker = ticker;
    payload.project_name = "Test Archive Recovery";

    const filePath = join(inboxDir, `${slug}.json`);
    writeFileSync(filePath, JSON.stringify(payload, null, 2));

    const failed = await ingestAnalysis(filePath);
    expect(failed).toMatchObject({
      ok: false,
      action: "created_archive_failed",
      ticker,
      version_number: 1,
    });
    expect(existsSync(filePath)).toBe(true);

    rmSync(publishedDir, { force: true, recursive: true });

    const recovered = await ingestAnalysis(filePath);
    expect(recovered).toMatchObject({
      ok: true,
      action: "archive_recovered",
      ticker,
      version_number: 1,
      payload_hash: failed.payload_hash,
    });
    expect(existsSync(filePath)).toBe(false);
    expect(existsSync(join(publishedDir, "v1.json"))).toBe(true);

    const [parent] = await db
      .select({ id: analyses.id })
      .from(analyses)
      .where(eq(analyses.ticker, ticker));
    const versions = await db
      .select({ versionNumber: analysisVersions.versionNumber })
      .from(analysisVersions)
      .where(eq(analysisVersions.analysisId, parent.id));
    expect(versions).toEqual([{ versionNumber: 1 }]);
  });

  test("dry-run validates and diffs without writing", async () => {
    const ticker = `D${Date.now().toString(36).toUpperCase()}`;
    createdTickers.push(ticker);
    await cleanupTicker(ticker);

    const payload = transformAeroInput(rawAero());
    payload.ticker = ticker;
    payload.project_name = "Test Dry Run";

    const dir = mkdtempSync(join(tmpdir(), "sistema-medusa-dry-"));
    const filePath = join(dir, `${ticker.toLowerCase()}.json`);
    writeFileSync(filePath, JSON.stringify(payload, null, 2));

    await ingestAnalysis(filePath);

    payload.executive_summary = `${payload.executive_summary} Cambio controlado.`;
    writeFileSync(filePath, JSON.stringify(payload, null, 2));

    const dryRun = await ingestAnalysis(filePath, { dryRun: true });
    expect(dryRun).toMatchObject({
      ok: true,
      action: "validated",
      ticker,
      version_number: 2,
    });
    expect(dryRun.diff).toContain("executive_summary");

    const [parent] = await db
      .select({ id: analyses.id })
      .from(analyses)
      .where(eq(analyses.ticker, ticker));
    const versions = await db
      .select({ versionNumber: analysisVersions.versionNumber })
      .from(analysisVersions)
      .where(eq(analysisVersions.analysisId, parent.id));
    expect(versions).toEqual([{ versionNumber: 1 }]);
  });

  test("concurrent identical ingests create a single version", async () => {
    const ticker = `C${Date.now().toString(36).toUpperCase()}`;
    createdTickers.push(ticker);
    await cleanupTicker(ticker);

    const payload = transformAeroInput(rawAero());
    payload.ticker = ticker;
    payload.project_name = "Test Concurrent Ingest";

    const dir = mkdtempSync(join(tmpdir(), "sistema-medusa-concurrent-"));
    const filePath = join(dir, `${ticker.toLowerCase()}.json`);
    writeFileSync(filePath, JSON.stringify(payload, null, 2));

    const results = await Promise.all([
      ingestAnalysis(filePath),
      ingestAnalysis(filePath),
    ]);

    expect(results.map((result) => result.action).sort()).toEqual([
      "created",
      "noop",
    ]);

    const [parent] = await db
      .select({ id: analyses.id })
      .from(analyses)
      .where(eq(analyses.ticker, ticker));
    const versions = await db
      .select({ versionNumber: analysisVersions.versionNumber })
      .from(analysisVersions)
      .where(eq(analysisVersions.analysisId, parent.id));
    expect(versions).toEqual([{ versionNumber: 1 }]);
  });

  test("mid-flight transaction failure leaves no orphan rows", async () => {
    const ticker = `X${Date.now().toString(36).toUpperCase()}`;
    createdTickers.push(ticker);
    await cleanupTicker(ticker);

    const payload = transformAeroInput(rawAero());
    payload.ticker = ticker;
    payload.project_name = "Test Transaction Rollback";

    const dir = mkdtempSync(join(tmpdir(), "sistema-medusa-rollback-"));
    const filePath = join(dir, `${ticker.toLowerCase()}.json`);
    writeFileSync(filePath, JSON.stringify(payload, null, 2));

    await expect(
      ingestAnalysis(filePath, {
        testHooks: { failAfterVersionInsert: true },
      })
    ).rejects.toThrow("Simulated ingest failure after version insert");

    const parents = await db
      .select({ id: analyses.id })
      .from(analyses)
      .where(eq(analyses.ticker, ticker));
    expect(parents).toEqual([]);
  });
});
