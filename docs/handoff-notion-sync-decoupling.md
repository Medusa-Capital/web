# Handoff: Notion Sync Decoupling

**Branch:** `staging` (pushed to `origin/staging`)
**Commits:** `02e7f27` (pre-existing content sync) + `dac21dc` (our infrastructure changes)

## What was done

Decoupled the Notion blog sync from the Vercel build. Previously, every Vercel build ran a full Notion re-sync (all 14 articles, 127+ images) even though the content was already committed to git. Now:

- **New workflow:** `.github/workflows/sync-notion.yml` — runs daily at 9 AM UTC, syncs Notion, commits changes, pushes to `main`
- **Deleted:** `.github/workflows/scheduled-deploy.yml` — no longer needed
- **Changed:** `vercel.json` buildCommand from `bun run build:notion` to `bun run build`
- **Changed:** `.gitignore` — un-gitignored `.notion-sync.json` so CI can track synced slugs
- **Updated:** `CLAUDE.md` and `docs/notion-sync-setup.md` to reflect new architecture
- **Fixed:** `scripts/sync-notion.ts` — strip "ARTÍCULO:" prefix from Notion titles before generating slugs to avoid `articulo-*` duplicate files
- **Cleaned up:** Removed 10 duplicate `articulo-*` prefixed blog posts and their images (created by the old slug generation)
- **Fixed:** Blog article categories — `por-que-no-invierto-en-eth.md` and `mientras-todos-miran-a-iran-...md` corrected from `market-analysis` to `article` to appear on `/blog`

## Things that still need fixing

### ~~1. Stale `staging` reference in notion-sync-setup.md~~ DONE

Fixed: now says `main`.

### ~~2. CLAUDE.md env vars note is stale~~ DONE

Fixed: now says "GitHub repo secrets for CI" instead of "Vercel env vars for production".

### 3. Add GitHub repo secrets

Before the workflow can run, add these to `Urbistondo/medusa-capital-typescript` > Settings > Secrets > Actions:
- `NOTION_API_KEY` — the Notion integration token (same value as in `.env.local`)
- `NOTION_DATABASE_ID` — the Notion database ID (same value as in `.env.local`)

### 4. Clean up old Vercel secret

The `VERCEL_DEPLOY_HOOK` secret in GitHub can be removed — the `scheduled-deploy.yml` workflow that used it has been deleted.

### 5. Merge to main

The `sync-notion.yml` workflow checks out `ref: main`, so it needs to exist on `main` to run. These changes are currently on `staging` — need to merge/PR into `main`.

### 6. Remove Notion env vars from Vercel (optional cleanup)

`NOTION_API_KEY` and `NOTION_DATABASE_ID` are no longer needed in Vercel's env vars since the build doesn't call the Notion API. Can be removed for cleanliness, but won't cause issues if left (the `isNotionConfigured()` check in `lib/notion.ts` is only called by `sync-notion.ts`, not during the build).

### 7. Notion Slug field (recommended)

The sync script generates slugs from Notion titles when the `Slug` field is empty. Some Notion entries have titles like "ARTÍCULO: ..." which produced `articulo-*` slugs (now fixed by stripping the prefix). However, the generated slugs still won't match the original manually-created slugs (e.g., `es-lighter-el-fin-de-hyperliquid` vs original `lighter-vs-hyperliquid`).

**Recommended:** Set the `Slug` field in Notion for existing articles to match their current URL slugs. This ensures URL stability when the CI sync takes over. New articles will auto-generate clean slugs.

### 8. Category assignment for "Análisis Mercado" articles

The sync script assigns `category: "market-analysis"` to articles with Tema = "Análisis Mercado". However, production currently shows these articles on `/blog` (which only renders `category: "article"`). The manually committed files override this with `category: "article"`.

Once the CI sync takes over, it will overwrite these with `market-analysis`, hiding them from `/blog`. Options:
- Change the sync script to always assign `category: "article"` (simplest)
- Update the blog page to show both categories
- Change the Tema in Notion for articles that should appear on `/blog`

## Key files

| File | Purpose |
|------|---------|
| `.github/workflows/sync-notion.yml` | New daily sync workflow |
| `vercel.json` | Build command (now `bun run build`) |
| `.gitignore` | Manifest no longer ignored |
| `content/blog/.notion-sync.json` | Sync manifest (now tracked) |
| `CLAUDE.md` | Project docs |
| `docs/notion-sync-setup.md` | Sync setup docs |
| `scripts/sync-notion.ts` | The sync script (slug prefix fix) |
| `lib/blog-processing.ts` | Shared slug generation |
