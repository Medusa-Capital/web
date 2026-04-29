# Medusa Capital Website

Spanish-language marketing site for a thesis-driven crypto investing platform. Deployed on Vercel at staging.medusacapital.xyz.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, TypeScript 5 strict)
- **Styling:** Tailwind CSS v4, framer-motion, Lenis smooth scroll
- **Components:** shadcn (radix-ui primitives), lucide-react icons
- **Content:** Markdown blog with gray-matter frontmatter, synced from Notion
- **Analytics:** GA4 via @next/third-parties, custom event tracking in `lib/analytics.ts`, daily GA4 → Supabase sync pipeline
- **Package Manager:** Bun (never npm/yarn/pnpm)
- **Deploy:** Vercel (builds from git content; Notion sync runs separately via GitHub Actions)
- **Testing:** Playwright for e2e tests (`bun run test:e2e`)

## Project Structure

```
app/
├── page.tsx                    # Landing page (home)
├── blog/                       # Blog listing + [slug] + tags/[tag]
├── ideas/                      # Member feedback board (Featurebase-style)
│   ├── layout.tsx              # Auth gate (requireMember) + IdeasHeader
│   ├── page.tsx                # List view: hero, filters, post cards
│   ├── [id]/page.tsx           # Post detail: vote, markdown body, comments
│   └── actions.ts              # Server actions: createPost, toggleVote, addComment, changeStatus
├── sistema-medusa/             # Member-only Sistema Medusa research library
│   ├── layout.tsx              # Auth gate (requireMember) + SistemaMedusaHeader
│   ├── page.tsx                # Filterable analysis list (verdict/category/chain/q filters)
│   └── [ticker]/
│       ├── page.tsx            # Full analysis detail — all sections + admin delete button
│       └── actions.ts          # deleteAnalysis server action (requireInternalCore gated)
├── login/                      # Whop OAuth login page
├── not-a-member/               # Gate for authenticated non-members
├── track-record/               # Performance showcase
├── colaboradores/              # Collaborator profiles
├── privacidad/                 # Privacy policy
└── api/
    ├── lead-capture/route.ts
    ├── newsletter/route.ts
    ├── ideas/similar/route.ts  # Similar post search for propose modal
    ├── sistema-medusa/         # Internal read API (analyses list + ticker detail + versions)
    ├── webhooks/calendly/route.ts  # Calendly booking → Airtable sync
    └── auth/whop/              # login, callback, logout routes

components/
├── ideas/                      # Feedback board components (Featurebase-style)
│   ├── IdeasHeader.tsx         # Sticky top nav: logo, tabs (+ Sistema Medusa link), user, logout
│   ├── PostCard.tsx            # Post card with vote button, status pill, comment count
│   ├── ListControls.tsx        # Status filter pills + sort controls
│   ├── VoteButton.tsx          # Upvote toggle (detail page)
│   ├── ProposeIdeaModal.tsx    # Create post modal with similar-post suggestions
│   ├── CommentForm.tsx         # Comment input form
│   ├── StatusChanger.tsx       # Internal-only status change form
│   └── status.ts              # Status labels, badge colors, dot colors
├── sistema-medusa/             # Sistema Medusa Library UI components
│   ├── SistemaMedusaHeader.tsx # Sticky nav with active Sistema Medusa + Feedback cross-link
│   ├── AnalysisCard.tsx        # List card: verdict badge, category, chain, date
│   ├── BaseDataTable.tsx       # Base data section (key/value rows)
│   ├── FiltersGrid.tsx         # Discard filters grid with pass/fail pills
│   ├── FundamentalPillarsGrid.tsx  # Pillar scores with status pills
│   ├── ComparativeTable.tsx    # Comparative analysis table
│   ├── ItaBox.tsx              # ITA definitiva highlighted box
│   ├── RisksSection.tsx        # Risks + watchpoints list
│   ├── VerdictBox.tsx          # Final verdict + summary + section narrative
│   ├── SourcesList.tsx         # Numbered sources list with links
│   ├── VerdictBadge.tsx        # Inline verdict pill (APTO / NO APTO / VIGILAR)
│   ├── MethodologyTag.tsx      # Methodology version tag
│   ├── VersionNavigator.tsx    # Version picker dropdown
│   ├── DeleteAnalysisButton.tsx # Admin-only delete (client, confirm dialog, useTransition)
│   ├── ComplianceDisclaimer.tsx # "No es asesoramiento financiero" footer
│   └── ...                     # HeroSection, ListControls, EmptyLibrary, NoResults, etc.
├── landing/                    # Domain components (Hero, Header, Footer, Testimonials, etc.)
│   └── track-record/           # Performance chart, carousel, ROI calculator
├── blog/                       # Blog cards, markdown renderer, newsletter CTA
├── ui/                         # shadcn primitives (button, input, dialog, etc.)
└── providers/                  # AnalyticsProvider (GA4 context)

lib/
├── sistema-medusa/             # Sistema Medusa data layer, schemas, and tooling
│   ├── schemas.ts              # Canonical Zod payload schema (single source of truth)
│   ├── queries.ts              # DB read layer — reads from published_versions view
│   ├── types.ts                # AnalysisView discriminated union (member vs public)
│   ├── visibility.ts           # Field visibility map (member-only vs public)
│   ├── methodologies.ts        # Methodology registry — append-only, never remove keys
│   ├── canonicalize.ts         # Payload normalization for dedup hash
│   ├── enum-values.ts          # Pure enum value arrays (no Drizzle imports)
│   ├── enums/                  # Client-safe Zod enums + Spanish label maps
│   └── __tests__/              # 70+ unit tests (ingest, schema, queries, API, visibility)
├── analytics.ts                # GA4 event tracking helpers (funnel events, CTA tracking, etc.)
├── blog.ts                     # Blog data layer (getAllPosts, getPostBySlug, etc.)
├── blog-processing.ts          # Shared content processing (slug, tags, description, cleanup)
├── notion.ts                   # Notion client configuration
├── utils.ts                    # General utilities
└── utm.ts                      # UTM capture, sessionStorage persistence, and outbound URL enrichment

content/
├── blog/                       # Markdown articles (Spanish) — synced from Notion + manual
├── inbox/                      # Staging area for manual blog posts (processed by inbox script)
└── sistema-medusa/
    ├── inbox/<ticker>/         # Drop <ticker>.json here, then bun run sm:validate + sm:ingest
    └── published/<ticker>/     # Archived versions after ingest (v1.json, v2.json, …)

scripts/
├── sistema-medusa/             # Sistema Medusa CLI toolchain
│   ├── validate.ts             # bun run sm:validate <path> — schema + consistency check
│   ├── ingest.ts               # bun run sm:ingest <path> — publish to DB + archive
│   ├── unpublish.ts            # bun run sm:unpublish <ticker> <version> [--reason "…"]
│   └── seed-aero.ts            # Dev seed for AERO analysis (testing)
├── sync-analytics.ts           # GA4 → Supabase daily analytics sync (6 reports → 6 tables)
├── sync-notion.ts              # Notion DB → markdown sync (runs via CI or locally)
├── process-blog-inbox.ts       # Process manual blog posts from content/inbox/
├── basket-data/                # Track record data & Python analysis (gitignored)
└── ...                         # Other utility scripts (logos, UTM links)

db/
├── schema/
│   ├── sistema-medusa.ts       # analyses, analysis_versions, publish_events + published_versions view
│   ├── enums.ts                # Shared pgEnum definitions (verdict, category, chain, etc.)
│   └── ...                     # users, sessions, feedback tables
└── migrations/                 # 0002 (sistema_medusa schema) + 0003 (constraints, triggers, indexes)

docs/
├── analytics-pipeline-reference.md  # Full event catalog, UTM flow, conversion funnel, table schemas, SQL queries — UPDATE THIS when adding/changing events
├── analytics-pipeline-setup-guide.md # Step-by-step replication guide (GCP, WIF, Supabase, etc.)
└── ...                              # Other docs (analytics-setup.md, PRDs)

figma/                          # Embedded Vite SPA for design reference (built separately)
public/fonts/                   # Cormorant-Bold (headings), Inter (body)
public/img/                     # Images, avatars, icons
public/img/blog/                # Blog images (cover + inline, downloaded from Notion)
```

