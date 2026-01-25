"use client";

import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";

const features = [
  {
    number: 1,
    title: "Formación estructurada en 7 módulos clave",
    description:
      "Del funcionamiento de Bitcoin y la blockchain hasta estrategias de inversión, DeFi y gestión del riesgo. Todo explicado paso a paso, con ejemplos y sin tecnicismos innecesarios.",
    icon: "/img/step-1.webp",
    countIcon: "/img/step-count-1.webp",
  },
  {
    number: 2,
    title: "Comunidad de Discord",
    description:
      "Aprende de aquellos que han recorrido el camino que tú estás emprendiendo. A través de Discord compartimos análisis diarios del mercado, informes de proyectos y recursos académicos para que te mantengas informado.",
    icon: "/img/step-2.webp",
    countIcon: "/img/step-count-2.webp",
  },
  {
    number: 3,
    title: "Acceso de por vida y actualizaciones",
    description:
      "Podrás revisar todo el contenido siempre que lo necesites, y recibirás nuevas lecciones cuando cambien las condiciones del mercado.",
    icon: "/img/step-3.webp",
    countIcon: "/img/step-count-3.webp",
  },
  {
    number: 4,
    title: "Casos reales de portafolios y decisiones de inversión",
    description:
      "Compartimos nuestras operaciones reales (aciertos y errores), gestión de carteras y ejemplos prácticos para ayudarte a aplicar lo aprendido con criterio y confianza.",
    icon: "/img/step-4.webp",
    countIcon: "/img/step-count-4.webp",
  },
];

export function Features() {
  const { theme } = useTheme();
  
  return (
    <section id="method" className="relative px-4 md:px-6 mt-0 py-[50px]">
      {/* Background Medusa graphic */}
      <div
        className="hidden lg:block absolute pointer-events-none select-none transition-opacity duration-300"
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
          opacity: theme === "light" ? 0.1 : 1,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Two column layout */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Left content - sticky */}
          <div>
            <div className="lg:sticky lg:top-[clamp(140px,4vw,162px)] mb-12 lg:mb-0 text-center lg:text-left">
              <h2 className="font-[family-name:var(--font-heading)] text-[clamp(28px,4.5vw,60px)] font-bold dark:text-white light:text-[#010052] leading-tight mb-6 transition-colors duration-300">
                Un Método Claro para Entender, Evaluar e Invertir en Cripto con
                Criterio
              </h2>
              <p className="dark:text-[#cccce0] light:text-[#3d3d6b] text-base md:text-lg leading-relaxed transition-colors duration-300">
                Desde Bitcoin hasta DeFi, pasando por tokenomics, ciclos de
                mercado y gestión del riesgo. Una formación paso a paso diseñada
                para ayudarte a interpretar este nuevo ecosistema con el mismo
                rigor con el que analizas cualquier otro activo financiero.
              </p>
            </div>
          </div>

          {/* Right - Cards list with vertical spacing */}
          <div className="flex flex-col gap-8">
            {features.map((feature, i) => (
              <div key={i} className="flex gap-4 md:gap-8">
                {/* Step count badge - hidden on mobile */}
                <div className="flex-shrink-0 hidden md:block">
                  <Image
                    src={feature.countIcon}
                    alt={`Step ${feature.number}`}
                    width={112}
                    height={112}
                    className="w-20 lg:w-[112px] h-auto rounded-full"
                  />
                </div>

                {/* Card */}
                <div
                  className="flex-1 rounded-[clamp(20px,2vw,30px)] p-5 lg:p-8 shadow-2xl transition-all duration-300 dark:border-white/10 light:border-[#010052]/10 border dark:bg-[#1b1a64] light:bg-white/90 light:shadow-lg"
                >
                  <div className="mb-4">
                    <Image
                      src={feature.icon}
                      alt=""
                      width={100}
                      height={100}
                      className="w-16 md:w-20 lg:w-[100px] h-auto"
                    />
                  </div>
                  <h3 className="dark:text-white light:text-[#010052] font-semibold text-lg lg:text-xl mb-3 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="dark:text-[#cccce0] light:text-[#3d3d6b] text-sm lg:text-base leading-relaxed transition-colors duration-300">
                    {feature.description}
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
