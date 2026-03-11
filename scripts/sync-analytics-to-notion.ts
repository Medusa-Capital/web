// scripts/sync-analytics-to-notion.ts
// Reads weekly analytics from Supabase and writes to a Notion database.
// One row per week with all metrics as columns.
//
// Usage:
//   bun scripts/sync-analytics-to-notion.ts                                          # sync current + previous week
//   bun scripts/sync-analytics-to-notion.ts --week 2026-03-03                        # sync a specific week
//   bun scripts/sync-analytics-to-notion.ts --backfill-from 2025-12-29 --backfill-to 2026-03-10  # backfill range
//
// Required env vars:
//   SUPABASE_URL                      - Supabase project URL
//   SUPABASE_SERVICE_ROLE_KEY         - Supabase service role key
//   NOTION_API_KEY                    - Notion integration token
//   NOTION_ANALYTICS_PARENT_PAGE_ID   - Notion page ID where the analytics DB is created
//
// Setup:
//   1. Ensure the Notion integration is shared with the parent page (Connections -> add integration)
//   2. On first run, the script creates a "Website Analytics - Weekly" database under the parent page
//   3. Subsequent runs find the existing database by title and upsert rows

import { Client } from "@notionhq/client";
import type {
  CreatePageParameters,
  UpdatePageParameters,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";
import { getSupabaseClient } from "../lib/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WeeklySummary {
  totalUsers: number;
  newUsers: number;
  sessions: number;
  pageviews: number;
  bounceRate: number;
  avgDuration: number;
  days: number;
}

interface TopPage {
  pagePath: string;
  pageviews: number;
}

interface TopSource {
  source: string;
  medium: string;
  sessions: number;
}

interface TopCountry {
  country: string;
  users: number;
}

interface TopEvent {
  eventName: string;
  eventCount: number;
  uniqueUsers: number;
}

interface DeviceBreakdown {
  desktop: number;
  mobile: number;
  tablet: number;
}

