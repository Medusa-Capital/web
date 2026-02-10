"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

type ModuleIcon =
  | "bitcoin"
  | "blockchain"
  | "defi"
  | "market"
  | "fundamental"
  | "onchain"
  | "psychology"
  | "portfolio"
  | "tax";

const modules: {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: ModuleIcon;
}[] = [
  {
    id: 1,
    title: "Bitcoin y el Derecho de Propiedad",
    subtitle: "Redefiniendo el dinero desde su origen",
    description:
      "Entiende por qué existe Bitcoin, cómo funciona su red, cómo se custodia, cómo se representa el valor y cómo propone una alternativa soberana al sistema fiat. Este módulo incluye fundamentos teóricos, arquitectura del sistema e implicaciones económicas.",
    icon: "bitcoin",
  },
  {
    id: 2,
    title: "Esenciales Blockchain",
    subtitle: "Comprende la tecnología y sus implicaciones económicas",
    description:
      "Sienta las bases para moverte con soltura en el entorno blockchain. Se explican conceptos clave como DeFi, exchanges centralizados y descentralizados, wallets, bridges, bots y herramientas básicas para navegar en Web3. Es una guía práctica para entender cómo funciona este nuevo ecosistema y cómo participar de forma segura y eficaz.",
    icon: "blockchain",
  },
  {
    id: 3,
    title: "DeFi - Finanzas Descentralizadas",
    subtitle: "El sistema financiero abierto",
    description:
      "Explora protocolos de lending, DEXs, liquidity pools, yield farming y staking. Aprende a evaluar riesgos de smart contracts y a generar rendimiento en DeFi.",
    icon: "defi",
  },
  {
    id: 4,
    title: "Dinámicas de Mercado",
    subtitle: "Narrativas, ciclos y comportamiento institucional",
    description:
      "Aprende cómo fluye el capital en cripto. Analizamos las dinámicas macro y micro que mueven el mercado: ciclos, rotación sectorial, comportamiento institucional, y las mecánicas detrás del dinero inteligente. Clave para interpretar tendencias y posicionarse antes que el resto.",
    icon: "market",
  },
  {
    id: 5,
    title: "Análisis Fundamental",
    subtitle: "Detecta valor en un mercado saturado",
    description:
      "Una guía para detectar oportunidades sólidas a largo plazo. Aprenderás a analizar whitepapers, evaluar la propuesta de valor de un token, entender la tokenomics, y construir una tesis completa sobre un proyecto. Incluye estudios reales sobre casos relevantes como $HYPE, Terra, stablecoins y más.",
    icon: "fundamental",
  },
  {
    id: 6,
    title: "Análisis On-Chain",
    subtitle: "Lectura directa del comportamiento del mercado",
    description:
      "Profundiza en la lectura directa de la blockchain. Estudia el comportamiento de smart money, detecta wallets relevantes, identifica señales de entrada y salida de capital, y utiliza herramientas como Arkham para tomar decisiones basadas en datos reales y verificables.",
    icon: "onchain",
  },
  {
    id: 7,
    title: "Psicología del Trading",
    subtitle: "Mentalidad, sesgos y toma de decisiones racionales",
    description:
      "El mayor enemigo de tus inversiones eres tú mismo. En este módulo abordamos la psicología financiera, sesgos cognitivos, sistemas de pensamiento, y cómo desarrollar la disciplina emocional necesaria para mantener tu plan. Incluye la teoría de la reflexividad y cómo impacta en cripto.",
    icon: "psychology",
  },
  {
    id: 8,
    title: "Estrategia y Gestión de Cartera",
    subtitle: "De la teoría a la acción",
    description:
      "Aprende a construir, proteger y escalar tu portafolio. Diseña tu perfil de inversor, comprende la diferencia entre gestión activa y pasiva, y domina estrategias complejas (Delta Neutral), gestión por escenarios y control del riesgo. Todo con enfoque práctico, desde la teoría hasta el caso de uso.",
    icon: "portfolio",
  },
  {
    id: 9,
    title: "Fiscalidad de los Criptoactivos",
    subtitle: "Obligaciones y optimización fiscal",
    description:
      "Entiende cómo declarar criptoactivos en España, calcular plusvalías, documentar operaciones y aplicar estrategias legales para optimizar tu carga tributaria.",
    icon: "tax",
  },
];

