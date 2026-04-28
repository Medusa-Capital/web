# Analytics Pipeline Reference

Complete reference for the GA4 → Supabase analytics pipeline. Covers what we track, what each metric means, where data lives, and how to query it.

## Architecture

```
Visitor lands on site
  → GA4 JavaScript snippet (G-7Y5RK2XFHR) fires events to Google servers
  → Google aggregates raw events into queryable dimensions + metrics
  → Daily at 6 AM UTC, GitHub Actions triggers scripts/sync-analytics.ts
  → Script calls GA4 Data API (6 reports in parallel)
  → Script upserts results into Supabase (analytics schema, 6 tables)
```

**Data flow timing:** Visitors generate events in real-time → Google processes them (up to 24-48h delay for some metrics) → our pipeline fetches yesterday's finalized data each morning.

**Why two systems:**
- **GA4 dashboard** (analytics.google.com) — real-time exploration, ad-hoc analysis, built-in visualizations
- **Supabase** (our copy) — queryable via SQL, joinable with business data (leads, subscriptions), dashboardable in any BI tool, data ownership

## Client-Side Event Collection

Events are sent to GA4 via the JavaScript snippet loaded by `@next/third-parties`. Custom events are fired from `lib/analytics.ts`.

### Automatic Events (GA4 built-in)

These fire automatically without any code — GA4 Enhanced Measurement handles them:

| Event | What triggers it |
|-------|-----------------|
| `page_view` | Every route navigation (SPA and full page loads) |
| `session_start` | First event in a new session (30-min inactivity timeout) |
| `first_visit` | User's first-ever visit (sets new user flag) |
| `user_engagement` | Page was in foreground for 10+ seconds |
| `scroll` | User scrolls past 90% of page height |
| `click` | Outbound link clicks (Enhanced Measurement) |

### Custom Events — Conversion Funnel (lib/analytics.ts)

These are the key events that define our acquisition funnel. `lead_capture` and `call_booked` should be marked as **key events** (conversions) in GA4 Admin → Events.

```
page_view (UTMs) → visitor landed
  ├─ book_call_click (UTMs + placement) → visitor showed intent
  │   └─ call_booked (UTMs) → visitor converted (Calendly booking confirmed)
  └─ lead_capture (UTMs) → lead form submitted (LeadCaptureModal)
```

| Event Name | Trigger | Key Parameters | Key Event? | Helper |
|------------|---------|---------------|------------|--------|
| `book_call_click` | Any Calendly CTA clicked | `placement` (hero, header, final_cta, mission, blog_cta, roi_calculator), UTM params | Optional | `trackBookCallClick()` |
| `lead_capture` | LeadCaptureModal form success | UTM params | **Yes** | `trackLeadCapture()` |
| `call_booked` | Calendly `calendly.event_scheduled` postMessage on embedded iframe | UTM params | **Yes** | `trackCallBooked()` |

**Note:** `call_booked` only fires from the Calendly **embed** on `/gracias-5-errores`. Bookings via `window.open` (most CTAs) happen on Calendly's domain and can't be tracked client-side — those are tracked in Calendly's own analytics, attributed via UTM params forwarded in the URL.

### Custom Events — General Tracking (lib/analytics.ts)

| Event Name | Trigger | Key Parameters | Helper |
|------------|---------|---------------|--------|
| `campaign_detected` | UTM parameters found in URL on landing | All UTM params | AnalyticsProvider |
| `cta_click` | Generic CTA click (PDF lead magnet) | `cta_name`, `destination` | `trackCTAClick()` |
| `form_interaction` | Lead capture form lifecycle | `form_name`, `action` (start/submit/error/success) | `trackFormEvent()` |
| `video_interaction` | Video player events | `video_name`, `action` (play/pause/complete/progress), `progress_percent` | `trackVideoEvent()` |
| `modal_interaction` | Dialog open/close/submit | `modal_name`, `action` | `trackModalEvent()` |
| `outbound_click` | External link clicks (social, collaborators) | `url`, `link_text` | `trackOutboundLink()` |
| `navigation_click` | Header nav link clicks | `destination` | `trackEvent()` direct |
| `section_view` | Scroll-triggered section visibility | `section_name` | `trackSectionView()` |
| `pdf_cta_click` | PDF lead magnet CTA | `funnel` | `trackPdfFunnelEvent()` |
| `faq_expand` | FAQ accordion interaction | — | `trackEvent()` direct |
| `module_view` | Module visibility tracking | — | `trackEvent()` direct |

