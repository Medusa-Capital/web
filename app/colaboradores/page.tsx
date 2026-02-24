"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageBackground } from "@/components/landing/PageBackground";
import { PageCTA } from "@/components/landing/PageCTA";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Clock,
  TrendingUp,
  Users,
  Building2,
  Mic,
  Calendar,
} from "lucide-react";
import {
  CollaboratorCard,
  CollaboratorData,
} from "@/components/landing/CollaboratorCard";

const collaborators: CollaboratorData[] = [
  {
    name: "Pablo Gil",
    role: "Trader profesional (+$500 Millones Gestionados) & divulgador financiero",
    imageUrl: "/img/avatar/collaborators/pablogil.jpg",
    accentColor: "#f59e0b",
    collaboration: {
      tag: "Curso Exclusivo",
      title: "Criptomonedas: Fundamentos y Estrategias Avanzadas",
      description:
        "Curso exclusivo de 3 horas donde Pablo comparte su visión sobre el mercado de criptomonedas, combinando su experiencia de más de 37 años en mercados tradicionales con las oportunidades del ecosistema cripto.",
      linkText: "Publicado en Pablo Gil Trader",
      linkUrl: "#",
    },
    credentials: [
      <>Top 100 <strong><em>Forbes España</em></strong> en negocios e industria financiera</>,
      <>Mejor Divulgador Financiero 2023, 2024 y 2025 — Premios <strong><em>Rankia</em></strong></>,
      <>Ex-Director de Análisis Técnico en <strong><em>Banco Santander</em></strong></>,
      "Fundador del primer hedge fund market-neutral con +$500M gestionados",
      <>Estratega jefe en <strong><em>XTB</em></strong> y embajador de <strong><em>IG Markets</em></strong></>,
    ],
    stats: [
      { label: "Forbes", value: "Top 100 España", icon: <Award className="w-3.5 h-3.5" /> },
      { label: "Experiencia", value: "+37 años", icon: <Clock className="w-3.5 h-3.5" /> },
      { label: "YouTube", value: "381K", icon: <Users className="w-3.5 h-3.5" /> },
      { label: "Rankia", value: "Mejor Divulgador", icon: <TrendingUp className="w-3.5 h-3.5" /> },
    ],
    socials: [
      { platform: "youtube", url: "https://www.youtube.com/@PabloGilTrader" },
      { platform: "twitter", url: "https://twitter.com/PabloGilTrader" },
      { platform: "website", url: "https://pablogiltrader.com/" },
    ],
  },
  {
    name: "Javier del Valle",
    role: "Inversor y Analista macroeconómico",
    imageUrl: "/img/avatar/collaborators/javierdelvalle.jpg",
    accentColor: "#06b6d4",
    collaboration: {
      tag: "Curso Exclusivo",
      title: "Bitcoin: Análisis Fundamental y Perspectivas",
      description:
        "Curso exclusivo de 3 horas donde Javier profundiza en el análisis fundamental de Bitcoin y el ecosistema DeFi, compartiendo su experiencia como pionero del sector en España.",
      linkText: "Publicado en su plataforma educativa",
      linkUrl: "#",
    },
    credentials: [
      <>Asesor financiero certificado <strong><em>EFA</em></strong> (European Financial Advisor)</>,
      <>Fundador de <strong><em>JFPartners</em></strong> — educación financiera para inversores</>,
      "+188K seguidores en redes como referente en inversión",
      <>Host del podcast <strong><em>Aprende a Invertir con Javier del Valle</em></strong></>,
      <>Creador de la comunidad <strong><em>Domina la Bolsa</em></strong></>,
    ],
    stats: [
      { label: "Certificación", value: "Asesor EFA", icon: <Award className="w-3.5 h-3.5" /> },
      { label: "Fundador", value: "JFPartners", icon: <Building2 className="w-3.5 h-3.5" /> },
      { label: "YouTube", value: "188K", icon: <Users className="w-3.5 h-3.5" /> },
      { label: "Podcast", value: "Aprende a Invertir", icon: <Mic className="w-3.5 h-3.5" /> },
    ],
    socials: [
      { platform: "linkedin", url: "https://www.linkedin.com/in/javierdelvalle/" },
      { platform: "twitter", url: "https://twitter.com/JFPartners_" },
      { platform: "website", url: "https://dominalabolsa.com/" },
    ],
  },
  {
    name: "Diego Puertas",
    role: "Analista Macro & Podcaster",
    imageUrl: "/img/avatar/collaborators/diegopuertas.jpeg",
    accentColor: "#8b5cf6",
    collaboration: {
      tag: "Análisis Exclusivo",
      title: "Reportes semanales de análisis macroeconómico y flujos de capital",
      description:
        "Análisis macro exclusivo para la comunidad Medusa Capital, donde Diego comparte su visión sobre los flujos de capital, tendencias macroeconómicas y su impacto en el mercado cripto.",
      linkText: "Exclusivo para Comunidad Medusa Capital",
      linkUrl: "#",
    },
    credentials: [
      <>Analista de inversiones en <strong><em>Serenity Markets</em></strong></>,
      <>Certificado por el <strong><em>CISI</em></strong> (Chartered Institute for Securities &amp; Investment)</>,
      <>Creador de <strong><em>The Markets Eye</em></strong> — guía diaria de mercados con miles de suscriptores</>,
      "+800 episodios publicados de análisis económico diario",
      <>Colaborador en <strong><em>Rankia</em></strong> y medios financieros especializados</>,
    ],
    stats: [
      { label: "Certificación", value: "CISI", icon: <Award className="w-3.5 h-3.5" /> },
      { label: "Experiencia", value: "+8 años", icon: <Clock className="w-3.5 h-3.5" /> },
      { label: "Episodios", value: "800+", icon: <Mic className="w-3.5 h-3.5" /> },
      { label: "Publicación", value: "Diaria", icon: <Calendar className="w-3.5 h-3.5" /> },
    ],
    socials: [
      { platform: "twitter", url: "https://twitter.com/daborsjr" },
      { platform: "youtube", url: "https://www.youtube.com/@SerenityMarkets" },
    ],
  },
];

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
              <Badge variant="hero" className="mb-5">
                <Image
                  src="/img/icons/logo-icon.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="w-5 h-5 md:w-6 md:h-6"
                />
                Expertos del sector financiero tradicional respaldan a Medusa Capital
              </Badge>
              <h1 className="font-[family-name:var(--font-heading)] text-[clamp(40px,6vw,72px)] font-bold leading-[1.1] text-white mb-4">
                Los mayores expertos del sector
                <br />
                financiero tradicional respaldan a Medusa Capital
              </h1>
              <p className="text-lg md:text-xl leading-relaxed text-[#B9B8EB]/60 max-w-2xl mx-auto">
                Profesionales con décadas de experiencia en banca de inversión, gestión de fondos y análisis macro han colaborado con nosotros para acercar el rigor del sector tradicional al mercado de activos digitales.
              </p>
            </motion.div>
          </div>

          {/* Collaborators - vertical scroll */}
          <div className="max-w-6xl mx-auto px-6 space-y-8 md:space-y-12 snap-y snap-mandatory">
            {collaborators.map((collaborator, index) => (
              <CollaboratorCard
                key={collaborator.name}
                data={collaborator}
                index={index}
              />
            ))}
          </div>

          {/* Collaboration CTA */}
          <PageCTA
            title="¿Quieres colaborar con Medusa Capital?"
            description="Estamos siempre buscando talento excepcional para crear contenido educativo de máxima calidad."
            buttonText="Contáctanos"
            buttonEmail="contacto@medusacapital.xyz"
          />
        </main>
        <Footer />
      </div>
    </div>
  );
}
