"use client";

import Image from "next/image";

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
  return (
    <section className="relative px-6 py-16 lg:py-24">
      {/* Radial glow effects - matching legacy site */}
      <div
        className="circle-radial"
        style={{
          top: '10%',
          right: '-500px',
          opacity: 0.25,
        }}
      />
      <div
        className="circle-radial"
        style={{
          bottom: '20%',
          left: '-400px',
          opacity: 0.2,
        }}
      />
      {/* Background Medusa graphic */}
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

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Two column layout */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-stretch">
          {/* Left content - sticky */}
          <div className="flex flex-col">
            <div className="flex-1">
              <div className="lg:sticky lg:top-[clamp(140px,4vw,162px)] mb-12 lg:mb-0">
                <h2 className="font-[family-name:var(--font-heading)] text-[clamp(36px,4.5vw,60px)] font-bold text-white leading-tight mb-6">
                  Un Método Claro para Entender, Evaluar e Invertir en Cripto con
                  Criterio
                </h2>
                <p className="text-[#cccce0] text-lg leading-relaxed">
                  Desde Bitcoin hasta DeFi, pasando por tokenomics, ciclos de
                  mercado y gestión del riesgo. Una formación paso a paso diseñada
                  para ayudarte a interpretar este nuevo ecosistema con el mismo
                  rigor con el que analizas cualquier otro activo financiero.
                </p>
              </div>
            </div>
          </div>

          {/* Right - Cards list with sticky stacking effect */}
          <div className="relative">
            {features.map((feature, i) => (
              <div
                key={i}
                className="lg:sticky lg:top-[clamp(100px,4vw,120px)] mb-8 lg:mb-0"
                style={{ 
                  zIndex: 10 + i,
                  backgroundColor: "#010052",
                  paddingTop: "40px",
                  paddingBottom: "250px",
                }}
              >
                <div className="flex gap-4 md:gap-8">
                  {/* Step count badge */}
                  <div className="flex-shrink-0">
                    <Image
                      src={feature.countIcon}
                      alt={`Step ${feature.number}`}
                      width={112}
                      height={112}
                      className="w-14 md:w-20 lg:w-[112px] h-auto rounded-full"
                    />
                  </div>

                  {/* Card */}
                  <div
                    className="flex-1 rounded-[clamp(20px,2vw,30px)] p-5 lg:p-8 shadow-2xl border border-white/10"
                    style={{ backgroundColor: "#1b1a64" }}
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
                    <h3 className="text-white font-semibold text-lg lg:text-xl mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-[#cccce0] text-sm lg:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {/* Final spacer - must be large enough so all cards unstick together */}
            <div className="hidden lg:block h-[300vh]" />
          </div>
        </div>
      </div>
    </section>
  );
}
