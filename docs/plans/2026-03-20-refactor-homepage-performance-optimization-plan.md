---
title: "refactor: Homepage Performance Optimization"
type: refactor
date: 2026-03-20
---

# Homepage Performance Optimization

## Overview

The homepage (`/`) scores **53 RES** on Vercel Speed Insights (P75, desktop, last 7 days) while `/blog/[slug]` (91) performs well. The problem is isolated to the homepage, which loads 14 eagerly-imported components with zero code splitting, massive unoptimized images, duplicate font declarations, and GPU-heavy decorative effects.

**Target:** Raise homepage RES from 53 → 90+ (matching blog pages).

## Current Metrics (Desktop, P75, Last 7 Days)

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Real Experience Score | 73 overall / **53 homepage** | 90+ | -37 pts |
| First Contentful Paint | 3.53s | <1.8s | -1.73s |
| Largest Contentful Paint | 4.27s | <2.5s | -1.77s |
| Time to First Byte | 1.1s | <0.8s | -0.3s |
| Interaction to Next Paint | 144ms | <200ms | OK |
| Cumulative Layout Shift | 0 | <0.1 | OK |

**Worst countries:** Romania (25), Netherlands (36), USA (38).

## Problem Statement

The homepage is the primary conversion tool (visitor → book a call). Every 100ms of delay costs conversion. The current 4.27s LCP means visitors wait over 4 seconds before seeing meaningful content. The root causes are:

1. **~8MB of unoptimized assets** loaded eagerly (images + fonts)
2. **Zero code splitting** — all 14 components and their JS shipped on initial load
3. **Duplicate font loading** — 2MB TTF loaded twice (next/font + CSS @font-face)
4. **GPU-heavy effects** — 72 testimonial cards with `backdrop-filter: blur(40px)`, 4 large gradient overlays
5. **Eager third-party loading** — Mux video player SDK loads on page load, not viewport

## Technical Approach

### Architecture

The homepage (`app/page.tsx`) renders 14 components in a single server component with no dynamic imports, no Suspense boundaries, and no intersection-observer-based lazy loading. The component tree:

```
page.tsx (server)
├── PageBackground (server) — 4x 1200×900px radial gradient divs
├── Header (client) — sticky nav, logo
├── Hero (client) — headline, MuxPlayer video, CTA ← ABOVE FOLD
├── ProblemSection (server)
├── AnalysisFrameworkSection (server, imports client PdfLeadCaptureForm)
├── InstitutionalQuotes (client) — horizontal scroll carousel
├── Features (server) — 647KB CSS background image
├── MissionSection (client) — spinning coin animation
├── Modules (client) — AnimatePresence tab switching
├── Team (client) — 3.2MB PNG team photos, misused `priority`
├── Testimonials (server) — 72 cards with backdrop-filter blur, infinite scroll
├── FAQ (client)
├── FinalCTA (client) — 313KB CSS background image
└── Footer (server)
```

### Implementation Phases

#### Phase 0: Baseline & Measurement (prerequisite)

**Goal:** Establish quantitative baselines so we can measure improvement per phase.

**Tasks:**

- [x] **0.1** Install `@next/bundle-analyzer` and run a production bundle analysis
  - `bun add -D @next/bundle-analyzer`
  - Add to `next.config.ts`: `withBundleAnalyzer` wrapper (enabled via `ANALYZE=true`)
  - Run `ANALYZE=true bun run build` and save the report screenshot
  - Record initial JS bundle sizes (First Load JS per route)
  - **File:** `next.config.ts`

- [x] **0.2** Compare TTFB across routes to determine if server-side work is needed
  - Run from multiple regions: `curl -o /dev/null -w "TTFB: %{time_starttransfer}s\n" https://medusacapital.xyz/` vs `/blog/some-slug`
  - If homepage TTFB is significantly higher than other routes → investigate SSR/ISR/middleware
  - If similar across routes → TTFB is CDN/network, not route-specific (proceed with client-side optimizations)
  - **Decision gate:** If TTFB >1.5s on homepage only, add a server-side investigation task before Phase 1

- [~] **0.3** Record pre-optimization conversion metrics
  - Export from GA4: homepage bounce rate, scroll depth, `book_call_click` rate, average session duration
  - Save as baseline for post-optimization comparison
  - Check `docs/analytics-pipeline-reference.md` for available events

