// scripts/sync-notion.ts
// Run with: bun scripts/sync-notion.ts
//
// Syncs blog articles from a Notion database to content/blog/ at build time.
// Articles with Status = "publish" are fetched, converted to markdown,
// and written with frontmatter matching the existing blog system.

import { NotionToMarkdown } from "notion-to-md";
import { getNotionClient, getDatabaseId, isNotionConfigured } from "../lib/notion";
import {
  generateSlug,
  generateDescription,
  generateTags,
  insertNewsletterMarker,
  cleanupContent,
} from "../lib/blog-processing";
import { existsSync, mkdirSync, writeFileSync, readFileSync, unlinkSync, rmSync, readdirSync } from "fs";
import { join, extname } from "path";
import type {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

const CONTENT_DIR = join(process.cwd(), "content/blog");
const PUBLIC_IMG_DIR = join(process.cwd(), "public/img/blog");
const SYNC_MANIFEST = join(CONTENT_DIR, ".notion-sync.json");

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

interface NotionArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  category: "article" | "market-analysis";
  type?: string;
  featured: boolean;
  coverImage?: string;
}

interface SyncManifest {
  slugs: string[];
  lastSync: string;
}

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------

function getPlainText(richText: RichTextItemResponse[]): string {
  return richText.map((t) => t.plain_text).join("");
}

/**
 * Download an image from a URL and save it locally using Bun-native fetch.
 * Returns the local public path on success, null on failure.
 */
async function downloadImage(
  url: string,
  destPath: string
): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = await response.arrayBuffer();
    writeFileSync(destPath, Buffer.from(buffer));
    return true;
  } catch (err) {
    console.error(`  Failed to download image: ${err}`);
    return false;
  }
}

/**
 * Guess a file extension from a URL or content-type.
 */
function guessImageExt(url: string): string {
  const urlLower = url.toLowerCase();
  if (urlLower.includes(".png")) return ".png";
  if (urlLower.includes(".gif")) return ".gif";
  if (urlLower.includes(".webp")) return ".webp";
  if (urlLower.includes(".svg")) return ".svg";
  return ".jpg";
}

// -------------------------------------------------------------------
// Notion → Markdown conversion with image downloading
// -------------------------------------------------------------------

/**
 * Convert a Notion page to markdown, downloading all inline images.
 */
async function pageToMarkdown(
  notion: ReturnType<typeof getNotionClient>,
  pageId: string,
  slug: string
): Promise<string> {
  const n2m = new NotionToMarkdown({ notionClient: notion });
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdBlocks);

  // notion-to-md can return string or { parent: string }
  const markdown =
    typeof mdString === "string" ? mdString : mdString.parent;

  // Download and replace inline image URLs
  const processedMarkdown = await processInlineImages(markdown, slug);

  return processedMarkdown;
}

/**
 * Find all markdown image references, download them, and replace URLs
 * with local paths.
 */
async function processInlineImages(
  markdown: string,
  slug: string
): Promise<string> {
  const imageDir = join(PUBLIC_IMG_DIR, slug);

  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  let imageIndex = 0;
  const replacements: { original: string; replacement: string }[] = [];

  while ((match = imageRegex.exec(markdown)) !== null) {
    const [fullMatch, altText, imageUrl] = match;

    // Skip already-local paths
    if (imageUrl.startsWith("/img/")) continue;

    // Ensure image directory exists
    if (!existsSync(imageDir)) {
      mkdirSync(imageDir, { recursive: true });
    }

    const ext = guessImageExt(imageUrl);
    const filename = `image-${imageIndex}${ext}`;
    const localPath = join(imageDir, filename);
    const publicPath = `/img/blog/${slug}/${filename}`;

    console.log(`  Downloading image ${imageIndex + 1}: ${filename}`);
    const success = await downloadImage(imageUrl, localPath);

    if (success) {
      replacements.push({
        original: fullMatch,
        replacement: `![${altText}](${publicPath})`,
      });
    }

    imageIndex++;
  }

  let result = markdown;
  for (const { original, replacement } of replacements) {
    result = result.replace(original, replacement);
  }

  return result;
}

// -------------------------------------------------------------------
// Fetch articles from Notion
// -------------------------------------------------------------------

