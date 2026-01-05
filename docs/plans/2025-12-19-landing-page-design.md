# Medusa Capital Design System

## Overview

A comprehensive design system for Medusa Capital's landing page, built with Next.js, Tailwind CSS, and shadcn/ui components. The aesthetic is a dark, premium fintech style featuring deep navy backgrounds, glassmorphic cards, and subtle purple/violet accents.

---

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing Scale](#spacing-scale)
4. [Layout Patterns](#layout-patterns)
5. [Component Patterns](#component-patterns)
6. [Visual Effects](#visual-effects)
7. [Animation Patterns](#animation-patterns)
8. [Responsive Design](#responsive-design)

---

## Color System

### Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--medusa-navy` | `#010052` | Primary background |
| `--medusa-lavender` | `#B9B8EB` | Accent text, highlights |
| `--medusa-text-primary` | `#FFFFFF` | Headlines, primary text |
| `--medusa-text-secondary` | `#cccce0` | Body text |
| `--medusa-text-muted` | `#cccce0/60` or `#B9B8EB/50` | Subtle labels, descriptions |

### Interactive Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--medusa-primary` | `#4355d9` | Primary buttons, active states |
| `--medusa-primary-hover` | `#6366f1` | Hover states |
| `--medusa-accent-blue` | `#3a54f8` | Button gradients |
| `--medusa-accent-orange` | `#e85c30` to `#ff7a4d` | Secondary CTA gradient |

### Surface Colors

```css
/* Glass card backgrounds */
--medusa-glass: rgba(255, 255, 255, 0.1);
--medusa-glass-dark: rgba(255, 255, 255, 0.05);

/* Card solid backgrounds */
--medusa-card-solid: #1b1a64;
--medusa-card-gradient: linear-gradient(0deg, rgba(1, 0, 82, 1) 0%, rgba(185, 184, 235, 0.1) 100%);

/* Borders */
--medusa-border: rgba(255, 255, 255, 0.1);
--medusa-border-subtle: rgba(185, 184, 235, 0.1);
--medusa-border-accent: #535296;
```

### Code Examples

```tsx
// Primary text on dark background
<h1 className="text-white">Headline</h1>

// Secondary body text
<p className="text-[#cccce0]">Body text</p>

// Muted/subtle text
<span className="text-[#cccce0]/60">Label</span>
<span className="text-[#B9B8EB]/50">Hint text</span>

// Accent highlight text
<span className="text-[#B9B8EB]">Highlighted</span>

// Interactive blue text
<span className="text-[#3a54f8]">Link or stat</span>
<span className="text-[#6366f1]">Module subtitle</span>
<span className="text-cyan-400">Username</span>
```

---

## Typography

### Font Families

```css
/* Headings - Cormorant Bold (serif) */
font-family: "Cormorant-Bold", serif;
/* Applied via: font-[family-name:var(--font-heading)] */

/* Body - Inter (sans-serif) */
font-family: "Inter", sans-serif;
/* Applied via: font-[family-name:var(--font-sans)] or default */
```

### Type Scale

| Element | Size | Line Height | Weight | Class Pattern |
|---------|------|-------------|--------|---------------|
| H1 (Hero) | `clamp(1.5rem, 6vw, 4.5rem)` | `tight` | Bold | `text-[clamp(1.5rem,6vw,4.5rem)] font-bold leading-tight` |
| H2 (Section) | `clamp(28px, 4.5vw, 60px)` | `tight` | Bold | `text-[clamp(28px,4.5vw,60px)] font-bold leading-tight` |
| H3 (Card) | `text-xl lg:text-2xl` | `tight` | Bold | `text-xl md:text-2xl font-bold leading-tight` |
| H4 (Subsection) | `text-lg lg:text-xl` | Default | Semibold | `text-lg lg:text-xl font-semibold` |
| Body Large | `clamp(16px, 2vw, 20px)` | `relaxed` | Normal | `text-[clamp(16px,2vw,20px)] leading-relaxed` |
| Body Default | `text-base md:text-lg` | `relaxed` | Normal | `text-base md:text-lg leading-relaxed` |
| Body Small | `text-sm lg:text-base` | `relaxed` | Normal | `text-sm lg:text-base leading-relaxed` |
| Caption | `text-xs` | Default | Normal | `text-xs` |

### Code Examples

```tsx
// Hero headline (Cormorant)
<h1
  className="font-[family-name:var(--font-heading)] font-bold text-white leading-tight capitalize"
  style={{ fontSize: 'clamp(1.5rem, 6vw, 4.5rem)' }}
>
  Formación En Criptomonedas
  <br />
  <span className="text-[#B9B8EB]">Para Inversores Exigentes</span>
</h1>

// Section headline
<h2 className="font-[family-name:var(--font-heading)] text-[clamp(28px,4.5vw,60px)] font-bold text-white leading-tight mb-6">
  Section Title
</h2>

// Card title
<h3 className="text-white font-bold text-xl md:text-2xl mb-3 leading-tight">
  Card Title
</h3>

// Body paragraph
<p className="text-[#cccce0] text-base md:text-lg leading-relaxed">
  Body text content here
</p>

// Small description
<p className="text-[#B9B8EB]/60 text-sm leading-relaxed">
  Description or hint text
</p>
```

---

## Spacing Scale

### Section Spacing

| Context | Desktop | Mobile | Class Pattern |
|---------|---------|--------|---------------|
| Section vertical padding | `100px` | `64px` (py-16) | `py-16 md:py-[100px]` |
| Section horizontal padding | `24px` | `16px` | `px-4 md:px-6` |
| Between major sections | `100px` margin-top | `64px` | `mt-0` (handled by py) |

### Container Widths

| Container | Max Width | Usage |
|-----------|-----------|-------|
| Default content | `max-w-6xl` (1152px) | Standard sections |
| Narrow content | `max-w-5xl` (1024px) | Modules section |
| Text content | `max-w-4xl` (896px) | Hero, centered text |
| Narrow text | `max-w-2xl` (672px) | Paragraphs |
| CTA card | `max-w-[973px]` | Final CTA |

### Component Spacing

| Context | Value | Class |
|---------|-------|-------|
| Card padding (desktop) | `32px` | `p-8` or `p-[clamp(20px,2vw,32px)]` |
| Card padding (mobile) | `20px` | `p-5` |
| Gap between cards | `32px` | `gap-8` |
| Gap between items | `16px` | `gap-4` |
| Headline margin-bottom | `24px` | `mb-6` |
| Paragraph margin-bottom | `16px` or `32px` | `mb-4` or `mb-8` |
| Section header margin-bottom | `48-64px` | `mb-8 md:mb-12` or `mb-10 md:mb-16` |

### Code Examples

```tsx
// Standard section wrapper
<section className="relative py-16 md:py-[100px] px-4 md:px-6">
  <div className="max-w-6xl mx-auto">
    {/* Content */}
  </div>
</section>

// Card with responsive padding
<div className="rounded-[clamp(20px,2vw,30px)] p-5 lg:p-8">
  {/* Card content */}
</div>

// Grid with responsive gaps
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
  {/* Grid items */}
</div>

// Flex list with gaps
<div className="flex flex-col gap-8">
  {/* Items */}
</div>
```

---

## Layout Patterns

### Two-Column Split

Used in: Features, FAQ, ValueProp

```tsx
<div className="lg:grid lg:grid-cols-2 lg:gap-12">
  {/* Left: Sticky headline */}
  <div>
    <div className="lg:sticky lg:top-[140px] mb-12 lg:mb-0 text-center lg:text-left">
      <h2>Headline</h2>
      <p>Description</p>
    </div>
  </div>

  {/* Right: Scrolling content */}
  <div className="flex flex-col gap-8">
    {/* Cards or items */}
  </div>
</div>
```

### FAQ Layout (5:7 Split)

```tsx
<div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-4 md:gap-6">
  {/* Left header */}
  <div className="mb-4 lg:mb-0">
    <Badge variant="section">FAQs</Badge>
    <h2>Headline</h2>
  </div>

  {/* Right content */}
  <div>
    {/* Accordion or content */}
  </div>
</div>
```

### Centered Section

Used in: Stats, Modules, Team, Testimonials

```tsx
<section className="relative py-16 md:py-[100px] px-4 md:px-6">
  <div className="max-w-6xl mx-auto">
    {/* Centered header */}
    <div className="text-center mb-8 md:mb-16">
      <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
        Section Title
      </h2>
      <p className="text-[#B9B8EB]/50 max-w-2xl mx-auto">
        Description text
      </p>
    </div>

    {/* Content */}
  </div>
</section>
```

### Three-Column Grid

Used in: Stats, Testimonials

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
  {items.map((item, i) => (
    <div key={i} className="text-center">
      {/* Item content */}
    </div>
  ))}
</div>
```

---

## Component Patterns

### Glass Card

Glassmorphic card with blur effect and subtle border.

```tsx
// Using component
<Card variant="glass">
  {/* Content */}
</Card>

// Manual implementation
<div className="relative bg-white/10 backdrop-blur-[20px] rounded-[clamp(20px,2vw,30px)] p-[clamp(20px,2vw,32px)] border border-white/10">
  {/* Content */}
</div>

// CSS class (from globals.css)
<div className="glass-card">
  {/* Content */}
</div>
```

### Solid Card

Used for feature cards with solid backgrounds.

```tsx
<div
  className="flex-1 rounded-[clamp(20px,2vw,30px)] p-5 lg:p-8 shadow-2xl border border-white/10"
  style={{ backgroundColor: "#1b1a64" }}
>
  <h3 className="text-white font-semibold text-lg lg:text-xl mb-3">
    Card Title
  </h3>
  <p className="text-[#cccce0] text-sm lg:text-base leading-relaxed">
    Card description
  </p>
</div>
```

### Gradient Border Card

Card with gradient border effect.

```tsx
<div
  className="relative rounded-[clamp(30px,4vw,44px)] px-[clamp(40px,6vw,96px)] py-[70px] gradient-border"
  style={{
    background: "linear-gradient(0deg, rgba(1, 0, 82, 1) 0%, rgba(185, 184, 235, 0.1) 100%)",
  }}
>
  {/* Content */}
</div>
```

### Primary Glow Button

```tsx
<Button
  variant="primaryGlow"
  size="lg"
  className="px-8 py-6 text-base font-semibold rounded-lg"
>
  Quiero Reservar Mi Plaza
</Button>

// Manual implementation
<button className="bg-gradient-to-t from-[#657ef3] to-[#3a54f8] text-white shadow-[inset_0px_0px_6px_rgba(255,172,227,0.5)] hover:brightness-[1.4] hover:scale-105 transition-all duration-300 px-8 py-6 text-base font-semibold rounded-lg">
  Button Text
</button>
```

### Hero Badge

```tsx
<Badge variant="hero" className="mb-5">
  <Image src="/img/icons/logo-icon.svg" alt="" width={24} height={24} className="w-5 h-5 md:w-6 md:h-6" />
  Bienvenido a Medusa Capital
</Badge>

// Styles
// gap-3 px-3 py-1.5 rounded-full border border-[#535296] bg-white/[0.14] text-white text-sm md:text-base
```

### Section Badge

```tsx
<Badge variant="section" className="mb-3 md:mb-4">
  FAQs
</Badge>

// Styles
// px-5 py-3 rounded-[30px] bg-[#B9B8EB]/30 text-white text-sm font-medium
```

### Module Number Badge

```tsx
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4355d9]/20 border border-[#4355d9]/30 mb-4 md:mb-6">
  <span className="text-[#6366f1] text-xs font-semibold">
    MÓDULO {number}
  </span>
</div>
```

### Role Badge (Team)

```tsx
<span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-[#4355d9]/20 text-[#B9B8EB] mb-2">
  FUNDADOR
</span>
```

### Navigation Button (Circular)

```tsx
<button
  className={cn(
    "w-10 h-10 rounded-full bg-[#1a1952] border border-[#B9B8EB]/20 flex items-center justify-center transition-all",
    isDisabled
      ? "opacity-30 cursor-not-allowed"
      : "hover:bg-[#4355d9] hover:border-[#4355d9]"
  )}
>
  <ChevronRight className="w-5 h-5 text-white" />
</button>
```

### Module Pill Button

```tsx
<button
  className={cn(
    "relative px-4 md:px-5 py-2.5 md:py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
    isActive
      ? "bg-[#4355d9] text-white shadow-lg shadow-[#4355d9]/30"
      : "bg-[#1a1952] text-[#B9B8EB]/50 hover:text-[#B9B8EB] hover:bg-[#252463] border border-[#B9B8EB]/10"
  )}
>
  {label}
</button>
```

### Dot Indicator

```tsx
<div className="flex gap-1.5">
  {items.map((_, i) => (
    <button
      key={i}
      className={cn(
        "w-2 h-2 rounded-full transition-all duration-300",
        activeIndex === i
          ? "bg-[#4355d9] w-6"
          : "bg-[#B9B8EB]/20 hover:bg-[#B9B8EB]/40"
      )}
    />
  ))}
</div>
```

### Progress Bar

```tsx
<div className="max-w-2xl mx-auto mb-8">
  <div className="flex justify-between text-xs text-[#B9B8EB]/50 mb-2">
    <span>Módulo {current} de {total}</span>
    <span>{percentage}% del programa</span>
  </div>
  <div className="h-1 bg-[#423d80] rounded-full overflow-hidden">
    <motion.div
      className="h-full bg-gradient-to-r from-[#4355d9] to-[#6366f1]"
      animate={{ width: `${percentage}%` }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    />
  </div>
</div>
```

### Testimonial Card

```tsx
<Card variant="glass" className="p-6 pb-[50px] mb-4 !bg-white/5">
  {/* Header */}
  <div className="flex items-center gap-3 mb-4">
    <Image
      src={avatar}
      alt={name}
      width={48}
      height={48}
      className="w-12 h-12 rounded-full object-cover"
    />
    <div>
      <h4 className="text-cyan-400 font-medium">{name}</h4>
      <span className="text-[#cccce0]/50 text-xs">{role}</span>
    </div>
  </div>
  {/* Content */}
  <p className="text-[#cccce0]/70 text-sm leading-relaxed">
    {text}
  </p>
</Card>
```

### Team Card

```tsx
<div className="flex-shrink-0 w-[calc(100vw-32px)] md:w-[600px] min-h-0 md:min-h-[320px] flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-[#B9B8EB]/10 bg-gradient-to-br from-[#1b1a64]/60 to-[#0a0a2e]/80 backdrop-blur-sm">
  {/* Photo */}
  <div className="relative flex-shrink-0">
    <Image
      src={photo}
      alt={name}
      width={180}
      height={280}
      className="w-[140px] md:w-[180px] h-[200px] md:h-full object-cover object-top rounded-xl md:rounded-2xl"
    />
    {/* LinkedIn badge */}
    <a className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#4355d9] flex items-center justify-center hover:bg-[#0077b5] transition-colors">
      {/* LinkedIn icon */}
    </a>
  </div>

  {/* Content */}
  <div className="flex flex-col flex-1 py-1">
    <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-[#4355d9]/20 text-[#B9B8EB] mb-2 self-start">
      {role}
    </span>
    <h3 className="text-white font-bold text-xl md:text-2xl mb-3">{name}</h3>
    <p className="text-[#B9B8EB]/60 text-xs md:text-sm leading-relaxed">{bio}</p>
  </div>
</div>
```

### Stat Item

```tsx
<div className="text-center">
  <div className="font-[family-name:var(--font-heading)] text-[clamp(40px,5vw,60px)] font-bold text-[#B9B8EB] mb-4">
    +200
  </div>
  <p className="text-[#cccce0]/60 text-sm leading-relaxed max-w-[200px] mx-auto">
    Alumnos han aprendido a gestionar su cartera
  </p>
</div>
```

---

## Visual Effects

### Background Glow (Circle Radial)

```tsx
<div
  className="absolute pointer-events-none"
  style={{
    right: "-100px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.1) 40%, transparent 70%)",
    filter: "blur(60px)",
  }}
/>

// CSS class version
<div className="circle-radial" style={{ top: "100px", left: "-200px" }} />
```

### Gradient Border (Mask Technique)

```css
.gradient-border {
  position: relative;
}
.gradient-border::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 2px solid transparent;
  background: linear-gradient(0deg, rgba(1, 0, 82, 1) 0%, rgba(185, 184, 235, 1) 100%) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  z-index: -1;
  pointer-events: none;
}
```

### Fade Overlay (for Scrolling)

```tsx
{/* Top fade */}
<div
  className="absolute top-0 left-0 right-0 h-[160px] md:h-[211px] z-10 pointer-events-none"
  style={{
    background: "linear-gradient(0deg, rgba(1, 0, 82, 0) 0%, rgb(1, 0, 82) 100%)",
  }}
/>

{/* Bottom fade */}
<div
  className="absolute bottom-0 left-0 right-0 h-[160px] md:h-[211px] z-10 pointer-events-none"
  style={{
    background: "linear-gradient(180deg, rgba(1, 0, 82, 0) 0%, rgb(1, 0, 82) 100%)",
  }}
/>
```

### Section Background Image

```tsx
<section
  className="relative min-h-screen flex flex-col items-center justify-center"
  style={{
    backgroundImage: 'url("/img/hero-strokes.webp")',
    backgroundSize: 'contain',
    backgroundPosition: 'center 20px',
    backgroundRepeat: 'no-repeat',
  }}
>
```

### Decorative Background Graphic

```tsx
<div
  className="hidden lg:block absolute pointer-events-none select-none"
  style={{
    left: 0,
    top: 0,
    width: "690px",
    maxWidth: "50%",
    height: "1281px",
    maxHeight: "100%",
    backgroundImage: "url('/img/step-sec-obj.webp')",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    zIndex: 0,
  }}
/>
```

---

## Animation Patterns

### Infinite Scroll (Testimonials)

```css
@keyframes scroll-down {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}

@keyframes scroll-up {
  0% { transform: translateY(-50%); }
  100% { transform: translateY(0); }
}

.animate-scroll-down {
  animation: scroll-down 40s linear infinite;
}

.animate-scroll-up {
  animation: scroll-up 40s linear infinite;
}
```

### Carousel Auto-Scroll (Team)

```tsx
useEffect(() => {
  const scrollContainer = scrollRef.current;
  let animationId: number;
  let scrollPosition = 0;
  const scrollSpeed = 0.5;

  const scroll = () => {
    if (!isPaused && scrollContainer) {
      scrollPosition += scrollSpeed;
      const singleSetWidth = scrollContainer.scrollWidth / 2;
      if (scrollPosition >= singleSetWidth) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
    }
    animationId = requestAnimationFrame(scroll);
  };

  animationId = requestAnimationFrame(scroll);
  return () => cancelAnimationFrame(animationId);
}, [isPaused]);
```

### Content Transition (Framer Motion)

```tsx
<AnimatePresence mode="wait" custom={direction}>
  <motion.div
    key={activeId}
    custom={direction}
    initial={{ opacity: 0, x: direction * 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: direction * -50 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {/* Content */}
  </motion.div>
</AnimatePresence>
```

### Progress Bar Animation

```tsx
<motion.div
  className="h-full bg-gradient-to-r from-[#4355d9] to-[#6366f1]"
  initial={false}
  animate={{ width: `${percentage}%` }}
  transition={{ duration: 0.3, ease: "easeOut" }}
/>
```

### Button Hover

```css
.btn-primary-glow:hover {
  filter: brightness(1.4);
  transform: scale(1.05);
}
```

### Accordion Arrow Rotation

```tsx
<div
  className={cn(
    "absolute top-1/2 right-0 -translate-y-1/2 transition-transform duration-300 origin-center",
    "group-data-[state=open]:-rotate-[70deg]"
  )}
>
  <CustomArrowIcon />
</div>
```

---

## Responsive Design

### Breakpoints

| Name | Min Width | Tailwind Prefix |
|------|-----------|-----------------|
| Mobile | 0 | (default) |
| Tablet | 768px | `md:` |
| Desktop | 1024px | `lg:` |

### Common Responsive Patterns

**Text sizing:**
```tsx
// Headline
text-3xl md:text-5xl
text-[clamp(28px,4.5vw,60px)]

// Body
text-sm md:text-base
text-base md:text-lg
```

**Spacing:**
```tsx
// Section padding
py-16 md:py-[100px]
px-4 md:px-6

// Component padding
p-5 lg:p-8
gap-4 md:gap-8
```

**Layout:**
```tsx
// Stack to grid
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3

// Hidden on mobile
hidden md:block
hidden lg:block

// Flex direction
flex flex-col md:flex-row
```

**Widths:**
```tsx
// Card widths
w-[calc(100vw-32px)] md:w-[600px]

// Image sizing
w-[140px] md:w-[180px]
h-12 md:h-20
```

### Mobile-First Visibility

```tsx
// Show only on desktop
<div className="hidden lg:block">Desktop content</div>

// Show only on mobile/tablet
<div className="lg:hidden">Mobile content</div>

// Show on tablet and up
<div className="hidden md:block">Tablet+ content</div>
```

---

## File Structure

```
components/
  landing/
    Header.tsx          # Logo + theme toggle
    Hero.tsx            # Main headline, video, CTA
    Stats.tsx           # Metrics with gradient border card
    ValueProp.tsx       # Two-column with graphic
    Features.tsx        # Sticky headline + card list
    Modules.tsx         # Tab navigation + animated content
    Team.tsx            # Auto-scrolling carousel
    Testimonials.tsx    # Three-column infinite scroll
    FAQ.tsx             # Accordion with custom icons
    FinalCTA.tsx        # Gradient border CTA card
    Footer.tsx          # Logo, links, copyright
    PageBackground.tsx  # Main page background
  ui/
    button.tsx          # Button variants including primaryGlow
    card.tsx            # Card variants including glass
    badge.tsx           # Badge variants including hero, section
    accordion.tsx       # FAQ accordion
    ...

app/
  page.tsx              # Composes all landing sections
  globals.css           # Brand colors, effects, animations
  layout.tsx            # Font loading, providers
```

---

## CSS Variables Reference

From `globals.css`:

```css
/* Dark mode brand colors (oklch) */
--background: oklch(0.13 0.028 261.692);
--foreground: oklch(0.985 0.002 247.839);
--primary: oklch(0.59 0.20 277);
--primary-foreground: oklch(0.96 0.02 272);
--card: oklch(0.21 0.034 264.665);
--card-foreground: oklch(0.985 0.002 247.839);
--border: oklch(1 0 0 / 10%);
--input: oklch(1 0 0 / 15%);

/* Medusa-specific hex colors */
#010052      /* Deep navy background */
#B9B8EB      /* Lavender accent */
#cccce0      /* Secondary text */
#4355d9      /* Primary interactive */
#6366f1      /* Primary hover */
#3a54f8      /* Button gradient top */
#657ef3      /* Button gradient bottom */
#1b1a64      /* Solid card background */
#1a1952      /* Dark interactive background */
```