- [x] **0.4** Search codebase for files planned for deletion to confirm they're unused
  - Verify `step-5.webp` (2.4MB) — **confirmed: zero code references**
  - Verify `step-sec-obj-light.webp` (655KB) — **confirmed: zero code references**
  - Verify `content-sec-obj-light.webp` (315KB) — **confirmed: zero code references**
  - Verify `video-poster.webp` (684KB) — **confirmed: zero code references**
  - Verify `@studio-freight/lenis` — **confirmed: zero code imports** (only in package.json/lockfile)

**Success criteria:** Bundle size report saved, TTFB comparison done, conversion baseline recorded, deletion candidates confirmed.

---

#### Phase 1: Image Optimization (highest impact, lowest risk)

**Goal:** Reduce total image payload from ~8MB to ~1.5MB without visual changes.

**Estimated FCP/LCP improvement:** 1.5-2.5s (this is the single biggest win).

**Tasks:**

- [x] **1.1** Delete confirmed unused images
  - `public/img/step-5.webp` (2.4MB) — no references
  - `public/img/step-sec-obj-light.webp` (655KB) — no references (dark mode only, no light theme)
  - `public/img/content-sec-obj-light.webp` (315KB) — no references
  - `public/img/video-poster.webp` (684KB) — no references
  - **Total freed:** ~4MB of dead weight (not loaded by browsers but clutters the repo)

- [x] **1.2** Convert team PNG photos to optimized WebP
  - Current sizes (all PNG, all below the fold):
    - `team-alex-new.png` — 1.4MB
    - `team-alejandro-gilabert.png` — 781KB
    - `team-alejandro-garcia.png` — 521KB
    - `team-borja.png` — 431KB
    - `team-esteban.png` — 97KB
  - Use `sharp` (already installed) to convert: `sharp input.png -resize 800 -webp quality=80 -o output.webp`
  - Target: each photo < 100KB at 800px wide (displayed at ~400-500px)
  - Update import paths in `Team.tsx` (references in the `teamMembers` data array)
  - **Files:** `components/landing/Team.tsx`, `public/img/team-*.png` → `team-*.webp`

- [x] **1.3** Compress `bruno.png` featured testimonial avatar
  - Current: 522KB PNG, displayed at 56×56px (`w-14 h-14`)
  - Convert to WebP, resize to 200×200px max (4x display size for retina)
  - Target: <20KB
  - Update path in `Testimonials.tsx` line 7
  - **Files:** `components/landing/Testimonials.tsx`, `public/img/avatar/bruno.png` → `bruno.webp`

- [x] **1.4** Compress CSS background images using `sharp`
  - `step-sec-obj.webp` (647KB, decorative medusa graphic in Features) → target ~100KB at 690px wide, quality 70
  - `cta-bg.webp` (313KB, FinalCTA background) → target ~80KB, quality 65
  - `content-sec-obj.webp` (370KB, content section) → target ~80KB, quality 70
  - `content-coing.webp` (278KB, spinning coin) → target ~60KB
  - Overwrite files in place (same paths, same names)
  - **Files:** `public/img/step-sec-obj.webp`, `public/img/cta-bg.webp`, `public/img/content-sec-obj.webp`, `public/img/content-coing.webp`

- [x] **1.5** Compress collaborator avatars (InstitutionalQuotes)
  - Current sizes: `javierdelvalle.jpg` (170KB), `elonmusk.jpg` (118KB), `diegopuertas.jpeg` (113KB), `pablogil.jpg` (89KB)
  - Displayed at ~48×48px. Resize to 200×200px, convert to WebP, target <15KB each
  - Update paths in `InstitutionalQuotes.tsx`
  - **Files:** `components/landing/InstitutionalQuotes.tsx`, `public/img/avatar/collaborators/*`

- [x] **1.6** Compress `hyperliquid.png` (808KB, used in TrackRecordCarousel + ROICalculator)
  - Convert to WebP, resize to appropriate display size, target <80KB
  - Update paths in `components/landing/track-record/TrackRecordCarousel.tsx:61` and `ROICalculator.tsx:55`
  - **Files:** `public/img/hyperliquid.png` → `hyperliquid.webp`, TrackRecordCarousel.tsx, ROICalculator.tsx

- [x] **1.7** Remove `priority` from below-fold Team photo
  - `Team.tsx:171` has `priority` on the selected team member photo — this forces preloading for an image far below the fold, competing with above-fold resources
  - Simply delete the `priority` prop
  - **File:** `components/landing/Team.tsx:171`

