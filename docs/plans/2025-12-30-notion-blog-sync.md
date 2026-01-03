# Notion → Blog Sync Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Automatically sync blog articles from a Notion database to the Next.js site at build time, so articles marked "publish" in Notion appear on the website.

**Architecture:** A Node.js script runs before each build, fetches published articles from Notion via API, converts Notion blocks to Markdown, downloads images to the public folder, and writes markdown files to `/content/blog/`. The existing blog system reads these files unchanged. Vercel deploy hooks trigger rebuilds when content changes.

**Tech Stack:** @notionhq/client (Notion API), notion-to-md (block conversion), node-fetch (image downloads), Vercel deploy hooks

---

## Prerequisites

Before starting implementation, you need to:

1. **Create a Notion Integration:**
   - Go to https://www.notion.so/my-integrations
   - Click "New integration"
   - Name it "Medusa Capital Blog"
   - Select your workspace
   - Copy the "Internal Integration Token" (starts with `ntn_`)

2. **Set up Notion Database:**
   - Create a database (or use existing) with these properties:
     - `Title` (title) - Article title
     - `Slug` (text) - URL slug (e.g., "mi-articulo")
     - `Description` (text) - Meta description
     - `Status` (select) - Options: "draft", "publish"
     - `Date` (date) - Publication date
     - `Author` (text) - Author name
     - `Tags` (multi-select) - Article tags
     - `Category` (select) - Options: "article", "market-analysis"
     - `Featured` (checkbox) - Featured article flag
   - Share the database with your integration (click "..." → "Connections" → add your integration)
   - Copy the Database ID from the URL: `notion.so/[workspace]/[DATABASE_ID]?v=...`

3. **Add environment variables to Vercel:**
   - `NOTION_API_KEY` - Your integration token
   - `NOTION_DATABASE_ID` - Your database ID

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install Notion packages**

Run:
```bash
npm install @notionhq/client notion-to-md
```

**Step 2: Verify installation**

Run:
```bash
cat package.json | grep -A2 "notionhq"
```
Expected: Shows @notionhq/client in dependencies

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add Notion API dependencies"
```

---

## Task 2: Create Notion Client Configuration

**Files:**
- Create: `lib/notion.ts`

**Step 1: Create the Notion client module**

```typescript
import { Client } from "@notionhq/client";

if (!process.env.NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY environment variable is not set");
}

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error("NOTION_DATABASE_ID environment variable is not set");
}

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const databaseId = process.env.NOTION_DATABASE_ID;
```

**Step 2: Create .env.local for local development**

Create `.env.local` (this file should already be in .gitignore):
```
NOTION_API_KEY=ntn_your_token_here
NOTION_DATABASE_ID=your_database_id_here
```

**Step 3: Verify .env.local is gitignored**

Run:
```bash
grep ".env.local" .gitignore
```
Expected: `.env.local` appears in output

**Step 4: Commit**

```bash
git add lib/notion.ts
git commit -m "feat: add Notion client configuration"
```

---

## Task 3: Create Notion Block to Markdown Converter

**Files:**
- Create: `scripts/notion-to-markdown.ts`

**Step 1: Create the converter module**

```typescript
import { NotionToMarkdown } from "notion-to-md";
import { notion } from "../lib/notion";
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const n2m = new NotionToMarkdown({ notionClient: notion });

/**
 * Download an image from a URL and save it locally
 */
async function downloadImage(
  url: string,
  destPath: string
): Promise<string | null> {
  return new Promise((resolve) => {
    const protocol = url.startsWith("https") ? https : http;

    const file = fs.createWriteStream(destPath);
    protocol
      .get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            downloadImage(redirectUrl, destPath).then(resolve);
            return;
          }
        }

        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(destPath);
        });
      })
      .on("error", (err) => {
        fs.unlink(destPath, () => {}); // Delete the file on error
        console.error(`Failed to download image: ${err.message}`);
        resolve(null);
      });
  });
}

/**
 * Process markdown content to download and replace image URLs
 */
async function processImages(
  markdown: string,
  slug: string
): Promise<string> {
  const imageDir = path.join(process.cwd(), "public/img/blog", slug);

  // Create directory if it doesn't exist
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  // Find all image references in markdown
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  let processedMarkdown = markdown;
  let imageIndex = 0;

  const replacements: { original: string; replacement: string }[] = [];

  while ((match = imageRegex.exec(markdown)) !== null) {
    const [fullMatch, altText, imageUrl] = match;

    // Skip if already a local path
    if (imageUrl.startsWith("/img/")) {
      continue;
    }

    // Generate local filename
    const ext = imageUrl.includes(".png")
      ? ".png"
      : imageUrl.includes(".gif")
        ? ".gif"
        : ".jpg";
    const filename = `image-${imageIndex}${ext}`;
    const localPath = path.join(imageDir, filename);
    const publicPath = `/img/blog/${slug}/${filename}`;

    // Download the image
    console.log(`  Downloading image ${imageIndex + 1}: ${filename}`);
    const result = await downloadImage(imageUrl, localPath);

    if (result) {
      replacements.push({
        original: fullMatch,
        replacement: `![${altText}](${publicPath})`,
      });
    }

    imageIndex++;
  }

  // Apply replacements
  for (const { original, replacement } of replacements) {
    processedMarkdown = processedMarkdown.replace(original, replacement);
  }

  return processedMarkdown;
}

