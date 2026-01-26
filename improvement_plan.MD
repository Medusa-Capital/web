# Medusa Capital TypeScript — Improvement Plan (Highest → Lowest Severity)

This plan is ordered by severity and dependency. Each item includes scope, steps, and completion criteria.

---

## 1) Security & Data Integrity (Critical)

### 1.1 Move external webhook URLs to server-side env vars
**Why:** Hardcoded Airtable webhook exposes sensitive integration and encourages abuse.

**Scope**
- `app/api/lead-capture/route.ts`
- environment configuration

**Steps**
1. Replace the hardcoded webhook URL with `process.env.AIRTABLE_WEBHOOK_URL`.
2. Fail fast with a 500 + clear message if env var is missing.
3. Ensure env var is set in deployment and local `.env`.

**Completion criteria**
- No webhook URLs in source.
- API route returns 500 with helpful error when env missing.
- `.env.example` documents required envs.

---

### 1.2 Validate and sanitize incoming form data on the server
**Why:** API currently forwards arbitrary JSON without validation.

**Scope**
- `app/api/lead-capture/route.ts`
- possibly new validation utility

**Steps**
1. Validate request body shape (e.g., `first_name`, `last_name`, `email`, `phone`, `consent`).
2. Enforce size limits and type checks (string lengths, email format, boolean consent).
3. Strip unknown fields before forwarding.

**Completion criteria**
- Invalid payloads return 400 with error details.
- Only allowed fields are forwarded.

---

### 1.3 Add basic abuse protections
**Why:** Public endpoint can be spammed.

**Scope**
- `app/api/lead-capture/route.ts`
- middleware (optional)

**Steps**
1. Add a simple rate limit by IP (e.g., 5 req/min).
2. Add an optional honeypot field to the form, reject if filled.
3. Ensure rate limiting works in serverless context.

**Completion criteria**
- Excess requests return 429.
- Honeypot trips are blocked.

---

## 2) UX Correctness & Event Tracking (High)

### 2.1 Fix modal close behavior and “seen” persistence
**Why:** Modal can reopen; close via overlay/esc doesn’t call `handleClose` and doesn’t track close.

**Scope**
- `components/landing/LeadCaptureModal.tsx`

**Steps**
1. Use `onOpenChange` to call `handleClose` on close.
2. Ensure “seen” is set on any close path.
3. Track close event for all dismissal methods.

**Completion criteria**
- Modal shows once per session.
- Analytics `lead_capture:close` fires for overlay/esc/close button.

---

### 2.2 Stabilize theme bootstrapping to avoid flash and reflow
**Why:** Theme starts forced `dark`, corrected after mount; causes flash + theme mismatch on first paint.

**Scope**
- `app/layout.tsx`
- `components/providers/ThemeProvider.tsx`
- CSS theme classes

**Steps**
1. Remove hardcoded `dark` class in `<html>`.
2. Apply theme class early using a minimal inline script or `next-themes`-style hydration safe approach.
3. Reduce theme usage to CSS variables and Tailwind variants where possible.

**Completion criteria**
- No flash between dark/light on initial load.
- Theme toggle persists and restores correctly.

---

## 3) Style System Consistency (High)

### 3.1 Centralize Medusa design tokens
**Why:** Heavy repetition of hex colors and inline gradients makes maintenance hard.

**Scope**
- `app/globals.css`
- landing/blog components

**Steps**
1. Define CSS custom properties for surfaces, text, borders, accents, and gradients.
2. Replace inline styles with classes or variables.
3. Create utility classes (e.g., `.medusa-card`, `.medusa-heading`).

**Completion criteria**
- 70%+ of inline colors removed.
- Tokens used across components.

---

### 3.2 Fix light theme coverage for blog pages
**Why:** Blog pages are dark-only, inconsistent with overall theme.

**Scope**
- `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
- `components/blog/BlogCard.tsx`, `MarkdownRenderer.tsx`

**Steps**
1. Add theme-aware classes/variables for blog text and card colors.
2. Verify headings, links, and code blocks have proper contrast.
3. Ensure a consistent typographic scale between pages.

**Completion criteria**
- Blog renders correctly in light + dark.
- Contrast meets basic AA requirements.

---

## 4) Component Reusability (Medium)

### 4.1 Extract shared layout primitives
**Why:** Repeated patterns across landing/blog/track-record.

**Scope**
- `components/landing/*`, `app/*`

**Steps**
1. Create `PageShell` (background + header + footer).
2. Create `Section`, `SectionHeader`, `CTA` primitives.
3. Replace repeated usage in 2–3 key pages.

**Completion criteria**
- Reused primitives reduce repeated markup by ~30%.
- No layout regressions on main routes.

---

### 4.2 Move static content into data modules
**Why:** Large arrays in components clutter render logic.

**Scope**
- `components/landing/Modules.tsx`, `Team.tsx`, `Testimonials.tsx`
- `app/colaboradores/page.tsx`

**Steps**
1. Move data into `content/` or `lib/data/` with types.
2. Import data into components.
3. Keep components focused on render logic.

**Completion criteria**
- Components reduced in size and complexity.
- Data modules typed and reusable.

---

## 5) Performance & Rendering (Medium)

### 5.1 Reduce client component usage
**Why:** Many components are client-only for theme access; unnecessary for pure markup.

**Scope**
- `components/landing/*`, `components/blog/*`

**Steps**
1. Replace `useTheme` in purely presentational components with CSS vars.
2. Keep client components only where state/interaction is required.

**Completion criteria**
- Client component count reduced by at least 25%.

---

### 5.2 Replace external images or whitelist domains
**Why:** Next Image in production requires remotePatterns for external URLs.

**Scope**
- `next.config.ts`
- components using external images

**Steps**
1. Add `remotePatterns` for used domains (coinmarketcap, youtube, etc.).
2. Consider hosting critical assets locally.

**Completion criteria**
- All external images load in prod without `unoptimized`.

---

## 6) Tooling & Hygiene (Low)

### 6.1 Ignore `figma/**` in linting and other tooling
**Why:** Figma folder is legacy and not part of live code.

**Scope**
- `eslint.config.mjs`
- any build scripts

**Steps**
1. Add `figma/**` to ESLint ignores.
2. Ensure tooling doesn’t traverse `figma`.

**Completion criteria**
- `eslint` runs without scanning figma.

---

### 6.2 Remove or isolate demo/example components
**Why:** `components/component-example.tsx` and `components/example.tsx` are unused.

**Scope**
- `components/component-example.tsx`
- `components/example.tsx`

**Steps**
1. Either delete or move into a `sandbox/` or `docs/` area.
2. Ensure no imports reference them.

**Completion criteria**
- No unused demo components in production paths.

---

## 7) Testing & QA (Low)

### 7.1 Add minimal tests for blog parsing and lead capture
**Why:** No first-party tests currently exist.

**Scope**
- `lib/blog.ts`
- `components/landing/LeadCaptureModal.tsx`

**Steps**
1. Add tests for blog parsing (published/featured sorting).
2. Add tests for lead capture validation and submit behavior.

**Completion criteria**
- Tests run in CI and cover core logic paths.

---

## Suggested Execution Order
1. Security & Data Integrity
2. UX Correctness & Event Tracking
3. Style System Consistency
4. Component Reusability
5. Performance & Rendering
6. Tooling & Hygiene
7. Testing & QA

---

## Notes
- The `figma/` folder is excluded from TypeScript (`tsconfig.json`) but still visible to tooling; treat it as legacy reference only.
- If light theme is not intended to ship, we can simplify and remove light support instead of fixing it. That decision affects multiple sections above.
