"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin } from "lucide-react";
import { trackOutboundLink } from "@/lib/analytics";
import { useTheme } from "@/components/providers/ThemeProvider";

const team = [
  {
    name: 'Alex "Axel" Cuesta',
    role: "FUNDADOR",
    description:
      "Más de 7 años de experiencia analizando mercados financieros, he desarrollado un enfoque propio que combina fundamentos macroeconómicos, lectura institucional y análisis fundamental para entender las claves para que un activo digital triunfe.",
    linkedin: "https://www.linkedin.com/in/alejandro-cuesta/",
    photo: "/img/team-alex.png?v=2",
  },
  {
    name: "Alejandro García",
    role: "PROFESOR",
    description:
      "Economista con máster en mercados financieros, lleva desde 2018 analizando el ecosistema cripto con foco en protocolos DeFi y métricas on-chain. Ha formado a decenas de alumnos en programas académicos y trabajó como líder de operaciones en la startup Depasify, ayudando a levantar +2M€ en financiación.",
    linkedin: "#",
    photo: "/img/team-alejandro-garcia.png?v=2",
  },
  {
    name: "Borja Neira",
    role: "PROFESOR",
    description:
      "Especialista en tokenización de activos y analista financiero. Candidato a CFA y Proxy Product Owner en Mercedes-Benz, trabaja investigando cómo los activos tokenizados impactan en la lógica tradicional de asignación de carteras.",
    linkedin: "https://www.linkedin.com/in/bneira/",
    photo: "/img/team-borja.png?v=2",
  },
  {
    name: "Alejandro Gilabert",
    role: "PROFESOR",
    description:
      "Ingeniero de telecomunicaciones con experiencia en desarrollo de productos blockchain, es Product Owner en ONYZE, una de las principales custodias cripto en España. Profesor universitario en CEDEU, ha trabajado en soluciones DeFi y estrategias de tokenización.",
    linkedin: "https://www.linkedin.com/in/alejandrogilabertramirez/",
    photo: "/img/team-alejandro-gilabert.png?v=2",
  },
  {
    name: "Esteban Rivero",
    role: "PROFESOR",
    description:
      "Licenciado en ADE y Máster en Auditoría y Finanzas. Ejerce como consultor especializado en riesgos y regulación, y experto en fiscalidad de los criptoactivos. Fundador del proyecto de divulgación CeroUnoCrypto.",
    linkedin: "https://www.linkedin.com/in/esteban-rivero/",
    photo: "/img/team-esteban.png?v=2",
  },
];