/**
 * Convert a Notion page to markdown with downloaded images
 */
export async function pageToMarkdown(
  pageId: string,
  slug: string
): Promise<string> {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdBlocks);

  // Handle both string and object return types
  const markdown =
    typeof mdString === "string" ? mdString : mdString.parent;

  // Process images
  const processedMarkdown = await processImages(markdown, slug);

  return processedMarkdown;
}
```

**Step 2: Commit**

```bash
git add scripts/notion-to-markdown.ts
git commit -m "feat: add Notion to Markdown converter with image handling"
```

---

## Task 4: Create the Sync Script

**Files:**
- Create: `scripts/sync-notion.ts`

**Step 1: Create the main sync script**

```typescript
import { notion, databaseId } from "../lib/notion";
import { pageToMarkdown } from "./notion-to-markdown";
import fs from "fs";
import path from "path";
import type {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

interface NotionArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  category: "article" | "market-analysis";
  featured: boolean;
  coverImage?: string;
}

/**
 * Extract plain text from Notion rich text array
 */
function getPlainText(richText: RichTextItemResponse[]): string {
  return richText.map((t) => t.plain_text).join("");
}

/**
 * Fetch all published articles from Notion
 */
async function fetchPublishedArticles(): Promise<NotionArticle[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Status",
      select: {
        equals: "publish",
      },
    },
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });

  const articles: NotionArticle[] = [];

  for (const page of response.results) {
    if (!("properties" in page)) continue;

    const props = (page as PageObjectResponse).properties;

    // Extract cover image if present
    let coverImage: string | undefined;
    const pageWithCover = page as PageObjectResponse;
    if (pageWithCover.cover) {
      if (pageWithCover.cover.type === "external") {
        coverImage = pageWithCover.cover.external.url;
      } else if (pageWithCover.cover.type === "file") {
        coverImage = pageWithCover.cover.file.url;
      }
    }

    // Extract properties with type guards
    const titleProp = props.Title;
    const slugProp = props.Slug;
    const descProp = props.Description;
    const dateProp = props.Date;
    const authorProp = props.Author;
    const tagsProp = props.Tags;
    const categoryProp = props.Category;
    const featuredProp = props.Featured;

    const title =
      titleProp?.type === "title" ? getPlainText(titleProp.title) : "Untitled";

    const slug =
      slugProp?.type === "rich_text"
        ? getPlainText(slugProp.rich_text)
        : page.id;

    const description =
      descProp?.type === "rich_text" ? getPlainText(descProp.rich_text) : "";

    const date =
      dateProp?.type === "date" && dateProp.date?.start
        ? dateProp.date.start
        : new Date().toISOString().split("T")[0];

    const author =
      authorProp?.type === "rich_text"
        ? getPlainText(authorProp.rich_text)
        : "Medusa Capital";

    const tags =
      tagsProp?.type === "multi_select"
        ? tagsProp.multi_select.map((t) => t.name)
        : [];

    const category =
      categoryProp?.type === "select" && categoryProp.select?.name
        ? (categoryProp.select.name as "article" | "market-analysis")
        : "article";

    const featured =
      featuredProp?.type === "checkbox" ? featuredProp.checkbox : false;

    articles.push({
      id: page.id,
      slug,
      title,
      description,
      date,
      author,
      tags,
      category,
      featured,
      coverImage,
    });
  }

  return articles;
}

/**
 * Generate frontmatter for a blog post
 */
