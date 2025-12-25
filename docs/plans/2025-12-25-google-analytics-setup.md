# Google Analytics 4 & Event Tracking Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Set up comprehensive analytics tracking with Google Analytics 4, UTM parameter tracking, and custom event tracking for all user interactions on the Medusa Capital landing page.

**Architecture:** Use `@next/third-parties` for GA4 integration (Next.js recommended approach), create a custom analytics utility for event tracking, and implement UTM parameter persistence using URL search params and sessionStorage.

**Tech Stack:** Next.js 16, TypeScript, Google Analytics 4, `@next/third-parties/google`

---

## Task 1: Install GA4 Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install @next/third-parties**

Run:
```bash
npm install @next/third-parties
```

**Step 2: Verify installation**

Run: `cat package.json | grep "third-parties"`
Expected: `"@next/third-parties": "^x.x.x"`

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @next/third-parties for GA4 integration"
```

---

## Task 2: Create Analytics Utility Module

**Files:**
- Create: `lib/analytics.ts`

**Step 1: Create the analytics utility file**

```typescript
// lib/analytics.ts
"use client";

// GA4 Measurement ID - replace with actual ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

// Type definitions for gtag
declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "set",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

// Event categories for consistent tracking
export const EventCategory = {
  CTA: "cta",
  FORM: "form",
  VIDEO: "video",
  NAVIGATION: "navigation",
  ENGAGEMENT: "engagement",
} as const;

// Track custom events
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

// Track CTA clicks
export function trackCTAClick(ctaName: string, destination?: string) {
  trackEvent("cta_click", {
    cta_name: ctaName,
    destination: destination || "unknown",
    category: EventCategory.CTA,
  });
}

// Track form events
export function trackFormEvent(
  formName: string,
  action: "start" | "submit" | "error" | "success"
) {
  trackEvent("form_interaction", {
    form_name: formName,
    action,
    category: EventCategory.FORM,
  });
}

// Track video events
export function trackVideoEvent(
  videoName: string,
  action: "play" | "pause" | "complete" | "progress",
  progress?: number
) {
  trackEvent("video_interaction", {
    video_name: videoName,
    action,
    ...(progress !== undefined && { progress_percent: progress }),
    category: EventCategory.VIDEO,
  });
}

// Track modal events
export function trackModalEvent(
  modalName: string,
  action: "open" | "close" | "submit"
) {
  trackEvent("modal_interaction", {
    modal_name: modalName,
    action,
    category: EventCategory.ENGAGEMENT,
  });
}

// Track outbound links
export function trackOutboundLink(url: string, linkText?: string) {
  trackEvent("outbound_click", {
    url,
    link_text: linkText || "unknown",
    category: EventCategory.NAVIGATION,
  });
}

// Track section views (for scroll tracking)
export function trackSectionView(sectionName: string) {
  trackEvent("section_view", {
    section_name: sectionName,
    category: EventCategory.ENGAGEMENT,
  });
}
```

**Step 2: Verify file was created**

Run: `ls -la lib/analytics.ts`
Expected: File exists

**Step 3: Commit**

```bash
git add lib/analytics.ts
git commit -m "feat: add analytics utility module with event tracking helpers"
```

---

## Task 3: Create UTM Parameter Utility

**Files:**
- Create: `lib/utm.ts`

**Step 1: Create the UTM utility file**

```typescript
// lib/utm.ts
"use client";

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

const UTM_KEYS: (keyof UTMParams)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

const STORAGE_KEY = "medusa_utm_params";

// Extract UTM parameters from URL
export function extractUTMFromURL(): UTMParams {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {};

  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });

  return utmParams;
}

// Store UTM parameters in sessionStorage
export function storeUTMParams(params: UTMParams): void {
  if (typeof window === "undefined" || Object.keys(params).length === 0) return;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  } catch {
    // sessionStorage not available
  }
}

