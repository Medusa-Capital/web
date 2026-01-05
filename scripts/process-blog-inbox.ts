// scripts/process-blog-inbox.ts
// Run with: bun scripts/process-blog-inbox.ts
// Options:
//   --dry-run    Preview what would be processed without making changes
//   --cleanup    Remove processed files from inbox after successful processing

import { readdirSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, rmSync, statSync } from "fs";
import { join, basename, extname } from "path";

const INBOX_DIR = join(process.cwd(), "content/inbox");
const BLOG_DIR = join(process.cwd(), "content/blog");
const PUBLIC_IMG_DIR = join(process.cwd(), "public/img/blog");

interface ArticleMetadata {
  title: string;
  date: string;
  author: string;
  description: string;
  tags: string[];
  slug: string;
  imageFolderPath: string | null;
}

interface ProcessedArticle {
  metadata: ArticleMetadata;
  content: string;
  images: string[];
}

// Parse the inbox markdown format to extract metadata
function parseInboxFile(filePath: string): ProcessedArticle | null {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  // Extract title from first H1 (format: "# ARTÍCULO: Title" or "# Title")
  const titleLine = lines.find((l) => l.startsWith("# "));
  if (!titleLine) {
    console.error(`  ⚠️  No title found in ${basename(filePath)}`);
    return null;
  }

  let title = titleLine.replace(/^#\s*/, "").trim();
  // Remove "ARTÍCULO: " prefix if present
  title = title.replace(/^ARTÍCULO:\s*/i, "").trim();

  // Extract metadata from key-value pairs
  const getMetaValue = (key: string): string | null => {
    const line = lines.find((l) => l.toLowerCase().startsWith(key.toLowerCase() + ":"));
    return line ? line.split(":").slice(1).join(":").trim() : null;
  };

  // Parse date from "Fecha Publicación: DD/MM/YYYY" format
  const rawDate = getMetaValue("Fecha Publicación");
  let date = new Date().toISOString().split("T")[0]; // Default to today
  if (rawDate) {
    const dateParts = rawDate.split("/");
    if (dateParts.length === 3) {
      const [day, month, year] = dateParts;
      date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }

  // Extract author from "Responsable" field
  const rawAuthor = getMetaValue("Responsable") || "Axel";
  const author = rawAuthor.replace(/_/g, " ").replace(/mnvn$/i, "").trim() || "Axel";

  // Generate slug from title
  const slug = generateSlug(title);

  // Find where the actual content starts (the first heading after metadata)
  // This is typically the repeated title without "ARTÍCULO:" prefix
  let contentStartIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip the first "# ARTÍCULO..." line and metadata, find the content title
    if (line.startsWith("#") && !line.startsWith("# ARTÍCULO")) {
      contentStartIndex = i;
      break;
    }
  }

  // Extract content (everything after the metadata section)
  let articleContent = lines.slice(contentStartIndex).join("\n").trim();

  // Remove the repeated title heading if present (it's already in frontmatter)
  // Matches: "# Title" or "# **Title**" at the start
  articleContent = articleContent.replace(/^#\s+\*?\*?[^#\n]+\*?\*?\s*\n+/, "");

  // Clean up the content
  articleContent = cleanupContent(articleContent, slug);

  // Generate description from first paragraph
  const description = generateDescription(articleContent);

  // Generate tags from content
  const tags = generateTags(articleContent, title);

  // Find associated image folder
  const inboxDir = join(filePath, "..");
  const imageFolderPath = findImageFolder(inboxDir, filePath);

  return {
    metadata: {
      title,
      date,
      author,
      description,
      tags,
      slug,
      imageFolderPath,
    },
    content: articleContent,
    images: imageFolderPath ? getImagesFromFolder(imageFolderPath) : [],
  };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/-+/g, "-") // Multiple hyphens to single
    .replace(/^-|-$/g, "") // Trim hyphens
    .slice(0, 60); // Limit length
}

function cleanupContent(content: string, slug: string): string {
  // Convert # **Title** to ## Title (normalize heading format)
  content = content.replace(/^#\s*\*\*(.+?)\*\*$/gm, "## $1");

  // Fix image paths - convert relative Notion paths to our format
  // Pattern: ![...](ARTÍCULO.../image.png) or ![...](image.png)
  content = content.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, src) => {
      // Extract just the filename
      const filename = basename(src);
      // Clean the filename (remove spaces, url encoding)
      const cleanFilename = decodeURIComponent(filename).replace(/\s+/g, "-").toLowerCase();
      return `![${alt}](/img/blog/${slug}/${cleanFilename})`;
    }
  );

  // Remove Twitter/X cashtag links but keep the text
  content = content.replace(/\[\$([A-Z]+)\]\(https:\/\/x\.com\/search[^)]+\)/g, "$$$1");

  // Remove Twitter/X handle links but keep the handle
  content = content.replace(/\[@([^\]]+)\]\(https:\/\/x\.com\/@[^)]+\)/g, "@$1");

  // Fix blockquote formatting
  content = content.replace(/^>\s*$/gm, ""); // Remove empty blockquotes

  return content.trim();
}