function generateFrontmatter(
  article: NotionArticle,
  headerImage?: string
): string {
  const frontmatter: Record<string, unknown> = {
    title: article.title,
    date: article.date,
    description: article.description,
    tags: article.tags,
    author: article.author,
    featured: article.featured,
    published: true,
    category: article.category,
  };

  if (headerImage) {
    frontmatter.image = headerImage;
  }

  const lines = ["---"];
  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map((v) => `"${v}"`).join(", ")}]`);
    } else if (typeof value === "string") {
      // Escape quotes in strings
      const escaped = value.replace(/"/g, '\\"');
      lines.push(`${key}: "${escaped}"`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  lines.push("---");

  return lines.join("\n");
}

/**
 * Download cover image and return local path
 */
async function downloadCoverImage(
  url: string,
  slug: string
): Promise<string | null> {
  const imageDir = path.join(process.cwd(), "public/img/blog", slug);

  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  const ext = url.includes(".png") ? ".png" : ".jpg";
  const filename = `cover${ext}`;
  const localPath = path.join(imageDir, filename);
  const publicPath = `/img/blog/${slug}/${filename}`;

  // Simple download using fetch
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(localPath, Buffer.from(buffer));
    return publicPath;
  } catch (err) {
    console.error(`Failed to download cover image: ${err}`);
    return null;
  }
}

/**
 * Sync a single article from Notion to local markdown
 */
async function syncArticle(article: NotionArticle): Promise<void> {
  console.log(`Syncing: ${article.title}`);

  // Convert page content to markdown
  const content = await pageToMarkdown(article.id, article.slug);

  // Download cover image if present
  let headerImage: string | undefined;
  if (article.coverImage) {
    console.log(`  Downloading cover image...`);
    const localPath = await downloadCoverImage(article.coverImage, article.slug);
    if (localPath) {
      headerImage = localPath;
    }
  }

  // Generate frontmatter
  const frontmatter = generateFrontmatter(article, headerImage);

  // Combine frontmatter and content
  const fullContent = `${frontmatter}\n\n${content}`;

  // Write to file
  const filePath = path.join(CONTENT_DIR, `${article.slug}.md`);
  fs.writeFileSync(filePath, fullContent, "utf-8");

  console.log(`  Saved: ${filePath}`);
}

/**
 * Get list of currently synced articles (from Notion)
 */
function getSyncedSlugs(): Set<string> {
  const syncManifest = path.join(CONTENT_DIR, ".notion-sync.json");
  if (fs.existsSync(syncManifest)) {
    const data = JSON.parse(fs.readFileSync(syncManifest, "utf-8"));
    return new Set(data.slugs || []);
  }
  return new Set();
}

/**
 * Save list of synced slugs
 */
function saveSyncedSlugs(slugs: string[]): void {
  const syncManifest = path.join(CONTENT_DIR, ".notion-sync.json");
  fs.writeFileSync(
    syncManifest,
    JSON.stringify({ slugs, lastSync: new Date().toISOString() }, null, 2)
  );
}

/**
 * Main sync function
 */
async function main(): Promise<void> {
  console.log("🔄 Starting Notion sync...\n");

  // Ensure content directory exists
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  // Fetch published articles
  console.log("Fetching published articles from Notion...");
  const articles = await fetchPublishedArticles();
  console.log(`Found ${articles.length} published articles\n`);

  // Get previously synced slugs
  const previousSlugs = getSyncedSlugs();
  const currentSlugs = new Set(articles.map((a) => a.slug));

  // Find articles to remove (unpublished in Notion)
  for (const slug of previousSlugs) {
    if (!currentSlugs.has(slug)) {
      console.log(`Removing unpublished article: ${slug}`);
      const filePath = path.join(CONTENT_DIR, `${slug}.md`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      // Optionally remove images too
      const imageDir = path.join(process.cwd(), "public/img/blog", slug);
      if (fs.existsSync(imageDir)) {
        fs.rmSync(imageDir, { recursive: true });
      }
    }
  }

  // Sync each article
  for (const article of articles) {
    await syncArticle(article);
  }

  // Save current slugs
  saveSyncedSlugs(articles.map((a) => a.slug));

  console.log("\n✅ Notion sync complete!");
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
```

**Step 2: Commit**

```bash
git add scripts/sync-notion.ts
git commit -m "feat: add main Notion sync script"
```

---

## Task 5: Add Sync Script to Build Process

**Files:**
- Modify: `package.json`
- Create: `scripts/tsconfig.json`

**Step 1: Create tsconfig for scripts**

Create `scripts/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": ".."
  },
  "include": ["./**/*.ts", "../lib/notion.ts"]
}
```

**Step 2: Update package.json scripts**

Add these scripts to package.json:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "sync-notion": "npx tsx scripts/sync-notion.ts",
    "build:notion": "npm run sync-notion && npm run build"
  }
}
```

**Step 3: Install tsx for running TypeScript**

Run:
```bash
npm install -D tsx
```

**Step 4: Test the sync locally**

Run:
```bash
npm run sync-notion
```
Expected: Should connect to Notion and sync articles (or fail gracefully if no env vars)

**Step 5: Commit**

```bash
git add package.json package-lock.json scripts/tsconfig.json
git commit -m "feat: add sync-notion script to build process"
```

---

## Task 6: Configure Vercel Build

**Files:**
- Create: `vercel.json`

**Step 1: Create Vercel configuration**

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build:notion",
  "framework": "nextjs"
}
```

**Step 2: Commit**

```bash
git add vercel.json
git commit -m "chore: configure Vercel to use Notion sync build"
```

