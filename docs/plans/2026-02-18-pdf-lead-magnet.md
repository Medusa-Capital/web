# PDF Lead Magnet Download Flow — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a PDF lead magnet download flow for the Sistema Medusa framework document, with inline form expansion in the AnalysisFrameworkSection, a dedicated thank you page with Calendly embed, GA4 funnel tracking, and full external tooling configuration (Airtable + Mailchimp).

**Architecture:** Inline form expansion below the existing CTA button in AnalysisFrameworkSection. Email-only PDF delivery via Mailchimp automation. Qualification data flows through existing Airtable webhook pipeline with new fields for segmentation.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Bun, Vercel

**Research:** See `docs/PDF Lead Magnet Implementation Strategy.md` for full Perplexity Deep Research backing all design decisions.

---

## Design Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Delivery | Email-only | <5K traffic, quality > volume, eliminates fake emails |
| Form fields | Match popup (first, last, email, phone optional, consent) | Operational consistency, same pipeline |
| Qualification | 2 required dropdowns (experience + challenge) | Enables segmentation, personalizes nurture |
| Form UX | Single-step MVP | 7 fields manageable for high-intent clickers; multi-step deferred to Phase 2 |
| Thank you page | `/gracias-sistema-medusa` with Calendly embed | Embedded widget = lowest friction for bookings |
| Nurture | 5 emails over 21 days | Research-backed for financial education + Spanish market |

---

## Task 1: Extract Shared Validation Helpers

**Files:**
- Create: `lib/validation.ts`
- Modify: `components/landing/LeadCaptureModal.tsx`

**Why:** The validation logic in `LeadCaptureModal.tsx` (lines 41-69) is identical to what the PDF form needs. Extract to a shared module to avoid duplication.

**Step 1: Create `lib/validation.ts`**

Extract these functions from `LeadCaptureModal.tsx`:
```typescript
// lib/validation.ts
import {
  parsePhoneNumberFromString,
  CountryCode,
} from "libphonenumber-js";

// Supported countries with their codes and flags
export const COUNTRIES = [
  { code: "ES" as CountryCode, flag: "\u{1F1EA}\u{1F1F8}", name: "Espa\u00f1a" },
  { code: "US" as CountryCode, flag: "\u{1F1FA}\u{1F1F8}", name: "Estados Unidos" },
  { code: "MX" as CountryCode, flag: "\u{1F1F2}\u{1F1FD}", name: "M\u00e9xico" },
  { code: "AR" as CountryCode, flag: "\u{1F1E6}\u{1F1F7}", name: "Argentina" },
  { code: "CO" as CountryCode, flag: "\u{1F1E8}\u{1F1F4}", name: "Colombia" },
  { code: "CL" as CountryCode, flag: "\u{1F1E8}\u{1F1F1}", name: "Chile" },
  { code: "PE" as CountryCode, flag: "\u{1F1F5}\u{1F1EA}", name: "Per\u00fa" },
  { code: "GB" as CountryCode, flag: "\u{1F1EC}\u{1F1E7}", name: "Reino Unido" },
  { code: "DE" as CountryCode, flag: "\u{1F1E9}\u{1F1EA}", name: "Alemania" },
  { code: "FR" as CountryCode, flag: "\u{1F1EB}\u{1F1F7}", name: "Francia" },
];

export const isValidName = (name: string): boolean => {
  const trimmed = name.trim();
  if (!trimmed) return false;
  const nameRegex = /^[\p{L}\s\-']+$/u;
  return nameRegex.test(trimmed) && /\p{L}/u.test(trimmed);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPhone = (phone: string, countryCode: CountryCode): boolean => {
  if (!phone.trim()) return true;
  const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
  return phoneNumber?.isValid() ?? false;
};

export const formatPhoneForSubmission = (
  phone: string,
  countryCode: CountryCode
): string => {
  if (!phone.trim()) return "";
  const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
  return phoneNumber?.format("E.164") ?? "";
};
```