function generateDescription(content: string): string {
  // Get first meaningful paragraph (skip headings, blockquotes, images)
  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed &&
      !trimmed.startsWith("#") &&
      !trimmed.startsWith(">") &&
      !trimmed.startsWith("!") &&
      !trimmed.startsWith("-") &&
      !trimmed.startsWith("*") &&
      trimmed.length > 50
    ) {
      // Truncate to ~160 chars for SEO
      return trimmed.length > 160 ? trimmed.slice(0, 157) + "..." : trimmed;
    }
  }
  return "Análisis de mercado por Medusa Capital.";
}

function generateTags(content: string, title: string): string[] {
  const tags: Set<string> = new Set();
  const text = (content + " " + title).toLowerCase();

  // Common crypto/finance tags
  const tagPatterns: Record<string, RegExp> = {
    bitcoin: /bitcoin|\bbtc\b/,
    ethereum: /ethereum|\beth\b/,
    solana: /solana|\bsol\b/,
    analisis: /análisis|analisis/,
    mercado: /mercado/,
    institucional: /institucional|etf|blackrock|vanguard/,
    macro: /macro|liquidez|fed|tesoro|tga/,
    defi: /defi|dex|perp|hyperliquid|lighter/,
    tecnico: /técnico|soporte|resistencia|fibonacci/,
    onchain: /onchain|on-chain|reservas|exchange/,
  };

  for (const [tag, pattern] of Object.entries(tagPatterns)) {
    if (pattern.test(text)) {
      tags.add(tag);
    }
  }

  // Always include at least these
  tags.add("analisis");

  return Array.from(tags).slice(0, 6); // Limit to 6 tags
}

function findImageFolder(inboxDir: string, mdFilePath: string): string | null {
  const mdFilename = basename(mdFilePath, ".md");

  try {
    const items = readdirSync(inboxDir);

    // Look for a folder that matches the md filename pattern
    for (const item of items) {
      const itemPath = join(inboxDir, item);
      if (statSync(itemPath).isDirectory()) {
        // Check if folder name is similar to the md file (ignoring hash suffix)
        const mdBase = mdFilename.replace(/\s+[a-f0-9]{32}$/i, "").trim();
        const folderBase = item.replace(/\s+[a-f0-9]{32}$/i, "").trim();

        if (mdBase === folderBase || item.includes(mdBase.slice(0, 30))) {
          return itemPath;
        }
      }
    }
  } catch {
    // Folder doesn't exist or can't be read
  }

  return null;
}

function getImagesFromFolder(folderPath: string): string[] {
  try {
    const files = readdirSync(folderPath);
    return files.filter((f) => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f));
  } catch {
    return [];
  }
}

