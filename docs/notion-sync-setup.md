# Notion Blog Sync Setup

## Overview

Blog articles are synced from a Notion database via a GitHub Actions workflow (`.github/workflows/sync-notion.yml`). Articles with the `Publicado en web` checkbox checked are fetched via the Notion API, converted to Markdown, and committed to `content/blog/`. The workflow pushes to `main`, which triggers a Vercel auto-deploy. The Vercel build itself does NOT call the Notion API — it builds from git content.

## Environment Variables

Set these in **GitHub repo secrets** (for CI workflow) and locally in `.env.local` (for manual sync):

- `NOTION_API_KEY` - Your Notion integration token (starts with `ntn_`)
- `NOTION_DATABASE_ID` - Your Notion database ID

## Notion Database Schema

Your Notion database needs these properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Nombre | Title | Yes | Article title |
| Slug | Rich text | No | URL slug (auto-generated from title if empty) |
| Descripción | Rich text | No | Meta description (auto-extracted from content if empty) |
| Publicado en web | Checkbox | Yes | Publish filter — checked articles are synced |
| Fecha Publicación | Date | Yes | Publication date (defaults to today if empty) |
| Responsable | People | No | Author (uses person's name; default: "Medusa Capital") |
| Tags | Multi-select | No | Merged with auto-generated content tags |
| Tema | Select | Yes | Derives both category and type. Values: "Análisis Mercado", "Educación Cripto", "Research", "DeFi", "Trading" |
| Featured | Checkbox | No | Featured article flag |

**Tema → category/type mapping:**

| Tema value | → category | → type |
|------------|------------|--------|
| Análisis Mercado | market-analysis | Análisis |
| Educación Cripto | article | Educación |
| Research | article | Research |
| DeFi | article | DeFi |
| Trading | article | Trading |

## Setting Up the Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Name it "Medusa Capital Blog"
4. Select your workspace
5. Copy the "Internal Integration Token" (starts with `ntn_`)
6. Open your database in Notion
7. Click "..." > "Connections" > add your integration
8. Copy the Database ID from the URL: `notion.so/[workspace]/[DATABASE_ID]?v=...`

## Local Development

```bash
# 1. Copy .env.local.example to .env.local and fill in credentials
cp .env.local.example .env.local

# 2. Sync articles from Notion
bun run sync-notion

# 3. Start dev server
bun dev
```

## Deployment Architecture

The Notion sync is **decoupled from the Vercel build**:

1. **GitHub Actions workflow** (`.github/workflows/sync-notion.yml`) runs daily at 9 AM UTC (or manually)
2. The workflow checks out `main`, runs `bun run sync-notion`, and commits any changes
3. Pushing to `main` triggers Vercel auto-deploy
4. **Vercel builds from git content** (`bun run build`) — no Notion API calls at build time

This means:
- Code-only deploys (pushing features) are fast and don't depend on Notion API
- Blog content updates happen on a daily schedule via CI
- Manual sync: trigger the workflow from GitHub Actions UI, or run `bun run sync-notion` locally and commit

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `NOTION_API_KEY` | Notion integration token (starts with `ntn_`) |
| `NOTION_DATABASE_ID` | Notion database ID |

## How It Works

1. `bun run sync-notion` queries the Notion DB for articles with `Publicado en web` checked
2. Each article's Notion blocks are converted to Markdown using `notion-to-md` with a custom image transformer
3. Cover images are downloaded and resized to max 1200px wide (JPEG 85%) via `sharp`
4. Inline images are downloaded to `public/img/blog/[slug]/`; expired signed URLs are retried via fresh block fetch
5. Content is cleaned up: Notion metadata fields stripped, headings normalized, Twitter/X links simplified, duplicate cover image removed, filename alt text stripped
6. Auto-generated description, tags, and `<!-- newsletter -->` CTA marker are added
7. Markdown files with frontmatter are written to `content/blog/`
8. A manifest (`.notion-sync.json`) tracks synced slugs for unpublish detection
9. Articles previously synced but no longer published are removed (markdown + images)

## Troubleshooting

### "Notion sync skipped: NOTION_API_KEY or NOTION_DATABASE_ID not set"
The script gracefully skips sync when env vars aren't configured. Set them in GitHub repo secrets (for CI) and in `.env.local` (for local dev).

### "Database not found"
1. Verify the database ID is correct (from the Notion URL)
2. Ensure the integration is connected to the database (Share > Connections)

### Images not loading
Notion signed URLs expire after 1 hour. The sync downloads all images locally and retries with fresh block fetches for expired URLs. If images are still broken, re-run the sync.

### Articles not appearing after publish
1. Verify the article has `Publicado en web` checked in Notion
2. Verify the `Fecha Publicación` property is set
3. Trigger the sync-notion workflow manually from GitHub Actions, or wait for the daily run