## Blog Content Pipeline

Articles can come from two sources:

1. **Notion sync** (primary) — Articles in the Notion DB with `Publicado en web` checked are synced via `bun run sync-notion`. A GitHub Actions workflow (`.github/workflows/sync-notion.yml`) runs this daily, commits changes, and pushes to `main` — which triggers a Vercel deploy. The sync script:
   - Converts Notion blocks to markdown via `notion-to-md`
   - Downloads cover images, resizes to max 1200px wide (JPEG 85%) with `sharp`
   - Downloads inline images to `public/img/blog/[slug]/`, with retry via fresh block fetch for expired signed URLs
   - Strips "ARTÍCULO:" prefix from Notion titles before generating slugs (prevents `articulo-*` prefixed files)
   - Uses the Notion `Slug` field if set; falls back to auto-generated slug from title
   - Auto-generates description and tags if not set in Notion
   - Strips duplicate cover image from content (Notion duplicates cover as first block)
   - Strips filename alt text from images without captions
   - Inserts `<!-- newsletter -->` CTA marker at a natural midpoint
   - Cleans up Notion formatting artifacts (metadata fields, heading format, Twitter/X links, empty blockquotes)
   - Tracks synced slugs in `.notion-sync.json` manifest for unpublish detection

2. **Manual inbox** — Drop markdown files in `content/inbox/`, run `bun run inbox` to process them.

