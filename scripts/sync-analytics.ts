// scripts/sync-analytics.ts
// Fetches GA4 analytics data and upserts into Supabase.
//
// Usage:
//   bun scripts/sync-analytics.ts                    # sync yesterday
//   bun scripts/sync-analytics.ts --date 2026-02-14  # sync specific date
//   bun scripts/sync-analytics.ts --days 7           # backfill last 7 days
//
// Required env vars:
//   GA4_PROPERTY_ID          - GA4 property ID (numeric, from Admin > Property Settings)
//   SUPABASE_URL             - Supabase project URL
//   SUPABASE_SERVICE_ROLE_KEY - Supabase service role key
//
// GCP Auth (one of):
//   - GA4_CREDENTIALS_JSON   - SA JSON key (stringified) — for local dev if preferred
//   - Application Default Credentials (ADC) — used by WIF in GitHub Actions
//     Local alternative: run `gcloud auth application-default login`
//
// Setup:
//   1. Create GCP project at console.cloud.google.com
//   2. Enable "Google Analytics Data API"
//   3. Create Service Account (no key download needed — use Workload Identity Federation)
//   4. Set up WIF: create Workload Identity Pool + GitHub OIDC provider
//   5. Grant SA roles/iam.workloadIdentityUser on the WIF pool
//   6. In GA4 Admin > Property Access Management, add SA email as Viewer
//   7. Copy GA4 Property ID from Admin > Property Settings
//   8. Create Supabase tables (see SQL below)
//   9. Add env vars to .env.local (local) or GitHub Secrets (CI)
//
// Supabase table creation SQL:
//
//   CREATE SCHEMA IF NOT EXISTS analytics;
//
//   CREATE TABLE analytics.daily_summary (
//     date DATE PRIMARY KEY,
//     total_users INT NOT NULL DEFAULT 0,
//     new_users INT NOT NULL DEFAULT 0,
//     sessions INT NOT NULL DEFAULT 0,
//     pageviews INT NOT NULL DEFAULT 0,
//     bounce_rate FLOAT NOT NULL DEFAULT 0,
//     avg_session_duration FLOAT NOT NULL DEFAULT 0,
//     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
//   );
//
//   CREATE TABLE analytics.daily_pages (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     date DATE NOT NULL,
//     page_path TEXT NOT NULL,
//     pageviews INT NOT NULL DEFAULT 0,
//     unique_users INT NOT NULL DEFAULT 0,
//     avg_time_on_page FLOAT NOT NULL DEFAULT 0,
//     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
//     UNIQUE (date, page_path)
//   );
//
//   CREATE TABLE analytics.daily_sources (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     date DATE NOT NULL,
//     source TEXT NOT NULL,
//     medium TEXT NOT NULL,
//     sessions INT NOT NULL DEFAULT 0,
//     users INT NOT NULL DEFAULT 0,
//     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
//     UNIQUE (date, source, medium)
//   );
//
//   CREATE TABLE analytics.daily_events (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     date DATE NOT NULL,
//     event_name TEXT NOT NULL,
//     event_count INT NOT NULL DEFAULT 0,
//     unique_users INT NOT NULL DEFAULT 0,
//     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
//     UNIQUE (date, event_name)
//   );
//
//   CREATE TABLE analytics.daily_devices (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     date DATE NOT NULL,
//     device_category TEXT NOT NULL,
//     browser TEXT NOT NULL,
//     os TEXT NOT NULL,
//     users INT NOT NULL DEFAULT 0,
//     sessions INT NOT NULL DEFAULT 0,
//     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
//     UNIQUE (date, device_category, browser, os)
//   );
//
//   CREATE TABLE analytics.daily_geo (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     date DATE NOT NULL,
//     country TEXT NOT NULL,
//     city TEXT NOT NULL,
//     users INT NOT NULL DEFAULT 0,
//     sessions INT NOT NULL DEFAULT 0,
//     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
//     UNIQUE (date, country, city)
//   );

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { getSupabaseClient } from "../lib/supabase";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const GA4_PROPERTY_ID = requireEnv("GA4_PROPERTY_ID");

// Optional: explicit SA credentials for local dev. If absent, ADC is used (WIF in CI).
const GA4_CREDENTIALS_JSON = process.env.GA4_CREDENTIALS_JSON;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

// If explicit JSON credentials are provided, use them; otherwise fall back to ADC
const analyticsOpts = GA4_CREDENTIALS_JSON
  ? (() => {
      const creds = JSON.parse(GA4_CREDENTIALS_JSON);
      return { credentials: { client_email: creds.client_email, private_key: creds.private_key } };
    })()
  : {}; // empty = use Application Default Credentials (WIF / gcloud auth)