### Custom Events — Sistema Medusa Library

These events measure member research-library usage. They are engagement events, not conversion events.

| Event Name | Trigger | Key Parameters | Helper |
|------------|---------|---------------|--------|
| `sistema_medusa_view_list` | Member lands on `/sistema-medusa` | `result_count`, `has_filters`, `sort`, `offset` | `trackSistemaMedusaEvent("view_list")` |
| `sistema_medusa_view_detail` | Member lands on `/sistema-medusa/[ticker]` | `ticker`, `version_number`, `verdict`, `methodology_version` | `trackSistemaMedusaEvent("view_detail")` |
| `sistema_medusa_filter_applied` | Member clicks verdict/category/chain/sort controls | `filter_type`, `filter_value` | `trackSistemaMedusaEvent("filter_applied")` |
| `sistema_medusa_search` | Member uses list search | `query_length`, `has_query` | `trackSistemaMedusaEvent("search")` |
| `sistema_medusa_version_navigated` | Member selects a historical version | `ticker`, `version_number` | `trackSistemaMedusaEvent("version_navigated")` |

### UTM Parameter Flow

UTM params are captured on landing and forwarded through the entire conversion chain:

```
Visitor arrives with UTMs in URL (e.g., ?utm_source=x&utm_medium=social)
  → AnalyticsProvider calls initUTMTracking() → stored in sessionStorage
  → Persists across SPA navigation within the same tab/session
  → Forwarded to:
     1. All GA4 events (page_view, book_call_click, lead_capture, call_booked)
     2. All outbound Calendly URLs (appended as query params via getOutboundUrl())
     3. Calendly iframe embeds (appended to iframe src)
     4. Lead capture API → Airtable webhook (included in POST body)
```

**Key files:**
- `lib/utm.ts` — UTM extraction, storage, and URL enrichment
- `lib/analytics.ts` — All event tracking helpers
- `components/providers/AnalyticsProvider.tsx` — Initializes UTM tracking + page view events

## Supabase Schema

All tables live in the `analytics` schema (separate from `public` to avoid exposing via Supabase REST API).

### analytics.daily_summary

One row per day. High-level site health metrics.

| Column | Type | Description |
|--------|------|-------------|
| `date` | DATE (PK) | The calendar date |
| `total_users` | INT | Unique users who triggered at least one event. A "user" is identified by a client ID cookie — same browser = same user, different browser/device = different user |
| `new_users` | INT | Users whose `first_visit` event occurred on this date. Subset of `total_users` |
| `sessions` | INT | Total sessions. A session starts with `session_start` and expires after 30 minutes of inactivity or at midnight. One user can have multiple sessions |
| `pageviews` | INT | Total `page_view` events. Includes repeated views of the same page by the same user |
| `bounce_rate` | FLOAT | Percentage (0-1) of sessions that were NOT "engaged". An engaged session lasts 10+ seconds, has 2+ page views, or has a conversion event. Bounce = 1 - engaged rate |
| `avg_session_duration` | FLOAT | Average session length in seconds across all sessions. Only counts time while page is in foreground (visibility API) |
| `created_at` | TIMESTAMPTZ | When this row was inserted/last updated |

**Key insight:** `bounce_rate` in GA4 is the inverse of "engagement rate". A bounce rate of 0.45 means 45% of sessions were not engaged (lasted <10s with only 1 pageview and no conversions).

### analytics.daily_pages

One row per page per day. Top 50 pages ranked by pageviews.

| Column | Type | Description |
|--------|------|-------------|
| `date` | DATE | The calendar date |
| `page_path` | TEXT | URL path (e.g., `/`, `/blog/bitcoin-etf-analysis`, `/track-record`). Does not include domain or query params |
| `pageviews` | INT | Total `page_view` events for this path on this date |
| `unique_users` | INT | Distinct users who viewed this page on this date |
| `avg_time_on_page` | FLOAT | Average time (seconds) users spent with this page in the foreground. Uses GA4's `averageSessionDuration` scoped to the page dimension |
| `created_at` | TIMESTAMPTZ | Row timestamp |

**Limit:** 50 pages per day (ordered by pageviews desc). Pages outside the top 50 are not stored.

**Unique constraint:** `(date, page_path)` — re-running the sync for the same date updates existing rows.

### analytics.daily_sources

