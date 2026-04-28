import { sql } from "drizzle-orm";
import { analysisSchema, type Analysis } from "./schemas";
import { pickPublic } from "./visibility";
import type { AnalysisMemberView, AnalysisPublicView } from "./types";
import type {
  Category,
  Chain,
  Verdict,
} from "./enum-values";

// ---------------------------------------------------------------------------
// Reads from sistema_medusa.published_versions (the view), never the underlying
// table. Every JSONB read re-parses payload via analysisSchema — $type<>() casts
// don't validate; rows written by future buggy ingest could lie.
// ---------------------------------------------------------------------------

export type ListSort = "newest" | "verdict" | "ticker";

export interface ListFilters {
  verdict?: Verdict;
  category?: Category;
  chain?: Chain;
  q?: string;
}

export interface ListOptions {
  filters?: ListFilters;
  sort?: ListSort;
  offset?: number;
  limit?: number;
}

export interface AnalysisListItem {
  ticker: string;
  project_name: string;
  chain: Chain;
  category: Category;
  verdict: Verdict;
  data_date: string;
  analysis_date: string;
  executive_summary: string;
  version_number: number;
  methodology_version: string;
}

export interface AnalysisVersionSummary {
  version_number: number;
  verdict: Verdict;
  published_at: Date;
  revision_note: string | null;
}

interface ListRow {
  ticker: string;
  project_name: string;
  chain: Chain;
  category: Category;
  verdict: Verdict;
  data_date: string | Date;
  analysis_date: string | Date;
  version_number: number;
  payload: unknown;
}

interface VersionRow {
  payload: unknown;
  version_number: number;
}

interface VersionListRow {
  version_number: number;
  verdict: Verdict;
  published_at: Date;
  revision_note: string | null;
}

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

async function getDb() {
  return (await import("@/db")).db;
}

function toDateString(value: string | Date): string {
  if (typeof value === "string") return value.slice(0, 10);
  // Postgres date columns return Date in this driver — normalize to YYYY-MM-DD.
  const iso = value.toISOString();
  return iso.slice(0, 10);
}

function rowToListItem(row: ListRow): AnalysisListItem {
  const parsed: Analysis = analysisSchema.parse(row.payload);
  return {
    ticker: row.ticker,
    project_name: row.project_name,
    chain: row.chain,
    category: row.category,
    verdict: row.verdict,
    data_date: toDateString(row.data_date),
    analysis_date: toDateString(row.analysis_date),
    executive_summary: parsed.executive_summary,
    version_number: row.version_number,
    methodology_version: parsed.methodology_version,
  };
}

export async function listAnalyses(
  opts: ListOptions = {}
): Promise<AnalysisListItem[]> {
  const filters = opts.filters ?? {};
  const sort: ListSort = opts.sort ?? "newest";
  const offset = Math.max(0, opts.offset ?? 0);
  const limit = Math.min(MAX_LIMIT, Math.max(1, opts.limit ?? DEFAULT_LIMIT));

  const wheres = [sql`a.latest_version_id IS NOT NULL`];

  if (filters.verdict) {
    wheres.push(sql`a.current_verdict = ${filters.verdict}`);
  }
  if (filters.category) {
    wheres.push(sql`a.category = ${filters.category}`);
  }
  if (filters.chain) {
    wheres.push(sql`a.chain = ${filters.chain}`);
  }
  if (filters.q && filters.q.trim().length > 0) {
    const needle = filters.q.trim().toLowerCase();
    wheres.push(
      sql`lower(a.ticker || ' ' || a.project_name) ILIKE ${"%" + needle + "%"}`
    );
  }

  const orderBy =
    sort === "verdict"
      ? sql`a.current_verdict ASC, pv.published_at DESC`
      : sort === "ticker"
        ? sql`a.ticker ASC`
        : sql`pv.published_at DESC`;

  const whereClause = sql.join(wheres, sql` AND `);

  const db = await getDb();
  const result = await db.execute<ListRow>(sql`
    SELECT
      a.ticker,
      a.project_name,
      a.chain,
      a.category,
      pv.verdict,
      pv.data_date,
      pv.analysis_date,
      pv.version_number,
      pv.payload
    FROM sistema_medusa.analyses a
    INNER JOIN sistema_medusa.published_versions pv
      ON pv.id = a.latest_version_id
    WHERE ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ${limit}
    OFFSET ${offset}
  `);

  return result.rows.map(rowToListItem);
}

export async function getMemberView(
  ticker: string
): Promise<AnalysisMemberView | null> {
  const db = await getDb();
  const result = await db.execute<VersionRow>(sql`
    SELECT pv.payload, pv.version_number
    FROM sistema_medusa.analyses a
    INNER JOIN sistema_medusa.published_versions pv
      ON pv.id = a.latest_version_id
    WHERE a.ticker = ${ticker}
    LIMIT 1
  `);

  const row = result.rows[0];
  if (!row) return null;
  return analysisSchema.parse(row.payload);
}

export async function getMemberVersionView(
  ticker: string,
  versionNumber: number
): Promise<AnalysisMemberView | null> {
  const db = await getDb();
  const result = await db.execute<VersionRow>(sql`
    SELECT pv.payload, pv.version_number
    FROM sistema_medusa.analyses a
    INNER JOIN sistema_medusa.published_versions pv
      ON pv.analysis_id = a.id
    WHERE a.ticker = ${ticker}
      AND pv.version_number = ${versionNumber}
    LIMIT 1
  `);

  const row = result.rows[0];
  if (!row) return null;
  return analysisSchema.parse(row.payload);
}

export async function getPublicView(
  ticker: string
): Promise<AnalysisPublicView | null> {
  const member = await getMemberView(ticker);
  if (!member) return null;
  return pickPublic(member);
}

export async function getPublicVersionView(
  ticker: string,
  versionNumber: number
): Promise<AnalysisPublicView | null> {
  const member = await getMemberVersionView(ticker, versionNumber);
  if (!member) return null;
  return pickPublic(member);
}

export async function listVersions(
  analysisId: string
): Promise<AnalysisVersionSummary[]> {
  const db = await getDb();
  const result = await db.execute<VersionListRow>(sql`
    SELECT
      pv.version_number,
      pv.verdict,
      pv.published_at,
      pv.revision_note
    FROM sistema_medusa.published_versions pv
    WHERE pv.analysis_id = ${analysisId}
    ORDER BY pv.version_number DESC
  `);

  return result.rows.map((row) => ({
    version_number: row.version_number,
    verdict: row.verdict,
    published_at:
      row.published_at instanceof Date
        ? row.published_at
        : new Date(row.published_at),
    revision_note: row.revision_note,
  }));
}

export async function getAnalysisIdByTicker(
  ticker: string
): Promise<string | null> {
  const db = await getDb();
  const result = await db.execute<{ id: string }>(sql`
    SELECT id FROM sistema_medusa.analyses WHERE ticker = ${ticker} LIMIT 1
  `);
  return result.rows[0]?.id ?? null;
}
