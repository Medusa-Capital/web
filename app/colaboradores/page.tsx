"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageBackground } from "@/components/landing/PageBackground";
import { PageCTA } from "@/components/landing/PageCTA";
import { Badge } from "@/components/ui/badge";
import {
  CollaboratorCard,
  CollaboratorData,
} from "@/components/landing/CollaboratorCard";

const collaborators: CollaboratorData[] = [
  {
    name: "Pablo Gil",
    role: "Trader Profesional & Formador",
    imageUrl: "/img/avatar/pablogil.png",
    accentColor: "#f59e0b",
    collaboration: {
      tag: "Curso Exclusivo",
      title: "Criptomonedas: Fundamentos y Estrategias Avanzadas",
      description:
        "Curso exclusivo de 3 horas donde Pablo comparte su visión sobre el mercado de criptomonedas, combinando su experiencia de más de 37 años en mercados tradicionales con las oportunidades del ecosistema cripto.",
      linkText: "Ver en Pablo Gil Trader",
      linkUrl: "https://pablogiltrader.com/",
    },
    credentials: [
      "Top Líder Forbes 2025 en industria financiera",
      "Mejor Divulgador Financiero 2023-2025 (Rankia)",
      "Ex-Director Análisis Técnico en Santander y BBVA",
      "Fundador Hedge Fund Market Neutral (2000-2013)",
      "Embajador y estratega en IG y XTB",
    ],
    stats: [
      { label: "Forbes", value: "Top Líder" },
      { label: "Experiencia", value: "+37 años" },
      { label: "Rankia", value: "Mejor 23-25" },
      { label: "Alumnos", value: "15K+" },
    ],
    socials: [
      { platform: "youtube", url: "https://www.youtube.com/@PabloGilTrader" },
      { platform: "twitter", url: "https://twitter.com/PabloGilTrader" },
      { platform: "website", url: "https://pablogiltrader.com/" },
    ],
  },
  {
    name: "Javier del Valle",
    role: "Experto DeFi & Blockchain",
    imageUrl: "/img/avatar/javierdelvalle.jpg",
    accentColor: "#06b6d4",
    collaboration: {
      tag: "Curso Exclusivo",
      title: "Bitcoin: Análisis Fundamental y Perspectivas",
      description:
        "Curso exclusivo de 3 horas donde Javier profundiza en el análisis fundamental de Bitcoin y el ecosistema DeFi, compartiendo su experiencia como pionero del sector en España.",
      linkText: "Ver curso exclusivo",
      linkUrl: "https://jfpartners.net/",
    },
    credentials: [
      "Pionero en DeFi y ecosistema Bitcoin en España",
      "Conferenciante internacional en eventos blockchain",
      "Asesor estratégico en proyectos descentralizados",
    ],
    stats: [
      { label: "Comunidad", value: "30K+" },
      { label: "Experiencia", value: "+10 años" },
      { label: "Ponencias", value: "100+" },
      { label: "Proyectos DeFi", value: "50+" },
    ],
    socials: [
      { platform: "linkedin", url: "https://www.linkedin.com/in/javierdelvalle/" },
      { platform: "twitter", url: "https://twitter.com/JFPartners_" },
      { platform: "website", url: "https://jfpartners.net/" },
    ],
  },
  {
    name: "Diego Puertas",
    role: "Analista Macro & Podcaster",
    imageUrl: "/img/avatar/diegopuertas.jpeg",
    accentColor: "#8b5cf6",
    collaboration: {
      tag: "Análisis Exclusivo",
      title: "Reportes semanales de análisis macroeconómico y flujos de capital",
      description:
        "Análisis macro exclusivo para la comunidad Medusa Capital, donde Diego comparte su visión sobre los flujos de capital, tendencias macroeconómicas y su impacto en el mercado cripto.",
      linkText: "Exclusivo Comunidad Medusa",
      linkUrl: "#",
    },
    credentials: [
      "Analista macroeconómico especializado en cripto",
      "Host del podcast de economía y mercados",
      "Colaborador habitual en medios financieros",
    ],
    stats: [
      { label: "Oyentes", value: "40K+" },
      { label: "Experiencia", value: "+7 años" },
      { label: "Episodios", value: "200+" },
      { label: "Rating", value: "4.9/5" },
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
                Expertos del Sector Tradicional Confían en Nosotros
              </Badge>
              <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Los Mayores Expertos del Sector
                <br />
                Tradicional Confían en Nosotros
              </h1>
              <p className="text-[#B9B8EB]/60 max-w-2xl mx-auto text-base md:text-lg">
                Colaboramos con los mayores profesionales del sector tradicional para dar a conocer
                las enormes posibilidades que existen en el mercado de activos digitales
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
            title="¿Quieres Colaborar con Medusa Capital?"
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