**Step 2: Refactor `LeadCaptureModal.tsx`**

Replace lines 23-69 with imports from `lib/validation.ts`:
```typescript
import {
  COUNTRIES,
  isValidName,
  isValidEmail,
  isValidPhone,
  formatPhoneForSubmission,
} from "@/lib/validation";
```

Remove the local `COUNTRIES` array, `isValidName`, `isValidEmail`, `isValidPhone`, and `formatPhoneForSubmission` function definitions.

**Step 3: Verify**

Run `bun run build` — no regressions. The modal should function identically.

---

## Task 2: Build PdfLeadCaptureForm Component

**Files:**
- Create: `components/landing/PdfLeadCaptureForm.tsx`

**This is the main component.** It renders:
1. Initially: just the CTA button (matching current design exactly)
2. On click: the button area transitions to an expanded inline form below it
3. On submit: POST to `/api/lead-capture`, then redirect to `/gracias-sistema-medusa`

**Component structure:**

```typescript
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COUNTRIES,
  isValidName,
  isValidEmail,
  isValidPhone,
  formatPhoneForSubmission,
} from "@/lib/validation";
import { trackEvent, trackFormEvent, trackCTAClick } from "@/lib/analytics";
import { getUTMParamsForSubmission } from "@/lib/utm";
import { CountryCode, getCountryCallingCode } from "libphonenumber-js";
```

**State:**
```typescript
const [isExpanded, setIsExpanded] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState<string | null>(null);
const [acceptedTerms, setAcceptedTerms] = useState(false);
const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
const [showCountryDropdown, setShowCountryDropdown] = useState(false);

const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  experienceLevel: "",
  mainChallenge: "",
});

const [touched, setTouched] = useState({
  firstName: false,
  lastName: false,
  email: false,
  phone: false,
  experienceLevel: false,
  mainChallenge: false,
});
```

**Qualification options (constants):**
```typescript
const EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "Principiante (menos de 6 meses activo)" },
  { value: "intermediate", label: "Intermedio (6 meses - 2 a\u00f1os)" },
  { value: "advanced", label: "Avanzado (m\u00e1s de 2 a\u00f1os)" },
];

const CHALLENGE_OPTIONS = [
  { value: "fundamental_analysis", label: "No s\u00e9 c\u00f3mo analizar proyectos fundamentalmente" },
  { value: "macro_context", label: "No entiendo c\u00f3mo el contexto macro afecta los precios" },
  { value: "timing", label: "No s\u00e9 cu\u00e1ndo entrar o salir de posiciones" },
  { value: "risk_management", label: "Me cuesta gestionar el riesgo y las emociones" },
  { value: "other", label: "Otro desaf\u00edo" },
];
```

**Validation:**
```typescript
const validation = useMemo(() => ({
  firstName: isValidName(formData.firstName),
  lastName: isValidName(formData.lastName),
  email: isValidEmail(formData.email),
  phone: isValidPhone(formData.phone, selectedCountry.code),
  experienceLevel: formData.experienceLevel !== "",
  mainChallenge: formData.mainChallenge !== "",
}), [formData, selectedCountry.code]);

const isFormValid =
  validation.firstName &&
  validation.lastName &&
  validation.email &&
  validation.phone &&
  validation.experienceLevel &&
  validation.mainChallenge &&
  acceptedTerms;
```

**Form expansion handler:**
```typescript
const handleExpand = () => {
  setIsExpanded(true);
  trackCTAClick("pdf_sistema_medusa", "inline_form");
  trackEvent("pdf_cta_click", { cta_location: "analysis_framework_section" });
};
```