function ModuleIcon({ icon }: { icon: ModuleIcon }) {
  const shared = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 80 80",
    fill: "none",
    className: "w-full h-full",
  };

  const gradient = (
    <defs>
      <linearGradient id="iconGradient" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B9B8EB" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
      <linearGradient id="goldGradient" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E8C36A" />
        <stop offset="100%" stopColor="#C9943C" />
      </linearGradient>
    </defs>
  );

  switch (icon) {
    /* ------------------------------------------------
       Module 1 - Bitcoin / Property: Bitcoin symbol inside shield
       ------------------------------------------------ */
    case "bitcoin":
      return (
        <svg {...shared}>
          {gradient}
          {/* Shield outline */}
          <path
            d="M40 8 L64 20 L64 44 C64 56 52 66 40 72 C28 66 16 56 16 44 L16 20 Z"
            stroke="url(#iconGradient)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Bitcoin B */}
          <path
            d="M33 28 L33 52"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M33 28 L43 28 C47.5 28 50 30.5 50 34 C50 37.5 47.5 39 43.5 39 L33 39"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M33 39 L44 39 C49 39 52 41.5 52 45.5 C52 49.5 49 52 44 52 L33 52"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Vertical ticks */}
          <line x1="37" y1="25" x2="37" y2="28" stroke="url(#goldGradient)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="43" y1="25" x2="43" y2="28" stroke="url(#goldGradient)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="37" y1="52" x2="37" y2="55" stroke="url(#goldGradient)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="43" y1="52" x2="43" y2="55" stroke="url(#goldGradient)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    /* ------------------------------------------------
       Module 2 - Blockchain Essentials: Chain links / connected nodes
       ------------------------------------------------ */
    case "blockchain":
      return (
        <svg {...shared}>
          {gradient}
          {/* Block 1 */}
          <rect x="8" y="30" width="18" height="18" rx="3" stroke="#B9B8EB" strokeWidth="1.8" fill="none" />
          <rect x="12" y="34" width="10" height="3" rx="1" fill="#6366f1" opacity="0.5" />
          <rect x="12" y="39" width="7" height="2" rx="1" fill="#B9B8EB" opacity="0.3" />
          {/* Link 1 */}
          <line x1="26" y1="39" x2="31" y2="39" stroke="url(#iconGradient)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Block 2 */}
          <rect x="31" y="30" width="18" height="18" rx="3" stroke="url(#goldGradient)" strokeWidth="1.8" fill="none" />
          <rect x="35" y="34" width="10" height="3" rx="1" fill="#D4A853" opacity="0.5" />
          <rect x="35" y="39" width="7" height="2" rx="1" fill="#E8C36A" opacity="0.3" />
          {/* Link 2 */}
          <line x1="49" y1="39" x2="54" y2="39" stroke="url(#iconGradient)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Block 3 */}
          <rect x="54" y="30" width="18" height="18" rx="3" stroke="#B9B8EB" strokeWidth="1.8" fill="none" />
          <rect x="58" y="34" width="10" height="3" rx="1" fill="#6366f1" opacity="0.5" />
          <rect x="58" y="39" width="7" height="2" rx="1" fill="#B9B8EB" opacity="0.3" />
          {/* Connecting arcs above */}
          <path d="M17 30 C17 18 40 12 40 30" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 2" fill="none" opacity="0.5" />
          <path d="M40 30 C40 18 63 12 63 30" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 2" fill="none" opacity="0.5" />
          {/* Hash marks below blocks */}
          <text x="13" y="58" fontSize="5" fontFamily="monospace" fill="#B9B8EB" opacity="0.4">0x3f..a1</text>
          <text x="36" y="58" fontSize="5" fontFamily="monospace" fill="#B9B8EB" opacity="0.4">0x7b..c4</text>
          <text x="59" y="58" fontSize="5" fontFamily="monospace" fill="#B9B8EB" opacity="0.4">0xd2..f8</text>
        </svg>
      );

    /* ------------------------------------------------
       Module 3 - DeFi: Interconnected circles / liquidity flow
       ------------------------------------------------ */
    case "defi":
      return (
        <svg {...shared}>
          {gradient}
          {/* Three interconnected pools */}
          <circle cx="28" cy="32" r="14" stroke="#B9B8EB" strokeWidth="1.8" fill="none" />
          <circle cx="52" cy="32" r="14" stroke="#6366f1" strokeWidth="1.8" fill="none" />
          <circle cx="40" cy="52" r="14" stroke="url(#iconGradient)" strokeWidth="1.8" fill="none" />
          {/* Intersection highlights */}
          <path
            d="M38 24 A14 14 0 0 1 42 24"
            stroke="#B9B8EB"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
          {/* Flow arrows */}
          <path
            d="M35 26 L40 20 L45 26"
            stroke="#6366f1"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M52 42 L56 48 L50 48"
            stroke="#B9B8EB"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M22 42 L18 48 L24 48"
            stroke="#B9B8EB"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Center node */}
          <circle cx="40" cy="36" r="3" fill="url(#goldGradient)" opacity="0.8" />
          {/* Small dots at intersections */}
          <circle cx="40" cy="24" r="2" fill="#6366f1" opacity="0.8" />
          <circle cx="48" cy="46" r="2" fill="#B9B8EB" opacity="0.8" />
          <circle cx="32" cy="46" r="2" fill="#B9B8EB" opacity="0.8" />
        </svg>
      );

    /* ------------------------------------------------
       Module 4 - Market Dynamics: Wave cycle with arrows
       ------------------------------------------------ */
    case "market":
      return (
        <svg {...shared}>
          {gradient}
          {/* Market cycle wave */}
          <path
            d="M8 50 C14 50 16 20 24 20 C32 20 30 55 40 55 C50 55 48 15 56 15 C64 15 66 45 72 45"
            stroke="url(#iconGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Trend arrow up */}
          <path
            d="M60 22 L68 14 L68 22"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <line x1="68" y1="14" x2="68" y2="28" stroke="url(#goldGradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          {/* Phase markers */}
          <line x1="24" y1="20" x2="24" y2="65" stroke="#B9B8EB" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.3" />
          <line x1="40" y1="55" x2="40" y2="65" stroke="#B9B8EB" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.3" />
          <line x1="56" y1="15" x2="56" y2="65" stroke="#B9B8EB" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.3" />
          {/* Phase labels */}
          <text x="18" y="71" fontSize="5" fill="#B9B8EB" opacity="0.5" fontFamily="sans-serif">Bull</text>
          <text x="35" y="71" fontSize="5" fill="#B9B8EB" opacity="0.5" fontFamily="sans-serif">Bear</text>
          <text x="51" y="71" fontSize="5" fill="#B9B8EB" opacity="0.5" fontFamily="sans-serif">Bull</text>
          {/* Peak/trough dots */}
          <circle cx="24" cy="20" r="2.5" fill="url(#goldGradient)" opacity="0.9" />
          <circle cx="40" cy="55" r="2.5" fill="#B9B8EB" opacity="0.8" />
          <circle cx="56" cy="15" r="2.5" fill="url(#goldGradient)" opacity="0.9" />
        </svg>
      );

    /* ------------------------------------------------
       Module 5 - Fundamental Analysis: Magnifying glass over chart/document
       ------------------------------------------------ */
    case "fundamental":
      return (
        <svg {...shared}>
          {gradient}
          {/* Document */}
          <rect x="14" y="12" width="36" height="48" rx="3" stroke="#B9B8EB" strokeWidth="1.5" fill="none" opacity="0.7" />
          {/* Document lines */}
          <line x1="20" y1="22" x2="44" y2="22" stroke="#B9B8EB" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          <line x1="20" y1="28" x2="40" y2="28" stroke="#B9B8EB" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          <line x1="20" y1="34" x2="42" y2="34" stroke="#B9B8EB" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          {/* Mini bar chart on document */}
          <rect x="20" y="44" width="5" height="10" rx="1" fill="#6366f1" opacity="0.3" />
          <rect x="27" y="40" width="5" height="14" rx="1" fill="#6366f1" opacity="0.4" />
          <rect x="34" y="42" width="5" height="12" rx="1" fill="#B9B8EB" opacity="0.3" />
          <rect x="41" y="38" width="5" height="16" rx="1" fill="url(#iconGradient)" opacity="0.4" />
          {/* Magnifying glass */}
          <circle cx="54" cy="38" r="14" stroke="url(#iconGradient)" strokeWidth="2" fill="none" />
          <line x1="64" y1="48" x2="72" y2="56" stroke="url(#iconGradient)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Lens reflection */}
          <path d="M47 30 C49 28 52 28 54 29" stroke="#B9B8EB" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />
          {/* Checkmark inside lens */}
          <path d="M48 38 L52 42 L60 34" stroke="url(#goldGradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );

    /* ------------------------------------------------
       Module 6 - On-Chain Analysis: Network graph with highlighted nodes
       ------------------------------------------------ */
    case "onchain":
      return (
        <svg {...shared}>
          {gradient}
          {/* Connections first (behind nodes) */}
          <line x1="40" y1="24" x2="22" y2="38" stroke="#B9B8EB" strokeWidth="1" opacity="0.4" />
          <line x1="40" y1="24" x2="58" y2="38" stroke="#B9B8EB" strokeWidth="1" opacity="0.4" />
          <line x1="40" y1="24" x2="40" y2="48" stroke="url(#iconGradient)" strokeWidth="1.2" opacity="0.5" />
          <line x1="22" y1="38" x2="14" y2="55" stroke="#B9B8EB" strokeWidth="1" opacity="0.3" />
          <line x1="22" y1="38" x2="32" y2="58" stroke="#B9B8EB" strokeWidth="1" opacity="0.3" />
          <line x1="58" y1="38" x2="66" y2="55" stroke="#B9B8EB" strokeWidth="1" opacity="0.3" />
          <line x1="58" y1="38" x2="48" y2="58" stroke="#B9B8EB" strokeWidth="1" opacity="0.3" />
          <line x1="40" y1="48" x2="32" y2="58" stroke="#6366f1" strokeWidth="1" opacity="0.4" />
          <line x1="40" y1="48" x2="48" y2="58" stroke="#6366f1" strokeWidth="1" opacity="0.4" />
          <line x1="22" y1="38" x2="40" y2="48" stroke="#B9B8EB" strokeWidth="1" opacity="0.3" />
          <line x1="58" y1="38" x2="40" y2="48" stroke="#B9B8EB" strokeWidth="1" opacity="0.3" />
          {/* Data flow particles */}
          <circle cx="31" cy="31" r="1" fill="#6366f1" opacity="0.7">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="49" cy="31" r="1" fill="#6366f1" opacity="0.7">
            <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
          </circle>
          {/* Central highlighted node (smart money wallet) */}
          <circle cx="40" cy="48" r="6" stroke="url(#goldGradient)" strokeWidth="2" fill="none" />
          <circle cx="40" cy="48" r="3" fill="url(#goldGradient)" opacity="0.7" />
          {/* Top node */}
          <circle cx="40" cy="24" r="5" stroke="#B9B8EB" strokeWidth="1.5" fill="none" />
          <circle cx="40" cy="24" r="2" fill="#B9B8EB" opacity="0.5" />
          {/* Middle tier */}
          <circle cx="22" cy="38" r="4" stroke="#B9B8EB" strokeWidth="1.5" fill="none" />
          <circle cx="58" cy="38" r="4" stroke="#B9B8EB" strokeWidth="1.5" fill="none" />
          {/* Leaf nodes */}
          <circle cx="14" cy="55" r="3" stroke="#B9B8EB" strokeWidth="1" fill="none" opacity="0.5" />
          <circle cx="32" cy="58" r="3" stroke="#6366f1" strokeWidth="1.2" fill="none" opacity="0.7" />
          <circle cx="48" cy="58" r="3" stroke="#6366f1" strokeWidth="1.2" fill="none" opacity="0.7" />
          <circle cx="66" cy="55" r="3" stroke="#B9B8EB" strokeWidth="1" fill="none" opacity="0.5" />
          {/* Glow on central node */}
          <circle cx="40" cy="48" r="10" fill="#D4A853" opacity="0.1" />
        </svg>
      );

    /* ------------------------------------------------
       Module 7 - Trading Psychology: Brain outline with signal waves
       ------------------------------------------------ */
    case "psychology":
      return (
        <svg {...shared}>
          {gradient}
          {/* Brain left hemisphere */}
          <path
            d="M38 18 C28 18 18 24 18 36 C18 42 20 46 24 50 C26 52 28 56 28 60 L38 60"
            stroke="#B9B8EB"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Brain right hemisphere */}
          <path
            d="M42 18 C52 18 62 24 62 36 C62 42 60 46 56 50 C54 52 52 56 52 60 L42 60"
            stroke="#6366f1"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Brain center divide */}
          <line x1="40" y1="18" x2="40" y2="60" stroke="url(#iconGradient)" strokeWidth="0.8" opacity="0.4" />
          {/* Left brain folds */}
          <path d="M24 30 C28 28 32 32 36 28" stroke="#B9B8EB" strokeWidth="1.2" fill="none" opacity="0.5" />
          <path d="M22 40 C26 38 30 42 36 38" stroke="#B9B8EB" strokeWidth="1.2" fill="none" opacity="0.5" />
          {/* Right brain folds */}
          <path d="M44 28 C48 32 52 28 56 30" stroke="#6366f1" strokeWidth="1.2" fill="none" opacity="0.5" />
          <path d="M44 38 C48 42 52 38 58 40" stroke="#6366f1" strokeWidth="1.2" fill="none" opacity="0.5" />
          {/* Signal wave emanating right side */}
          <path d="M64 32 C66 30 68 34 70 32" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M66 38 C68 36 70 40 72 38" stroke="#6366f1" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />
          {/* Signal wave emanating left side */}
          <path d="M16 32 C14 30 12 34 10 32" stroke="#B9B8EB" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M14 38 C12 36 10 40 8 38" stroke="#B9B8EB" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />
          {/* Pulse/heartbeat line at bottom */}
          <path
            d="M18 66 L28 66 L31 62 L34 70 L37 64 L40 66 L43 66 L46 62 L49 70 L52 66 L62 66"
            stroke="url(#goldGradient)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.7"
          />
        </svg>
      );

    /* ------------------------------------------------
       Module 8 - Portfolio Strategy: Pie chart with shield accent
       ------------------------------------------------ */
    case "portfolio":
      return (
        <svg {...shared}>
          {gradient}
          {/* Pie chart - full circle outline */}
          <circle cx="36" cy="40" r="22" stroke="#B9B8EB" strokeWidth="1.5" fill="none" opacity="0.3" />
          {/* Pie segment 1 - large */}
          <path
            d="M36 18 A22 22 0 0 1 56.5 48 L36 40 Z"
            fill="#6366f1"
            opacity="0.25"
            stroke="#6366f1"
            strokeWidth="1.5"
          />
          {/* Pie segment 2 - medium */}
          <path
            d="M56.5 48 A22 22 0 0 1 24 58 L36 40 Z"
            fill="#B9B8EB"
            opacity="0.2"
            stroke="#B9B8EB"
            strokeWidth="1.5"
          />
          {/* Pie segment 3 - small */}
          <path
            d="M24 58 A22 22 0 0 1 18 30 L36 40 Z"
            fill="url(#iconGradient)"
            opacity="0.2"
            stroke="url(#iconGradient)"
            strokeWidth="1.5"
          />
          {/* Pie segment 4 - remainder */}
          <path
            d="M18 30 A22 22 0 0 1 36 18 L36 40 Z"
            fill="#6366f1"
            opacity="0.2"
            stroke="#B9B8EB"
            strokeWidth="1.5"
          />
          {/* Center dot */}
          <circle cx="36" cy="40" r="2.5" fill="url(#iconGradient)" opacity="0.7" />
          {/* Small shield overlay on right */}
          <path
            d="M60 16 L72 22 L72 34 C72 40 66 46 60 48 C54 46 48 40 48 34 L48 22 Z"
            stroke="url(#iconGradient)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Checkmark inside shield */}
          <path
            d="M54 30 L58 34 L66 26"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );

    /* ------------------------------------------------
       Module 9 - Tax/Fiscal: Balance scale with calculator
       ------------------------------------------------ */
    case "tax":
      return (
        <svg {...shared}>
          {gradient}
          {/* Scale vertical beam */}
          <line x1="40" y1="12" x2="40" y2="56" stroke="url(#iconGradient)" strokeWidth="1.8" strokeLinecap="round" />
          {/* Scale horizontal beam */}
          <line x1="16" y1="26" x2="64" y2="26" stroke="#B9B8EB" strokeWidth="1.8" strokeLinecap="round" />
          {/* Scale fulcrum triangle */}
          <path d="M36 14 L40 8 L44 14" stroke="url(#iconGradient)" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
          {/* Left pan strings */}
          <line x1="16" y1="26" x2="20" y2="38" stroke="#B9B8EB" strokeWidth="1" opacity="0.6" />
          <line x1="16" y1="26" x2="12" y2="38" stroke="#B9B8EB" strokeWidth="1" opacity="0.6" />
          {/* Left pan */}
          <path d="M8 38 C8 42 12 44 16 44 C20 44 24 42 24 38" stroke="#B9B8EB" strokeWidth="1.5" fill="none" />
          <line x1="8" y1="38" x2="24" y2="38" stroke="#B9B8EB" strokeWidth="1.5" />
          {/* Coins in left pan */}
          <circle cx="14" cy="37" r="2" stroke="url(#goldGradient)" strokeWidth="0.8" fill="#D4A853" opacity="0.5" />
          <circle cx="18" cy="37" r="2" stroke="url(#goldGradient)" strokeWidth="0.8" fill="#D4A853" opacity="0.5" />
          {/* Right pan strings */}
          <line x1="64" y1="26" x2="60" y2="34" stroke="#B9B8EB" strokeWidth="1" opacity="0.6" />
          <line x1="64" y1="26" x2="68" y2="34" stroke="#B9B8EB" strokeWidth="1" opacity="0.6" />
          {/* Right pan */}
          <path d="M56 34 C56 38 60 40 64 40 C68 40 72 38 72 34" stroke="#6366f1" strokeWidth="1.5" fill="none" />
          <line x1="56" y1="34" x2="72" y2="34" stroke="#6366f1" strokeWidth="1.5" />
          {/* Document in right pan */}
          <rect x="61" y="30" width="6" height="4" rx="0.5" stroke="#B9B8EB" strokeWidth="0.8" fill="none" opacity="0.6" />
          <line x1="62.5" y1="31.5" x2="65.5" y2="31.5" stroke="#B9B8EB" strokeWidth="0.5" opacity="0.4" />
          {/* Base */}
          <rect x="30" y="56" width="20" height="4" rx="2" stroke="url(#iconGradient)" strokeWidth="1.5" fill="none" />
          {/* Percentage symbol */}
          <circle cx="34" cy="66" r="2" stroke="#B9B8EB" strokeWidth="1" fill="none" opacity="0.5" />
          <circle cx="46" cy="74" r="2" stroke="#B9B8EB" strokeWidth="1" fill="none" opacity="0.5" />
          <line x1="46" y1="64" x2="34" y2="76" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        </svg>
      );

    default:
      return null;
  }
}

