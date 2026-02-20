# Analytics Pipeline Setup Guide

Step-by-step guide to replicate the GA4 → Supabase analytics pipeline for a new project. Covers GCP, GA4, Supabase, GitHub Actions, and local development.

**Time estimate:** ~45 minutes (mostly GCP/GA4 console clicking)

**Prerequisites:** A website with GA4 tracking already active, a Supabase project, and a GitHub repository.

---

## Step 1: Create a GCP Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **Select a project** → **New Project**
3. Name it something descriptive (e.g., `analytics-pipeline`)
4. Note the **Project ID** — you'll need it for quota configuration later

## Step 2: Enable the Analytics Data API

1. In GCP Console, go to **APIs & Services** → **Library**
2. Search for **"Google Analytics Data API"**
3. Click **Enable**

> This is the API that lets you programmatically query GA4 data. It's free with generous limits (200,000 requests/day).

## Step 3: Create a Service Account

1. In GCP Console, go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Name: `ga4-reader` (or similar)
4. Description: "Reads GA4 analytics data for pipeline sync"
5. Click **Create and Continue**
6. **Skip** the "Grant access" and "Grant users access" steps — click **Done**
7. Copy the **Service Account email** (e.g., `ga4-reader@your-project.iam.gserviceaccount.com`) — you'll need it for GA4 access and WIF

> **Do NOT create or download a JSON key.** We'll use Workload Identity Federation for keyless auth from GitHub Actions, and Application Default Credentials for local dev.

## Step 4: Set Up Workload Identity Federation (WIF)

WIF allows GitHub Actions to authenticate as your Service Account without storing long-lived credentials. It works by exchanging GitHub's OIDC token for a short-lived GCP access token.

### 4a. Create a Workload Identity Pool

1. In GCP Console, go to **IAM & Admin** → **Workload Identity Federation**
2. Click **Create Pool**
3. **Name:** `github-actions` (display name)
4. **Pool ID:** `github-actions` (URL slug — auto-generated from name)
5. Click **Continue**

### 4b. Add a Provider to the Pool