const analytics = new BetaAnalyticsDataClient(analyticsOpts);

const supabase = getSupabaseClient("analytics");

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDate(d);
}

function datesForLastNDays(n: number): string[] {
  const dates: string[] = [];
  for (let i = 1; i <= n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates;
}

// ---------------------------------------------------------------------------
// GA4 API calls
// ---------------------------------------------------------------------------

async function fetchDailySummary(date: string) {
  const [response] = await analytics.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate: date, endDate: date }],
    dimensions: [{ name: "date" }],
    metrics: [
      { name: "totalUsers" },
      { name: "newUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "bounceRate" },
      { name: "averageSessionDuration" },
    ],
  });
  return response;
}

async function fetchDailyPages(date: string) {
  const [response] = await analytics.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate: date, endDate: date }],
    dimensions: [{ name: "date" }, { name: "pagePath" }],
    metrics: [
      { name: "screenPageViews" },
      { name: "totalUsers" },
      { name: "averageSessionDuration" },
    ],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 50,
  });
  return response;
}

async function fetchDailySources(date: string) {
  const [response] = await analytics.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate: date, endDate: date }],
    dimensions: [
      { name: "date" },
      { name: "sessionSource" },
      { name: "sessionMedium" },
    ],
    metrics: [{ name: "sessions" }, { name: "totalUsers" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 50,
  });
  return response;
}

async function fetchDailyEvents(date: string) {
  const [response] = await analytics.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate: date, endDate: date }],
    dimensions: [{ name: "date" }, { name: "eventName" }],
    metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 100,
  });
  return response;
}

async function fetchDailyDevices(date: string) {
  const [response] = await analytics.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate: date, endDate: date }],
    dimensions: [
      { name: "date" },
      { name: "deviceCategory" },
      { name: "browser" },
      { name: "operatingSystem" },
    ],
    metrics: [{ name: "totalUsers" }, { name: "sessions" }],
    orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
    limit: 50,
  });
  return response;
}

async function fetchDailyGeo(date: string) {
  const [response] = await analytics.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate: date, endDate: date }],
    dimensions: [{ name: "date" }, { name: "country" }, { name: "city" }],
    metrics: [{ name: "totalUsers" }, { name: "sessions" }],
    orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
    limit: 100,
  });
  return response;
}

// ---------------------------------------------------------------------------
// Transform + Upsert
// ---------------------------------------------------------------------------

function metricVal(row: any, index: number): number {
  return parseFloat(row.metricValues?.[index]?.value ?? "0");
}

function dimVal(row: any, index: number): string {
  return row.dimensionValues?.[index]?.value ?? "";
}