---

## Task 7: Add .notion-sync.json to .gitignore

**Files:**
- Modify: `.gitignore`

**Step 1: Add sync manifest to gitignore**

Add this line to `.gitignore`:
```
# Notion sync manifest
content/blog/.notion-sync.json
```

**Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore Notion sync manifest"
```

---

## Task 8: Create Deploy Hook Documentation

**Files:**
- Create: `docs/notion-sync-setup.md`

**Step 1: Create setup documentation**

```markdown
# Notion Blog Sync Setup

## Overview

This project syncs blog articles from a Notion database at build time.

## Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

- `NOTION_API_KEY` - Your Notion integration token (starts with `ntn_`)
- `NOTION_DATABASE_ID` - Your Notion database ID

## Notion Database Schema

Your Notion database needs these properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Title | Title | Yes | Article title |
| Slug | Text | Yes | URL slug (e.g., "mi-articulo") |
| Description | Text | Yes | Meta description |
| Status | Select | Yes | "draft" or "publish" |
| Date | Date | Yes | Publication date |
| Author | Text | No | Author name (default: "Medusa Capital") |
| Tags | Multi-select | No | Article tags |
| Category | Select | No | "article" or "market-analysis" |
| Featured | Checkbox | No | Featured article flag |

## Setting Up Auto-Deploy

### Option A: Manual Deploys
Push to your repo or click "Redeploy" in Vercel dashboard.

### Option B: Scheduled Deploys (Recommended)
Use GitHub Actions to trigger deploys on a schedule:

1. Create a Vercel Deploy Hook:
   - Vercel Dashboard → Your Project → Settings → Git → Deploy Hooks
   - Create hook named "notion-sync"
   - Copy the URL

2. Add to GitHub Secrets:
   - Repo Settings → Secrets → Actions
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

## Local Development

1. Copy `.env.example` to `.env.local`
2. Fill in your Notion credentials
3. Run `npm run sync-notion` to sync articles
4. Run `npm run dev` to start dev server

## Troubleshooting

### "NOTION_API_KEY not set"
Ensure environment variables are set in Vercel and locally in `.env.local`

### "Database not found"
1. Verify the database ID is correct
2. Ensure the integration is connected to the database (Share → Connections)

### Images not loading
Notion image URLs expire. The sync script downloads images locally to avoid this.
```

**Step 2: Create .env.example**

```
# Notion API Configuration
# Get these from: https://www.notion.so/my-integrations

NOTION_API_KEY=ntn_your_integration_token_here
NOTION_DATABASE_ID=your_database_id_here
```

**Step 3: Commit**

```bash
git add docs/notion-sync-setup.md .env.example
git commit -m "docs: add Notion sync setup guide"
```

---

## Task 9: Test Full Sync Flow

**Step 1: Create a test article in Notion**

1. Open your Notion database
2. Create a new page with:
   - Title: "Test Article from Notion"
   - Slug: "test-notion-sync"
   - Description: "Testing the Notion sync integration"
   - Status: "publish"
   - Date: Today
   - Add some content in the page body

**Step 2: Run sync locally**

Run:
```bash
npm run sync-notion
```
Expected:
```
🔄 Starting Notion sync...

Fetching published articles from Notion...
Found 1 published articles

Syncing: Test Article from Notion
  Saved: /path/to/content/blog/test-notion-sync.md

✅ Notion sync complete!
```

**Step 3: Verify the generated file**

Run:
```bash
cat content/blog/test-notion-sync.md
```
Expected: Markdown file with frontmatter and content

**Step 4: Run dev server and verify**

Run:
```bash
npm run dev
```
Navigate to: http://localhost:3000/blog
Expected: New article appears in the list

**Step 5: Clean up test article**

1. In Notion, change Status to "draft"
2. Run `npm run sync-notion` again
3. Verify the test article is removed

---

## Task 10: Deploy and Verify

**Step 1: Push to GitHub**

```bash
git push origin main
```

**Step 2: Verify Vercel build**

1. Go to Vercel Dashboard
2. Watch the deployment logs
3. Verify "Starting Notion sync..." appears in build output

**Step 3: Create a real article in Notion and deploy**

1. Create article in Notion with Status: "publish"
2. Either push a commit or trigger deploy hook
3. Verify article appears on live site

---

## Summary

After completing all tasks, you'll have:

1. **Automatic sync**: Articles in Notion with `status: publish` appear on website
2. **Image handling**: All Notion images downloaded and hosted locally
3. **Unpublish support**: Changing status to "draft" removes article from site
4. **Flexible triggers**: Manual deploys, scheduled deploys, or instant webhooks
5. **Local development**: Run `npm run sync-notion` to test locally

The existing blog system (`lib/blog.ts`) continues to work unchanged - it just reads from the markdown files that the sync script creates.
