# Decouple Blog Content from Deployments — Notion → Neon Pipeline

**Status:** Proposed
**Goal:** Decouple blog content from the website's build/deploy cycle. Publishing, updating, or removing a blog post should never require a git commit or Vercel redeploy.

**Architecture:** A standalone processing script syncs articles from Notion to a Neon Postgres database. The website reads content from Neon at request time using ISR (Incremental Static Regeneration). An API route allows on-demand cache invalidation when content changes.

**Tech Stack:** Neon Postgres (new project), `@notionhq/client`, `@vercel/blob` (image storage), Drizzle ORM, Next.js ISR

---

## Why

Today, adding a blog post requires:

1. Export from Notion (or drop `.md` in `content/inbox/`)
2. Run `bun run inbox` to process it
3. Commit the generated `.md` file + images to git
4. Push to trigger a Vercel build

This couples content to code. The website rebuilds just to serve a new article — even though nothing in the application logic changed. The blog content should live in a data layer that the website reads from, independent of its own deployment lifecycle.

---

## Architecture Overview

```
Notion DB (source of truth — authors write here)
    ↓
Processing Script (standalone, runs independently)
  - Queries Notion API for articles with status: "publish"
  - Converts Notion blocks → Markdown
  - Processes content (slug, tags, description, newsletter CTA marker)
  - Uploads images to Vercel Blob
  - Writes processed content + metadata to Neon Postgres
    ↓
Neon Postgres (processed content store)
  - blog_posts table: metadata + markdown content + image URLs
  - Source of truth for the website
    ↓
Website (reads from Neon at request time)
  - lib/blog.ts refactored: filesystem reads → Neon queries
  - Blog pages use ISR with revalidation
  - /api/revalidate route for on-demand cache busting
```

---

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Content store | Neon Postgres | Already in our stack (Nelly), serverless, branches for dev/staging, no cold start concerns |
| Image storage | Vercel Blob | Native Vercel integration, no CORS setup, CDN-backed, simple SDK. Alternative: Cloudflare R2 (cheaper at scale) |
| ORM | Drizzle | Already used in Nelly, TypeScript-native, lightweight |
| Content format in DB | Raw Markdown (post-processing) | Keep `react-markdown` rendering on the frontend — same as today. No need to store HTML |
| Cache strategy | ISR with on-demand revalidation | Static performance for readers, instant updates when triggered. `revalidate = 3600` as fallback (1 hour) |
| Notion sync trigger | Manual script + optional cron/webhook | Start simple. Can add Make/Zapier automation later |
| Newsletter marker | Computed at sync time, stored in DB | Same `<!-- newsletter -->` injection logic from `process-blog-inbox.ts` |

---

## Neon Setup

Create a new Neon project: `medusa-capital-content`

### Schema: `blog_posts`

```sql
CREATE TABLE blog_posts (
  id            SERIAL PRIMARY KEY,
  notion_id     TEXT UNIQUE NOT NULL,          -- Notion page ID (for sync tracking)
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  content       TEXT NOT NULL,                  -- Processed Markdown (with newsletter marker)
  author        TEXT NOT NULL DEFAULT 'Medusa Capital',
  date          DATE NOT NULL,
  tags          TEXT[] NOT NULL DEFAULT '{}',
  category      TEXT NOT NULL DEFAULT 'article', -- 'article' | 'market-analysis'
  image_url     TEXT,                            -- Header image (Vercel Blob URL)
  featured      BOOLEAN NOT NULL DEFAULT false,
  published     BOOLEAN NOT NULL DEFAULT true,
  reading_time  INTEGER NOT NULL DEFAULT 1,      -- Minutes
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_blog_posts_published ON blog_posts (published, date DESC);
CREATE INDEX idx_blog_posts_slug ON blog_posts (slug);
CREATE INDEX idx_blog_posts_category ON blog_posts (category) WHERE published = true;
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN (tags) WHERE published = true;
```

### Environment Variables

```
# Neon
NEON_DATABASE_URL=postgresql://...@...neon.tech/medusa-content

# Notion (same as existing plan)
NOTION_API_KEY=ntn_...
NOTION_DATABASE_ID=...

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Revalidation
REVALIDATION_SECRET=<random-secret-for-api-route>
```

---

## Component 1: Processing Script

Standalone script (lives in `scripts/sync-notion-to-neon.ts`). Can be run manually via `bun run sync` or on a schedule.

### Responsibilities

