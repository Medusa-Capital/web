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
├── track-record/               # Performance showcase
├── colaboradores/              # Collaborator profiles
├── privacidad/                 # Privacy policy
└── api/
    ├── lead-capture/route.ts
    └── newsletter/route.ts

components/
├── landing/                    # Domain components (Hero, Header, Footer, Testimonials, etc.)
│   └── track-record/           # Performance chart, carousel, ROI calculator
├── blog/                       # Blog cards, markdown renderer, newsletter CTA
├── ui/                         # shadcn primitives (button, input, dialog, etc.)
└── providers/                  # AnalyticsProvider (GA4 context)

lib/
├── analytics.ts                # GA4 event tracking helpers (funnel events, CTA tracking, etc.)
├── blog.ts                     # Blog data layer (getAllPosts, getPostBySlug, etc.)
├── blog-processing.ts          # Shared content processing (slug, tags, description, cleanup)
├── notion.ts                   # Notion client configuration
├── utils.ts                    # General utilities
└── utm.ts                      # UTM capture, sessionStorage persistence, and outbound URL enrichment

content/blog/                   # Markdown articles (Spanish) — synced from Notion + manual
content/inbox/                  # Staging area for manual blog posts (processed by inbox script)

scripts/
├── sync-analytics.ts           # GA4 → Supabase daily analytics sync (6 reports → 6 tables)
├── sync-notion.ts              # Notion DB → markdown sync (runs via CI or locally)
├── process-blog-inbox.ts       # Process manual blog posts from content/inbox/
├── basket-data/                # Track record data & Python analysis (gitignored)
└── ...                         # Other utility scripts (logos, UTM links)

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