async function syncDate(date: string) {
  console.log(`\n--- Syncing ${date} ---`);

  // Fetch all 6 reports in parallel
  const [summaryRes, pagesRes, sourcesRes, eventsRes, devicesRes, geoRes] =
    await Promise.all([
      fetchDailySummary(date),
      fetchDailyPages(date),
      fetchDailySources(date),
      fetchDailyEvents(date),
      fetchDailyDevices(date),
      fetchDailyGeo(date),
    ]);

  // --- Summary ---
  const summaryRows = summaryRes.rows ?? [];
  if (summaryRows.length > 0) {
    const row = summaryRows[0];
    const summary = {
      date,
      total_users: metricVal(row, 0),
      new_users: metricVal(row, 1),
      sessions: metricVal(row, 2),
      pageviews: metricVal(row, 3),
      bounce_rate: metricVal(row, 4),
      avg_session_duration: metricVal(row, 5),
    };

    const { error } = await supabase
      .from("daily_summary")
      .upsert(summary, { onConflict: "date" });

    if (error) {
      console.error("  Summary upsert error:", error.message);
    } else {
      console.log(
        `  Summary: ${summary.total_users} users, ${summary.sessions} sessions, ${summary.pageviews} pageviews`
      );
    }
  } else {
    console.log("  Summary: no data for this date");
  }

  // --- Pages ---
  // Dimensions: [date, pagePath] / Metrics: [screenPageViews, totalUsers, averageSessionDuration]
  const pageRows = pagesRes.rows ?? [];
  if (pageRows.length > 0) {
    const pages = pageRows.map((row: any) => ({
      date,
      page_path: dimVal(row, 1),
      pageviews: metricVal(row, 0),
      unique_users: metricVal(row, 1),
      avg_time_on_page: metricVal(row, 2),
    }));

    const { error } = await supabase
      .from("daily_pages")
      .upsert(pages, { onConflict: "date,page_path" });

    if (error) {
      console.error("  Pages upsert error:", error.message);
    } else {
      console.log(`  Pages: ${pages.length} rows`);
    }
  } else {
    console.log("  Pages: no data for this date");
  }

  // --- Sources ---
  const sourceRows = sourcesRes.rows ?? [];
  if (sourceRows.length > 0) {
    const sources = sourceRows.map((row: any) => ({
      date,
      source: dimVal(row, 1) || "(direct)",
      medium: dimVal(row, 2) || "(none)",
      sessions: metricVal(row, 0),
      users: metricVal(row, 1),
    }));

    const { error } = await supabase
      .from("daily_sources")
      .upsert(sources, { onConflict: "date,source,medium" });

    if (error) {
      console.error("  Sources upsert error:", error.message);
    } else {
      console.log(`  Sources: ${sources.length} rows`);
    }
  } else {
    console.log("  Sources: no data for this date");
  }

  // --- Events ---
  // Dimensions: [date, eventName] / Metrics: [eventCount, totalUsers]
  const eventRows = eventsRes.rows ?? [];
  if (eventRows.length > 0) {
    const events = eventRows.map((row: any) => ({
      date,
      event_name: dimVal(row, 1),
      event_count: metricVal(row, 0),
      unique_users: metricVal(row, 1),
    }));

    const { error } = await supabase
      .from("daily_events")
      .upsert(events, { onConflict: "date,event_name" });

    if (error) {
      console.error("  Events upsert error:", error.message);
    } else {
      console.log(`  Events: ${events.length} rows`);
    }
  } else {
    console.log("  Events: no data for this date");
  }

  // --- Devices ---
  // Dimensions: [date, deviceCategory, browser, operatingSystem] / Metrics: [totalUsers, sessions]
  const deviceRows = devicesRes.rows ?? [];
  if (deviceRows.length > 0) {
    const devices = deviceRows.map((row: any) => ({
      date,
      device_category: dimVal(row, 1),
      browser: dimVal(row, 2),
      os: dimVal(row, 3),
      users: metricVal(row, 0),
      sessions: metricVal(row, 1),
    }));

    const { error } = await supabase
      .from("daily_devices")
      .upsert(devices, { onConflict: "date,device_category,browser,os" });

    if (error) {
      console.error("  Devices upsert error:", error.message);
    } else {
      console.log(`  Devices: ${devices.length} rows`);
    }
  } else {
    console.log("  Devices: no data for this date");
  }

  // --- Geo ---
  // Dimensions: [date, country, city] / Metrics: [totalUsers, sessions]
  const geoRows = geoRes.rows ?? [];
  if (geoRows.length > 0) {
    const geo = geoRows.map((row: any) => ({
      date,
      country: dimVal(row, 1) || "(not set)",
      city: dimVal(row, 2) || "(not set)",
      users: metricVal(row, 0),
      sessions: metricVal(row, 1),
    }));

    const { error } = await supabase
      .from("daily_geo")
      .upsert(geo, { onConflict: "date,country,city" });

    if (error) {
      console.error("  Geo upsert error:", error.message);
    } else {
      console.log(`  Geo: ${geo.length} rows`);
    }
  } else {
    console.log("  Geo: no data for this date");
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);

  console.log("====================================================");
  console.log("  GA4 Analytics → Supabase Sync");
  console.log("====================================================");

  let dates: string[];

  const dateArgIndex = args.indexOf("--date");
  const daysArgIndex = args.indexOf("--days");

  if (dateArgIndex !== -1 && args[dateArgIndex + 1]) {
    const dateStr = args[dateArgIndex + 1];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      console.error("Invalid date format. Use YYYY-MM-DD.");
      process.exit(1);
    }
    dates = [dateStr];
  } else if (daysArgIndex !== -1 && args[daysArgIndex + 1]) {
    const n = parseInt(args[daysArgIndex + 1], 10);
    if (isNaN(n) || n < 1 || n > 365) {
      console.error("--days must be between 1 and 365.");
      process.exit(1);
    }
    dates = datesForLastNDays(n);
  } else {
    dates = [yesterday()];
  }

  console.log(`\nSyncing ${dates.length} date(s): ${dates.join(", ")}`);

  for (const date of dates) {
    await syncDate(date);
  }

  console.log("\n====================================================");
  console.log("  Done.");
  console.log("====================================================");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