1. **Query Notion** — Fetch all pages with `Status: publish` from the configured database
2. **Diff against Neon** — Compare Notion page IDs + `last_edited_time` against `blog_posts.notion_id` + `updated_at` to determine what's new/changed/removed
3. **Process content** — For new/updated articles:
   - Convert Notion blocks → Markdown (via `notion-to-md`)
   - Generate slug from title (same logic as `process-blog-inbox.ts`)
   - Generate description from first paragraph
   - Generate tags via keyword matching
   - Inject `<!-- newsletter -->` marker at midpoint H2
   - Strip Notion metadata leaks (Canales, Estado, etc.)
   - Clean up Twitter/X cashtag and handle links
4. **Upload images** — Download Notion images, upload to Vercel Blob, store CDN URLs
5. **Upsert to Neon** — Insert or update `blog_posts` rows
6. **Handle unpublishing** — Articles in Neon whose `notion_id` is no longer in the published set get `published = false`

### Processing Logic Reuse

Most of the processing logic already exists in `scripts/process-blog-inbox.ts`:
- `generateSlug()` (line 117)
- `cleanupContent()` (line 129)
- `generateDescription()` (line 163)
- `generateTags()` (line 184)
- `insertNewsletterMarker()` (line 254)

These should be extracted into a shared `lib/content-processing.ts` module used by both the sync script and (temporarily) the inbox processor.

### Sync Diffing Strategy

```
For each Notion page with status: "publish":
  - If notion_id NOT in blog_posts → INSERT (new article)
  - If notion_id in blog_posts AND last_edited_time > updated_at → UPDATE
  - If notion_id in blog_posts AND last_edited_time <= updated_at → SKIP (no changes)

For each blog_posts row:
  - If notion_id NOT in current Notion publish set → SET published = false
```

---

## Component 2: lib/blog.ts Refactor

Replace filesystem reads with Neon queries. The exported interface (`BlogPost`, `BlogPostMeta`, function signatures) stays identical so no blog page components need to change.

### Before (current)

```typescript
import fs from "fs";
import matter from "gray-matter";

export function getAllPosts(): BlogPostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);
  // ... parse .md files
}
```

### After

```typescript
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const posts = await db
    .select({ /* metadata fields */ })
    .from(blogPosts)
    .where(eq(blogPosts.published, true))
    .orderBy(desc(blogPosts.date));

  return posts;
}
```

**Breaking change:** All `lib/blog.ts` functions become `async`. Call sites in blog pages (already server components) just need `await`.

### Migration Checklist

Functions to refactor:
- [ ] `getAllPosts()` → query with `published = true`, ordered by `date DESC`
- [ ] `getPostBySlug(slug)` → query by `slug` and `published = true`
- [ ] `getAllPostSlugs()` → select `slug` where `published = true`
- [ ] `getAllTags()` → `SELECT DISTINCT unnest(tags)` where `published = true`
- [ ] `getPostsByTag(tag)` → `WHERE $1 = ANY(tags)` and `published = true`
- [ ] `getPostsByCategory(category)` → query by `category`
- [ ] `getFeaturedArticles()` → query by `category = 'article'` and `featured = true`
- [ ] `getRegularArticles()` → query by `category = 'article'` and `featured = false`
- [ ] `getMarketAnalysisPosts()` → query by `category = 'market-analysis'`
- [ ] `getLatestMarketAnalysis()` → same + `LIMIT 1`

### Reading Time

Currently calculated at read time from word count. In the Neon approach, `reading_time` is computed during sync and stored in the DB — no runtime calculation needed.

---

## Component 3: ISR + On-Demand Revalidation

### Blog Pages — ISR Config

Add `revalidate` export to blog pages as a fallback (content refreshes at most every hour even without explicit triggers):

```typescript
// app/blog/page.tsx
export const revalidate = 3600; // 1 hour fallback

// app/blog/[slug]/page.tsx
export const revalidate = 3600;

// app/blog/tags/[tag]/page.tsx
export const revalidate = 3600;

// app/blog/analisis-mercado/page.tsx
export const revalidate = 3600;
```