One row per traffic source per day. Top 50 sources ranked by sessions.

| Column | Type | Description |
|--------|------|-------------|
| `date` | DATE | The calendar date |
| `source` | TEXT | Where the traffic came from. Examples: `google`, `twitter`, `instagram`, `(direct)`. Maps to the `utm_source` parameter or auto-detected referrer |
| `medium` | TEXT | The marketing channel. Examples: `organic`, `social`, `email`, `cpc`, `referral`, `(none)`. Maps to `utm_medium` or auto-classified by GA4 |
| `sessions` | INT | Sessions attributed to this source/medium combination |
| `users` | INT | Unique users from this source/medium |
| `created_at` | TIMESTAMPTZ | Row timestamp |

**Source/medium pairs explained:**
- `google / organic` — Google search results (SEO)
- `twitter / social` — Links from Twitter/X
- `(direct) / (none)` — No referrer detected (typed URL, bookmarks, some apps)
- `newsletter / email` — Email campaigns (from UTM tags)
- `google / cpc` — Google Ads paid clicks

### analytics.daily_events

One row per event name per day. Top 100 events ranked by count.

| Column | Type | Description |
|--------|------|-------------|
| `date` | DATE | The calendar date |
| `event_name` | TEXT | The GA4 event name (e.g., `page_view`, `cta_click`, `session_start`, `scroll`) |
| `event_count` | INT | Total number of times this event fired on this date |
| `unique_users` | INT | Distinct users who triggered this event |
| `created_at` | TIMESTAMPTZ | Row timestamp |

**Includes both automatic and custom events.** You'll see GA4 built-in events (`page_view`, `session_start`, `user_engagement`, `scroll`, `first_visit`) alongside your custom events (`cta_click`, `form_interaction`, `outbound_click`, etc.).

**What to watch for:**
- `cta_click` count vs `form_interaction` with action=submit → CTA-to-form conversion
- `scroll` count vs `page_view` count → scroll engagement rate
- `outbound_click` → which external links users follow

### analytics.daily_devices

One row per device/browser/OS combination per day. Top 50 by users.

| Column | Type | Description |
|--------|------|-------------|
| `date` | DATE | The calendar date |
| `device_category` | TEXT | `desktop`, `mobile`, or `tablet` |
| `browser` | TEXT | Browser name: `Chrome`, `Safari`, `Firefox`, `Edge`, `Samsung Internet`, etc. |
| `os` | TEXT | Operating system: `Windows`, `Macintosh`, `iOS`, `Android`, `Linux`, etc. |
| `users` | INT | Unique users with this device/browser/OS combination |
| `sessions` | INT | Sessions from this combination |
| `created_at` | TIMESTAMPTZ | Row timestamp |

**Why this matters:** Helps prioritize testing. If 80% of users are on mobile Safari, that's where bugs hurt most.

### analytics.daily_geo

One row per country/city pair per day. Top 100 by users.

| Column | Type | Description |
|--------|------|-------------|
| `date` | DATE | The calendar date |
| `country` | TEXT | Country name (e.g., `Spain`, `Mexico`, `Argentina`, `United States`). `(not set)` if geolocation failed |
| `city` | TEXT | City name (e.g., `Madrid`, `Mexico City`, `Buenos Aires`). `(not set)` if not resolved |
| `users` | INT | Unique users from this location |
| `sessions` | INT | Sessions from this location |
| `created_at` | TIMESTAMPTZ | Row timestamp |

**Privacy note:** GA4 uses IP-based geolocation (not GPS). City-level data can be inaccurate, especially on mobile networks/VPNs. Country-level is reliable.

## Sync Script

**Location:** `scripts/sync-analytics.ts`

**Dependencies:** `@google-analytics/data`, `@supabase/supabase-js`

### CLI Usage

```bash
bun scripts/sync-analytics.ts                    # sync yesterday
bun scripts/sync-analytics.ts --date 2026-02-14  # sync specific date
bun scripts/sync-analytics.ts --days 30          # backfill last 30 days
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GA4_PROPERTY_ID` | Yes | GA4 numeric property ID |
| `SUPABASE_URL` | Yes | Supabase project API URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase secret key |
| `GA4_CREDENTIALS_JSON` | No | SA JSON key (local dev alternative to ADC) |

### How Auth Works

