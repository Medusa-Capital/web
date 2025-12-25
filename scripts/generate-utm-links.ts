// scripts/generate-utm-links.ts
// Run with: npx ts-node scripts/generate-utm-links.ts

const BASE_URL = "https://medusacapital.com";

interface Campaign {
  name: string;
  source: string;
  medium: string;
  content?: string;
}

const campaigns: Campaign[] = [
  // Social Media Campaigns
  { name: "launch_2025", source: "twitter", medium: "social", content: "bio_link" },
  { name: "launch_2025", source: "twitter", medium: "social", content: "thread" },
  { name: "launch_2025", source: "instagram", medium: "social", content: "bio_link" },
  { name: "launch_2025", source: "instagram", medium: "social", content: "story" },
  { name: "launch_2025", source: "instagram", medium: "social", content: "post" },
  { name: "launch_2025", source: "youtube", medium: "video", content: "description" },
  { name: "launch_2025", source: "youtube", medium: "video", content: "pinned_comment" },

  // Email Campaigns
  { name: "newsletter_weekly", source: "email", medium: "email", content: "header_cta" },
  { name: "newsletter_weekly", source: "email", medium: "email", content: "footer_cta" },
  { name: "launch_announcement", source: "email", medium: "email", content: "main_cta" },

  // Referral
  { name: "partner_jf", source: "jf_partners", medium: "referral" },
  { name: "affiliate", source: "affiliate", medium: "referral" },
];

function generateUTMLink(campaign: Campaign): string {
  const params = new URLSearchParams({
    utm_source: campaign.source,
    utm_medium: campaign.medium,
    utm_campaign: campaign.name,
    ...(campaign.content && { utm_content: campaign.content }),
  });

  return `${BASE_URL}?${params.toString()}`;
}

console.log("=== Medusa Capital UTM Links ===\n");

campaigns.forEach((campaign) => {
  const label = campaign.content
    ? `${campaign.source} / ${campaign.medium} / ${campaign.content}`
    : `${campaign.source} / ${campaign.medium}`;

  console.log(`📍 ${label}`);
  console.log(`   Campaign: ${campaign.name}`);
  console.log(`   ${generateUTMLink(campaign)}\n`);
});