### On-Demand Revalidation Route

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { secret, paths } = await request.json();

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  // Revalidate specified paths, or all blog paths by default
  const targetPaths = paths || ["/blog"];

  for (const path of targetPaths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, paths: targetPaths });
}
```

### Sync Script Calls Revalidation

After the sync script finishes upserting to Neon, it POSTs to the revalidation endpoint:

```typescript
// At the end of sync-notion-to-neon.ts
if (changedSlugs.length > 0) {
  const paths = ["/blog", ...changedSlugs.map(s => `/blog/${s}`)];
  await fetch(`${SITE_URL}/api/revalidate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: REVALIDATION_SECRET, paths }),
  });
}
```

This means: run the sync script → content updates in Neon → cache is busted → next visitor sees new content. No git commit, no redeploy.

---

## Component 4: Image Storage

### Problem

Currently images live in `public/img/blog/{slug}/` — part of the git repo and served from the Vercel build output. Decoupling content means images can't live here anymore.

### Solution: Vercel Blob

- Upload images during the sync script via `@vercel/blob`
- Store the returned CDN URL in `blog_posts.image_url` and inline in the Markdown content
- Vercel Blob URLs are permanent, CDN-cached, and don't expire (unlike Notion's temporary URLs)

```typescript
import { put } from "@vercel/blob";

async function uploadImage(buffer: Buffer, filename: string, slug: string): Promise<string> {
  const { url } = await put(`blog/${slug}/${filename}`, buffer, {
    access: "public",
    addRandomSuffix: false,
  });
  return url;
}
```

### Image Processing During Sync

1. Parse Markdown for image references (`![alt](url)`)
2. Download from Notion's temporary URL
3. Upload to Vercel Blob under `blog/{slug}/{filename}`
4. Replace the Notion URL with the Blob CDN URL in the Markdown content
5. Store the header image Blob URL in `blog_posts.image_url`

### Next.js Image Config

Add Vercel Blob domain to `next.config.ts` remote patterns:

```typescript
images: {
  remotePatterns: [
    { hostname: "*.public.blob.vercel-storage.com" },
  ],
}
```

---

## Migration Path

### Phase 1: Parallel Operation (Safe)

1. Set up Neon project + schema
2. Build the sync script
3. Refactor `lib/blog.ts` to read from Neon
4. Add ISR + revalidation route
5. Migrate existing 13 articles from `content/blog/*.md` into Neon (one-time script)
6. Deploy and verify everything works

During this phase, keep `content/blog/` in git as a backup. The website reads from Neon, but the files are still there.

### Phase 2: Cut Over

1. Remove `content/blog/*.md` files from git (they now live in Neon)
2. Remove `scripts/process-blog-inbox.ts` (replaced by sync script)
3. Remove `content/inbox/` directory
4. Remove `gray-matter` dependency
5. Update CLAUDE.md to reflect new content workflow

### Phase 3: Automation (Optional)

Choose a trigger mechanism for running the sync script:

| Trigger | How | Latency | Complexity |
|---------|-----|---------|------------|
| Manual | Run `bun run sync` locally or via SSH | Instant (on demand) | None |
| Cron | GitHub Actions on schedule (e.g., every 6h) | Up to 6h | Low |
| Notion webhook via Make/Zapier | Notion page updated → Make → runs sync | ~1-2 min | Medium |
| Telegram command via Alfred | `/sync` command on Telegram → triggers sync on server | ~30s | Medium (already have Alfred infra) |

---

## Dependencies

| Dependency | Purpose | New? |
|------------|---------|------|
| `@notionhq/client` | Notion API | Yes |
| `notion-to-md` | Notion blocks → Markdown | Yes |
| `drizzle-orm` + `@neondatabase/serverless` | Neon queries | Yes (for this project) |
| `@vercel/blob` | Image storage | Yes |

---

## What Stays the Same

- Blog page components (`app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, etc.) — same JSX, just `await` the data functions
- `MarkdownRenderer` — still renders Markdown with `react-markdown`
- `BlogCard`, `NewsletterSection`, `BlogCTA` — unchanged
- `<!-- newsletter -->` marker system — same logic, just runs during sync instead of inbox processing
- Blog URL structure (`/blog/{slug}`, `/blog/tags/{tag}`) — identical
- SEO metadata generation — same, just async

## What Changes

- `lib/blog.ts` — filesystem → Neon queries (all functions become async)
- Content source — `content/blog/*.md` → `blog_posts` table in Neon
- Image hosting — `public/img/blog/` → Vercel Blob CDN
- Publishing workflow — commit+push → run sync script (or automated trigger)
- `next.config.ts` — add Vercel Blob remote image pattern

---

## Open Questions

1. **Vercel Blob vs Cloudflare R2 for images?** — Blob is simpler (native Vercel), R2 is cheaper at scale. Current volume is low (~13 articles), so Blob is fine for now.
2. **Should the sync script run on the Hetzner server (alongside Alfred) or as a GitHub Action?** — Hetzner is always-on and already runs automation. Could be a simple cron job there.
3. **Do we want a Neon branch for staging content?** — Could use a Neon branch for `staging.medusacapital.xyz` to preview articles before publishing to prod.
4. **Existing article images** — The 13 existing articles have images in `public/img/blog/`. During migration, these need to be uploaded to Vercel Blob and their references updated in the DB content.
