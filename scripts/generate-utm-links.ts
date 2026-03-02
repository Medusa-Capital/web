// scripts/generate-utm-links.ts
// Generates UTM links following docs/crm/utm-taxonomy.md
// Run with: bun run scripts/generate-utm-links.ts

const BASE_URL = "https://staging.medusacapital.xyz";

interface UTMLink {
  campaign: string;
  source: string;
  medium: string;
  content?: string;
  label?: string;
}

// Add new links here as needed. Follow docs/crm/utm-taxonomy.md for naming.
const links: UTMLink[] = [
  // Organic bio links (evergreen)
  { campaign: "organic_bio_2026", source: "x", medium: "social", content: "bio_link", label: "X bio" },
  { campaign: "organic_bio_2026", source: "youtube", medium: "social", content: "bio_link", label: "YouTube bio" },
  { campaign: "organic_bio_2026", source: "instagram", medium: "social", content: "bio_link", label: "Instagram bio" },

  // Newsletter
  { campaign: "newsletter_semanal", source: "newsletter", medium: "email", content: "header_cta", label: "Newsletter header" },
  { campaign: "newsletter_semanal", source: "newsletter", medium: "email", content: "footer_cta", label: "Newsletter footer" },

  // Partner template (copy and customize per campaign)
  // { campaign: "campaign_slug", source: "partnername", medium: "social", content: "x_post", label: "Partner X post" },
];

function generateUTMLink(link: UTMLink): string {
  const params = new URLSearchParams({
    utm_source: link.source,
    utm_medium: link.medium,
    utm_campaign: link.campaign,
    ...(link.content && { utm_content: link.content }),
  });

  return `${BASE_URL}?${params.toString()}`;
}

console.log("=== Medusa Capital UTM Links ===\n");
console.log(`Base URL: ${BASE_URL}\n`);

links.forEach((link) => {
  const label = link.label || `${link.source} / ${link.medium} / ${link.content || "—"}`;
  console.log(`  ${label}`);
  console.log(`  Campaign: ${link.campaign}`);
  console.log(`  ${generateUTMLink(link)}\n`);
});
