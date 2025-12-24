# Medusa Capital Landing Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a faithful recreation of the medusacapital.xyz landing page with functional YouTube embed and Calendly booking integration.

**Architecture:** Single-page Next.js app with 11 section components composed in `app/page.tsx`. Global CSS extended with Medusa brand colors. All content in Spanish.

**Tech Stack:** Next.js 15, Tailwind CSS v4, shadcn/ui components, Google Fonts (Cormorant), YouTube iframe, Calendly embed.

---

## Task 1: Update Global Styles with Medusa Brand

**Files:**
- Modify: `app/globals.css`

**Step 1: Add Medusa CSS custom properties**

Add after the existing `.dark` block in `app/globals.css`:

```css
/* Medusa Capital Brand */
.medusa {
  --medusa-bg-start: #000000;
  --medusa-bg-end: #0a0a2e;
  --medusa-bg-mid: #050520;
  --medusa-primary: #CCCCE0;
  --medusa-primary-muted: #9999b3;
  --medusa-accent: #6366f1;
  --medusa-accent-hover: #818cf8;
  --medusa-glow: #8b5cf6;
  --medusa-card: rgba(255, 255, 255, 0.05);
  --medusa-card-hover: rgba(255, 255, 255, 0.08);
  --medusa-border: rgba(255, 255, 255, 0.1);
  --medusa-border-glow: rgba(139, 92, 246, 0.5);
}
```

**Step 2: Verify file saves correctly**

Run: `cat app/globals.css | tail -20`
Expected: See the new `.medusa` CSS block

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add Medusa Capital brand CSS variables"
```

---

## Task 2: Add Cormorant Font

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Import and configure Cormorant font**

Update `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Geist_Mono, Inter, Cormorant } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-heading",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Medusa Capital",
  description: "Formación en Criptomonedas para Inversores Exigentes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${cormorant.variable}`}>
      <body className={`${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
```

**Step 2: Add font-heading to Tailwind theme**

Add to `app/globals.css` inside `@theme inline`:

```css
  --font-heading: var(--font-heading);
```

**Step 3: Verify dev server runs**

Run: `npm run dev`
Expected: Server starts without errors

**Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: add Cormorant heading font"
```

---

## Task 3: Create Landing Page Directory Structure

**Files:**
- Create: `components/landing/` directory

**Step 1: Create the landing components directory**

Run: `mkdir -p components/landing`

**Step 2: Verify directory exists**

Run: `ls -la components/`
Expected: See `landing/` directory

---

## Task 4: Build Header Component

**Files:**
- Create: `components/landing/Header.tsx`

**Step 1: Create Header component**

```tsx
"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg
            width="34"
            height="35"
            viewBox="0 0 34 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="17" cy="17.5" r="16" fill="white" />
            <path
              d="M7.02771 26.9605C1.56668 21.4995 1.58718 12.6248 7.07351 7.13855"
              stroke="#9392DF"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-white font-medium tracking-wider text-sm">
            MEDUSA
            <span className="block text-[10px] tracking-[0.3em] text-white/70">
              CAPITAL
            </span>
          </span>
        </div>

        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDark(!isDark)}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
}
```

**Step 2: Verify file created**

Run: `ls components/landing/`
Expected: `Header.tsx`

**Step 3: Commit**

```bash
git add components/landing/Header.tsx
git commit -m "feat: add Header component with logo and dark mode toggle"
```

---

## Task 5: Build Hero Component

**Files:**
- Create: `components/landing/Hero.tsx`

**Step 1: Create Hero component**

```tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#050520] to-[#0a0a2e]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Welcome badge */}
        <Badge
          variant="outline"
          className="mb-6 px-4 py-2 border-white/20 bg-white/5 text-white/80"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 34 35"
            fill="none"
            className="mr-2"
          >
            <circle cx="17" cy="17.5" r="14" fill="white" />
            <path
              d="M7 27C1.5 21.5 1.5 12.6 7 7.1"
              stroke="#9392DF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          Bienvenido a Medusa Capital
        </Badge>

        {/* Main headline */}
        <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl lg:text-8xl font-bold text-[#CCCCE0] leading-tight mb-6">
          Formación En Criptomonedas
          <br />
          Para Inversores Exigentes
        </h1>

        {/* Subheadline */}
        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Un programa formativo completo diseñado para que el pequeño y mediano
          inversor no sólo no pierda poder adquisitivo, sino que pueda
          rentabilizar su patrimonio
        </p>

        {/* YouTube Video Embed */}
        <div className="relative w-full max-w-3xl mx-auto mb-10 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10 border border-white/10">
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Medusa Capital x JF Partners"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0"
            />
          </div>
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
          onClick={() => window.open("https://calendly.com/medusacapital", "_blank")}
        >
          Quiero Reservar Mi Plaza
        </Button>

        {/* Social proof */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 border-2 border-[#0a0a2e]"
              />
            ))}
          </div>
          <p className="text-white/50 text-sm">
            Medusa Capital ha ayudado a{" "}
            <span className="text-white font-medium">200+</span> inversores a
            entender el mercado de las criptomonedas
          </p>
        </div>

        {/* Partner logos */}
        <div className="mt-12 flex items-center justify-center gap-6 text-white/40">
          <span className="text-lg font-medium">JF PARTNERS</span>
          <span className="text-2xl">×</span>
          <span className="text-lg font-medium">MEDUSA CAPITAL</span>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/landing/Hero.tsx