- [x] **1.8** Add `remotePatterns` to `next.config.ts` and remove `unoptimized` flags
  - `InstitutionalQuotes.tsx` uses `unoptimized` on external images from `encrypted-tbn0.gstatic.com` and `www.strategy.com`
  - Add these as `remotePatterns` in `next.config.ts` so Next.js can optimize them
  - Remove `unoptimized` prop from quotes that use local images (Ray Dalio, Elon Musk, etc.)
  - **Files:** `next.config.ts`, `components/landing/InstitutionalQuotes.tsx`

- [x] **1.9** Add `sizes` attribute to key Image components
  - Team photos: `sizes="(max-width: 768px) 100vw, 500px"`
  - Testimonial avatars: `sizes="48px"`
  - Collaborator avatars: `sizes="48px"`
  - This tells Next.js to generate appropriately sized srcsets for each breakpoint
  - **Files:** `Team.tsx`, `Testimonials.tsx`, `InstitutionalQuotes.tsx`

**Success criteria:** Run `ANALYZE=true bun run build`, compare First Load JS. Run Lighthouse locally and verify LCP improvement. Visually verify no image quality regression.

**CLS risk:** LOW — images keep same dimensions, only source files change.

---

#### Phase 2: Font Optimization (easy win, low risk)

**Goal:** Reduce font payload from ~2MB to ~400KB.

**Tasks:**

- [x] **2.1** Convert TTF fonts to WOFF2
  - Use a font conversion tool (e.g., `woff2_compress` or online converter)
  - Convert all 5 files:
    - `inter-regular.ttf` (335KB) → `inter-regular.woff2` (~80KB)
    - `inter-medium.ttf` (335KB) → `inter-medium.woff2` (~80KB)
    - `inter-semibold.ttf` (336KB) → `inter-semibold.woff2` (~80KB)
    - `inter-bold.ttf` (336KB) → `inter-bold.woff2` (~80KB)
    - `cormorant-bold.ttf` (650KB) → `cormorant-bold.woff2` (~150KB)
  - Place WOFF2 files alongside TTF files in `public/fonts/`
  - Update `layout.tsx` font declarations to reference WOFF2 files
  - **Files:** `app/layout.tsx:9-24`, `public/fonts/inter/*.woff2`, `public/fonts/cormorant/*.woff2`

- [x] **2.2** Remove duplicate `@font-face` declarations from `globals.css`
  - Lines 6-44 in `globals.css` declare the same fonts that `next/font/local` in `layout.tsx` already handles
  - `next/font/local` provides preloading, subsetting, and `font-display: swap` automatically
  - The CSS declarations load the fonts a second time without those optimizations
  - **ORDERING:** Only remove AFTER step 2.1 is complete and WOFF2 fonts are confirmed working
  - **File:** `app/globals.css:6-44` (delete these lines)

- [x] **2.3** Verify font rendering after changes
  - Check heading font (Cormorant Bold) renders correctly on all headings
  - Check body font (Inter 400/500/600/700) renders correctly
  - Verify no FOUT (Flash of Unstyled Text) regression
  - Test on Chrome, Safari, Firefox

**Success criteria:** Font payload reduced by ~75%. No visual font rendering changes. No CLS from font swap.

**CLS risk:** LOW — `font-display: swap` is already in use. WOFF2 files are smaller, so fonts load faster, reducing any swap flash.

---

#### Phase 3: Code Splitting & Lazy Loading (medium risk, high impact)

**Goal:** Reduce initial JS bundle by deferring below-fold component hydration.

**Estimated FCP improvement:** 0.5-1s (less JS to parse/execute on initial load).

**Critical constraint:** Current CLS is **0**. Every dynamic import needs a height-matched fallback to prevent regression.

**Tasks:**