- **GitHub Actions:** Workload Identity Federation (WIF) provides short-lived credentials automatically via `google-github-actions/auth@v2`. No secrets to rotate.
- **Local dev:** Run `gcloud auth application-default login --scopes="https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform"`, then `gcloud auth application-default set-quota-project <PROJECT_ID>`.

### Idempotency

All upserts use `onConflict` with the table's unique constraint. Running the sync for the same date multiple times updates existing rows — no duplicates.

## GitHub Actions Workflow

**File:** `.github/workflows/sync-analytics.yml`

- **Schedule:** Daily at 6 AM UTC (7 AM CET)
- **Manual trigger:** `workflow_dispatch` from GitHub Actions UI
- **Concurrency:** Only one sync runs at a time (`cancel-in-progress: false` queues rather than cancels)

## GA4 API Quotas

The GA4 Data API is free with generous limits:
- 200,000 requests per day per project
- 10 concurrent requests per property

Our usage: 6 requests per day (daily cron) = ~0.003% of quota. Backfilling 365 days = 2,190 requests = ~1% of quota.

## What We Don't Track (and Why)

| Data | Why not |
|------|---------|
| **User demographics** (age, gender) | Requires enabling Google Signals in GA4, which enables cross-device tracking and has privacy implications. Can be added later. |
| **Event parameters** (e.g., which specific CTA was clicked) | GA4 Data API returns event names but not custom parameters in standard reports. Would need custom dimensions configured in GA4 first. |
| **Real-time data** | Our pipeline fetches daily aggregates. For real-time, use the GA4 dashboard directly. |
| **Core Web Vitals** (LCP, CLS, INP) | These come from `@vercel/speed-insights`, not GA4. Available in the Vercel dashboard only — no API to sync. |
| **Conversion funnels (full)** | We track `book_call_click` → `call_booked` for the embedded Calendly flow. Bookings via `window.open` (most CTAs) are tracked in Calendly analytics via forwarded UTM params, not in GA4. |

## Useful SQL Queries

### Weekly traffic trend
```sql
SELECT
  date_trunc('week', date) AS week,
  SUM(total_users) AS users,
  SUM(sessions) AS sessions,
  SUM(pageviews) AS pageviews,
  ROUND(AVG(bounce_rate)::numeric, 3) AS avg_bounce_rate
FROM analytics.daily_summary
GROUP BY week
ORDER BY week DESC;
```

### Top pages all-time
```sql
SELECT
  page_path,
  SUM(pageviews) AS total_views,
  SUM(unique_users) AS total_users,
  ROUND(AVG(avg_time_on_page)::numeric, 1) AS avg_time
FROM analytics.daily_pages
GROUP BY page_path
ORDER BY total_views DESC
LIMIT 20;
```

### Traffic source breakdown
```sql
SELECT
  source,
  medium,
  SUM(sessions) AS total_sessions,
  SUM(users) AS total_users
FROM analytics.daily_sources
GROUP BY source, medium
ORDER BY total_sessions DESC;
```

### Conversion funnel (daily)
```sql
SELECT
  date,
  MAX(CASE WHEN event_name = 'page_view' THEN event_count END) AS page_views,
  MAX(CASE WHEN event_name = 'book_call_click' THEN event_count END) AS call_clicks,
  MAX(CASE WHEN event_name = 'lead_capture' THEN event_count END) AS leads,
  MAX(CASE WHEN event_name = 'call_booked' THEN event_count END) AS bookings
FROM analytics.daily_events
WHERE event_name IN ('page_view', 'book_call_click', 'lead_capture', 'call_booked')
GROUP BY date
ORDER BY date DESC;
```

### Custom event performance
```sql
SELECT
  event_name,
  SUM(event_count) AS total_fires,
  SUM(unique_users) AS total_users
FROM analytics.daily_events
WHERE event_name IN ('book_call_click', 'lead_capture', 'call_booked', 'cta_click', 'form_interaction', 'outbound_click', 'section_view')
GROUP BY event_name
ORDER BY total_fires DESC;
```

### Country breakdown
```sql
SELECT
  country,
  SUM(users) AS total_users,
  SUM(sessions) AS total_sessions
FROM analytics.daily_geo
WHERE country != '(not set)'
GROUP BY country
ORDER BY total_users DESC
LIMIT 15;
```

### Mobile vs desktop trend
```sql
SELECT
  date,
  device_category,
  SUM(users) AS users
FROM analytics.daily_devices
GROUP BY date, device_category
ORDER BY date DESC, users DESC;
```