git commit -m "feat: add Hero component with video embed and CTA"
```

---

## Task 6: Build Stats Component

**Files:**
- Create: `components/landing/Stats.tsx`

**Step 1: Create Stats component**

```tsx
export function Stats() {
  const stats = [
    {
      value: "+200",
      label: "Alumnos han aprendido a gestionar su cartera con nosotros",
    },
    {
      value: "+50",
      label: "Reseñas positivas avalan el método utilizado durante estos dos años",
    },
    {
      value: "+20.000",
      label: "Seguidores interesados en formación referente a activos digitales",
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#0a0a2e] to-[#050520]">
      <div className="max-w-5xl mx-auto text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 34 35"
              fill="none"
            >
              <circle cx="17" cy="17.5" r="14" fill="white" />
              <path
                d="M7 27C1.5 21.5 1.5 12.6 7 7.1"
                stroke="#9392DF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Headline */}
        <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl font-bold text-[#CCCCE0] leading-tight mb-16 max-w-4xl mx-auto">
          Ayudamos a inversores tradicionales a entender cripto con el mismo
          rigor con el que analizan acciones o ETFs
        </h2>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl font-bold text-[#CCCCE0] mb-3">
                {stat.value}
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/landing/Stats.tsx
git commit -m "feat: add Stats component with metrics"
```

---

## Task 7: Build ValueProp Component

**Files:**
- Create: `components/landing/ValueProp.tsx`

**Step 1: Create ValueProp component**

```tsx
import { Button } from "@/components/ui/button";

export function ValueProp() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#050520] to-[#0a0a2e]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold text-[#CCCCE0] leading-tight mb-6">
              Conviértete en un Inversor Experto en Bitcoin y otros Activos
              Digitales
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              En Medusa Capital aprenderás a navegar por el mercado de las
              criptomonedas, aprenderás estrategias de inversión probadas, y
              sabrás cómo moverte por el universo DeFi de manera segura. No te
              prometemos rentabilidad inmediata. Obtendrás{" "}
              <span className="text-white">conocimiento</span>,{" "}
              <span className="text-white">criterio propio</span> y{" "}
              <span className="text-white">herramientas para ser rentable</span>.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300"
              onClick={() => window.open("https://calendly.com/medusacapital", "_blank")}
            >
              Empezar Ahora
            </Button>
          </div>

          {/* Right graphic */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 blur-xl" />
              {/* Main circle */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-purple-500/30 flex items-center justify-center">
                {/* Inner shield icon */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-purple-500/30 to-indigo-500/30 border border-purple-400/30 flex items-center justify-center">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 34 35"
                    fill="none"
                  >
                    <circle cx="17" cy="17.5" r="14" fill="white" />
                    <path
                      d="M7 27C1.5 21.5 1.5 12.6 7 7.1"
                      stroke="#9392DF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              {/* Decorative dots */}
              <div className="absolute top-0 right-8 w-2 h-2 rounded-full bg-purple-400" />
              <div className="absolute bottom-8 left-0 w-3 h-3 rounded-full bg-indigo-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/landing/ValueProp.tsx
git commit -m "feat: add ValueProp component"
```

---

## Task 8: Build Features Component

**Files:**
- Create: `components/landing/Features.tsx`

**Step 1: Create Features component**

```tsx
const features = [
  {
    icon: "📚",
    title: "Formación estructurada en 7 módulos clave",
    description:
      "Del funcionamiento de Bitcoin y la blockchain hasta estrategias de inversión, DeFi y gestión del riesgo. Todo explicado paso a paso, con ejemplos y sin tecnicismos innecesarios.",
  },
  {
    icon: "💬",
    title: "Comunidad de Discord",
    description:
      "Aprende de aquellos que han recorrido el camino que tú estás emprendiendo. A través de Discord compartimos análisis diarios del mercado, informes de proyectos y recursos académicos para que te mantengas informado.",
  },
  {
    icon: "♾️",
    title: "Acceso de por vida y actualizaciones",
    description:
      "Podrás revisar todo el contenido siempre que lo necesites, y recibirás nuevas lecciones cuando cambien las condiciones del mercado.",
  },
  {
    icon: "📊",
    title: "Casos reales de portafolios y decisiones de inversión",
    description:
      "Compartimos nuestras operaciones reales (aciertos y errores), gestión de carteras y ejemplos prácticos para ayudarte a aplicar lo aprendido con criterio y confianza.",
  },
];

export function Features() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#0a0a2e] to-[#050520]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left content */}
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-[#CCCCE0] leading-tight mb-6">
              Un Método Claro para Entender, Evaluar e Invertir en Cripto con
              Criterio
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Desde Bitcoin hasta DeFi, pasando por tokenomics, ciclos de
              mercado y gestión del riesgo. Una formación paso a paso diseñada
              para ayudarte a interpretar este nuevo ecosistema con el mismo
              rigor con el que analizas cualquier otro activo financiero.
            </p>
          </div>

          {/* Right timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent" />

            <div className="space-y-8">
              {features.map((feature, i) => (
                <div key={i} className="relative flex gap-6">
                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center text-2xl">
                    {feature.icon}
                  </div>
                  {/* Content */}
                  <div className="pt-2">
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/landing/Features.tsx
git commit -m "feat: add Features component with timeline"
```

---

## Task 9: Build Modules Component

**Files:**
- Create: `components/landing/Modules.tsx`

**Step 1: Create Modules component**

```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const modules = [
  {
    id: 1,
    title: "Bitcoin y el Derecho de Propiedad",
    subtitle: "Redefiniendo el dinero desde su origen",
    description:
      "Entiende por qué existe Bitcoin, cómo funciona su red, cómo se custodia, cómo se representa el valor y cómo propone una alternativa soberana al sistema fiat. Este módulo incluye fundamentos teóricos, arquitectura del sistema e implicaciones económicas.",
  },
  {
    id: 2,
    title: "Fundamentos de Blockchain y Navegación Web3",
    subtitle: "Tu brújula en el ecosistema descentralizado",
    description:
      "Aprende sobre DeFi, exchanges centralizados y descentralizados, wallets, bridges, bots y los fundamentos para navegar Web3 de forma segura.",
  },
  {
    id: 3,
    title: "Ciclos de Mercado y Dinámica de Capitales",
    subtitle: "Entendiendo los flujos del dinero",
    description:
      "Examina los flujos de capital, dinámicas macro y micro, ciclos de mercado, comportamiento institucional y mecánicas del 'smart money'.",
  },
  {
    id: 4,
    title: "Análisis Fundamental de Proyectos",
    subtitle: "Evaluando el valor real",
    description:
      "Aprende a evaluar whitepapers, valoración de tokens, tokenomics y desarrollo de tesis de inversión para proyectos cripto.",
  },
  {
    id: 5,
    title: "Análisis On-Chain",
    subtitle: "Leyendo la blockchain",
    description:
      "Enfócate en leer el comportamiento de la blockchain, rastrear smart money, identificar wallets y usar herramientas como Arkham.",
  },
  {
    id: 6,
    title: "Psicología del Trading",
    subtitle: "Dominando tu mente",
    description:
      "Aborda sesgos cognitivos, disciplina emocional, teoría de la reflexividad y marcos de toma de decisiones.",
  },
  {
    id: 7,
    title: "Estrategia y Gestión de Portafolio",
    subtitle: "Construyendo tu cartera",
    description:
      "Cubre perfilamiento de inversor, gestión activa/pasiva, estrategias delta-neutral y control de riesgos.",
  },
];

export function Modules() {
  const [activeModule, setActiveModule] = useState(1);
  const currentModule = modules.find((m) => m.id === activeModule)!;

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#050520] to-[#0a0a2e]">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-[#CCCCE0] leading-tight mb-12">
          Tu Ruta de Aprendizaje
          <br />
          con Medusa Capital
        </h2>

        {/* Tab navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeModule === module.id
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
              )}
            >
              Módulo {module.id}
            </button>
          ))}
        </div>

        {/* Module content card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-[#CCCCE0] mb-3">
            {currentModule.title}
          </h3>
          <p className="text-purple-400 font-medium mb-6">
            {currentModule.subtitle}
          </p>
          <p className="text-white/60 leading-relaxed max-w-2xl mx-auto">
            {currentModule.description}
          </p>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/landing/Modules.tsx
git commit -m "feat: add Modules component with tabs"
```

---

## Task 10: Build Team Component

**Files:**
- Create: `components/landing/Team.tsx`

**Step 1: Create Team component**

```tsx
import { Linkedin } from "lucide-react";

const team = [
  {
    name: "Alex Cuesta",
    role: "FUNDADOR",
    bio: "7+ años analizando mercados financieros. Combina fundamentos macroeconómicos con análisis institucional e investigación fundamental.",
    linkedin: "#",
  },
  {
    name: "Alejandro Garcia",
    role: "PROFESOR",
    bio: "Economista con máster en mercados financieros. Especialista en blockchain desde 2018, enfocado en DeFi y métricas on-chain.",
    linkedin: "#",
  },
  {
    name: "Borja Neira",
    role: "PROFESOR",
    bio: "Especialista en tokenización de activos y analista financiero. Candidato a CFA y Proxy Product Owner en Mercedes-Benz, investigando activos tokenizados, DeFi y RWAs.",
    linkedin: "#",
  },
  {
    name: "Alejandro Gilabert",
    role: "PROFESOR",
    bio: "Ingeniero de telecomunicaciones con experiencia en desarrollo de productos blockchain. Product Owner en ONYZE, una de las principales custodias cripto en España.",
    linkedin: "#",
  },
];

export function Team() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#0a0a2e] to-[#050520]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-[#CCCCE0] leading-tight mb-4">
            Conoce al Equipo
          </h2>
          <p className="text-white/50">
            Llevamos en el sector de las criptomonedas desde 2018
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600" />
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center hover:bg-blue-500 transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-white" />
                  </a>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {member.name}
                  </h3>
                  <span className="inline-block text-purple-400 text-xs font-medium tracking-wider mb-3">
                    • {member.role}
                  </span>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/landing/Team.tsx
git commit -m "feat: add Team component"
```

---

## Task 11: Build Testimonials Component

**Files:**
- Create: `components/landing/Testimonials.tsx`

**Step 1: Create Testimonials component**

```tsx
const testimonials = [
  {
    name: "Sharkmodaw",
    role: "Alumno",
    text: "La cantidad de valor que aporta Axel, ya sea en el aspecto macroeconómico con las mejores personas, análisis de mercado semanales, defi, airdrops y prácticamente cualquier sector relacionado con este mundo, es muy, muy grande. Si alguien está dudando si entrar, mi recomendación es que lo prueben sin duda.",
  },
  {
    name: "Doni",
    role: "Alumno",
    text: "Fue gracias a la trinchera que encontré el segundo token que mas he estado acumulando y que mejores ganancias espero de él, creo que no es un spoiler pues Axel lo comparte bastante en sus redes, pero sin la trinchera no hubiera podido pillar HYPE a tiempo.",
  },
  {
    name: "Sergio",
    role: "Alumno",
    text: "Es increíble todo el contenido e información que nos brindan tanto los responsables como el resto de integrantes. A mi me gusta estar al día de todo, es un alivio saber que no me pierdo ni uno. Cuando entré no esperaba tanto conocimiento, análisis y debates sobre macroeconomía o análisis técnico.",
  },
  {
    name: "0xPerezz",
    role: "Alumno",
    text: "Gracias a todo el equipo y familia que hemos logrado en este pedazo de comunidad, y todo muy sano, no lo he podido seguir tan de cerca como quisiera por el tiempo, pero me ha ayudado mucho a la hora de mentalizarme y no caer en mentalidades equivocadas.",
  },
  {
    name: "FXfeno",
    role: "Alumno",
    text: "Hay trabajo, información confiable, aportes de todos, mucha interacción entre los directivos y la comunidad. Los 'jefes' se reúnen como uno más, llaman directamente para preguntar sobre el funcionamiento de la comunidad, mejoras, pero también para sugerir y recibir información de la comunidad sobre sus intereses y necesidades.",
  },
  {
    name: "csadiafrans",
    role: "Alumno",
    text: "Todo muy sano, no lo he podido seguir tan de cerca como quisiera por el tiempo, pero me ha ayudado mucho a la hora de mentalizarme y no caer en mentalidades equivocadas. Muchas gracias y sigue haciendo entradas carajo.",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#050520] to-[#0a0a2e]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-[#CCCCE0] leading-tight mb-4">
            Qué dicen Nuestros Alumnos
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Nuestra formación ha cambiado la manera en la que nuestros alumnos
            perciben el sistema monetario. Ahora conocen el sistema y tienen las
            herramientas para rentabilizar su dinero.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="break-inside-avoid bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors duration-300"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600" />
                <div>
                  <h4 className="text-purple-400 font-medium">
                    {testimonial.name}
                  </h4>
                  <span className="text-white/40 text-xs">{testimonial.role}</span>
                </div>
              </div>
              {/* Content */}
              <p className="text-white/60 text-sm leading-relaxed">
                {testimonial.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/landing/Testimonials.tsx
git commit -m "feat: add Testimonials component with masonry grid"
```

---

## Task 12: Build FAQ Component

**Files:**
- Create: `components/landing/FAQ.tsx`

**Step 1: Create FAQ component**

```tsx
"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    question: "¿En qué se basa la metodología del curso?",
    answer:
      "Explicamos los activos digitales desde una perspectiva fundamental y de asignación de capital siguiendo siempre el ciclo económico. Nada de promesas vacías, sí a marcos racionales de análisis.",
  },
  {
    question: "¿Necesito tener conocimientos previos en blockchain o programación?",
    answer:
      "No. El curso está diseñado para profesionales financieros que son nuevos en cripto. Empezamos desde los fundamentos.",
  },
  {
    question: "¿Esto es para traders o para inversores a largo plazo?",
    answer:
      "Ambos. El curso cubre tanto estrategias de trading como inversión a largo plazo enfocada en la construcción de patrimonio.",
  },
  {
    question: "¿Qué diferencia hay entre este curso y otros que prometen 'vivir del trading'?",
    answer:
      "Nos enfocamos en fundamentos, no en esquemas de enriquecimiento rápido. Enseñamos análisis riguroso, no promesas vacías.",
  },
  {
    question: "¿Se actualiza el contenido con nuevas tendencias o tecnologías?",
    answer:
      "Sí, los módulos se actualizan regularmente con cambios en protocolos, regulación y narrativas del mercado.",
  },
  {
    question: "¿Puedo aplicar lo aprendido si solo quiero invertir en BTC y ETH?",
    answer:
      "Absolutamente. El curso construye desde los fundamentos de BTC/ETH, que son la base de todo el ecosistema.",
  },
  {
    question: "¿Cómo se compara esto con una formación financiera tradicional?",
    answer:
      "Complementamos la formación tradicional con conocimiento específico de activos digitales, blockchain y DeFi.",
  },
  {
    question: "¿Qué pasa si el mercado entra en un bear market?",
    answer:
      "Proporcionamos herramientas para la preservación de capital e identificación de oportunidades durante mercados bajistas.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#0a0a2e] to-[#050520]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
          {/* Left header */}
          <div>
            <Badge
              variant="outline"
              className="mb-4 border-white/20 bg-white/5 text-white/60"
            >
              FAQs
            </Badge>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-[#CCCCE0] leading-tight">
              Preguntas que consideramos relevantes
            </h2>
          </div>

          {/* Right accordion */}
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border-b border-white/10 last:border-b-0"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between py-4 text-left group"
                >
                  <span className="text-white/80 group-hover:text-white transition-colors pr-4">
                    {faq.question}
                  </span>
                  <ChevronRight
                    className={cn(
                      "w-5 h-5 text-white/40 transition-transform duration-200 flex-shrink-0",
                      openIndex === i && "rotate-90"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    openIndex === i ? "max-h-48 pb-4" : "max-h-0"
                  )}
                >
                  <p className="text-white/50 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/landing/FAQ.tsx
git commit -m "feat: add FAQ component with accordion"
```

---

## Task 13: Build FinalCTA Component

**Files:**
- Create: `components/landing/FinalCTA.tsx`

**Step 1: Create FinalCTA component**

```tsx
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#050520] to-[#0a0a2e]">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl font-bold text-[#CCCCE0] leading-tight mb-6">
            Comienza a Invertir
            <br />
            con Confianza.
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            El mundo cripto no es humo... si sabes interpretarlo. Aquí
            aprenderás a analizar activos digitales como lo harías con cualquier
            otra clase de activo: con fundamentos, contexto y gestión del
            riesgo.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
            onClick={() => window.open("https://calendly.com/medusacapital", "_blank")}
          >
            Quiero Reservar Mi Plaza
          </Button>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/landing/FinalCTA.tsx
git commit -m "feat: add FinalCTA component"
```

---

## Task 14: Build Footer Component

**Files:**
- Create: `components/landing/Footer.tsx`

**Step 1: Create Footer component**

```tsx
import { Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative py-16 px-6 bg-[#050510] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Left - Logo and tagline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg
                width="34"
                height="35"
                viewBox="0 0 34 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="17" cy="17.5" r="16" fill="white" />
                <path
                  d="M7.02771 26.9605C1.56668 21.4995 1.58718 12.6248 7.07351 7.13855"
                  stroke="#9392DF"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-white font-medium tracking-wider text-sm">
                MEDUSA
                <span className="block text-[10px] tracking-[0.3em] text-white/70">
                  CAPITAL
                </span>
              </span>
            </div>
            <p className="text-white/40 text-sm max-w-sm">
              Únete a la única formación de habla hispana con resultados
              probados y profesores de alto nivel.
            </p>
          </div>

          {/* Right - Social links */}
          <div className="md:text-right">
            <h4 className="text-white/60 font-medium mb-4">
              Síguenos en Redes Sociales
            </h4>
            <div className="flex gap-4 md:justify-end">
              <a
                href="https://twitter.com/Axel_Mnvn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
                <span className="text-sm">@Axel_Mnvn</span>
              </a>
              <a
                href="https://substack.com/@axelmnvn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                </svg>
                <span className="text-sm">@axelmnvn</span>
              </a>
              <a
                href="https://youtube.com/@Axel_mnvn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
                <span className="text-sm">@Axel_mnvn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-white/30 text-sm">
            ©Medusa Capital 2025. Todos los Derechos Reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Commit**

```bash
git add components/landing/Footer.tsx
git commit -m "feat: add Footer component"
```

---

## Task 15: Create Component Index

**Files:**
- Create: `components/landing/index.ts`

**Step 1: Create barrel export file**

```ts
export { Header } from "./Header";
export { Hero } from "./Hero";
export { Stats } from "./Stats";
export { ValueProp } from "./ValueProp";
export { Features } from "./Features";
export { Modules } from "./Modules";
export { Team } from "./Team";
export { Testimonials } from "./Testimonials";
export { FAQ } from "./FAQ";
export { FinalCTA } from "./FinalCTA";
export { Footer } from "./Footer";
```

**Step 2: Commit**

```bash
git add components/landing/index.ts
git commit -m "feat: add component barrel exports"
```

---

## Task 16: Compose Landing Page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Update page.tsx to compose all sections**

```tsx
import {
  Header,
  Hero,
  Stats,
  ValueProp,
  Features,
  Modules,
  Team,
  Testimonials,
  FAQ,
  FinalCTA,
  Footer,
} from "@/components/landing";

export default function Page() {
  return (
    <main className="medusa min-h-screen bg-black">
      <Header />
      <Hero />
      <Stats />
      <ValueProp />
      <Features />
      <Modules />
      <Team />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
```

**Step 2: Verify dev server and visual output**

Run: `npm run dev`
Expected: Landing page renders with all sections

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: compose landing page with all sections"
```

---

## Task 17: Final Testing and Polish

**Step 1: Test responsive behavior**

- Resize browser to mobile, tablet, desktop widths
- Verify all sections stack properly on mobile
- Verify module tabs scroll horizontally on mobile

**Step 2: Test interactive elements**

- Click dark mode toggle in header
- Click module tabs to switch content
- Click FAQ items to expand/collapse
- Click CTA buttons (should open Calendly in new tab)

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete Medusa Capital landing page implementation"
```