**Vercel build:** `vercel.json` uses `bun run build` (standard Next.js build from git content, no Notion API calls). Notion sync is decoupled — it runs in CI via `.github/workflows/sync-notion.yml` (daily at 9 AM UTC + manual trigger), commits content changes, and pushes to `main` to trigger Vercel auto-deploy.

**Notion DB properties:** Nombre (title), Slug (rich_text — **always set this for existing articles** to preserve URL stability), Descripción (rich_text), Fecha Publicación (date), Responsable (people → author), Publicado en web (checkbox → publish filter), Tags (multi_select), Tema (select → derives both category and type), Featured (checkbox). Tema values: "Análisis Mercado" → market-analysis/Análisis, "Educación Cripto" → article/Educación, "Research" → article/Research, "DeFi" → article/DeFi, "Trading" → article/Trading.

**Blog categories and routing:**
- `/blog` — shows only `category: "article"` posts (featured section + regular grid)
- `/blog/analisis-mercado` — shows only `category: "market-analysis"` posts
- **Important:** The sync script maps Tema "Análisis Mercado" → `category: "market-analysis"`, which means those articles will NOT appear on `/blog`. If an article with Tema "Análisis Mercado" should appear on `/blog`, its category must be manually overridden to `"article"` in the committed markdown after syncing.

**How Notion changes propagate:** Edits in Notion (title, content, tags, etc.) are NOT reflected on the website until the next sync runs (daily at 9 AM UTC or manually via `bun run sync-notion`). The sync commits updated markdown to `main`, which triggers a Vercel deploy. Deploys alone do NOT re-fetch from Notion — they only build from committed markdown. **Important:** If an article has no explicit `Slug` field set in Notion and you change the title, the slug (and therefore URL) will change, breaking existing links. Always set the Slug field for published articles.

**Env vars needed:** `NOTION_API_KEY`, `NOTION_DATABASE_ID` (in `.env.local` locally, GitHub repo secrets for CI).

## Auth (Whop OAuth + iron-session)

Member login flows through `/login` → `/api/auth/whop/login` → Whop authorize → `/api/auth/whop/callback` → DB upsert + iron-session → `/ideas`.