interface WeeklyData {
  summary: WeeklySummary;
  pages: TopPage[];
  sources: TopSource[];
  countries: TopCountry[];
  events: TopEvent[];
  devices: DeviceBreakdown;
  days: number;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

const DB_TITLE = "Website Analytics \u2014 Weekly";

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function getWeekRange(weekStart: string): { from: string; to: string } {
  const d = new Date(weekStart + "T00:00:00Z");
  const end = new Date(d);
  end.setUTCDate(end.getUTCDate() + 6);
  return { from: formatDate(d), to: formatDate(end) };
}

function getPreviousWeek(weekStart: string): string {
  const d = new Date(weekStart + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - 7);
  return formatDate(d);
}

function formatWeekLabel(weekStart: string): string {
  const d = new Date(weekStart + "T00:00:00Z");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function getWeeksToSync(): string[] {
  const args = process.argv.slice(2);

  const weekIdx = args.indexOf("--week");
  if (weekIdx !== -1 && args[weekIdx + 1]) {
    const weekStart = args[weekIdx + 1];
    if (new Date(weekStart + "T00:00:00Z").getUTCDay() !== 1) {
      console.error("--week must be a Monday. Got: " + weekStart);
      process.exit(1);
    }
    return [weekStart];
  }

  const fromIdx = args.indexOf("--backfill-from");
  const toIdx = args.indexOf("--backfill-to");
  if (fromIdx !== -1 && toIdx !== -1 && args[fromIdx + 1] && args[toIdx + 1]) {
    const from = new Date(args[fromIdx + 1] + "T00:00:00Z");
    const to = new Date(args[toIdx + 1] + "T00:00:00Z");
    const weeks: string[] = [];
    let current = getMonday(from);
    const end = getMonday(to);
    while (current <= end) {
      weeks.push(formatDate(current));
      current.setUTCDate(current.getUTCDate() + 7);
    }
    return weeks;
  }

  const today = new Date();
  const currentMonday = getMonday(today);
  const prevMonday = new Date(currentMonday);
  prevMonday.setUTCDate(prevMonday.getUTCDate() - 7);
  return [formatDate(prevMonday), formatDate(currentMonday)];
}

// ---------------------------------------------------------------------------
// Notion DB management
// ---------------------------------------------------------------------------

const NOTION_DB_SCHEMA = {
  Week: { title: {} },
  "Week Start": { date: {} },
  Days: { number: { format: "number" as const } },
  Users: { number: { format: "number" as const } },
  "New Users": { number: { format: "number" as const } },
  Sessions: { number: { format: "number" as const } },
  Pageviews: { number: { format: "number" as const } },
  "Bounce Rate": { number: { format: "percent" as const } },
  "Avg Duration": { number: { format: "number" as const } },
  "Prev Users": { number: { format: "number" as const } },
  "Prev Sessions": { number: { format: "number" as const } },
  "Prev Pageviews": { number: { format: "number" as const } },
  "Top Pages": { rich_text: {} },
  "Top Sources": { rich_text: {} },
  "Top Countries": { rich_text: {} },
  "Top Events": { rich_text: {} },
  "Desktop %": { number: { format: "percent" as const } },
  "Mobile %": { number: { format: "percent" as const } },
  "Tablet %": { number: { format: "percent" as const } },
};

async function findOrCreateDatabase(notion: Client, parentPageId: string): Promise<string> {
  const results = await notion.search({
    query: DB_TITLE,
    filter: { property: "object", value: "database" },
  });

  for (const result of results.results) {
    if (result.object !== "database" || !("title" in result)) continue;
    const db = result as Extract<typeof result, { object: "database" }>;
    const title = db.title?.map((t) => t.plain_text).join("") ?? "";
    if (title === DB_TITLE && "page_id" in db.parent && db.parent.page_id === parentPageId) {
      console.log("  Found existing database: " + db.id);
      return db.id;
    }
  }

  console.log("  Creating new database under parent page " + parentPageId + "...");
  const db = await notion.databases.create({
    parent: { page_id: parentPageId },
    title: [{ text: { content: DB_TITLE } }],
    properties: NOTION_DB_SCHEMA as any,
  });
  console.log("  Created database: " + db.id);
  return db.id;
}

// ---------------------------------------------------------------------------
// Supabase queries
// ---------------------------------------------------------------------------

async function fetchWeeklySummary(supabase: ReturnType<typeof getSupabaseClient>, from: string, to: string): Promise<WeeklySummary> {
  const { data, error } = await supabase.from("daily_summary").select("total_users, new_users, sessions, pageviews, bounce_rate, avg_session_duration, date").gte("date", from).lte("date", to);
  if (error) throw new Error("Failed to fetch daily_summary: " + error.message);
  if (!data || data.length === 0) return { totalUsers: 0, newUsers: 0, sessions: 0, pageviews: 0, bounceRate: 0, avgDuration: 0, days: 0 };
  return {
    totalUsers: data.reduce((sum, r) => sum + (r.total_users ?? 0), 0),
    newUsers: data.reduce((sum, r) => sum + (r.new_users ?? 0), 0),
    sessions: data.reduce((sum, r) => sum + (r.sessions ?? 0), 0),
    pageviews: data.reduce((sum, r) => sum + (r.pageviews ?? 0), 0),
    bounceRate: data.reduce((sum, r) => sum + (r.bounce_rate ?? 0), 0) / data.length,
    avgDuration: data.reduce((sum, r) => sum + (r.avg_session_duration ?? 0), 0) / data.length,
    days: data.length,
  };
}

async function fetchTopPages(supabase: ReturnType<typeof getSupabaseClient>, from: string, to: string): Promise<TopPage[]> {
  const { data, error } = await supabase.from("daily_pages").select("page_path, pageviews").gte("date", from).lte("date", to);
  if (error) throw new Error("Failed to fetch daily_pages: " + error.message);
  if (!data || data.length === 0) return [];
  const byPath = new Map<string, number>();
  for (const row of data) byPath.set(row.page_path, (byPath.get(row.page_path) ?? 0) + (row.pageviews ?? 0));
  return [...byPath.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([pagePath, pageviews]) => ({ pagePath, pageviews }));
}

async function fetchTopSources(supabase: ReturnType<typeof getSupabaseClient>, from: string, to: string): Promise<TopSource[]> {
  const { data, error } = await supabase.from("daily_sources").select("source, medium, sessions").gte("date", from).lte("date", to);
  if (error) throw new Error("Failed to fetch daily_sources: " + error.message);
  if (!data || data.length === 0) return [];
  const byKey = new Map<string, { source: string; medium: string; sessions: number }>();
  for (const row of data) {
    const key = row.source + "|" + row.medium;
    const existing = byKey.get(key);
    if (existing) existing.sessions += row.sessions ?? 0;
    else byKey.set(key, { source: row.source, medium: row.medium, sessions: row.sessions ?? 0 });
  }
  return [...byKey.values()].sort((a, b) => b.sessions - a.sessions).slice(0, 5);
}

async function fetchTopCountries(supabase: ReturnType<typeof getSupabaseClient>, from: string, to: string): Promise<TopCountry[]> {
  const { data, error } = await supabase.from("daily_geo").select("country, users").gte("date", from).lte("date", to);
  if (error) throw new Error("Failed to fetch daily_geo: " + error.message);
  if (!data || data.length === 0) return [];
  const byCountry = new Map<string, number>();
  for (const row of data) byCountry.set(row.country, (byCountry.get(row.country) ?? 0) + (row.users ?? 0));
  return [...byCountry.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([country, users]) => ({ country, users }));
}

async function fetchTopEvents(supabase: ReturnType<typeof getSupabaseClient>, from: string, to: string): Promise<TopEvent[]> {
  const { data, error } = await supabase.from("daily_events").select("event_name, event_count, unique_users").gte("date", from).lte("date", to);
  if (error) throw new Error("Failed to fetch daily_events: " + error.message);
  if (!data || data.length === 0) return [];
  const byEvent = new Map<string, { eventCount: number; uniqueUsers: number }>();
  for (const row of data) {
    const existing = byEvent.get(row.event_name);
    if (existing) { existing.eventCount += row.event_count ?? 0; existing.uniqueUsers += row.unique_users ?? 0; }
    else byEvent.set(row.event_name, { eventCount: row.event_count ?? 0, uniqueUsers: row.unique_users ?? 0 });
  }
  return [...byEvent.entries()].sort((a, b) => b[1].eventCount - a[1].eventCount).slice(0, 5).map(([eventName, { eventCount, uniqueUsers }]) => ({ eventName, eventCount, uniqueUsers }));
}

async function fetchDeviceBreakdown(supabase: ReturnType<typeof getSupabaseClient>, from: string, to: string): Promise<DeviceBreakdown> {
  const { data, error } = await supabase.from("daily_devices").select("device_category, users").gte("date", from).lte("date", to);
  if (error) throw new Error("Failed to fetch daily_devices: " + error.message);
  if (!data || data.length === 0) return { desktop: 0, mobile: 0, tablet: 0 };
  const byCategory = new Map<string, number>();
  for (const row of data) { const cat = (row.device_category ?? "").toLowerCase(); byCategory.set(cat, (byCategory.get(cat) ?? 0) + (row.users ?? 0)); }
  const total = [...byCategory.values()].reduce((a, b) => a + b, 0);
  if (total === 0) return { desktop: 0, mobile: 0, tablet: 0 };
  return { desktop: (byCategory.get("desktop") ?? 0) / total, mobile: (byCategory.get("mobile") ?? 0) / total, tablet: (byCategory.get("tablet") ?? 0) / total };
}

// ---------------------------------------------------------------------------
// Notion property builder
// ---------------------------------------------------------------------------

function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? str.slice(0, maxLen - 1) + "\u2026" : str;
}

function buildWeekProperties(weekStart: string, data: WeeklyData, prevSummary: WeeklySummary) {
  const pagesText = data.pages.length > 0
    ? data.pages.map((p, i) => (i + 1) + ". " + truncate(p.pagePath, 60) + " \u2014 " + p.pageviews + " views").join("\n")
    : "No data";
  const sourcesText = data.sources.length > 0
    ? data.sources.map((s, i) => (i + 1) + ". " + s.source + " / " + s.medium + " \u2014 " + s.sessions + " sessions").join("\n")
    : "No data";
  const countriesText = data.countries.length > 0
    ? data.countries.map((c, i) => (i + 1) + ". " + c.country + " \u2014 " + c.users + " users").join("\n")
    : "No data";
  const eventsText = data.events.length > 0
    ? data.events.map((e, i) => (i + 1) + ". " + e.eventName + " \u2014 " + e.eventCount + " (" + e.uniqueUsers + " users)").join("\n")
    : "No data";

  return {
    Week: { title: [{ text: { content: formatWeekLabel(weekStart) } }] },
    "Week Start": { date: { start: weekStart } },
    Days: { number: data.days },
    Users: { number: data.summary.totalUsers },
    "New Users": { number: data.summary.newUsers },
    Sessions: { number: data.summary.sessions },
    Pageviews: { number: data.summary.pageviews },
    "Bounce Rate": { number: Math.round(data.summary.bounceRate * 100) / 100 },
    "Avg Duration": { number: Math.round(data.summary.avgDuration * 10) / 10 },
    "Prev Users": { number: prevSummary.totalUsers },
    "Prev Sessions": { number: prevSummary.sessions },
    "Prev Pageviews": { number: prevSummary.pageviews },
    "Top Pages": { rich_text: [{ text: { content: pagesText } }] },
    "Top Sources": { rich_text: [{ text: { content: sourcesText } }] },
    "Top Countries": { rich_text: [{ text: { content: countriesText } }] },
    "Top Events": { rich_text: [{ text: { content: eventsText } }] },
    "Desktop %": { number: Math.round(data.devices.desktop * 1000) / 1000 },
    "Mobile %": { number: Math.round(data.devices.mobile * 1000) / 1000 },
    "Tablet %": { number: Math.round(data.devices.tablet * 1000) / 1000 },
  };
}

// ---------------------------------------------------------------------------
// Notion upsert
// ---------------------------------------------------------------------------

async function upsertWeekRow(notion: Client, dbId: string, weekStart: string, properties: Record<string, unknown>): Promise<void> {
  const existing = await notion.databases.query({
    database_id: dbId,
    filter: { property: "Week Start", date: { equals: weekStart } },
  });

  if (existing.results.length > 0) {
    await notion.pages.update({ page_id: existing.results[0].id, properties: properties as UpdatePageParameters["properties"] });
    console.log("  Updated week " + weekStart);
  } else {
    await notion.pages.create({ parent: { database_id: dbId }, properties: properties as CreatePageParameters["properties"] });
    console.log("  Created week " + weekStart);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const notion = new Client({ auth: requireEnv("NOTION_API_KEY") });
  const supabase = getSupabaseClient("analytics");
  const parentPageId = requireEnv("NOTION_ANALYTICS_PARENT_PAGE_ID");

  console.log("=== Notion Analytics Sync ===");
  const dbId = await findOrCreateDatabase(notion, parentPageId);

  const weeks = getWeeksToSync();
  console.log("\nSyncing " + weeks.length + " week(s): " + weeks.join(", "));

  for (const weekStart of weeks) {
    const { from, to } = getWeekRange(weekStart);
    console.log("\n--- Week of " + formatWeekLabel(weekStart) + " (" + from + " to " + to + ") ---");

    const [summary, pages, sources, countries, events, devices] = await Promise.all([
      fetchWeeklySummary(supabase, from, to),
      fetchTopPages(supabase, from, to),
      fetchTopSources(supabase, from, to),
      fetchTopCountries(supabase, from, to),
      fetchTopEvents(supabase, from, to),
      fetchDeviceBreakdown(supabase, from, to),
    ]);

    const data: WeeklyData = { summary, pages, sources, countries, events, devices, days: summary.days };

    const prevWeekStart = getPreviousWeek(weekStart);
    const { from: prevFrom, to: prevTo } = getWeekRange(prevWeekStart);
    const prevSummary = await fetchWeeklySummary(supabase, prevFrom, prevTo);

    const properties = buildWeekProperties(weekStart, data, prevSummary);
    await upsertWeekRow(notion, dbId, weekStart, properties);
  }

  console.log("\n=== Sync complete ===");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
