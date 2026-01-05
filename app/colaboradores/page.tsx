"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageBackground } from "@/components/landing/PageBackground";
import { trackOutboundLink } from "@/lib/analytics";

const collaborators = [
  {
    name: "Pablo Gil",
    tagline: "Trader y Analista de Mercados",
    description:
      "Referente en el mundo del trading en español, con décadas de experiencia en mercados financieros. Colaboramos en contenido educativo y análisis de mercado para ofrecer una visión completa del ecosistema financiero.",
    url: "https://pablogiltrader.com/",
    accentColor: "from-amber-500/20 via-orange-500/10 to-transparent",
    glowColor: "bg-amber-500/30",
    borderAccent: "hover:border-amber-500/30",
    buttonAccent: "bg-amber-500/20 hover:bg-amber-500/30 text-amber-200",
    photo: "/img/avatar/pablogil.png",
  },
  {
    name: "JF Partners",
    tagline: "Comunidad de Educación Financiera",
    description:
      "Comunidad de inversores enfocada en formación financiera para el pequeño y mediano inversor. Juntos impulsamos la educación financiera de calidad y accesible para todos.",
    url: "https://jfpartners.net/",
    accentColor: "from-cyan-500/20 via-teal-500/10 to-transparent",
    glowColor: "bg-cyan-500/30",
    borderAccent: "hover:border-cyan-500/30",
    buttonAccent: "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200",
    photo: "/img/avatar/javierdv.png",
  },
];

function CollaboratorCard({
  collaborator,
  index,
}: {
  collaborator: (typeof collaborators)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="snap-center"
    >
      <a
        href={collaborator.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackOutboundLink(collaborator.url, collaborator.name)
        }
        className={`group relative block w-full min-h-[400px] md:min-h-[450px] p-8 md:p-12 lg:p-16 rounded-3xl border border-[#B9B8EB]/10 bg-gradient-to-br from-[#1b1a64]/80 to-[#0a0a2e]/90 backdrop-blur-sm overflow-hidden transition-all duration-500 ${collaborator.borderAccent}`}
      >
        {/* Gradient accent overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${collaborator.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        {/* Decorative glow */}
        <div
          className={`absolute -top-32 -right-32 w-96 h-96 ${collaborator.glowColor} rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700`}
        />

        {/* Decorative pattern - subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Top section */}
          <div>
            {/* Number badge */}
            <span className="inline-block text-[#B9B8EB]/30 text-sm font-mono mb-6">
              0{index + 1}
            </span>

            {/* Brand name - large typography */}
            <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight group-hover:translate-x-2 transition-transform duration-500">
              {collaborator.name}
            </h2>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-[#B9B8EB]/80 font-medium mb-6">
              {collaborator.tagline}
            </p>

            {/* Description */}
            <p className="text-[#B9B8EB]/50 text-base md:text-lg leading-relaxed max-w-2xl">
              {collaborator.description}
            </p>
          </div>

          {/* Bottom section - CTA */}
          <div className="mt-8 flex items-center gap-4">
            <span
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${collaborator.buttonAccent} font-medium transition-all duration-300 group-hover:gap-4`}
            >
              Visitar
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* Large decorative text - brand initial */}
        <div className="absolute -bottom-20 -right-10 md:-bottom-16 md:-right-4 text-[200px] md:text-[280px] font-bold text-white/[0.02] leading-none pointer-events-none select-none">
          {collaborator.name.charAt(0)}
        </div>

        {/* Photo - always visible with left edge fade */}
        {collaborator.photo && (
          <div 
            className="absolute bottom-0 right-0 w-[280px] md:w-[350px] h-[350px] md:h-[450px] pointer-events-none"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
            }}
          >
            <Image
              src={collaborator.photo}
              alt={collaborator.name}
              fill
              className="object-contain object-bottom"
            />
          </div>
        )}
      </a>
    </motion.div>
  );
}

export default function ColaboradoresPage() {
  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <div className="relative z-10">
        <Header />
        <main className="pt-8 pb-16">
          {/* Hero header */}
          <div className="max-w-6xl mx-auto px-6 mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Colaboradores
              </h1>
              <p className="text-[#B9B8EB]/60 max-w-2xl mx-auto text-base md:text-lg">
                Trabajamos junto a profesionales y creadores que comparten
                nuestra visión de educación financiera accesible y de calidad.
              </p>
            </motion.div>
          </div>

          {/* Collaborators - vertical scroll */}
          <div className="max-w-5xl mx-auto px-6 space-y-8 md:space-y-12 snap-y snap-mandatory">
            {collaborators.map((collaborator, index) => (
              <CollaboratorCard
                key={collaborator.name}
                collaborator={collaborator}
                index={index}
              />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