1. **Provider type:** OpenID Connect (OIDC)
2. **Provider name:** `github` (display name)
3. **Provider ID:** `github` (URL slug)
4. **Issuer URL:** `https://token.actions.githubusercontent.com`
5. **Audiences:** Select **Default audience** (uses the pool's own URL)
6. Click **Continue**

### 4c. Configure Attribute Mapping

Map GitHub's OIDC claims to GCP attributes:

| Google attribute | OIDC claim |
|-----------------|------------|
| `google.subject` | `assertion.sub` |
| `attribute.repository` | `assertion.repository` |

### 4d. Set an Attribute Condition

This restricts which GitHub repos can use this identity pool:

```
attribute.repository == "YOUR_GITHUB_ORG/YOUR_REPO_NAME"
```

Replace with your actual GitHub repo (e.g., `Urbistondo/medusa-capital-typescript`).

> **Important:** The condition uses `attribute.repository` (left side of the mapping), NOT `assertion.repository`. This is a common source of errors.

Click **Save**.

### 4e. Grant the SA Access to the WIF Pool

You need to allow the WIF pool to impersonate the Service Account. The easiest way is via `gcloud`:

```bash
gcloud iam service-accounts add-iam-policy-binding \
  "ga4-reader@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --project="YOUR_PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/YOUR_PROJECT_NUMBER/locations/global/workloadIdentityPools/github-actions/attribute.repository/YOUR_GITHUB_ORG/YOUR_REPO_NAME"
```

Replace:
- `YOUR_PROJECT_ID` — your GCP project ID
- `YOUR_PROJECT_NUMBER` — numeric project number (find in GCP Console → Dashboard)
- `YOUR_GITHUB_ORG/YOUR_REPO_NAME` — your GitHub repo

> **Tip:** If the gcloud command breaks across lines in your terminal, paste it into a single-line text editor first, or run it from a script file.

### 4f. Note the Provider Resource Name

You'll need this as a GitHub Secret later. Construct it from your pool details:

```
projects/YOUR_PROJECT_NUMBER/locations/global/workloadIdentityPools/github-actions/providers/github
```

This is the value for `GCP_WORKLOAD_IDENTITY_PROVIDER`.

## Step 5: Grant GA4 Property Access to the Service Account

1. Go to [analytics.google.com](https://analytics.google.com)
2. Open your GA4 property
3. Go to **Admin** (gear icon, bottom left)
4. Under **Property**, click **Property Access Management**
5. Click the **+** button → **Add users**
6. Enter the Service Account email (e.g., `ga4-reader@your-project.iam.gserviceaccount.com`)
7. Role: **Viewer** (read-only is sufficient)
8. Uncheck "Notify new users by email" (SA can't receive email)
9. Click **Add**

## Step 6: Find Your GA4 Property ID

1. In GA4, go to **Admin** (gear icon)
2. Under **Property**, click **Property Settings** (or **Property details**)
3. The **Property ID** is a numeric value (e.g., `123456789`)
4. Copy it — this is your `GA4_PROPERTY_ID`

## Step 7: Create Supabase Tables

### 7a. Create the Analytics Schema

Run this SQL in Supabase's SQL Editor (or via migration):

```sql
CREATE SCHEMA IF NOT EXISTS analytics;
```

### 7b. Create All 6 Tables

```sql
CREATE TABLE analytics.daily_summary (
  date DATE PRIMARY KEY,
  total_users INT NOT NULL DEFAULT 0,
  new_users INT NOT NULL DEFAULT 0,
  sessions INT NOT NULL DEFAULT 0,
  pageviews INT NOT NULL DEFAULT 0,
  bounce_rate FLOAT NOT NULL DEFAULT 0,
  avg_session_duration FLOAT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE analytics.daily_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  page_path TEXT NOT NULL,
  pageviews INT NOT NULL DEFAULT 0,
  unique_users INT NOT NULL DEFAULT 0,
  avg_time_on_page FLOAT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (date, page_path)
);

CREATE TABLE analytics.daily_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  source TEXT NOT NULL,
  medium TEXT NOT NULL,
  sessions INT NOT NULL DEFAULT 0,
  users INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (date, source, medium)
);

CREATE TABLE analytics.daily_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  event_name TEXT NOT NULL,
  event_count INT NOT NULL DEFAULT 0,
  unique_users INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (date, event_name)
);

CREATE TABLE analytics.daily_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  device_category TEXT NOT NULL,
  browser TEXT NOT NULL,
  os TEXT NOT NULL,
  users INT NOT NULL DEFAULT 0,
  sessions INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (date, device_category, browser, os)
);

CREATE TABLE analytics.daily_geo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  users INT NOT NULL DEFAULT 0,
  sessions INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (date, country, city)
);
```

### 7c. Expose the Analytics Schema

By default, Supabase only exposes the `public` schema via its REST API. Since the sync script uses the Supabase JS client (which goes through the REST API), you need to expose the `analytics` schema:

1. Go to Supabase Dashboard → **Settings** → **API**
2. Under **Exposed schemas**, add `analytics`
3. Save

### 7d. Grant Permissions

The `service_role` key needs access to the `analytics` schema:

```sql
GRANT USAGE ON SCHEMA analytics TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA analytics TO service_role;

-- Ensure future tables also get permissions automatically:
ALTER DEFAULT PRIVILEGES IN SCHEMA analytics
  GRANT ALL ON TABLES TO service_role;
```

## Step 8: Install Dependencies

In your project directory:

```bash
bun add @google-analytics/data @supabase/supabase-js
```

## Step 9: Create the Sync Script

Copy `scripts/sync-analytics.ts` to your project. The script:

1. Reads env vars for GA4 and Supabase credentials
2. Initializes a GA4 `BetaAnalyticsDataClient` (supports both explicit JSON credentials and ADC)
3. Initializes a Supabase client pointed at the `analytics` schema
4. Fetches 6 GA4 reports in parallel (summary, pages, sources, events, devices, geo)
5. Transforms GA4 response rows into table-ready objects
6. Upserts into Supabase using `onConflict` for idempotency

CLI interface:
```bash
bun scripts/sync-analytics.ts                    # sync yesterday
bun scripts/sync-analytics.ts --date 2026-02-14  # sync specific date
bun scripts/sync-analytics.ts --days 30          # backfill last 30 days
```

## Step 10: Create the GitHub Actions Workflow

Create `.github/workflows/sync-analytics.yml`:

```yaml
name: Sync GA4 Analytics

on:
  schedule:
    - cron: '0 6 * * *' # 6 AM UTC daily
  workflow_dispatch: # manual trigger

concurrency:
  group: sync-analytics
  cancel-in-progress: false

permissions:
  id-token: write # Required for Workload Identity Federation
  contents: read

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Authenticate to Google Cloud (WIF)
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
          service_account: ${{ secrets.GCP_SERVICE_ACCOUNT }}

      - uses: oven-sh/setup-bun@v2

      - run: bun install --frozen-lockfile

      - name: Sync yesterday's analytics
        run: bun scripts/sync-analytics.ts
        env:
          GA4_PROPERTY_ID: ${{ secrets.GA4_PROPERTY_ID }}
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

Key details:
- `permissions.id-token: write` is **required** for WIF OIDC token exchange
- `google-github-actions/auth@v2` handles the WIF authentication — it fetches a GitHub OIDC token and exchanges it for GCP credentials
- The GCP credentials are automatically set as Application Default Credentials for the rest of the job
- No `GA4_CREDENTIALS_JSON` needed in CI — WIF provides auth via ADC

## Step 11: Add GitHub Secrets

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret Name | Value | Where to Find It |
|-------------|-------|-------------------|
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/XXXXX/locations/global/workloadIdentityPools/github-actions/providers/github` | Constructed from GCP project number + pool/provider IDs (Step 4f) |
| `GCP_SERVICE_ACCOUNT` | `ga4-reader@your-project.iam.gserviceaccount.com` | GCP Console → IAM & Admin → Service Accounts |
| `GA4_PROPERTY_ID` | `123456789` | GA4 Admin → Property Settings (Step 6) |
| `SUPABASE_URL` | `https://xxx.supabase.co` | Supabase Dashboard → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (or `sbp_...`) | Supabase Dashboard → Settings → API → Secret key (NOT the publishable key) |

> **Supabase note:** The "Secret key" (also called "service_role key") may start with `sbp_` instead of `eyJ` depending on your Supabase project version. Both formats work.

## Step 12: Test

### First run via GitHub Actions

1. Push the workflow file to your `main` branch (workflows only appear in GitHub Actions if they exist on the default branch)
2. Go to **Actions** tab → **Sync GA4 Analytics** → **Run workflow**
3. Watch the logs for successful upserts
4. Check Supabase tables for data

### Local development setup

For running the script locally (e.g., backfills):

1. Install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
2. Authenticate with the correct scopes:
   ```bash
   gcloud auth application-default login \
     --scopes="https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform"
   ```
3. Set the quota project:
   ```bash
   gcloud auth application-default set-quota-project YOUR_PROJECT_ID
   ```
4. Add to your `.env.local`:
   ```
   GA4_PROPERTY_ID=123456789
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_key_here
   ```
5. Run:
   ```bash
   bun scripts/sync-analytics.ts --date 2026-02-19
   ```

> **Important:** The `--scopes` flag is required because the default gcloud scopes don't include `analytics.readonly`. Without it you'll get an "insufficient authentication scopes" error.

### Backfill historical data

```bash
bun scripts/sync-analytics.ts --days 60  # last 60 days
```

The script processes dates sequentially (one at a time) to avoid hitting GA4 API rate limits. Each date makes 6 API calls. A 60-day backfill = 360 requests, well within the 200,000/day quota.

---

## Troubleshooting

### "schema must be one of: public, graphql_public"

The `analytics` schema is not exposed in Supabase. Go to Supabase Dashboard → Settings → API → add `analytics` to Exposed schemas.

### "permission denied for schema analytics"

Run the GRANT statements from Step 7d in the Supabase SQL Editor.

### "insufficient authentication scopes" (local dev)

Re-run `gcloud auth application-default login` with the `--scopes` flag as shown in Step 12.

### "Quota project not set" (local dev)

Run `gcloud auth application-default set-quota-project YOUR_PROJECT_ID`.

### "attribute condition must reference one of the provider's claims"

WIF attribute condition must use `attribute.repository` (the mapped Google attribute), not `assertion.repository` (the raw OIDC claim). See Step 4d.

### "Invalid mapped attribute key: assertion.repository"

In the WIF attribute mapping, the left side must use the `attribute.` prefix (Google namespace) and the right side uses `assertion.` (OIDC claim). See Step 4c.

### Workflow not visible in GitHub Actions tab

The workflow YAML file must exist on the default branch (`main`). If you created it on a feature branch, merge to main first.

### No data for a specific date

GA4 can take 24-48 hours to finalize data. If you sync "today" or "yesterday" too early, some metrics may be incomplete or missing. The daily cron at 6 AM UTC gives Google enough time to process the previous day.

---

## Architecture Recap

```
Visitor lands on site
  → GA4 JavaScript snippet fires events to Google servers
  → Google aggregates raw events into queryable dimensions + metrics
  → Daily at 6 AM UTC, GitHub Actions triggers scripts/sync-analytics.ts
  → Script authenticates via WIF (CI) or ADC (local)
  → Script calls GA4 Data API (6 reports in parallel)
  → Script upserts results into Supabase (analytics schema, 6 tables)
```

For detailed information about what each table contains, what each metric means, and useful SQL queries, see `docs/analytics-pipeline-reference.md`.