- **Provider:** Whop OAuth 2.1 + PKCE. The `client_secret` needs `oauth:token_exchange` permission (toggled per OAuth app in the Whop dashboard).
- **State carries flow data:** PKCE verifier + nonce + returnTo are sealed (iron-session `sealData`) into the OAuth `state` param itself. We **don't** use a flow cookie — Chrome/Safari both drop cross-site cookies on OAuth redirects, even with `__Host-` + `SameSite=None`. State HMAC preserves CSRF.
- **Membership gate:** `verifyMembership(whopUserId)` calls `GET /api/v1/memberships?company_id=biz_xxx&user_ids[]=user_xxx&statuses[]=active&statuses[]=trialing&statuses[]=completed`, then client-side filters by `WHOP_MEDUSA_PRODUCT_ID`. The `completed` status covers one-time/lifetime purchases (vs `active` for recurring subs).
- **Session:** `__Host-medusa-session` iron-session cookie, 7-day rolling TTL. Tokens stored AES-GCM encrypted in `user_tokens` table, **not** in the cookie.
- **Lazy re-check:** every 10 min, `requireMember()` re-calls Whop to refresh tiers / detect membership cancellation.
- **Logout** uses 303 redirect to convert POST → GET on the follow-up to `/login`.
- **Webhook:** `POST /api/webhooks/whop` with HMAC-SHA256 over `${timestamp}.${rawBody}` and ±5min replay window. Whop event names use snake_case: `membership_deactivated` (covers cancellation + expiry + invalid) and `payment_failed`.

Guards live in `lib/auth/require.ts`:
- `requireMember()` — RSC redirect; `requireMemberCore()` — Result-returning for actions
- `requireInternal()` — re-reads role from DB (never trusts session cache)
- `requireEntitlement(tier)` — trusts `session.tiers` (kept fresh by lazy re-check)

## Database (Drizzle + Neon)

- **Driver:** `drizzle-orm/neon-serverless` with `Pool` (WebSocket) — the `neon-http` driver doesn't support transactions. All routes run on the Node.js runtime; no edge runtime declared.
- **Schema:** `db/schema/*` (users, sessions, tokens, feedback). Drizzle barrel re-export at `db/schema/index.ts`. Generate migrations with `bunx drizzle-kit generate`.
- **Feedback schema:** all feedback tables live in a dedicated Postgres schema `feedback` (posts / votes / comments / post_status_history). Composite PK on `(post_id, user_id)` makes upvote toggling race-safe.
- **author_id is nullable** on posts + comments (SET NULL on user soft-delete) — UI shows "Miembro anterior" for orphaned rows.

## Feedback Board (`/ideas`)

Featurebase-inspired design. Dark card surfaces (`#111118`), `white/[0.06]` borders, zinc text scale, lucide-react icons throughout.

