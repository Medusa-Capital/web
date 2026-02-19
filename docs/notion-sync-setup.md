# Notion Blog Sync Setup

## Overview

Blog articles are synced from a Notion database at build time. Articles with `Status = "publish"` are fetched via the Notion API, converted to Markdown, and written to `content/blog/`. The existing blog system reads these files unchanged.

## Environment Variables

Set these in **Vercel Dashboard > Settings > Environment Variables** and locally in `.env.local`:

- `NOTION_API_KEY` - Your Notion integration token (starts with `ntn_`)
- `NOTION_DATABASE_ID` - Your Notion database ID

## Notion Database Schema

Your Notion database needs these properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Title | Title | Yes | Article title |
| Slug | Text | No | URL slug (auto-generated from title if empty) |
| Description | Text | No | Meta description (auto-extracted from content if empty) |
| Status | Select | Yes | "draft" or "publish" |
| Date | Date | Yes | Publication date |
| Author | Text | No | Author name (default: "Medusa Capital") |
| Tags | Multi-select | No | Merged with auto-generated content tags |
| Category | Select | Yes | "article" or "market-analysis" |
| Type | Select | No | "Analisis", "Educacion", "Research", "DeFi", "Trading" |
| Featured | Checkbox | No | Featured article flag |

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

## Auto-Deploy Options

### Option A: Manual Deploys

Push to your repo or click "Redeploy" in Vercel dashboard. Every build runs `sync-notion` first.

### Option B: Scheduled Deploys (Recommended)

Use GitHub Actions to trigger deploys on a schedule:

1. Create a Vercel Deploy Hook:
   - Vercel Dashboard > Your Project > Settings > Git > Deploy Hooks
   - Create hook named "notion-sync"
   - Copy the URL

2. Add to GitHub Secrets:
   - Repo Settings > Secrets > Actions
   - Add `VERCEL_DEPLOY_HOOK` with the URL

3. Create `.github/workflows/scheduled-deploy.yml`:

```yaml
name: Scheduled Deploy

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:  # Manual trigger

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Vercel Deploy
        run: curl -X POST ${{ secrets.VERCEL_DEPLOY_HOOK }}
```

### Option C: Instant Deploys with Make/Zapier

1. Create Vercel Deploy Hook (same as Option B)
2. Create automation in Make.com or Zapier:
   - Trigger: Notion database updated
   - Action: HTTP POST to deploy hook URL

## How It Works

1. `bun run sync-notion` fetches all published articles from Notion
2. Each article is converted to Markdown using `notion-to-md`
3. Images (inline + cover) are downloaded to `public/img/blog/[slug]/`
4. Content is processed: cleanup, auto-tags, newsletter CTA marker
5. Markdown files with frontmatter are written to `content/blog/`
6. A manifest (`.notion-sync.json`) tracks synced slugs
7. Articles unpublished in Notion are removed from the blog

## Troubleshooting

### "Notion sync skipped: NOTION_API_KEY or NOTION_DATABASE_ID not set"
The build gracefully skips sync when env vars aren't configured. Set them in Vercel and in `.env.local`.

### "Database not found"
1. Verify the database ID is correct (from the Notion URL)
2. Ensure the integration is connected to the database (Share > Connections)

### Images not loading
Notion image URLs expire after 1 hour. The sync downloads all images locally. If images are broken, re-run the sync.

### Articles not appearing after publish
1. Verify the article has `Status = "publish"` in Notion
2. Verify the `Date` property is set
3. Re-deploy or trigger the deploy hook