function processArticle(article: ProcessedArticle, dryRun: boolean): boolean {
  const { metadata, content, images } = article;
  const { slug, title, date, author, description, tags, imageFolderPath } = metadata;

  console.log(`\n📝 Processing: ${title}`);
  console.log(`   Slug: ${slug}`);
  console.log(`   Date: ${date}`);
  console.log(`   Author: ${author}`);
  console.log(`   Images: ${images.length}`);

  // Check if article already exists (duplicate detection)
  const existingFiles = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  for (const existing of existingFiles) {
    const existingSlug = existing.replace(".md", "");
    // Check for exact match or if one slug contains significant part of the other
    const slugWords = slug.split("-").slice(0, 4).join("-");
    const existingWords = existingSlug.split("-").slice(0, 4).join("-");

    if (slug === existingSlug || (slugWords.length > 10 && existingSlug.includes(slugWords))) {
      console.log(`   ⏭️  SKIPPED: Similar article already exists → ${existing}`);
      return false;
    }
  }

  if (dryRun) {
    console.log("   [DRY RUN] Would create blog post and copy images");
    return true;
  }

  // Create image directory
  const imgDir = join(PUBLIC_IMG_DIR, slug);
  if (images.length > 0) {
    mkdirSync(imgDir, { recursive: true });

    // Copy and rename images
    for (const img of images) {
      const cleanName = img.replace(/\s+/g, "-").toLowerCase();
      const srcPath = join(imageFolderPath!, img);
      const destPath = join(imgDir, cleanName);

      try {
        copyFileSync(srcPath, destPath);
        console.log(`   ✓ Copied: ${cleanName}`);
      } catch (err) {
        console.error(`   ✗ Failed to copy ${img}: ${err}`);
      }
    }
  }

  // Generate frontmatter
  const headerImage = images.length > 0 ? `/img/blog/${slug}/${images[0].replace(/\s+/g, "-").toLowerCase()}` : "";

  const frontmatter = `---
title: "${title}"
date: "${date}"
description: "${description.replace(/"/g, '\\"')}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
author: "${author}"
image: "${headerImage}"
featured: true
published: true
category: "article"
---`;

  // Write blog post
  const blogPath = join(BLOG_DIR, `${slug}.md`);
  const fullContent = `${frontmatter}\n\n${content}\n`;

  try {
    writeFileSync(blogPath, fullContent);
    console.log(`   ✓ Created: ${blogPath}`);
    return true;
  } catch (err) {
    console.error(`   ✗ Failed to write blog post: ${err}`);
    return false;
  }
}

function cleanupInboxItem(mdFilePath: string, imageFolderPath: string | null): void {
  try {
    rmSync(mdFilePath);
    console.log(`   🗑️  Removed: ${basename(mdFilePath)}`);

    if (imageFolderPath && existsSync(imageFolderPath)) {
      rmSync(imageFolderPath, { recursive: true });
      console.log(`   🗑️  Removed: ${basename(imageFolderPath)}/`);
    }
  } catch (err) {
    console.error(`   ⚠️  Cleanup failed: ${err}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const cleanup = args.includes("--cleanup");

  console.log("═══════════════════════════════════════════════════════════");
  console.log("  📥 Blog Inbox Processor");
  console.log("═══════════════════════════════════════════════════════════");

  if (dryRun) {
    console.log("  Mode: DRY RUN (no changes will be made)");
  }
  if (cleanup) {
    console.log("  Cleanup: Enabled (will remove processed files)");
  }

  // Check if inbox exists
  if (!existsSync(INBOX_DIR)) {
    console.log("\n⚠️  Inbox directory does not exist. Creating...");
    mkdirSync(INBOX_DIR, { recursive: true });
    console.log("✓ Created content/inbox/");
    console.log("\nNo articles to process.");
    return;
  }

  // Find all markdown files in inbox
  const files = readdirSync(INBOX_DIR).filter((f) => f.endsWith(".md"));

  if (files.length === 0) {
    console.log("\n✓ Inbox is empty. No articles to process.");
    return;
  }

  console.log(`\nFound ${files.length} article(s) to process:`);

  const processed: { path: string; imagePath: string | null }[] = [];
  let successCount = 0;

  for (const file of files) {
    const filePath = join(INBOX_DIR, file);
    const article = parseInboxFile(filePath);

    if (!article) {
      console.log(`\n⚠️  Skipping ${file} (parse error)`);
      continue;
    }

    const success = processArticle(article, dryRun);
    if (success) {
      successCount++;
      processed.push({
        path: filePath,
        imagePath: article.metadata.imageFolderPath,
      });
    }
  }

  // Cleanup if requested
  if (cleanup && !dryRun && processed.length > 0) {
    console.log("\n🧹 Cleaning up inbox...");
    for (const item of processed) {
      cleanupInboxItem(item.path, item.imagePath);
    }
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log(`  ✅ Processed: ${successCount}/${files.length} articles`);
  console.log("═══════════════════════════════════════════════════════════");

  if (!dryRun && successCount > 0) {
    console.log("\n💡 Next steps:");
    console.log("   1. Run 'bun run build' to verify");
    console.log("   2. Preview locally with 'bun run dev'");
    console.log("   3. Deploy when ready");
  }
}

main().catch(console.error);