export function Modules() {
  const { theme } = useTheme();
  const [activeModule, setActiveModule] = useState(1);
  const [direction, setDirection] = useState(0);
  const currentModule = modules.find((m) => m.id === activeModule)!;

  const handleModuleChange = (moduleId: number) => {
    setDirection(moduleId > activeModule ? 1 : -1);
    const module = modules.find((m) => m.id === moduleId);
    trackEvent("module_view", {
      module_id: moduleId,
      module_title: module?.title || "unknown",
      category: "engagement",
    });
    setActiveModule(moduleId);
  };

  const goToPrev = () => {
    if (activeModule > 1) handleModuleChange(activeModule - 1);
  };

  const goToNext = () => {
    if (activeModule < modules.length) handleModuleChange(activeModule + 1);
  };

  const progressPercentage = (activeModule / modules.length) * 100;

  return (
    <section className="relative py-16 md:py-[100px] px-4 md:px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(36px,6vw,72px)] font-bold dark:text-white light:text-[#010052] leading-tight mb-4 transition-colors duration-300">
            Tu ruta de aprendizaje
          </h2>
          <p className="dark:text-[#B9B8EB]/60 light:text-[#3d3d6b]/70 text-xl md:text-2xl transition-colors duration-300">
            9 módulos para dominar el ecosistema cripto
          </p>
        </div>

        {/* Module selector - horizontal scroll */}
        <div className="relative mb-8 md:mb-12">
          {/* Navigation arrows */}
          <button
            onClick={goToPrev}
            disabled={activeModule === 1}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full dark:bg-[#1a1952] light:bg-white border dark:border-[#B9B8EB]/20 light:border-[#010052]/15 flex items-center justify-center transition-all",
              activeModule === 1
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-[#4355d9] hover:border-[#4355d9]"
            )}
          >
            <ChevronLeft className="w-5 h-5 dark:text-white light:text-[#010052]" />
          </button>
          <button
            onClick={goToNext}
            disabled={activeModule === modules.length}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full dark:bg-[#1a1952] light:bg-white border dark:border-[#B9B8EB]/20 light:border-[#010052]/15 flex items-center justify-center transition-all",
              activeModule === modules.length
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-[#4355d9] hover:border-[#4355d9]"
            )}
          >
            <ChevronRight className="w-5 h-5 dark:text-white light:text-[#010052]" />
          </button>

          {/* Module pills */}
          <div className="mx-12 overflow-x-auto scrollbar-hide">
            <div className="flex justify-center gap-2 md:gap-3 min-w-max px-4">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => handleModuleChange(module.id)}
                  className={cn(
                    "relative px-4 md:px-5 py-2.5 md:py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                    activeModule === module.id
                      ? "bg-[#4355d9] text-white shadow-lg shadow-[#4355d9]/30"
                      : "dark:bg-[#1a1952] light:bg-white dark:text-[#B9B8EB]/50 light:text-[#3d3d6b]/60 dark:hover:text-[#B9B8EB] light:hover:text-[#010052] dark:hover:bg-[#252463] light:hover:bg-[#f5f3f0] border dark:border-[#B9B8EB]/10 light:border-[#010052]/10"
                  )}
                >
                  <span className="relative z-10">{module.id}</span>
                  {activeModule === module.id && (
                    <motion.div
                      layoutId="activeModule"
                      className="absolute inset-0 bg-[#4355d9] rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Module content card */}
        <div className="relative">
          {/* Decorative glows */}
          <div
            className="absolute pointer-events-none transition-opacity duration-300"
            style={{
              right: "-100px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "400px",
              height: "400px",
              background: theme === "light"
                ? "radial-gradient(circle, rgba(58, 84, 248, 0.1) 0%, rgba(58, 84, 248, 0.03) 40%, transparent 70%)"
                : "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.1) 40%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute pointer-events-none transition-opacity duration-300"
            style={{
              left: "-100px",
              top: "30%",
              width: "300px",
              height: "300px",
              background: theme === "light"
                ? "radial-gradient(circle, rgba(1, 0, 82, 0.08) 0%, transparent 60%)"
                : "radial-gradient(circle, rgba(67, 85, 217, 0.25) 0%, transparent 60%)",
              filter: "blur(50px)",
            }}
          />

          {/* Card */}
          <div
            className="relative rounded-2xl md:rounded-3xl border dark:border-[#B9B8EB]/15 light:border-[#010052]/10 overflow-hidden transition-all duration-300"
            style={{
              background: theme === "light"
                ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 243, 240, 0.9) 50%, rgba(255, 255, 255, 0.95) 100%)"
                : "linear-gradient(135deg, rgba(67, 85, 217, 0.3) 0%, rgba(27, 26, 100, 0.5) 50%, rgba(1, 0, 82, 0.7) 100%)",
            }}
          >
            <div className="relative p-6 md:p-12">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeModule}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -50 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {/* Two-column layout */}
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-8 mb-6">
                    {/* Content column */}
                    <div>
                      {/* Module number with divider */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <span className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-bold bg-gradient-to-br from-[#B9B8EB] to-[#6366f1] bg-clip-text text-transparent">
                            {String(activeModule).padStart(2, "0")}
                          </span>
                          <div
                            className="absolute -inset-3 rounded-lg blur-xl -z-10 transition-colors duration-300"
                            style={{
                              background:
                                theme === "light"
                                  ? "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(185, 184, 235, 0.1))"
                                  : "linear-gradient(135deg, rgba(185, 184, 235, 0.2), rgba(99, 102, 241, 0.2))",
                            }}
                          />
                        </div>
                        <div className="h-12 w-px bg-gradient-to-b from-transparent via-[#B9B8EB]/50 to-transparent" />
                        <span className="text-xs font-medium uppercase tracking-wide dark:text-[#B9B8EB]/60 light:text-[#3d3d6b]/60 transition-colors duration-300">
                          Módulo
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-[family-name:var(--font-heading)] text-xl md:text-[32px] font-bold dark:text-white light:text-[#010052] mb-3 leading-tight transition-colors duration-300">
                        {currentModule.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-sm md:text-base font-semibold bg-gradient-to-r from-[#B9B8EB] to-[#6366f1] bg-clip-text text-transparent mb-4">
                        {currentModule.subtitle}
                      </p>
                    </div>

                    {/* Icon column */}
                    <div className="flex items-center justify-center md:justify-end">
                      <div className="relative w-[140px] h-[140px] md:w-[180px] md:h-[180px]">
                        {/* Glow effect */}
                        <div
                          className="absolute inset-0 rounded-full blur-2xl transition-colors duration-300"
                          style={{
                            background:
                              theme === "light"
                                ? "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(185, 184, 235, 0.15))"
                                : "linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(185, 184, 235, 0.3))",
                          }}
                        />

                        {/* Border gradient */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#B9B8EB]/40 via-[#6366f1]/30 to-transparent p-[2px]">
                          <div className="w-full h-full rounded-full dark:bg-[#010052]/80 light:bg-white/80 backdrop-blur-sm overflow-hidden transition-colors duration-300 flex items-center justify-center p-6 md:p-8">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={activeModule}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.4 }}
                                className="w-full h-full"
                              >
                                <ModuleIcon icon={currentModule.icon} />
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="dark:text-[#B9B8EB]/70 light:text-[#3d3d6b] leading-relaxed text-sm md:text-base transition-colors duration-300 mb-6">
                    {currentModule.description}
                  </p>

                  {/* Progress tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="px-3 py-1.5 rounded-full bg-[#6366f1]/15 border border-[#6366f1]/30">
                      <span className="text-xs font-medium dark:text-[#B9B8EB] light:text-[#4355d9] transition-colors duration-300">
                        Módulo {activeModule}/{modules.length}
                      </span>
                    </div>
                    <div className="w-1 h-1 rounded-full dark:bg-[#B9B8EB]/30 light:bg-[#010052]/20" />
                    {/* Mini progress bar */}
                    <div className="flex-1 min-w-[120px] h-2 dark:bg-[#B9B8EB]/10 light:bg-[#010052]/10 rounded-full overflow-hidden transition-colors duration-300">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#B9B8EB] to-[#6366f1]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t dark:border-[#B9B8EB]/10 light:border-[#010052]/10 transition-colors duration-300">
                <button
                  onClick={goToPrev}
                  disabled={activeModule === 1}
                  className={cn(
                    "flex items-center gap-2 text-sm transition-colors",
                    activeModule === 1
                      ? "dark:text-[#B9B8EB]/20 light:text-[#010052]/20 cursor-not-allowed"
                      : "dark:text-[#B9B8EB]/50 light:text-[#3d3d6b]/60 dark:hover:text-white light:hover:text-[#010052]"
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden md:inline">Anterior</span>
                </button>

                {/* Dot indicators */}
                <div className="flex gap-1.5">
                  {modules.map((module) => (
                    <motion.button
                      key={module.id}
                      onClick={() => handleModuleChange(module.id)}
                      className={cn(
                        "h-2 rounded-full transition-colors duration-300",
                        activeModule === module.id
                          ? "bg-gradient-to-r from-[#B9B8EB] to-[#6366f1] shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                          : module.id < activeModule
                            ? "bg-[#6366f1]/40"
                            : "dark:bg-[#B9B8EB]/15 light:bg-[#010052]/15"
                      )}
                      animate={{
                        width: activeModule === module.id ? 32 : 8,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>

                <button
                  onClick={goToNext}
                  disabled={activeModule === modules.length}
                  className={cn(
                    "flex items-center gap-2 text-sm transition-colors",
                    activeModule === modules.length
                      ? "dark:text-[#B9B8EB]/20 light:text-[#010052]/20 cursor-not-allowed"
                      : "dark:text-[#B9B8EB]/50 light:text-[#3d3d6b]/60 dark:hover:text-white light:hover:text-[#010052]"
                  )}
                >
                  <span className="hidden md:inline">Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