- [x] **3.1** Dynamic import below-fold sections with `next/dynamic`
  - Convert these components from static imports to `dynamic()` in `app/page.tsx`:
    - `Modules` — client component, far below fold
    - `Team` — client component, far below fold, heaviest images
    - `Testimonials` — server-turned-client (72 DOM nodes, 3 gradient overlays)
    - `FAQ` — client component
    - `FinalCTA` — client component, 313KB background image
    - `Footer` — server component
  - Use **default SSR behavior** (NOT `ssr: false`) — content still renders in HTML for SEO, but JS hydration is deferred
  - Wrap each in `<Suspense>` with a height-matched skeleton fallback
  - **DO NOT** dynamically import above-fold or critical-path components: `Header`, `Hero`, `ProblemSection`, `AnalysisFrameworkSection`, `PageBackground`
  - **File:** `app/page.tsx`

  ```tsx
  // Example pattern
  import dynamic from "next/dynamic";

  const Modules = dynamic(() => import("@/components/landing/Modules").then(m => ({ default: m.Modules })), {
    loading: () => <div style={{ minHeight: "600px" }} />,
  });
  ```

- [x] **3.2** Design height-matched skeleton fallbacks for each dynamically imported section
  - Measure rendered height of each section at desktop (1280px) and mobile (375px) breakpoints
  - Create simple placeholder divs with `min-height` matching the measured values
  - Use responsive min-height: `style={{ minHeight: "clamp(400px, 50vh, 800px)" }}`
  - **CLS validation:** After implementing, run Lighthouse CLS audit — must remain at 0 or <0.01
  - **Files:** `app/page.tsx` (inline loading components)

- [x] **3.3** Defer MuxPlayer loading from "page" to viewport intersection
  - Current: `loading="page"` (line 97 in `Hero.tsx`) — loads SDK when page loads
  - Change to: `loading="viewport"` — loads SDK when video enters viewport
  - The Mux SDK (~100-200KB) is currently loaded eagerly even though the video is mid-fold
  - **Important:** The video is in the Hero section (above/near fold on desktop, below fold on mobile). Using `loading="viewport"` means it loads when scrolled into view, which is immediate on desktop but deferred on mobile — this is the correct behavior.
  - Verify: poster/thumbnail still shows before SDK loads (Mux `thumbnailTime={2}` should handle this)
  - **File:** `components/landing/Hero.tsx:97`

- [x] **3.4** Lazy-import `libphonenumber-js` in PdfLeadCaptureForm
  - This large validation library is imported in `AnalysisFrameworkSection` which renders on the homepage
  - The form is initially collapsed — most users never expand it
  - Convert to dynamic import that loads only when the form is expanded/focused
  - **File:** Find and modify the `PdfLeadCaptureForm` component import

- [x] **3.5** Run bundle analysis after code splitting
  - `ANALYZE=true bun run build`
  - Compare initial JS bundle per route against Phase 0 baseline
  - Verify that dynamically imported chunks are separate from the main bundle
  - Document the bundle size reduction

**Success criteria:** First Load JS for homepage reduced by 30%+. CLS remains at 0. All content still visible in server-rendered HTML (view-source check). Lighthouse Performance score improved.

**CLS risk:** MEDIUM — mitigated by height-matched fallbacks (step 3.2). Must validate.

**SEO risk:** LOW — using default SSR (not `ssr: false`), so HTML contains all content.

---

#### Phase 4: Third-Party & Bundle Cleanup (low risk, moderate impact)

**Goal:** Remove dead dependencies, optimize package imports, improve config.

**Tasks:**

- [x] **4.1** Remove dead `@studio-freight/lenis` dependency
  - Installed in `package.json` but never imported in any component
  - `bun remove @studio-freight/lenis`
  - **File:** `package.json`

- [x] **4.2** Add `optimizePackageImports` to `next.config.ts`
  - This enables automatic tree-shaking for large libraries
  - Add: `experimental: { optimizePackageImports: ["framer-motion", "lucide-react"] }`
  - `framer-motion` is imported in 9 components — tree-shaking reduces the bundle to only used features
  - `lucide-react` ships hundreds of icons — tree-shaking reduces to only used icons
  - **File:** `next.config.ts`

- [x] **4.3** Remove legacy CSS classes that are no longer used
  - `globals.css:311-328`: `testi-y` and `testi-y-inverse` keyframes (legacy testimonial animations)
  - `globals.css:331-335`: `.testimonial-card-bg` class — search codebase to confirm unused
  - `globals.css:338-340`: `.video-wrapper-bg` class — search codebase to confirm unused
  - **Only delete if confirmed zero references in component code**
  - **File:** `app/globals.css`

- [x] **4.4** Run final bundle analysis
  - `ANALYZE=true bun run build`
  - Compare against Phase 3 numbers
  - Document total bundle reduction from Phase 0 baseline

