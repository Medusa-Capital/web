import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";
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

async function seedTicker(suffix: string) {
  const ticker = `A${suffix}${Date.now().toString(36).toUpperCase()}`;
  createdTickers.push(ticker);
  await cleanupTicker(ticker);

  const payload = transformAeroInput(rawAero());
  payload.ticker = ticker;
  payload.project_name = `API Test ${suffix}`;

  const dir = mkdtempSync(join(tmpdir(), "sistema-medusa-api-"));
  const filePath = join(dir, `${ticker.toLowerCase()}.json`);
  writeFileSync(filePath, JSON.stringify(payload, null, 2));

  const result = await ingestAnalysis(filePath);
  if (!result.ok) throw new Error(`seed failed: ${JSON.stringify(result)}`);
  return ticker;
}

mock.module("@/lib/auth/require", () => ({
  requireMemberCore: async () => ({
    ok: true,
    data: {
      userId: "test-user",
      sessionId: "test-session",
      externalId: "ext",
      tiers: ["foundational"],
      membershipCheckedAt: Date.now(),
    },
  }),
}));

beforeAll(async () => {
  loadEnvLocal();
  db = (await import("@/db")).db;
});

afterAll(async () => {
  for (const ticker of createdTickers) {
    await cleanupTicker(ticker);
  }
});

function buildRequest(url: string) {
  return new Request(url) as unknown as import("next/server").NextRequest;
}

describe("GET /api/sistema-medusa/analyses", () => {
  test("returns the seeded ticker in the list", async () => {
    const ticker = await seedTicker("L");
    const { GET } = await import("@/app/api/sistema-medusa/analyses/route");
    const res = await GET(
      buildRequest(`https://example.com/api/sistema-medusa/analyses`)
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data)).toBe(true);
    const found = body.data.find((item: { ticker: string }) => item.ticker === ticker);
    expect(found).toBeDefined();
    expect(found.executive_summary.length).toBeGreaterThan(0);
  });

  test("rejects bad sort with 400", async () => {
    const { GET } = await import("@/app/api/sistema-medusa/analyses/route");
    const res = await GET(
      buildRequest(`https://example.com/api/sistema-medusa/analyses?sort=oops`)
    );
    expect(res.status).toBe(400);
  });
});

describe("GET /api/sistema-medusa/analyses/[ticker]", () => {
  test("member mode returns the full payload", async () => {
    const ticker = await seedTicker("D");
    const { GET } = await import(
      "@/app/api/sistema-medusa/analyses/[ticker]/route"
    );
    const res = await GET(
      buildRequest(
        `https://example.com/api/sistema-medusa/analyses/${ticker}?fields=member`
      ),
      { params: Promise.resolve({ ticker }) }
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.ticker).toBe(ticker);
    expect(body.data.base_data).toBeDefined();
    expect(body.data.fundamental_pillars).toBeDefined();
  });

  test("public mode strips member-only fields from the JSON wire", async () => {
    const ticker = await seedTicker("P");
    const { GET } = await import(
      "@/app/api/sistema-medusa/analyses/[ticker]/route"
    );
    const res = await GET(
      buildRequest(
        `https://example.com/api/sistema-medusa/analyses/${ticker}?fields=public`
      ),
      { params: Promise.resolve({ ticker }) }
    );
    expect(res.status).toBe(200);
    const wire = await res.text();
    expect(wire).toContain(ticker);
    expect(wire).not.toContain("base_data");
    expect(wire).not.toContain("discard_filters");
    expect(wire).not.toContain("fundamental_pillars");
    expect(wire).not.toContain("ita_definitiva");
    expect(wire).not.toContain("comparative_analysis");
    expect(wire).not.toContain("risks_and_watchpoints");
    expect(wire).not.toContain("verdict_section");
    expect(wire).not.toContain('"sources"');
  });

  test("returns 404 for unknown tickers", async () => {
    const { GET } = await import(
      "@/app/api/sistema-medusa/analyses/[ticker]/route"
    );
    const res = await GET(
      buildRequest(
        `https://example.com/api/sistema-medusa/analyses/NOSUCH`
      ),
      { params: Promise.resolve({ ticker: "NOSUCH" }) }
    );
    expect(res.status).toBe(404);
  });
});

describe("GET /api/sistema-medusa/analyses/[ticker]/versions", () => {
  test("returns the version list", async () => {
    const ticker = await seedTicker("V");
    const { GET } = await import(
      "@/app/api/sistema-medusa/analyses/[ticker]/versions/route"
    );
    const res = await GET(new Request("https://example.com/x"), {
      params: Promise.resolve({ ticker }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toHaveLength(1);
    expect(body.data[0].version_number).toBe(1);
  });
});

describe("GET /api/sistema-medusa/analyses/[ticker]/versions/[n]", () => {
  test("returns the explicit version", async () => {
    const ticker = await seedTicker("N");
    const { GET } = await import(
      "@/app/api/sistema-medusa/analyses/[ticker]/versions/[n]/route"
    );
    const res = await GET(
      buildRequest(
        `https://example.com/api/sistema-medusa/analyses/${ticker}/versions/1`
      ),
      { params: Promise.resolve({ ticker, n: "1" }) }
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.ticker).toBe(ticker);
  });

  test("strips member fields with ?fields=public", async () => {
    const ticker = await seedTicker("S");
    const { GET } = await import(
      "@/app/api/sistema-medusa/analyses/[ticker]/versions/[n]/route"
    );
    const res = await GET(
      buildRequest(
        `https://example.com/api/sistema-medusa/analyses/${ticker}/versions/1?fields=public`
      ),
      { params: Promise.resolve({ ticker, n: "1" }) }
    );
    expect(res.status).toBe(200);
    const wire = await res.text();
    expect(wire).not.toContain("base_data");
    expect(wire).not.toContain("discard_filters");
  });

  test("rejects invalid version number", async () => {
    const { GET } = await import(
      "@/app/api/sistema-medusa/analyses/[ticker]/versions/[n]/route"
    );
    const res = await GET(
      buildRequest(`https://example.com/x`),
      { params: Promise.resolve({ ticker: "AERO", n: "99999" }) }
    );
    expect(res.status).toBe(400);
  });
});