async function fetchPublishedArticles(
  notion: ReturnType<typeof getNotionClient>,
  databaseId: string
): Promise<NotionArticle[]> {
  // Property name mapping (Notion DB → script):
  //   Nombre (title)          → title
  //   Slug (rich_text)        → slug
  //   Descripción (rich_text) → description
  //   Fecha Publicación (date)→ date
  //   Responsable (people)    → author
  //   Status (select)         → publish filter (draft/publish)
  //   Tags (multi_select)     → tags
  //   Category (select)       → category (article/market-analysis)
  //   Type (select)           → type (Analysis/Education/Research/DeFi/Trading)
  //   Featured (checkbox)     → featured
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Status",
      select: { equals: "publish" },
    },
    sorts: [{ property: "Fecha Publicación", direction: "descending" }],
  });

  const articles: NotionArticle[] = [];

  for (const page of response.results) {
    if (!("properties" in page)) continue;

    const p = (page as PageObjectResponse).properties;

    // Nombre (title field)
    const title =
      p.Nombre?.type === "title"
        ? getPlainText(p.Nombre.title)
        : "Untitled";

    // Slug (optional, auto-generated from title if empty)
    const slugRaw =
      p.Slug?.type === "rich_text"
        ? getPlainText(p.Slug.rich_text)
        : "";
    const slug = slugRaw || generateSlug(title);

    // Descripción (optional, auto-generated from content later if empty)
    const description =
      p["Descripción"]?.type === "rich_text"
        ? getPlainText(p["Descripción"].rich_text)
        : "";

    // Fecha Publicación (required, defaults to today)
    const fechaPub = p["Fecha Publicación"];
    const date =
      fechaPub?.type === "date" && fechaPub.date?.start
        ? fechaPub.date.start
        : new Date().toISOString().split("T")[0];

    // Responsable (people type — extract name)
    let author = "Medusa Capital";
    const responsable = p.Responsable;
    if (responsable?.type === "people" && responsable.people.length > 0) {
      const person = responsable.people[0];
      if ("name" in person && person.name) {
        author = person.name;
      }
    }

    // Tags (optional, merged with auto-generated tags later)
    const tags =
      p.Tags?.type === "multi_select"
        ? p.Tags.multi_select.map((t) => t.name)
        : [];

    // Category (required)
    const category =
      p.Category?.type === "select" && p.Category.select?.name
        ? (p.Category.select.name as "article" | "market-analysis")
        : "article";

    // Type (optional)
    const type =
      p.Type?.type === "select" && p.Type.select?.name
        ? p.Type.select.name
        : undefined;

    // Featured (optional)
    const featured =
      p.Featured?.type === "checkbox" ? p.Featured.checkbox : false;

    // Cover image
    let coverImage: string | undefined;
    const pageObj = page as PageObjectResponse;
    if (pageObj.cover) {
      if (pageObj.cover.type === "external") {
        coverImage = pageObj.cover.external.url;
      } else if (pageObj.cover.type === "file") {
        coverImage = pageObj.cover.file.url;
      }
    }

    articles.push({
      id: page.id,
      slug,
      title,
      description,
      date,
      author,
      tags,
      category,
      type,
      featured,
      coverImage,
    });
  }

  return articles;
}

// -------------------------------------------------------------------
// Sync logic
// -------------------------------------------------------------------

/**
 * Download cover image and return local public path.
 */
async function downloadCoverImage(
  url: string,
  slug: string
): Promise<string | null> {
  const imageDir = join(PUBLIC_IMG_DIR, slug);
  if (!existsSync(imageDir)) {
    mkdirSync(imageDir, { recursive: true });
  }

  const ext = guessImageExt(url);
  const filename = `cover${ext}`;
  const localPath = join(imageDir, filename);
  const publicPath = `/img/blog/${slug}/${filename}`;

  const success = await downloadImage(url, localPath);
  return success ? publicPath : null;
}

/**
 * Generate frontmatter string matching the BlogPost interface.
 */