**Success criteria:** Dead dependency removed. Bundle size further reduced by tree-shaking. No unused CSS.

---

#### Phase 5: Paint Complexity Reduction (medium risk, moderate impact)

**Goal:** Reduce GPU/rendering cost of decorative effects, especially on testimonials.

**Tasks:**

- [x] **5.1** Optimize testimonial card backdrop-filter
  - Current: 72 cards each with `backdropFilter: 'blur(40px) saturate(150%)'` — extremely expensive
  - Replace with a simpler semi-transparent background that achieves a similar visual effect:
    ```tsx
    style={{
      background: 'rgba(10, 10, 60, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    }}
    ```
  - **Visual validation required** — screenshot before/after to ensure the dark theme aesthetic is preserved
  - **File:** `components/landing/Testimonials.tsx:136-139`

- [x] **5.2** Understand testimonial 4x duplication before changing
  - The `ScrollingColumn` duplicates testimonials 4x for seamless infinite scroll animation
  - The animation translates `-50%` (half the total height), so at least 2x is required for the loop to be seamless
  - **Test with 3x** (reduce from 4x to 3x): `[...testimonials, ...testimonials, ...testimonials]`
  - Check if the scroll animation has visible gaps at the 880px column height
  - If 3x works → use 3x. If gaps visible → keep 4x. **Do NOT blindly reduce to 2x.**
  - **File:** `components/landing/Testimonials.tsx:175`

- [x] **5.3** Simplify Testimonials gradient orbs
  - Current: 3 large absolutely positioned divs (400-600px) with `filter: blur(40-50px)`
  - These are purely decorative and are behind the cards
  - Option A: Replace with a single CSS radial-gradient on the section itself (no extra DOM nodes, no blur filter)
  - Option B: Reduce to 1 central gradient orb instead of 3
  - **File:** `components/landing/Testimonials.tsx:198-231`

- [x] **5.4** Verify PageBackground gradient performance
  - The 4 `.circle-radial` divs (1200×900px each) in `PageBackground.tsx` are positioned throughout the page
  - These are `absolute` positioned inside an `overflow-hidden` container — they only composite when in viewport
  - **Likely acceptable** — they're simple radial gradients without blur filters
  - Run a Lighthouse "Avoid large layout shifts" and "Reduce the impact of third-party code" audit to confirm
  - If flagged → convert to CSS gradients on the parent container
  - **Files:** `components/landing/PageBackground.tsx`, `app/globals.css:237-246`

**Success criteria:** Testimonials section renders without jank. Visual appearance preserved (screenshot comparison). Lighthouse "Avoid excessive DOM size" audit improves.

**CLS risk:** LOW — decorative elements don't affect layout.

---

## Alternative Approaches Considered

| Approach | Why Rejected |
|----------|--------------|
| Intersection Observer for conditional rendering | Removes content from SSR HTML, hurting SEO. `next/dynamic` with default SSR is better. |
| `ssr: false` on dynamic imports | Removes content from server HTML entirely. Bad for SEO on the primary conversion page. |
| Image CDN (Cloudinary/imgix) | Adds external dependency + cost. Next.js built-in image optimization is sufficient. |
| Service Worker caching | Over-engineering for this stage. Solve the source problem (asset size) first. |
| Move to ISR/static generation | Need to verify current rendering strategy first (Phase 0). May already be static. |
| Reduce framer-motion usage | High risk of breaking animations. `optimizePackageImports` tree-shaking is safer. |

## Acceptance Criteria

### Functional Requirements

- [ ] Homepage RES score ≥ 85 (stretch: 90+)
- [ ] FCP < 2.0s (from 3.53s)
- [ ] LCP < 2.5s (from 4.27s)
- [ ] All visual elements render identically (screenshot comparison)
- [ ] All CTAs and conversion flows work (book a call, lead capture form)
- [ ] Blog and welcome page scores do not regress

### Non-Functional Requirements

- [ ] CLS remains at 0 (or <0.01)
- [ ] INP remains under 200ms
- [ ] No SEO regression — all homepage content present in server-rendered HTML
- [ ] No accessibility regression
- [ ] Build succeeds without errors

### Quality Gates

- [ ] Lighthouse audit run before and after each phase
- [ ] Visual screenshot comparison for image compression and effect changes
- [ ] Bundle size comparison documented per phase
- [ ] Conversion metrics monitored for 7 days post-deployment