**Submit handler:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitError(null);
  trackFormEvent("pdf_sistema_medusa", "submit");

  // Mark all fields as touched
  setTouched({
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    experienceLevel: true,
    mainChallenge: true,
  });

  if (!isFormValid) return;

  setIsSubmitting(true);

  try {
    const formattedPhone = formatPhoneForSubmission(
      formData.phone,
      selectedCountry.code
    );
    const utmParams = getUTMParamsForSubmission();

    const response = await fetch("/api/lead-capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: formData.firstName.trim().toUpperCase(),
        last_name: formData.lastName.trim().toUpperCase(),
        email: formData.email.trim().toLowerCase(),
        phone: formattedPhone,
        consent: acceptedTerms,
        lead_source: "pdf_sistema_medusa",
        experience_level: formData.experienceLevel,
        main_challenge: formData.mainChallenge,
        ...utmParams,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al enviar el formulario");
    }

    trackFormEvent("pdf_sistema_medusa", "success");
    router.push("/gracias-sistema-medusa");
  } catch {
    trackFormEvent("pdf_sistema_medusa", "error");
    setSubmitError("Ha ocurrido un error. Por favor, int\u00e9ntalo de nuevo.");
  } finally {
    setIsSubmitting(false);
  }
};
```

**Render — collapsed state (matches current button exactly):**
```tsx
{!isExpanded && (
  <>
    <Button
      variant="primaryGlow"
      size="lg"
      onClick={handleExpand}
      className="px-8 py-6 text-base font-semibold rounded-xl gap-2 !bg-gradient-to-r !from-[#6B4CE6] !via-[#9074F6] !to-[#6B4CE6] shadow-[0_0_32px_rgba(144,116,246,0.45)] hover:shadow-[0_0_40px_rgba(144,116,246,0.6)]"
    >
      <Download className="w-5 h-5" />
      Descargar Sistema Medusa (PDF Gratis)
    </Button>
    <p className="text-sm mt-4 text-[#B9B8EB]/60">
      20 p\u00e1ginas \u2022 Casos de estudio \u2022 Checklists \u2022 Templates
    </p>
  </>
)}
```

**Render — expanded state:**

The expanded form should appear below the button position, with a smooth height transition. Style it as a card matching the section's dark glass aesthetic (similar to the step cards in AnalysisFrameworkSection: `bg-gradient-to-br from-[#1b1a64]/70 to-[#151450]/90`, `rounded-[20px]`, border `border-[#B9B8EB]/20`).

Form layout (single column, max-w-md, centered):
1. **Header**: "Descarga el Sistema Medusa" + subtext "Completa el formulario y te lo enviaremos por email"
2. **Row 1**: First name + Last name (2-column grid on md+)
3. **Row 2**: Email (full width)
4. **Row 3**: Phone with country selector (reuse pattern from LeadCaptureModal)
5. **Divider + label**: "Personaliza tu experiencia" + subtext "As\u00ed podemos enviarte contenido m\u00e1s relevante para tu nivel"
6. **Row 4**: Experience level (Select dropdown, full width)
7. **Row 5**: Main challenge (Select dropdown, full width)
8. **Row 6**: Consent checkbox
9. **Row 7**: Submit button: "Enviar y Recibir PDF"
10. **Error message area** (if submitError)

**Styling notes for all form inputs:**
- Match LeadCaptureModal: `bg-[#1b1a64]/50 border-[#B9B8EB]/20 text-white placeholder:text-[#B9B8EB]/40 h-12 rounded-xl`
- Error state: `border-red-500/50`
- Select dropdowns: Override shadcn Select styles to match dark theme (bg-[#1b1a64], text-white, border-[#B9B8EB]/20)
- Submit button: Match CTA gradient style
- Touch targets: min 44x44px for mobile

**Phone field:** Copy the country selector implementation from LeadCaptureModal (lines 341-422). Same COUNTRIES array (now from `lib/validation.ts`), same dropdown behavior.

**Select dropdowns:** Use shadcn `Select` component (`components/ui/select.tsx`) with dark theme overrides:
```tsx
<Select
  value={formData.experienceLevel}
  onValueChange={(value) =>
    setFormData((prev) => ({ ...prev, experienceLevel: value }))
  }
>
  <SelectTrigger className="w-full h-12 bg-[#1b1a64]/50 border-[#B9B8EB]/20 text-white rounded-xl">
    <SelectValue placeholder="Selecciona tu nivel de experiencia" />
  </SelectTrigger>
  <SelectContent className="bg-[#1b1a64] border-[#B9B8EB]/20">
    {EXPERIENCE_OPTIONS.map((opt) => (
      <SelectItem
        key={opt.value}
        value={opt.value}
        className="text-white hover:bg-[#4355d9]/20"
      >
        {opt.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

**Expansion animation:** Use CSS transition on max-height + opacity:
```tsx
<div
  className={`overflow-hidden transition-all duration-500 ease-out ${
    isExpanded ? "max-h-[800px] opacity-100 mt-8" : "max-h-0 opacity-0"
  }`}
>
  {/* Form card */}
</div>
```

**Step 1:** Create the component file with all the above logic.

**Step 2:** Track `pdf_form_start` when the first field receives focus:
```typescript
const handleFirstInteraction = () => {
  if (!hasTrackedStart) {
    trackFormEvent("pdf_sistema_medusa", "start");
    setHasTrackedStart(true);
  }
};
```
Add `onFocus={handleFirstInteraction}` to the firstName input.

**Step 3:** Verify the component renders correctly in isolation (import in AnalysisFrameworkSection — next task).

---

## Task 3: Update AnalysisFrameworkSection

**Files:**
- Modify: `components/landing/AnalysisFrameworkSection.tsx`

**Step 1: Replace the static CTA section (lines 328-342)**

Replace the current CTA block:
```tsx
{/* CTA Section */}
<div className="text-center mt-12 md:mt-16">
  <Button ...>
    ...
  </Button>
  <p ...>...</p>
</div>
```

With:
```tsx
{/* CTA Section */}
<div className="text-center mt-12 md:mt-16">
  <PdfLeadCaptureForm />
</div>
```

**Step 2: Add import**

```typescript
import { PdfLeadCaptureForm } from "./PdfLeadCaptureForm";
```

**Step 3: Remove unused imports**

Remove `Download` from the lucide-react imports (line 11) and `Button` from the ui imports (line 14) — ONLY if they're not used elsewhere in the component. Check first.

`Button` is only used on line 329 (the CTA) — safe to remove.
`Download` is only used on line 334 — safe to remove.

**Step 4: Verify**

Run `bun run build`. The section should render identically to before (button visible, no form until clicked).

---

## Task 4: Build Thank You Page

**Files:**
- Create: `app/gracias-sistema-medusa/page.tsx`

**Design:** Mirror the `/welcome` page structure (Header, Footer, PageBackground, Suspense boundary). Same visual language but with different content.

**Page structure:**

```typescript
// Server component — no "use client" needed for the page itself
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageBackground } from "@/components/landing/PageBackground";
import {
  CheckCircle2,
  Mail,
  Calendar,
  ArrowRight,
  Clock,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
```

**Section 1 — Hero / Confirmation:**
```
Icon: CheckCircle2 in green circle (same style as /welcome page)
Badge: "ENVIADO CON \u00c9XITO"
Headline: "\u00a1Tu Sistema Medusa est\u00e1 en camino!"
Subhead: "Revisa tu email ahora \u2014 te enviamos el PDF completo con el framework de 4 pasos, checklists y plantillas."
Instruction card (glass card):
  - Icon: Mail
  - "Normalmente llega en menos de 2 minutos"
  - "\u00bfNo lo ves? Revisa tu carpeta de spam o promociones"
  - "A\u00f1ade hola@medusacapital.xyz a tus contactos"
```

**Section 2 — Social Proof:**
```
Heading: "\u00danete a 250+ inversores que usan el Sistema Medusa"
3 testimonial cards (placeholder content for now):
  Card 1: "El framework me ayud\u00f3 a filtrar el 90% de tokens basura. Ahora s\u00f3lo invierto en lo que entiendo." \u2014 Carlos M., Madrid
  Card 2: "Antes compraba por hype. Ahora tengo un proceso sistem\u00e1tico que me da confianza." \u2014 Andrea L., Buenos Aires
  Card 3: "La secci\u00f3n de gesti\u00f3n de riesgo vale m\u00e1s que cualquier curso que haya pagado." \u2014 Pablo R., Barcelona
Stat: "El 85% de nuestros miembros reporta mayor confianza en sus decisiones de inversi\u00f3n"
```

Style: Same card pattern as `/welcome` page feature cards (`rounded-2xl p-6 border border-white/10 bg-[#1b1a64]/50 backdrop-blur-sm`).

**Section 3 — Calendly CTA (Primary):**
```
Pre-heading: "\u00bfQuieres acelerar tu progreso?"
Heading: "Agenda Tu Sesi\u00f3n Estrat\u00e9gica Gratuita (30 min)"
4 bullet benefits (with icons):
  - Shield: "Revisi\u00f3n personalizada de tu estrategia actual"
  - Target: "Identificaci\u00f3n de tus mayores riesgos (que probablemente no ves)"
  - TrendingUp: "Plan de acci\u00f3n espec\u00edfico para tus objetivos"
  - CheckCircle2: "Claridad sobre si Medusa Pro es adecuado para ti (sin presi\u00f3n)"

Calendly embed: Use an iframe pointing to the Calendly scheduling URL.
  <iframe
    src="https://calendly.com/medusacapital/sesion-estrategica"
    width="100%"
    height="700"
    frameBorder="0"
    className="rounded-xl"
  />

  NOTE: The exact Calendly URL needs to be confirmed by Javier. Use a placeholder
  and mark with a TODO comment.
```

**Section 4 — What to Expect:**
```
Heading (with ArrowRight icon): "Qu\u00e9 esperar en los pr\u00f3ximos d\u00edas"
3 numbered steps (same style as /welcome nextSteps):
  1. "Hoy: Recibir\u00e1s el PDF del Sistema Medusa por email"
  2. "En 4 d\u00edas: Contenido educativo personalizado sobre tu mayor desaf\u00edo"
  3. "En 2 semanas: Invitaci\u00f3n a una sesi\u00f3n estrat\u00e9gica gratuita"
```

**Section 5 — Secondary CTA:**
```
"Mientras tanto, explora m\u00e1s contenido"
Button linking to "/" or best blog post: "Visitar Medusa Capital" (secondaryGlow variant)
```

**Analytics:** Track Calendly CTA click:
```typescript
// If making Calendly a link instead of embed, add onClick tracking
trackEvent("calendly_click", { source: "gracias_sistema_medusa" });
```

Since the page is a server component, the Calendly click tracking needs to be in a small client component wrapper if using a button. If using iframe embed, the page load itself is sufficient tracking (GA4 auto-tracks pageviews).

**Step 1:** Create the page file with all sections above.

**Step 2:** Verify with `bun dev` — navigate to `/gracias-sistema-medusa` directly. Should render with Header, content, Footer.

---

## Task 5: Add GA4 Funnel Tracking Events

**Files:**
- Modify: `lib/analytics.ts`

**Step 1: Add PDF-specific tracking helpers**

Add to `lib/analytics.ts`:
```typescript
// Track PDF lead magnet funnel events
export function trackPdfFunnelEvent(
  action: "cta_click" | "form_start" | "form_submit" | "form_success" | "form_error",
  params?: Record<string, string | number | boolean>
) {
  trackEvent(`pdf_${action}`, {
    funnel: "pdf_sistema_medusa",
    category: EventCategory.FORM,
    ...params,
  });
}
```

**Step 2:** Verify the PdfLeadCaptureForm component (Task 2) uses these tracking calls at the right points:
- `pdf_cta_click` — when button is clicked and form expands
- `pdf_form_start` — when first field receives focus
- `pdf_form_submit` — when form is submitted (before API call)
- `pdf_form_success` — when API returns 200
- `pdf_form_error` — when API fails

These are already wired in the component code from Task 2. This task just adds the helper function to `lib/analytics.ts` for cleaner usage.

---

## Task 6: Add PDF Placeholder and Robots Disallow

**Files:**
- Create: `public/pdfs/` directory
- Create: `public/pdfs/.gitkeep` (placeholder until real PDF is added)
- Create: `app/robots.ts` (Next.js metadata robots)

**Step 1: Create directory structure**

```bash
mkdir -p public/pdfs
touch public/pdfs/.gitkeep
```

Add a comment file or README noting this is where `sistema-medusa.pdf` will go.

**Step 2: Create `app/robots.ts`**

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: ["/pdfs/"],
    },
    sitemap: "https://medusacapital.xyz/sitemap.xml",
  };
}
```

This prevents search engines from indexing the PDF directly, encouraging form submissions.

**Step 3: Verify** — `bun run build` passes. Check `/robots.txt` is generated correctly.

---

## Task 7: External Tooling Setup (Airtable + Mailchimp)

> This task is a configuration guide, not code. Javier will execute these steps manually in the Airtable and Mailchimp web interfaces.

### 7A: Airtable Configuration

**Step 1: Add new columns to the Leads table**

In the existing Airtable base (`appOy27N5Wx2OdFX3`), add 3 new fields to the leads table:

| Field Name | Type | Options |
|------------|------|---------|
| `lead_source` | Single Select | `popup_masterclass`, `pdf_sistema_medusa`, `newsletter_substack` |
| `experience_level` | Single Select | `beginner`, `intermediate`, `advanced` |
| `main_challenge` | Single Select | `fundamental_analysis`, `macro_context`, `timing`, `risk_management`, `other` |

**Step 2: Update existing Airtable automation**

The existing automation (triggered on new record) currently creates a Mailchimp contact. Modify it to:

1. **Condition check**: If `lead_source` = `pdf_sistema_medusa`:
   - Add Mailchimp tag: `PDF_Lead_Magnet_Sistema_Medusa`
   - Add experience tag based on `experience_level`:
     - `beginner` -> tag `PDF_Beginner`
     - `intermediate` -> tag `PDF_Intermediate`
     - `advanced` -> tag `PDF_Advanced`
   - Add challenge tag based on `main_challenge`:
     - `fundamental_analysis` -> tag `Challenge_Fundamental_Analysis`
     - `macro_context` -> tag `Challenge_Macro_Context`
     - `timing` -> tag `Challenge_Timing`
     - `risk_management` -> tag `Challenge_Risk_Management`
     - `other` -> tag `Challenge_Other`

2. **Else** (existing popup leads): Keep current behavior unchanged.

**Step 3: Verify**

Test by submitting a form on the staging site. Confirm:
- New fields appear in Airtable
- Mailchimp contact is created with correct tags

### 7B: Mailchimp Configuration

**Step 1: Create tags**

In Mailchimp audience, create these tags:
- `PDF_Lead_Magnet_Sistema_Medusa`
- `PDF_Beginner`, `PDF_Intermediate`, `PDF_Advanced`
- `Challenge_Fundamental_Analysis`, `Challenge_Macro_Context`, `Challenge_Timing`, `Challenge_Risk_Management`, `Challenge_Other`

**Step 2: Create automation workflow**

- **Trigger**: Tag `PDF_Lead_Magnet_Sistema_Medusa` is added to contact
- **Workflow name**: "Sistema Medusa PDF - Nurture Sequence"

**Email 1 — Day 0 (Immediate):**
- Subject: "\u2713 Tu Sistema Medusa est\u00e1 aqu\u00ed (+ plantillas exclusivas)"
- From: hola@medusacapital.xyz
- Content:
  - "Hola [FIRST_NAME], aqu\u00ed est\u00e1 tu Sistema Medusa..."
  - Primary CTA button: "Descargar Sistema Medusa (PDF)" -> `https://medusacapital.xyz/pdfs/sistema-medusa.pdf`
  - Bonus content links (if available): checklist, templates
  - Expectation setting: "Durante las pr\u00f3ximas 3 semanas, te enviar\u00e9 an\u00e1lisis exclusivos..."
  - P.S.: Soft Calendly link

**Email 2 — Day 4:**
- Subject: "El error de \u20ac10,000 que cometen el 85% de inversores crypto"
- Content: Educational value addressing common pain points
  - Reference their challenge (MVP: generic content, Phase 2: personalized by Challenge_* tag)
  - 300-500 words educational content
  - Case example using Sistema Medusa framework
  - P.S.: Soft Calendly link

**Email 3 — Day 8:**
- Subject: "C\u00f3mo [Name] pas\u00f3 de perder dinero a gestionar \u20ac50K con confianza"
- Content: Social proof / case study
  - Transformation story (before/after)
  - Connection to reader's situation
  - P.S.: Soft Calendly link

**Email 4 — Day 14:**
- Subject: "\u00bfListo para acelerar tu progreso?"
- Content: Strategy session introduction
  - What happens in the session (minute-by-minute breakdown)
  - Objection handling ("No es una llamada de ventas disfrazada...")
  - 4 benefits
  - Primary CTA: Calendly link (prominent button)
  - Testimonial from someone who booked

**Email 5 — Day 21:**
- Subject: "\u00daltima oportunidad: S\u00f3lo 3 sesiones disponibles esta semana"
- Content: Final push
  - Recap of value delivered over 3 weeks
  - Urgency: limited sessions
  - 2 short testimonials
  - Address final objection
  - Primary CTA: Calendly link
  - Scarcity reinforcement

**Step 3: Email template design**

Use Mailchimp's email designer. Brand guidelines:
- Dark theme (match website: bg dark navy, white/light text)
- Medusa Capital logo header
- Purple accent color (#6B4CE6) for CTA buttons
- Font: System sans-serif (Inter-like)
- Footer: Unsubscribe link, contact info, social links

**Step 4: Automation exit conditions**

- Exit if contact books a Calendly session (requires Calendly->Mailchimp integration or manual tag)
- Exit if contact unsubscribes

**Step 5: Test**

- Add yourself as a test contact with tag `PDF_Lead_Magnet_Sistema_Medusa`
- Verify Email 1 arrives immediately
- Verify delay timings are correct
- Verify PDF download link works
- Verify Calendly links work

---

## Verification Checklist

After all tasks are complete:

- [ ] CTA button in AnalysisFrameworkSection clicks and expands to inline form
- [ ] Form validates all 7 fields correctly (real-time inline validation)
- [ ] Phone field with country selector works (same as popup)
- [ ] Select dropdowns render with dark theme styling
- [ ] Form submits to `/api/lead-capture` with all fields including `lead_source`, `experience_level`, `main_challenge`
- [ ] On success, redirects to `/gracias-sistema-medusa`
- [ ] Thank you page renders with all 5 sections
- [ ] Calendly embed loads (or placeholder is visible)
- [ ] GA4 events fire at each funnel step (check browser console / GA4 DebugView)
- [ ] `/robots.txt` disallows `/pdfs/`
- [ ] `bun run build` passes with no errors
- [ ] `bun run lint` passes with no errors
- [ ] Airtable receives new fields correctly
- [ ] Mailchimp automation triggers on tag add
- [ ] Email 1 arrives with working PDF download link

---

## Phase 2 Backlog (Post-MVP)

- Upgrade to 2-step form with progress indicator ("Paso 1 de 2" / "Paso 2 de 2")
- Personalize Email 2 content by `Challenge_*` tag (Mailchimp conditional content blocks)
- Personalize Email 3 case study by `PDF_*` experience tag
- localStorage: suppress popup for users who already downloaded PDF
- A/B test: instant download vs email-only (measure fake email rate + downstream quality)
- Session counter on thank you page ("7 de 10 sesiones reservadas esta semana")
- Retargeting: detect form abandoners via localStorage, show targeted reminder
- Calendly webhook -> Mailchimp: auto-exit nurture sequence when session is booked
