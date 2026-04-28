import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { eq } from "drizzle-orm";

import { analyses, analysisVersions, publishEvents } from "@/db/schema";
import { ingestAnalysis } from "@/scripts/sistema-medusa/ingest";
import { transformAeroInput } from "@/scripts/sistema-medusa/seed-aero";
import {
  listAnalyses,
  getMemberView,
  getMemberVersionView,
  getPublicView,
  listVersions,
} from "@/lib/sistema-medusa/queries";

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

async function seedTicker(suffix: string, overrides: { project_name?: string; verdict?: string } = {}) {
  const ticker = `Q${suffix}${Date.now().toString(36).toUpperCase()}`;
  createdTickers.push(ticker);
  await cleanupTicker(ticker);

  const payload = transformAeroInput(rawAero());
  payload.ticker = ticker;
  if (overrides.project_name) payload.project_name = overrides.project_name;
  if (overrides.verdict) {
    payload.verdict = overrides.verdict as typeof payload.verdict;
    payload.verdict_section.final_verdict = overrides.verdict as typeof payload.verdict_section.final_verdict;
  }

  const dir = mkdtempSync(join(tmpdir(), "sistema-medusa-queries-"));
  const filePath = join(dir, `${ticker.toLowerCase()}.json`);
  writeFileSync(filePath, JSON.stringify(payload, null, 2));

  const result = await ingestAnalysis(filePath);
  if (!result.ok) throw new Error(`seed failed: ${JSON.stringify(result)}`);

  return { ticker, payload };
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

describe("listAnalyses", () => {
  test("returns AnalysisListItem joined with the latest published version", async () => {
    const { ticker } = await seedTicker("L1", { project_name: "Querytest Joined" });

    const items = await listAnalyses({ limit: 100 });
    const found = items.find((item) => item.ticker === ticker);
    expect(found).toBeDefined();
    expect(found).toMatchObject({
      ticker,
      project_name: "Querytest Joined",
      chain: "Base",
      category: "DEX",
      verdict: "AVANZA_A_AT",
      version_number: 1,
    });
    expect(typeof found?.executive_summary).toBe("string");
    expect(found?.executive_summary.length).toBeGreaterThan(0);
    expect(found?.data_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(found?.analysis_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test("filters by verdict, category, chain", async () => {
    const { ticker } = await seedTicker("L2");
    const items = await listAnalyses({
      filters: { verdict: "AVANZA_A_AT", category: "DEX", chain: "Base" },
      limit: 100,
    });
    expect(items.find((item) => item.ticker === ticker)).toBeDefined();

    const empty = await listAnalyses({
      filters: { verdict: "DESCARTE" },
      limit: 100,
    });
    expect(empty.find((item) => item.ticker === ticker)).toBeUndefined();
  });

  test("free-text search matches ticker or project name (pg_trgm)", async () => {
    const { ticker } = await seedTicker("L3", { project_name: "Querytest Searchable" });
    const items = await listAnalyses({ filters: { q: "querytest searchable" }, limit: 100 });
    expect(items.find((item) => item.ticker === ticker)).toBeDefined();
  });

  test("sort newest puts most recent published version first", async () => {
    await seedTicker("L4");
    const items = await listAnalyses({ sort: "newest", limit: 100 });
    expect(items.length).toBeGreaterThan(0);
  });

  test("excludes analyses where latest_version_id is NULL", async () => {
    const { ticker } = await seedTicker("L5");

    const [parent] = await db
      .select({ id: analyses.id })
      .from(analyses)
      .where(eq(analyses.ticker, ticker));
    await db
      .update(analyses)
      .set({ latestVersionId: null, currentVerdict: null })
      .where(eq(analyses.id, parent.id));

    const items = await listAnalyses({ limit: 100 });
    expect(items.find((item) => item.ticker === ticker)).toBeUndefined();
  });
});

describe("getMemberView", () => {
  test("returns the latest published payload re-parsed via Zod", async () => {
    const { ticker } = await seedTicker("M1", { project_name: "Querytest Member" });
    const view = await getMemberView(ticker);
    expect(view).not.toBeNull();
    expect(view?.ticker).toBe(ticker);
    expect(view?.project_name).toBe("Querytest Member");
    expect(view?.base_data.price_usd).toBeGreaterThan(0);
    expect(view?.fundamental_pillars.pillars.length).toBeGreaterThan(0);
  });

  test("returns null when ticker does not exist", async () => {
    const view = await getMemberView("NONEXISTENT_TICKER_XYZ");
    expect(view).toBeNull();
  });
});

describe("getMemberVersionView", () => {
  test("returns the explicit version when present", async () => {
    const { ticker } = await seedTicker("V1");
    const view = await getMemberVersionView(ticker, 1);
    expect(view).not.toBeNull();
    expect(view?.ticker).toBe(ticker);
  });

  test("returns null when the version is missing", async () => {
    const { ticker } = await seedTicker("V2");
    const view = await getMemberVersionView(ticker, 99);
    expect(view).toBeNull();
  });
});

describe("getPublicView", () => {
  test("strips member-only fields from the wire", async () => {
    const { ticker } = await seedTicker("P1");
    const publicView = await getPublicView(ticker);
    expect(publicView).not.toBeNull();
    expect(publicView).toMatchObject({
      ticker,
      verdict: "AVANZA_A_AT",
    });
    const wire = JSON.stringify(publicView);
    expect(wire).not.toContain("base_data");
    expect(wire).not.toContain("discard_filters");
    expect(wire).not.toContain("fundamental_pillars");
    expect(wire).not.toContain("ita_definitiva");
    expect(wire).not.toContain("comparative_analysis");
    expect(wire).not.toContain("risks_and_watchpoints");
    expect(wire).not.toContain("verdict_section");
    expect(wire).not.toContain("sources");
  });
});

describe("listVersions", () => {
  test("returns all published versions for an analysis", async () => {
    const { ticker } = await seedTicker("LV1");
    const [parent] = await db
      .select({ id: analyses.id })
      .from(analyses)
      .where(eq(analyses.ticker, ticker));

    const versions = await listVersions(parent.id);
    expect(versions).toHaveLength(1);
    expect(versions[0]).toMatchObject({
      version_number: 1,
      verdict: "AVANZA_A_AT",
    });
    expect(versions[0]?.published_at).toBeInstanceOf(Date);
  });
});
