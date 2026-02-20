# Medusa Capital Website

Spanish-language marketing site for a thesis-driven crypto investing platform. Deployed on Vercel at staging.medusacapital.xyz.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, TypeScript 5 strict)
- **Styling:** Tailwind CSS v4, framer-motion, Lenis smooth scroll
- **Components:** shadcn (radix-ui primitives), lucide-react icons
- **Content:** Markdown blog with gray-matter frontmatter, synced from Notion
- **Analytics:** GA4 via @next/third-parties, custom event tracking in `lib/analytics.ts`, daily GA4 → Supabase sync pipeline
- **Package Manager:** Bun (never npm/yarn/pnpm)
- **Deploy:** Vercel (build command overridden in `vercel.json` to run Notion sync before build)
- **Testing:** Playwright for e2e tests (`bun run test:e2e`)

## Project Structure

```
app/
├── page.tsx                    # Landing page (home)
├── blog/                       # Blog listing + [slug] + tags/[tag]
├── track-record/               # Performance showcase
├── colaboradores/              # Collaborator profiles
├── welcome/                    # Post-signup welcome
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
├── analytics.ts                # GA4 event tracking helpers
├── blog.ts                     # Blog data layer (getAllPosts, getPostBySlug, etc.)
├── blog-processing.ts          # Shared content processing (slug, tags, description, cleanup)
├── notion.ts                   # Notion client configuration
├── utils.ts                    # General utilities
└── utm.ts                      # UTM parameter tracking

content/blog/                   # Markdown articles (Spanish) — synced from Notion + manual
content/inbox/                  # Staging area for manual blog posts (processed by inbox script)

scripts/
├── sync-analytics.ts           # GA4 → Supabase daily analytics sync (6 reports → 6 tables)
├── sync-notion.ts              # Notion DB → markdown sync (runs at build time)
├── process-blog-inbox.ts       # Process manual blog posts from content/inbox/
├── basket-data/                # Track record data & Python analysis (gitignored)
└── ...                         # Other utility scripts (logos, UTM links)

docs/
├── analytics-pipeline-reference.md  # What we track, table schemas, useful SQL queries
├── analytics-pipeline-setup-guide.md # Step-by-step replication guide (GCP, WIF, Supabase, etc.)
└── ...                              # Other docs (analytics-setup.md, PRDs)

figma/                          # Embedded Vite SPA for design reference (built separately)
public/fonts/                   # Cormorant-Bold (headings), Inter (body)
public/img/                     # Images, avatars, icons
public/img/blog/                # Blog images (cover + inline, downloaded from Notion)
```

## Blog Content Pipeline

Articles can come from two sources:

1. **Notion sync** (primary) — Articles in the Notion DB with Status = "publish" are fetched at build time via `bun run sync-notion`. The sync script:
   - Converts Notion blocks to markdown via `notion-to-md`
   - Downloads and resizes cover images to 16:9 (1200x675) with `sharp`
   - Downloads inline images to `public/img/blog/[slug]/`
   - Auto-generates slug, description, and tags if not set in Notion
   - Strips duplicate cover image from content (Notion duplicates cover as first block)
   - Strips filename alt text from images without captions
   - Inserts `<!-- newsletter -->` CTA marker at a natural midpoint
   - Cleans up Notion formatting artifacts (metadata fields, heading format, Twitter links)
   - Tracks synced slugs in `.notion-sync.json` manifest for unpublish detection

2. **Manual inbox** — Drop markdown files in `content/inbox/`, run `bun run inbox` to process them.

**Vercel build:** `vercel.json` overrides the build command to `bun run build:notion`, which runs Notion sync before the standard build. A GitHub Actions workflow (`.github/workflows/scheduled-deploy.yml`) triggers a daily Vercel deploy via deploy hook.

**Notion DB properties:** Nombre (title), Slug, Descripción, Fecha Publicación (date), Responsable (people/author), Status (draft/publish), Tags (multi_select), Category (article/market-analysis), Type (Analysis/Education/Research/DeFi/Trading), Featured (checkbox).

**Env vars needed:** `NOTION_API_KEY`, `NOTION_DATABASE_ID` (in `.env.local` locally, Vercel env vars for production).

## Conventions

- **All UI copy is in Spanish** — never switch to English in user-facing text
- **Dark mode only** — `dark` class on `<html>`, no light theme
- **Brand palette:** Neo-Noir / Cyber-Luxury. Purple/blue accents (#6366f1, #B9B8EB), dark backgrounds
- **Fonts:** Cormorant Bold for headings (`--font-heading`), Inter for body
- **No Prettier** — ESLint only (next/core-web-vitals + typescript)
- **Git worktrees** at `.worktrees/` for feature branch isolation (gitignored)
- **Main branch:** `main`
- **GitHub repo:** `Urbistondo/medusa-capital-typescript`

## Key Patterns

- **Next.js 16 params are `Promise<>`** — must `await params` in dynamic routes
- **PageCTA component** is reused across pages for bottom CTAs (takes title, description, button props)
- **CollaboratorCard** renders from a typed `CollaboratorData` array with credentials, stats, socials
- **Testimonials** use 3-column infinite scroll with duplicated arrays for seamless animation
- **Track record data** comes from CSV analysis in `scripts/basket-data/`, hardcoded into chart components
- **Blog** uses static markdown files in `content/blog/`, parsed with gray-matter + react-markdown
- **Blog images** use `<figure>/<figcaption>` — alt text renders as caption below the image
- **Blog article page** splits content at `<!-- newsletter -->` marker for mid-article CTA
- **Analytics** tracked via `lib/analytics.ts` helpers (`trackCTAClick`, `trackOutboundLink`, etc.)
- **Analytics pipeline** syncs GA4 data daily into Supabase `analytics` schema (6 tables: daily_summary, daily_pages, daily_sources, daily_events, daily_devices, daily_geo). See `docs/analytics-pipeline-reference.md`

## Commands

```bash
bun dev              # Start dev server (Turbopack)
bun run build        # Production build (figma + next build)
bun run build:notion # Full build with Notion sync (used by Vercel)
bun run sync-notion  # Sync articles from Notion DB (requires env vars)
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