// Retrieve stored UTM parameters
export function getStoredUTMParams(): UTMParams {
  if (typeof window === "undefined") return {};

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// Initialize UTM tracking - call on page load
export function initUTMTracking(): UTMParams {
  const urlParams = extractUTMFromURL();

  // Only store if we have new UTM params in the URL
  if (Object.keys(urlParams).length > 0) {
    storeUTMParams(urlParams);
    return urlParams;
  }

  // Return stored params if no new ones in URL
  return getStoredUTMParams();
}

// Get UTM params for form submissions or analytics
export function getUTMParamsForSubmission(): UTMParams {
  return getStoredUTMParams();
}

// Generate a URL with UTM parameters
export function generateUTMLink(
  baseUrl: string,
  params: UTMParams
): string {
  const url = new URL(baseUrl);

  UTM_KEYS.forEach((key) => {
    const value = params[key];
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

// Predefined campaign templates for easy link generation
export const CampaignTemplates = {
  twitter: (campaign: string, content?: string): UTMParams => ({
    utm_source: "twitter",
    utm_medium: "social",
    utm_campaign: campaign,
    utm_content: content,
  }),
  instagram: (campaign: string, content?: string): UTMParams => ({
    utm_source: "instagram",
    utm_medium: "social",
    utm_campaign: campaign,
    utm_content: content,
  }),
  email: (campaign: string, content?: string): UTMParams => ({
    utm_source: "email",
    utm_medium: "email",
    utm_campaign: campaign,
    utm_content: content,
  }),
  youtube: (campaign: string, content?: string): UTMParams => ({
    utm_source: "youtube",
    utm_medium: "video",
    utm_campaign: campaign,
    utm_content: content,
  }),
  referral: (source: string, campaign: string): UTMParams => ({
    utm_source: source,
    utm_medium: "referral",
    utm_campaign: campaign,
  }),
};
```

**Step 2: Verify file was created**

Run: `ls -la lib/utm.ts`
Expected: File exists

**Step 3: Commit**

```bash
git add lib/utm.ts
git commit -m "feat: add UTM parameter utility for campaign tracking"
```

---

## Task 4: Create Analytics Provider Component

**Files:**
- Create: `components/providers/AnalyticsProvider.tsx`
- Modify: `app/layout.tsx`

**Step 1: Create providers directory and component**

```typescript
// components/providers/AnalyticsProvider.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initUTMTracking, getStoredUTMParams } from "@/lib/utm";
import { trackEvent } from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize UTM tracking on mount
  useEffect(() => {
    const utmParams = initUTMTracking();

    // Send UTM params to GA4 if present
    if (Object.keys(utmParams).length > 0) {
      trackEvent("campaign_detected", {
        ...utmParams,
      });
    }
  }, []);

  // Track page views on route changes
  useEffect(() => {
    const utmParams = getStoredUTMParams();
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

    trackEvent("page_view", {
      page_path: pathname,
      page_url: url,
      ...utmParams,
    });
  }, [pathname, searchParams]);

  return <>{children}</>;
}
```

**Step 2: Verify file was created**

Run: `ls -la components/providers/AnalyticsProvider.tsx`
Expected: File exists

**Step 3: Commit**

```bash
git add components/providers/AnalyticsProvider.tsx
git commit -m "feat: add AnalyticsProvider component for page view tracking"
```

---

## Task 5: Integrate GA4 Script in Layout

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Update layout.tsx to include GA4 and AnalyticsProvider**

Add imports at the top:
```typescript
import { GoogleAnalytics } from "@next/third-parties/google";
import { Suspense } from "react";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
```

Add GA_MEASUREMENT_ID constant:
```typescript
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
```

Wrap children with AnalyticsProvider (inside Suspense for useSearchParams):
```typescript
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased">
        <Suspense fallback={null}>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </Suspense>
      </body>
      {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
    </html>
  );
}
```

**Step 2: Verify the changes**

Run: `cat app/layout.tsx | head -20`
Expected: See GoogleAnalytics import and AnalyticsProvider

**Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: integrate GA4 script and AnalyticsProvider in layout"
```

---

## Task 6: Create Environment Variable Configuration

**Files:**
- Create: `.env.local.example`
- Modify: `.gitignore` (if needed)

**Step 1: Create environment variable example file**

```bash
# .env.local.example
# Google Analytics 4 Measurement ID
# Get this from: Google Analytics > Admin > Data Streams > Web > Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Step 2: Verify .gitignore includes .env.local**

Run: `grep ".env.local" .gitignore`
Expected: `.env.local` or `.env*.local` in output

**Step 3: Create actual .env.local (user will need to add their GA ID)**

```bash
# .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

**Step 4: Commit example file**

```bash
git add .env.local.example
git commit -m "docs: add environment variable example for GA4"
```

---

## Task 7: Add CTA Tracking to Hero Component

**Files:**
- Modify: `components/landing/Hero.tsx`

**Step 1: Add analytics import**

```typescript
import { trackCTAClick, trackOutboundLink } from "@/lib/analytics";
```

**Step 2: Update the CTA button onClick handler**

Replace:
```typescript
onClick={() => window.open("https://calendly.com/contacto-medusacapital/30min", "_blank")}
```

With:
```typescript
onClick={() => {
  trackCTAClick("hero_cta", "calendly");
  trackOutboundLink("https://calendly.com/contacto-medusacapital/30min", "Quiero Reservar Mi Plaza");
  window.open("https://calendly.com/contacto-medusacapital/30min", "_blank");
}}
```

**Step 3: Verify the changes**

Run: `grep -n "trackCTAClick" components/landing/Hero.tsx`
Expected: Line with trackCTAClick call

**Step 4: Commit**

```bash
git add components/landing/Hero.tsx
git commit -m "feat: add analytics tracking to Hero CTA button"
```

---

## Task 8: Add CTA Tracking to FinalCTA Component

**Files:**
- Modify: `components/landing/FinalCTA.tsx`

**Step 1: Add "use client" directive if not present and analytics import**

The file already has "use client". Add import:
```typescript
import { trackCTAClick, trackOutboundLink } from "@/lib/analytics";
```

**Step 2: Update the CTA button onClick handler**

Replace:
```typescript
onClick={() => window.open("https://calendly.com/contacto-medusacapital/30min", "_blank")}
```

With:
```typescript
onClick={() => {
  trackCTAClick("final_cta", "calendly");
  trackOutboundLink("https://calendly.com/contacto-medusacapital/30min", "Quiero Reservar Mi Plaza");
  window.open("https://calendly.com/contacto-medusacapital/30min", "_blank");
}}
```

**Step 3: Verify the changes**

Run: `grep -n "trackCTAClick" components/landing/FinalCTA.tsx`
Expected: Line with trackCTAClick call

**Step 4: Commit**

```bash
git add components/landing/FinalCTA.tsx
git commit -m "feat: add analytics tracking to FinalCTA button"
```

---

## Task 9: Add Lead Capture Form Tracking

**Files:**
- Modify: `components/landing/LeadCaptureModal.tsx`

**Step 1: Add analytics and UTM imports**

```typescript
import { trackModalEvent, trackFormEvent, trackVideoEvent } from "@/lib/analytics";
import { getUTMParamsForSubmission } from "@/lib/utm";
```

**Step 2: Track modal open in useEffect**

Inside the useEffect that shows the modal, add tracking:
```typescript
useEffect(() => {
  const hasSeenModal = localStorage.getItem("medusa-lead-modal-seen");
  if (hasSeenModal) return;

  const timer = setTimeout(() => {
    setIsOpen(true);
    trackModalEvent("lead_capture", "open");
  }, 1000);

  return () => clearTimeout(timer);
}, []);
```

**Step 3: Track form submission in handleSubmit**

At the start of handleSubmit (after preventing default):
```typescript
trackFormEvent("lead_capture", "submit");
```

After successful submission (before setIsSubmitted(true)):
```typescript
trackFormEvent("lead_capture", "success");
trackVideoEvent("masterclass", "play");
```

In the catch block:
```typescript
trackFormEvent("lead_capture", "error");
```

**Step 4: Include UTM params in form submission**

Modify the fetch body to include UTM params:
```typescript
const utmParams = getUTMParamsForSubmission();

const response = await fetch("/api/lead-capture", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    first_name: formData.firstName.trim().toUpperCase(),
    last_name: formData.lastName.trim().toUpperCase(),
    email: formData.email.trim().toLowerCase(),
    phone: formattedPhone,
    consent: acceptedTerms,
    ...utmParams,
  }),
});
```

**Step 5: Track modal close in handleClose**

```typescript
const handleClose = () => {
  trackModalEvent("lead_capture", "close");
  setIsOpen(false);
  localStorage.setItem("medusa-lead-modal-seen", "true");
};
```

**Step 6: Verify the changes**

Run: `grep -n "trackModalEvent\|trackFormEvent" components/landing/LeadCaptureModal.tsx`
Expected: Multiple lines with tracking calls

**Step 7: Commit**

```bash
git add components/landing/LeadCaptureModal.tsx
git commit -m "feat: add comprehensive analytics tracking to lead capture modal"
```

---

## Task 10: Add FAQ Interaction Tracking

**Files:**
- Modify: `components/landing/FAQ.tsx`

**Step 1: Add analytics import**

```typescript
import { trackEvent } from "@/lib/analytics";
```

**Step 2: Track accordion interactions**

The Accordion component uses onValueChange. Wrap the Accordion with tracking:

Add a handler function in the FAQ component:
```typescript
const handleAccordionChange = (value: string) => {
  if (value) {
    const index = parseInt(value.replace("item-", ""));
    trackEvent("faq_expand", {
      faq_index: index,
      faq_question: faqs[index]?.question || "unknown",
      category: "engagement",
    });
  }
};
```

Update Accordion to use onValueChange:
```typescript
<Accordion
  type="single"
  collapsible
  defaultValue="item-0"
  className="w-full"
  onValueChange={handleAccordionChange}
>
```

**Step 3: Verify the changes**

Run: `grep -n "trackEvent" components/landing/FAQ.tsx`
Expected: Line with trackEvent call

**Step 4: Commit**

```bash
git add components/landing/FAQ.tsx
git commit -m "feat: add analytics tracking to FAQ accordion interactions"
```

---

## Task 11: Add Module Tab Tracking

**Files:**
- Modify: `components/landing/Modules.tsx`

**Step 1: Add analytics import**

```typescript
import { trackEvent } from "@/lib/analytics";
```

**Step 2: Track module tab changes**

Create a handler function:
```typescript
const handleModuleChange = (moduleId: number) => {
  const module = modules.find((m) => m.id === moduleId);
  trackEvent("module_view", {
    module_id: moduleId,
    module_title: module?.title || "unknown",
    category: "engagement",
  });
  setActiveModule(moduleId);
};
```

Update the button onClick:
```typescript
onClick={() => handleModuleChange(module.id)}
```

**Step 3: Verify the changes**

Run: `grep -n "trackEvent" components/landing/Modules.tsx`
Expected: Line with trackEvent call

**Step 4: Commit**

```bash
git add components/landing/Modules.tsx
git commit -m "feat: add analytics tracking to module tab interactions"
```

---

## Task 12: Add Team LinkedIn Click Tracking

**Files:**
- Modify: `components/landing/Team.tsx`

**Step 1: Add analytics import**

```typescript
import { trackOutboundLink } from "@/lib/analytics";
```

**Step 2: Update LinkedIn link onClick**

Modify the LinkedIn anchor tag:
```typescript
<a
  href={member.linkedin}
  target="_blank"
  rel="noopener noreferrer"
  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#4355d9] flex items-center justify-center hover:bg-[#0077b5] transition-colors shadow-lg"
  onClick={() => trackOutboundLink(member.linkedin, `LinkedIn - ${member.name}`)}
>
```

**Step 3: Verify the changes**

Run: `grep -n "trackOutboundLink" components/landing/Team.tsx`
Expected: Line with trackOutboundLink call

**Step 4: Commit**

```bash
git add components/landing/Team.tsx
git commit -m "feat: add analytics tracking to team LinkedIn links"
```

---

## Task 13: Add Header Navigation Tracking

**Files:**
- Modify: `components/landing/Header.tsx`

**Step 1: Add analytics import**

```typescript
import { trackEvent } from "@/lib/analytics";
```

**Step 2: Track Blog link click**

Update the Blog Link:
```typescript
<Link
  href="/blog"
  className="text-[#B9B8EB]/70 hover:text-white transition-colors font-medium"
  onClick={() => trackEvent("navigation_click", { destination: "blog", category: "navigation" })}
>
  Blog
</Link>
```

**Step 3: Track theme toggle**

Update the theme toggle button onClick:
```typescript
onClick={() => {
  const newMode = !isDark;
  setIsDark(newMode);
  trackEvent("theme_toggle", { theme: newMode ? "dark" : "light", category: "engagement" });
}}
```

**Step 4: Verify the changes**

Run: `grep -n "trackEvent" components/landing/Header.tsx`
Expected: Lines with trackEvent calls

**Step 5: Commit**

```bash
git add components/landing/Header.tsx
git commit -m "feat: add analytics tracking to header navigation"
```

---

## Task 14: Create UTM Link Generator Script

**Files:**
- Create: `scripts/generate-utm-links.ts`

**Step 1: Create the script file**

```typescript
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
```

**Step 2: Verify file was created**

Run: `ls -la scripts/generate-utm-links.ts`
Expected: File exists

**Step 3: Commit**

```bash
git add scripts/generate-utm-links.ts
git commit -m "feat: add UTM link generator script for campaign management"
```

---

## Task 15: Verify Build Passes

**Files:**
- None (verification only)

**Step 1: Run TypeScript type check**

Run: `npm run build`
Expected: Build completes without errors

**Step 2: If errors occur**

Fix any TypeScript errors in the files modified above.

**Step 3: Commit any fixes**

```bash
git add .
git commit -m "fix: resolve build errors in analytics implementation"
```

---

## Task 16: Update API Route to Store UTM Params

**Files:**
- Modify: `app/api/lead-capture/route.ts`

**Step 1: Update the route to accept UTM params**

The route should already forward all body fields to Airtable. Verify UTM fields are included:

```typescript
import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_WEBHOOK_URL =
  "https://hooks.airtable.com/workflows/v1/genericWebhook/appm5ImZjJIK6m2yl/wflRiDLbj1jjOabcs/wtr0vVMTBQHF662Cf";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Body now includes UTM params: utm_source, utm_medium, utm_campaign, utm_term, utm_content
    const response = await fetch(AIRTABLE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to submit to Airtable" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

**Step 2: Verify the route handles UTM params**

Run: `cat app/api/lead-capture/route.ts`
Expected: Route forwards complete body to Airtable

**Step 3: Commit if changes were made**

```bash
git add app/api/lead-capture/route.ts
git commit -m "docs: add comment about UTM param forwarding in lead capture API"
```

---

## Task 17: Create Analytics Documentation

**Files:**
- Create: `docs/analytics-setup.md`

**Step 1: Create documentation file**

```markdown
# Analytics Setup Documentation

## Overview

This document describes the analytics implementation for Medusa Capital landing page.

## Google Analytics 4 Setup

### Configuration

1. Create a GA4 property at https://analytics.google.com/
2. Get your Measurement ID (format: G-XXXXXXXXXX)
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### Events Tracked

| Event Name | Category | Description |
|------------|----------|-------------|
| `page_view` | - | Automatic on route change |
| `cta_click` | cta | CTA button clicks |
| `form_interaction` | form | Form start/submit/success/error |
| `video_interaction` | video | Video play/pause/complete |
| `modal_interaction` | engagement | Modal open/close/submit |
| `outbound_click` | navigation | External link clicks |
| `faq_expand` | engagement | FAQ accordion expansion |
| `module_view` | engagement | Module tab selection |
| `navigation_click` | navigation | Internal navigation |
| `theme_toggle` | engagement | Dark/light mode toggle |
| `campaign_detected` | - | UTM params detected |

## UTM Parameter Tracking

### Supported Parameters

- `utm_source` - Traffic source (twitter, email, etc.)
- `utm_medium` - Marketing medium (social, email, etc.)
- `utm_campaign` - Campaign name
- `utm_term` - Paid search terms (optional)
- `utm_content` - Content identifier (optional)

### Link Generation

Use the script to generate UTM links:
```bash
npx ts-node scripts/generate-utm-links.ts
```

### Example Links

```
# Twitter bio link
https://medusacapital.com?utm_source=twitter&utm_medium=social&utm_campaign=launch_2025&utm_content=bio_link

# Email newsletter
https://medusacapital.com?utm_source=email&utm_medium=email&utm_campaign=newsletter_weekly&utm_content=header_cta
```

## Data Flow

1. User arrives with UTM parameters → stored in sessionStorage
2. UTM params sent to GA4 with `campaign_detected` event
3. UTM params included with lead capture form submission
4. All UTM params forwarded to Airtable webhook

## Testing

1. Add `?utm_source=test&utm_medium=test&utm_campaign=test` to URL
2. Open browser DevTools → Network tab
3. Verify GA4 requests include custom events
4. Submit lead form and verify UTM params in Airtable

## GA4 Dashboard Setup

Recommended custom reports:

1. **Acquisition by Campaign** - Group by utm_campaign
2. **CTA Performance** - Filter by event_name = cta_click
3. **Lead Form Funnel** - Sequence: modal_open → form_submit → form_success
4. **Content Engagement** - FAQ, Module, Video interactions
```

**Step 2: Verify file was created**

Run: `ls -la docs/analytics-setup.md`
Expected: File exists

**Step 3: Commit**

```bash
git add docs/analytics-setup.md
git commit -m "docs: add comprehensive analytics setup documentation"
```

---

## Summary

After completing all tasks, you will have:

1. **GA4 Integration** - Using `@next/third-parties/google` (Next.js recommended)
2. **Event Tracking** - Custom events for all user interactions
3. **UTM Parameter Tracking** - Full campaign attribution support
4. **Lead Attribution** - UTM params included in Airtable submissions
5. **Documentation** - Setup guide and event reference

### Key Files Created/Modified

| File | Action |
|------|--------|
| `lib/analytics.ts` | Created - Event tracking utilities |
| `lib/utm.ts` | Created - UTM parameter handling |
| `components/providers/AnalyticsProvider.tsx` | Created - Page view tracking |
| `app/layout.tsx` | Modified - GA4 script integration |
| `components/landing/Hero.tsx` | Modified - CTA tracking |
| `components/landing/FinalCTA.tsx` | Modified - CTA tracking |
| `components/landing/LeadCaptureModal.tsx` | Modified - Form/modal tracking |
| `components/landing/FAQ.tsx` | Modified - Accordion tracking |
| `components/landing/Modules.tsx` | Modified - Tab tracking |
| `components/landing/Team.tsx` | Modified - LinkedIn tracking |
| `components/landing/Header.tsx` | Modified - Navigation tracking |
| `scripts/generate-utm-links.ts` | Created - UTM link generator |
| `docs/analytics-setup.md` | Created - Documentation |

### Next Steps After Implementation

1. Create GA4 property and get Measurement ID
2. Add Measurement ID to `.env.local`
3. Configure Airtable to capture UTM fields
4. Set up GA4 custom reports and dashboards
5. Test all tracking events in GA4 DebugView