- **Layout:** `app/ideas/layout.tsx` — `requireMember()` auth gate + `IdeasHeader` (sticky top nav with Medusa logo, Feedback/Roadmap/Novedades tabs, user avatar, logout). Uses session data returned by `requireMember()` directly — never double-read the session.
- **List page:** `app/ideas/page.tsx` — centered hero section ("Comparte tu feedback" + lightbulb icon), status filter pills with colored dots, sort controls (votes/newest), post cards. `dynamic = "force-dynamic"`, never cached (per-viewer vote state).
- **Detail page:** `app/ideas/[id]/page.tsx` — post in card container, vote button, markdown body, status badge, comment section with user avatars. Comment form above comment list.
- **Server actions:** `app/ideas/actions.ts` — `createPost`, `toggleVote`, `addComment`, `changeStatus`. Every action: assert same-origin (CSRF), Zod-validate, return `ActionResult<T>` discriminated union.
- **Vote toggle:** `INSERT … ON CONFLICT DO NOTHING` followed by separate `DELETE` (never delete-then-insert — would briefly drop the vote in a race).
- **Status changes:** internal-only. Atomic transaction: update `posts.status` + insert `post_status_history` row. Email fanout (best-effort) outside the transaction.
- **Status colors:** `status.ts` exports `STATUS_LABELS`, `STATUS_TONE` (badge classes), and `STATUS_DOT` (dot indicator classes). Colors: open=purple, planned=indigo, in_progress=sky, shipped=green, declined=zinc.
- **Similar posts:** `GET /api/ideas/similar?q=…` for the propose-idea modal. ILIKE input is escaped (`%`, `_`, `\`) before query — see `escapeIlike()` in `lib/feedback/queries.ts`.

## Sistema Medusa Library (`/sistema-medusa`)

Member-only research library for Sistema Medusa analyses. Editorial dark product surface — Neo-Noir / Cyber-Luxury aesthetic with Cormorant Bold headings, semantic verdict colors, and full desktop-width layouts.

- **List page layout:** `max-w-[1500px]`, sticky `w-56` left sidebar (lg+) for filters + auto-fill card grid (`repeat(auto-fill, minmax(min(100%, 340px), 420px))`). Cards are bounded at 420px so a single card never stretches awkwardly. Hero is horizontal on lg+ (title + subtitle on left, stat panel inline on right). Filters are vertical sidebar items on desktop, stacked above grid on mobile.
- **Detail page layout:** `max-w-[1500px]` full-width verdict-tinted editorial header (Cormorant Bold project name, `text-5xl`–`text-7xl`), then two-column flex below on xl: main content column + `w-72` sticky sidebar (verdict card, ficha técnica, version navigator, tags). After the executive summary, a 3-cell `ScoreSummaryStrip` shows filter pass count, pillar pass count, and ITA verdict at a glance with mini progress bars.
- **Section editorial treatment:** PASO N eyebrows in `#6366f1`, Cormorant `text-[32px]` section titles, scorecard headers with pass/fail dots. Filters and pillars use 2-col grids on lg+ with circular ring "medallions" (Check / X / Minus / HelpCircle lucide icons) for instant green-light scanability. Risks columns have iconified headers (AlertTriangle / Settings / Eye). Comparative table includes inline P/S and value-capture mini bars. Final `VerdictBox` renders the verdict label as a `text-[60px]` Cormorant statement in the verdict tint, not a pill.
- **Verdict colors:** AVANZA_A_AT=emerald, EN_REVISION=amber, DESCARTE=red, AT_BLOQUEA=orange, EN_CARTERA=indigo. Applied to badges, card left borders, hover glows, detail page ambient glow, and sidebar verdict bar.
- **Routes:** `app/sistema-medusa/layout.tsx` gates once with `requireMember({ returnTo })`; `page.tsx` renders the filterable list; `[ticker]/page.tsx` renders a detail article with `ComplianceDisclaimer`. `generateMetadata` is noindex for v1.
- **Local dev auth bypass:** set `SKIP_AUTH=true` in `.env.local` to skip the Whop gate in both middleware and layout. Never set this in production env vars.
- **Auth allowlist:** `lib/auth/return-to.ts` allows `/sistema-medusa` and `/sistema-medusa/[ticker]`; only detail routes preserve `?v=\d{1,4}`. Middleware injects `x-pathname` for layout-level returnTo.
- **DB schema:** `db/schema/sistema-medusa.ts` defines `sistema_medusa.analyses`, `analysis_versions`, and `publish_events`. `latest_version_id` is nullable; `analysis_versions.analysis_id` is `ON DELETE RESTRICT`; `publish_events` is an outbox for `published`, `superseded`, `unpublished`.
- **Migrations:** generated schema migration is paired with journaled custom SQL `0003_sistema_medusa_constraints_and_triggers.sql`. Manual SQL creates `published_versions`, `pg_trgm` search index, partial active payload-hash unique index, column-only CHECKs, and `analysis_versions_refresh_current`.
- **Reads:** `lib/sistema-medusa/queries.ts` reads from `published_versions`, never `analysis_versions` directly. JSONB payloads are re-parsed with `analysisSchema.parse()` at the boundary.
- **Payload schema:** `lib/sistema-medusa/schemas.ts` is the single canonical Zod schema. It enforces safe `https://` URLs, prose XSS guards, array/string bounds, semantic filter/pillar IDs, methodology registry membership, and verdict consistency.
- **Visibility:** `FIELD_VISIBILITY` in `lib/sistema-medusa/visibility.ts` is path-based with `[]` array markers and default-deny behavior. `pickPublic()` strips member-only fields server-side before serialization.
- **Enum split:** pure values live in `lib/sistema-medusa/enum-values.ts`; DB pgEnums live in `db/schema/enums.ts`; client-safe Zod enums and Spanish labels live in `lib/sistema-medusa/enums/`. Do not import Drizzle into client label modules.
- **Methodologies:** `lib/sistema-medusa/methodologies.ts` is append-only. Mark old methodologies `deprecated: true`; never remove keys while DB rows reference them.
- **Ingest commands:** `bun run sm:validate <path>`, `bun run sm:ingest <path>`, `bun run sm:ingest:dry <path>`, `bun run sm:unpublish <ticker> <version> [--reason "..."]`. Every CLI supports `--json`; no `--from-stdin` in v1.
- **Authoring for Alex:** author canonical JSON under `content/sistema-medusa/inbox/<ticker>/<ticker>.json`, run `bun run sm:validate`, then `bun run sm:ingest`. Successful inbox ingests archive to `content/sistema-medusa/published/<ticker>/v<n>.json`. `--force` preserves history by superseding the active version, not overwriting it.
- **Testing:** focused gate is `bun test lib/sistema-medusa/__tests__/`. E2E specs live at `e2e/sistema-medusa.spec.ts` and are intentionally skipped until a robust HTTPS/member-session fixture exists.

## Email (Resend)

- **Client:** `lib/email/client.ts` — fail-soft (try/catch + `captureError`). Email failures never block the underlying user action.
- **Templates:** `lib/email/templates.ts` — plain HTML strings, Spanish copy, dark theme. Move to react-email if templates grow past ~5.
- **Unsubscribe:** `lib/email/unsubscribe-token.ts` — HMAC tokens HKDF-derived from `SESSION_SECRET`. `GET` + `POST` `/api/unsubscribe?token=…` both flip `users.email_notifications_enabled`. Idempotent. `List-Unsubscribe` + `List-Unsubscribe-Post` headers on every email for inbox-provider one-click.
- **Recipient filter:** every fanout query enforces `WHERE deleted_at IS NULL AND email_notifications_enabled = true`.

## Security

- **CSRF:** `lib/csrf.ts` `assertSameOrigin()` requires `Origin === NEXT_PUBLIC_APP_URL` OR `Sec-Fetch-Site: same-origin`. Called by every server action.
- **Open redirect:** `returnTo` is regex-allowlisted in `lib/auth/return-to.ts` (only `/`, `/ideas`, `/ideas/[slug]`).
- **XSS:** `react-markdown` with `skipHtml`, element allowlist, and `https://`-only links forced `rel="nofollow noopener" target="_blank"`.
- **Tokens:** AES-256-GCM encrypted in DB; key HKDF-derived from `SESSION_SECRET` (no separate key env var).
- **Webhook:** raw body preserved before any JSON parse; HMAC compared in constant time; ±5min replay window enforced.
- **id_token:** verified via JWKS (`jose`); issuer + audience + expiry + nonce match all enforced fail-closed.

## Design

Design system: `~/Code/design-system/`
Profile: `./design-profile.md` (preferred brands: coinbase + stripe, Neo-Noir / Cyber-Luxury, purple/blue accents)

For any UI work, invoke the `design-system` skill. It reads `design-profile.md` and loads the right brand reference (coinbase for product pages, stripe for marketing/landing pages), component patterns, and guidelines automatically.

Aesthetic: Neo-Noir / Cyber-Luxury — dark backgrounds, purple/blue gradients, institutional authority, crypto-native.

## Conventions

- **All UI copy is in Spanish** — never switch to English in user-facing text
- **Dark mode only** — `dark` class on `<html>`, no light theme
- **Brand palette:** Neo-Noir / Cyber-Luxury. Purple/blue accents (#6366f1, #B9B8EB), dark backgrounds
- **Fonts:** Cormorant Bold for headings (`--font-heading`), Inter for body
- **No Prettier** — ESLint only (next/core-web-vitals + typescript)
- **Git worktrees** at `.worktrees/` for feature branch isolation (gitignored)
- **Main branch:** `main`
- **GitHub repo:** `Medusa-Capital/web`

## Key Patterns

- **Next.js 16 params are `Promise<>`** — must `await params` in dynamic routes
- **PageCTA component** is reused across pages for bottom CTAs (takes title, description, button props)
- **CollaboratorCard** renders from a typed `CollaboratorData` array with credentials, stats, socials
- **Testimonials** use 3-column infinite scroll with duplicated arrays for seamless animation
- **Track record data** comes from CSV analysis in `scripts/basket-data/`, hardcoded into chart components
- **Blog** uses static markdown files in `content/blog/`, parsed with gray-matter + react-markdown
- **Blog images** use `<figure>/<figcaption>` — alt text renders as caption below the image
- **Blog article page** splits content at `<!-- newsletter -->` marker for mid-article CTA
- **Analytics** tracked via `lib/analytics.ts` helpers. Conversion funnel: `book_call_click` (CTA intent) → `call_booked` (Calendly confirmation) / `lead_capture` (form submission). All events include UTM params from `lib/utm.ts`
- **UTM forwarding** — UTM params captured on landing (sessionStorage) and appended to all outbound Calendly URLs (`getOutboundUrl()`), Calendly iframe embeds, and lead capture API payloads. See `lib/utm.ts`
- **Calendly webhook** — `POST /api/webhooks/calendly` receives Calendly `invitee.created` and `invitee.canceled` events. On `invitee.created`: (1) idempotency check via Calendly event URI on Bookings; (2) find/create Person + promote Lifecycle to Engaged; (3) create Submission linked to Person + Calendly Form Version v1 (`recbVJCYRsHd75T9i`) + UTMs; (4) batch-create one Answer per `questions_and_answers` item — exact question text → Question record ID via `CALENDLY_QUESTION_MAP`; unknown questions fall back to `cal_unmapped`; for select-type questions (portfolio range, situation, WhatsApp consent) the exact answer label → Option record ID via `CALENDLY_OPTION_MAP` and the Answer links to that Option instead of storing free text; free-text questions and option drift fall back to `answer_text`; (5) create Booking linked to the Submission. On `invitee.canceled`: update Booking status to Cancelada/Re-agendada only — Submission + Answers are immutable. Signature verification is optional (plan-dependent). Env vars: `AIRTABLE_API_TOKEN`, `CALENDLY_WEBHOOK_SECRET`. **Calendly leads do NOT trigger the Bienvenida Brevo sequence** — update the `new-lead-subscribe-brevo.js` automation trigger in Airtable to exclude Form Version `recbVJCYRsHd75T9i` if not already done. Full schema in `docs/crm/airtable-crm-schema.md`.
- **Analytics pipeline** syncs GA4 data daily into Supabase `analytics` schema (6 tables: daily_summary, daily_pages, daily_sources, daily_events, daily_devices, daily_geo). Full event catalog and UTM flow documented in `docs/analytics-pipeline-reference.md` — **keep this doc updated when adding or changing tracked events**

## Commands

```bash
bun dev              # Start dev server (Turbopack)
bun run build        # Production build (used by Vercel, builds from git content)
bun run build:notion # Build with Notion sync first (for local dev convenience)
bun run sync-notion  # Sync articles from Notion DB (runs in CI daily, or locally)
bun run inbox        # Process manual blog posts from content/inbox/
bun run lint         # ESLint
bun run test:e2e     # Playwright e2e tests

# Analytics pipeline (manual runs / backfill)
bun scripts/sync-analytics.ts                    # sync yesterday
bun scripts/sync-analytics.ts --date 2026-02-14  # sync specific date
bun scripts/sync-analytics.ts --days 30          # backfill last 30 days
```

## Known Issues

- Turbopack cache corruption happens occasionally — fix: delete `.next/` and restart dev server
- `figma/node_modules/` was accidentally committed — needs cleanup (14k+ tracked files)
- `figma/` builds separately via `bun run build:figma` (Vite SPA served under /figma route)