function generateFrontmatter(
  article: NotionArticle,
  headerImage?: string
): string {
  const lines = ["---"];

  // title
  const escapedTitle = article.title.replace(/"/g, '\\"');
  lines.push(`title: "${escapedTitle}"`);

  // date
  lines.push(`date: "${article.date}"`);

  // description
  const escapedDesc = article.description.replace(/"/g, '\\"');
  lines.push(`description: "${escapedDesc}"`);

  // tags
  lines.push(`tags: [${article.tags.map((t) => `"${t}"`).join(", ")}]`);

  // type (optional)
  if (article.type) {
    lines.push(`type: "${article.type}"`);
  }

  // author
  lines.push(`author: "${article.author}"`);

  // image
  if (headerImage) {
    lines.push(`image: "${headerImage}"`);
  }

  // featured
  lines.push(`featured: ${article.featured}`);

  // published
  lines.push(`published: true`);

  // category
  lines.push(`category: "${article.category}"`);

  lines.push("---");
  return lines.join("\n");
}

/**
 * Sync a single article: convert content, download images, write file.
 */
async function syncArticle(
  notion: ReturnType<typeof getNotionClient>,
  article: NotionArticle
): Promise<void> {
  console.log(`\nSyncing: ${article.title}`);

  // Convert Notion page content to markdown
  let content = await pageToMarkdown(notion, article.id, article.slug);

  // Clean up Notion formatting artifacts
  content = cleanupContent(content, article.slug);

  // Auto-generate description if not set in Notion
  if (!article.description) {
    article.description = generateDescription(content);
  }

  // Merge Notion tags with auto-generated tags
  const autoTags = generateTags(content, article.title);
  const mergedTags = new Set([...article.tags, ...autoTags]);
  article.tags = Array.from(mergedTags).slice(0, 6);

  // Insert newsletter CTA marker
  content = insertNewsletterMarker(content);

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

  // Write the final markdown file
  const fullContent = `${frontmatter}\n\n${content}\n`;
  const filePath = join(CONTENT_DIR, `${article.slug}.md`);
  writeFileSync(filePath, fullContent, "utf-8");
  console.log(`  Saved: content/blog/${article.slug}.md`);
}

// -------------------------------------------------------------------
// Manifest management
// -------------------------------------------------------------------

function loadManifest(): SyncManifest {
  if (existsSync(SYNC_MANIFEST)) {
    const data = JSON.parse(readFileSync(SYNC_MANIFEST, "utf-8"));
    return { slugs: data.slugs || [], lastSync: data.lastSync || "" };
  }
  return { slugs: [], lastSync: "" };
}

function saveManifest(slugs: string[]): void {
  writeFileSync(
    SYNC_MANIFEST,
    JSON.stringify(
      { slugs, lastSync: new Date().toISOString() },
      null,
      2
    )
  );
}

/**
 * Remove articles that were previously synced but are no longer published.
 */
function removeUnpublishedArticles(
  previousSlugs: Set<string>,
  currentSlugs: Set<string>
): void {
  for (const slug of previousSlugs) {
    if (!currentSlugs.has(slug)) {
      console.log(`Removing unpublished article: ${slug}`);

      const filePath = join(CONTENT_DIR, `${slug}.md`);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }

      const imageDir = join(PUBLIC_IMG_DIR, slug);
      if (existsSync(imageDir)) {
        rmSync(imageDir, { recursive: true });
      }
    }
  }
}

// -------------------------------------------------------------------
// Main
// -------------------------------------------------------------------

async function main(): Promise<void> {
  // Graceful degradation: skip sync if not configured
  if (!isNotionConfigured()) {
    console.log("Notion sync skipped: NOTION_API_KEY or NOTION_DATABASE_ID not set");
    return;
  }

  console.log("Starting Notion sync...\n");

  // Ensure content directory exists
  if (!existsSync(CONTENT_DIR)) {
    mkdirSync(CONTENT_DIR, { recursive: true });
  }

  const notion = getNotionClient();
  const databaseId = getDatabaseId();

  // Fetch published articles
  console.log("Fetching published articles from Notion...");
  const articles = await fetchPublishedArticles(notion, databaseId);
  console.log(`Found ${articles.length} published article(s)`);

  // Load previous manifest
  const manifest = loadManifest();
  const previousSlugs = new Set(manifest.slugs);
  const currentSlugs = new Set(articles.map((a) => a.slug));

  // Remove articles no longer published
  removeUnpublishedArticles(previousSlugs, currentSlugs);

  // Sync each article
  for (const article of articles) {
    await syncArticle(notion, article);
  }

  // Save updated manifest
  saveManifest(articles.map((a) => a.slug));

  console.log("\nNotion sync complete!");
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
