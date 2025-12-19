# Medusa Capital Landing Page Design

## Overview

Faithful recreation of the medusacapital.xyz landing page using Next.js and shadcn components, with all content in Spanish and functional elements (YouTube embed, Calendly booking).

## Architecture & File Structure

```
app/
  page.tsx              # Main landing page composing all sections
  globals.css           # Updated with Medusa brand colors/fonts

components/
  landing/
    Header.tsx          # Logo + dark mode toggle
    Hero.tsx            # Main headline, video embed, CTA
    Stats.tsx           # +200, +50, +20,000 metrics
    ValueProp.tsx       # "Conviértete en un Inversor Experto..."
    Features.tsx        # 4 feature cards with icons
    Modules.tsx         # 7 module tabs with content
    Team.tsx            # 4 team member cards
    Testimonials.tsx    # Student testimonial grid
    FAQ.tsx             # Accordion-style questions
    FinalCTA.tsx        # "Comienza a Invertir con Confianza"
    Footer.tsx          # Logo, social links, copyright
```

## Visual Design System

### Typography
- Headings: `Cormorant` (bold, serif)
- Body: `Inter` (already configured)
- Sizes: H1 80px, H2 60px, H3 36px, Body 18-20px

### Color Palette
```css
--medusa-bg-start: #000000
--medusa-bg-end: #0a0a2e
--medusa-primary: #CCCCE0      /* light lavender text */
--medusa-accent: #6366f1       /* purple/indigo for buttons */
--medusa-glow: #8b5cf6         /* violet glow effects */
--medusa-card: rgba(255,255,255,0.05)  /* glass cards */
--medusa-border: rgba(255,255,255,0.1)
```

### Visual Effects
- Radial gradient background with subtle purple glow spots
- Glass-morphism cards: backdrop-blur, semi-transparent bg, subtle border
- Glowing CTA buttons with box-shadow pulse
- Circular icon containers with gradient borders

### Responsive Breakpoints
- Mobile: < 768px (stacked layouts, smaller text)
- Tablet: 768px - 1024px
- Desktop: > 1024px (max-width container ~1200px)

## Section Details

### 1. Header (sticky)
- Left: Medusa Capital logo (SVG with white circle + purple arc)
- Right: Dark/light mode toggle

### 2. Hero Section
- Welcome badge: "Bienvenido a Medusa Capital"
- Main headline (Cormorant 80px): "Formación En Criptomonedas Para Inversores Exigentes"
- Subheadline describing the program
- YouTube Video Embed (JF Partners collaboration)
- Primary CTA: "Quiero Reservar Mi Plaza" → Calendly
- Social proof: Avatar stack + "200+ inversores"
- Partner logos: JF Partners × Medusa Capital

### 3. Stats Section
- Medusa logo icon
- Headline about helping traditional investors
- Three stat columns: +200, +50, +20,000

### 4. Value Proposition Section
- Two-column layout
- Left: Headline "Conviértete en un Inversor Experto..." + body + CTA
- Right: Decorative 3D shield/coin graphic

### 5. Features Section
- Left: "Un Método Claro para Entender, Evaluar e Invertir..."
- Right: Vertical timeline with 4 feature cards:
  1. Formación estructurada en 7 módulos clave
  2. Comunidad de Discord
  3. Acceso de por vida y actualizaciones
  4. Casos reales de portafolios

### 6. Modules Section
- Headline: "Tu Ruta de Aprendizaje con Medusa Capital"
- 7 horizontal tabs (scrollable on mobile)
- Module content card with title, subtitle, description
- Modules:
  1. Bitcoin y el Derecho de Propiedad
  2. Fundamentos de Blockchain y Navegación Web3
  3. Ciclos de Mercado y Dinámica de Capitales
  4. Análisis Fundamental de Proyectos
  5. Análisis On-Chain
  6. Psicología del Trading
  7. Estrategia y Gestión de Portafolio

### 7. Team Section
- Headline: "Conoce al Equipo"
- 2x2 grid of team cards
- Members: Alex Cuesta (Fundador), Alejandro Garcia, Borja Neira, Alejandro Gilabert (Profesores)
- Each card: Avatar, LinkedIn badge, name, role, bio

### 8. Testimonials Section
- Headline: "Qué dicen Nuestros Alumnos"
- Masonry grid (3 cols desktop, 2 tablet, 1 mobile)
- ~6-9 testimonial cards with avatar, username, "Alumno" badge, text

### 9. FAQ Section
- Two-column: Left headline, Right accordion
- 8 FAQ items with expand/collapse

### 10. Final CTA Section
- Glass card with "Comienza a Invertir con Confianza"
- Body text + CTA button

### 11. Footer
- Medusa logo + tagline
- Social links: X, Substack, YouTube
- Copyright: "©Medusa Capital 2025"

## Dependencies to Add
- `@fontsource/cormorant` or Google Fonts for Cormorant
- Calendly embed script for booking integration

## Functional Elements
- YouTube iframe embed (responsive)
- Calendly popup/embed for "Quiero Reservar Mi Plaza" buttons
- Dark/light mode toggle (persisted)
- FAQ accordion interactions
- Module tab switching