export function Team() {
  const { theme } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedMember = team[selectedIndex];

  return (
    <section className="relative py-16 md:py-20 px-4 md:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2
            className="font-[family-name:var(--font-heading)] text-[clamp(36px,6vw,72px)] font-bold leading-tight mb-6 transition-colors duration-300"
            style={{
              color: theme === "light" ? "#010052" : "#ffffff",
            }}
          >
            Conoce al Equipo
          </h2>
          <p
            className="text-lg md:text-xl max-w-3xl mx-auto transition-colors duration-300"
            style={{
              color:
                theme === "light"
                  ? "rgba(61, 61, 107, 0.7)"
                  : "rgba(185, 184, 235, 0.5)",
            }}
          >
            El elenco de profesores, a diferencia del resto de escuelas, no está
            compuesto por &quot;apasionados de las criptomonedas&quot;. Llevamos en el
            sector de las criptomonedas desde 2017 y sumamos más de 30 años de
            experiencia profesional combinada entre finanzas tradicionales y
            digitales.
          </p>
        </motion.div>

        {/* Team selector layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-12"
        >
          {/* Thumbnail selector - horizontal on mobile, vertical on desktop */}
          <div className="flex md:flex-col gap-4 order-2 md:order-1">
            {team.map((member, index) => (
              <button
                key={member.name}
                onClick={() => setSelectedIndex(index)}
                className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden transition-all duration-300 ${
                  selectedIndex === index
                    ? "ring-2 ring-[#4355d9] scale-110"
                    : "opacity-60 hover:opacity-100 hover:scale-105"
                }`}
              >
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover border-0 border-transparent"
                  style={{
                    borderStyle: "none",
                    borderImage: "none",
                    borderWidth: 0,
                    borderColor: "rgba(0, 0, 0, 0)",
                  }}
                />
              </button>
            ))}
          </div>

          {/* Featured member card */}
          <div className="relative group order-1 md:order-2 w-full max-w-4xl">
            {/* Gradient border */}
            <div
              className="absolute inset-[-2px] rounded-[22px] bg-gradient-to-br from-[rgba(185,184,235,0.3)] via-[rgba(99,102,241,0.2)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />

            {/* Main card */}
            <div
              className="relative rounded-[22px] overflow-hidden backdrop-blur-xl border transition-all duration-300"
              style={{
                background:
                  theme === "light"
                    ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 243, 240, 0.9) 100%)"
                    : "rgba(1, 0, 82, 0.6)",
                borderColor:
                  theme === "light"
                    ? "rgba(1, 0, 82, 0.1)"
                    : "rgba(185, 184, 235, 0.1)",
              }}
            >
              {/* Background glow effects */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      theme === "light"
                        ? "rgba(99, 102, 241, 0.08)"
                        : "rgba(99, 102, 241, 0.1)",
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 w-[150px] h-[150px] rounded-full blur-[40px]"
                  style={{
                    background:
                      theme === "light"
                        ? "rgba(185, 184, 235, 0.05)"
                        : "rgba(185, 184, 235, 0.08)",
                  }}
                />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedMember.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative p-6 flex flex-col md:flex-row gap-6 md:gap-8"
                >
                  {/* Image - left side */}
                  <div className="relative w-full md:w-[280px] lg:w-[320px] flex-shrink-0 aspect-[4/5] overflow-hidden" style={{ borderRadius: "35px" }}>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.3)] via-transparent to-transparent z-10 pointer-events-none" />

                    <Image
                      src={selectedMember.photo}
                      alt={selectedMember.name}
                      fill
                      className="object-cover border-0 border-transparent"
                      style={{
                        borderStyle: "none",
                        borderImage: "none",
                        borderWidth: 0,
                        borderColor: "rgba(0, 0, 0, 0)",
                      }}
                      priority
                    />

                    {/* Role badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <div
                        className="px-3 py-1.5 rounded-full backdrop-blur-sm border transition-colors duration-300"
                        style={{
                          background:
                            theme === "light"
                              ? "rgba(67, 85, 217, 0.15)"
                              : "rgba(67, 85, 217, 0.3)",
                          borderColor:
                            theme === "light"
                              ? "rgba(99, 102, 241, 0.3)"
                              : "rgba(99, 102, 241, 0.3)",
                        }}
                      >
                        <span
                          className="text-xs font-semibold uppercase tracking-wider transition-colors duration-300"
                          style={{
                            color: theme === "light" ? "#4355d9" : "#ffffff",
                          }}
                        >
                          {selectedMember.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info - right side */}
                  <div className="flex flex-col justify-center space-y-4 md:space-y-5 flex-1">
                    <h3
                      className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl lg:text-4xl font-bold leading-tight transition-colors duration-300"
                      style={{
                        color: theme === "light" ? "#010052" : "#ffffff",
                      }}
                    >
                      {selectedMember.name}
                    </h3>

                    <p
                      className="text-sm md:text-base leading-relaxed transition-colors duration-300"
                      style={{
                        color:
                          theme === "light"
                            ? "rgba(61, 61, 107, 0.8)"
                            : "rgba(185, 184, 235, 0.7)",
                      }}
                    >
                      {selectedMember.description}
                    </p>

                    {/* LinkedIn button */}
                    <a
                      href={selectedMember.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackOutboundLink(
                          selectedMember.linkedin,
                          `LinkedIn - ${selectedMember.name}`
                        )
                      }
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 hover:scale-105 w-fit"
                      style={{
                        background:
                          theme === "light"
                            ? "transparent"
                            : "rgba(67, 85, 217, 0.1)",
                        borderColor:
                          theme === "light"
                            ? "rgba(1, 0, 82, 0.2)"
                            : "rgba(185, 184, 235, 0.2)",
                      }}
                    >
                      <Linkedin
                        className="w-4 h-4"
                        style={{
                          color: theme === "light" ? "#010052" : "#ffffff",
                        }}
                      />
                      <span
                        className="text-sm font-medium transition-colors duration-300"
                        style={{
                          color: theme === "light" ? "#010052" : "#ffffff",
                        }}
                      >
                        LinkedIn
                      </span>
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