## Risk Analysis & Mitigation

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| CLS regression from Suspense fallbacks | High | Medium | Height-matched fallbacks, Lighthouse CLS audit after Phase 3 |
| TTFB is server-side, not fixable client-side | High | Low-Medium | Phase 0 TTFB comparison gates the rest of the plan |
| Image quality visibly degrades | Medium | Low | Screenshot comparison, conservative quality settings (70-80%) |
| Testimonial marquee breaks with fewer duplicates | Medium | Medium | Test with 3x before committing, keep 4x as fallback |
| Font rendering changes with WOFF2 | Low | Low | `font-display: swap` already in use, test across browsers |
| Conversion rate drops despite better scores | Medium | Low | GA4 baseline comparison after 7 days |
| Dynamic imports add loading jank | Medium | Medium | SSR preserves content in HTML, only hydration is deferred |

## Implementation Order & Dependencies

```
Phase 0 (Baseline)
    │
    ├── 0.1 Bundle analysis ─────────────────────┐
    ├── 0.2 TTFB comparison ──── DECISION GATE ──├── Phase 1-5 proceed if TTFB is CDN-level
    ├── 0.3 Conversion baseline                   │   (if TTFB is route-specific, add server investigation)
    └── 0.4 Confirm deletions                     │
                                                  │
Phase 1 (Images) ←────────────────────────────────┘
    │   No dependencies on other phases.
    │   Lowest risk, highest impact. Do first.
    │
Phase 2 (Fonts)
    │   2.1 (WOFF2 conversion) MUST complete before 2.2 (remove CSS @font-face)
    │   Independent of Phase 1.
    │
Phase 3 (Code Splitting) ── depends on Phase 0.1 (need baseline bundle numbers)
    │   3.1 + 3.2 are tightly coupled (dynamic imports need fallbacks)
    │   3.3 (MuxPlayer) is independent
    │   3.4 (libphonenumber) is independent
    │   3.5 (bundle analysis) depends on 3.1-3.4
    │
Phase 4 (Cleanup) ── depends on Phase 3.5 (need post-splitting bundle numbers)
    │
Phase 5 (Paint) ── independent, can run in parallel with Phase 3-4
    │   But lower priority, so sequence after.
```

**Phases 1 and 2 can run in parallel.** Phases 3-5 should be sequential.

## Testing Plan

1. **Before starting:** Run Lighthouse on production (`medusacapital.xyz`), save report
2. **After each phase:** Run Lighthouse on the dev server (`bun dev`), compare metrics
3. **Before deploying:** Run `bun run build` to verify production build succeeds
4. **After deploying:** Monitor Vercel Speed Insights for 7 days, compare against baseline
5. **Conversion monitoring:** Compare GA4 `book_call_click` rate and bounce rate for 7 days post-deploy vs pre-deploy

## Rollback Plan

- Each phase is an independent git commit on a feature branch
- If any phase causes regression, revert that specific commit
- Vercel preview deployments for each phase before merging to main
- If conversion rate drops >10% within 7 days, revert all changes and investigate

## References

### Internal References

- Homepage component tree: `app/page.tsx`
- Layout (fonts, GA, SpeedInsights): `app/layout.tsx:1-55`
- Hero (MuxPlayer, above fold): `components/landing/Hero.tsx:96-118`
- Features (647KB CSS bg): `components/landing/Features.tsx:43-56`
- Team (priority misuse): `components/landing/Team.tsx:171`
- Testimonials (72 cards, blur, 4x duplication): `components/landing/Testimonials.tsx:131-191`
- PageBackground (4 gradient divs): `components/landing/PageBackground.tsx:1-57`
- FinalCTA (313KB CSS bg): `components/landing/FinalCTA.tsx:28`
- InstitutionalQuotes (unoptimized external imgs): `components/landing/InstitutionalQuotes.tsx`
- CSS animations + font duplication: `app/globals.css:6-44, 272-340`
- Next.js config: `next.config.ts`
- Analytics pipeline docs: `docs/analytics-pipeline-reference.md`

### External References

- Vercel Speed Insights RES methodology: https://vercel.com/docs/speed-insights
- Next.js Image Optimization: https://nextjs.org/docs/app/building-your-application/optimizing/images
- Next.js `next/dynamic`: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading
- Core Web Vitals thresholds: https://web.dev/vitals/
- `optimizePackageImports`: https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports
