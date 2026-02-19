import { basename } from "path";

/**
 * Generate a URL-friendly slug from a title.
 * Removes accents, special chars, and limits length.
 */
export function generateSlug(title: string): string {
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

/**
 * Generate a meta description from the first meaningful paragraph of content.
 * Skips headings, blockquotes, images, and lists.
 * Truncates to ~160 chars for SEO.
 */
export function generateDescription(content: string): string {
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
      return trimmed.length > 160 ? trimmed.slice(0, 157) + "..." : trimmed;
    }
  }
  return "Análisis de mercado por Medusa Capital.";
}

/**
 * Auto-generate tags from content and title based on keyword patterns.
 * Returns up to 6 tags.
 */
export function generateTags(content: string, title: string): string[] {
  const tags: Set<string> = new Set();
  const text = (content + " " + title).toLowerCase();

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

  tags.add("analisis");

  return Array.from(tags).slice(0, 6);
}

/**
 * Insert a <!-- newsletter --> marker at a natural break point in the article.
 * Finds the H2 heading closest to the 40-60% midpoint of the content.
 * Skips articles shorter than 40 lines or with fewer than 3 H2 headings.
 */
export function insertNewsletterMarker(content: string): string {
  const lines = content.split("\n");

  if (lines.length < 40) return content;

  const headingIndices: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s/.test(lines[i])) {
      headingIndices.push(i);
    }
  }

  if (headingIndices.length < 3) return content;

  const targetLine = Math.round(lines.length * 0.45);
  let bestIndex = headingIndices[0];
  let bestDistance = Math.abs(headingIndices[0] - targetLine);

  for (const idx of headingIndices) {
    const distance = Math.abs(idx - targetLine);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = idx;
    }
  }

  const minLine = Math.round(lines.length * 0.2);
  const maxLine = Math.round(lines.length * 0.8);
  if (bestIndex < minLine || bestIndex > maxLine) return content;

  lines.splice(bestIndex, 0, "", "<!-- newsletter -->", "");

  return lines.join("\n");
}

/**
 * Clean up markdown content exported from Notion.
 * Strips metadata fields, normalizes headings, fixes image paths,
 * and removes Twitter/X link formatting.
 */
export function cleanupContent(content: string, slug: string): string {
  // Strip Notion metadata fields that leak into content
  const notionMetaPattern =
    /^(Canales|Documento Link|Día \(auto\)|Estado|Fecha Publicación|Publicado en web|Semana \(auto\)|Responsable|Tipo|Pilar):.*$/gm;
  content = content.replace(notionMetaPattern, "");

  // Convert # **Title** to ## Title (normalize heading format)
  content = content.replace(/^#\s*\*\*(.+?)\*\*$/gm, "## $1");

  // Fix image paths - convert relative Notion paths to local format
  content = content.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, src) => {
      // Skip already-local paths
      if (src.startsWith("/img/")) return match;

      const decoded = decodeURIComponent(src);
      const filename = basename(decoded);
      const cleanFilename = filename.replace(/\s+/g, "-").toLowerCase();
      return `![${alt}](/img/blog/${slug}/${cleanFilename})`;
    }
  );

  // Remove Twitter/X cashtag links but keep the text
  content = content.replace(
    /\[\$([A-Z]+)\]\(https:\/\/x\.com\/search[^)]+\)/g,
    "$$$1"
  );

  // Remove Twitter/X handle links but keep the handle
  content = content.replace(
    /\[@([^\]]+)\]\(https:\/\/x\.com\/@[^)]+\)/g,
    "@$1"
  );

  // Remove empty blockquotes
  content = content.replace(/^>\s*$/gm, "");

  return content.trim();
}
