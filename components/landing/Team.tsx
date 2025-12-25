"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { trackOutboundLink } from "@/lib/analytics";

// Team data - 4 members: Founder + 3 Professors
const team = [
  {
    name: 'Alex "Axel" Cuesta',
    role: "FUNDADOR",
    bio: "Más de 7 años de experiencia analizando mercados financieros, he desarrollado un enfoque propio que combina fundamentos macroeconómicos, lectura institucional y análisis fundamental para entender las claves para que un activo digital triunfe.",
    linkedin: "#",
    photo: "/img/member-1.webp",
  },
  {
    name: "Alejandro García",
    role: "PROFESOR",
    bio: "Economista con máster en mercados financieros, lleva desde 2018 analizando el ecosistema cripto con foco en protocolos DeFi y métricas on-chain. Ha formado a decenas de alumnos en programas académicos y trabajó como líder de operaciones en la startup Depasify, ayudando a levantar +2M€ en financiación. Combina visión académica y experiencia práctica para enseñar cómo interpretar los activos digitales con lógica económica y sin depender del ruido del mercado.",
    linkedin: "#",
    photo: "/img/member-2.webp",
  },
  {
    name: "Borja Neira",
    role: "PROFESOR",
    bio: "Especialista en tokenización de activos y analista financiero. Candidato a CFA y Proxy Product Owner en Mercedes-Benz, trabaja investigando cómo los activos tokenizados impactan en la lógica tradicional de asignación de carteras. Combina formación financiera rigurosa con un enfoque puramente económico sobre cripto, centrado en DeFi, RWAs y la transformación estructural de los mercados privados.",
    linkedin: "#",
    photo: "/img/member-3.webp",
  },
  {
    name: "Alejandro Gilabert",
    role: "PROFESOR",
    bio: "Ingeniero de telecomunicaciones con experiencia en desarrollo de productos blockchain, es Product Owner en ONYZE, una de las principales custodias cripto en España. Profesor universitario en CEDEU, ha trabajado en soluciones DeFi y estrategias de tokenización para startups del sector. Combina perfil técnico y visión de negocio para enseñar cómo funciona la infraestructura blockchain más allá de la especulación.",
    linkedin: "#",
    photo: "/img/member-4.webp",
  },
];

function TeamCard({ member }: { member: typeof team[0] }) {
  return (
    <div className="flex-shrink-0 w-[600px] min-h-[320px] flex gap-6 p-6 rounded-3xl border border-[#B9B8EB]/10 bg-gradient-to-br from-[#1b1a64]/60 to-[#0a0a2e]/80 backdrop-blur-sm items-stretch">
      {/* Photo with LinkedIn badge */}
      <div className="relative flex-shrink-0">
        <Image
          src={member.photo}
          alt={member.name}
          width={180}
          height={280}
          className="w-[180px] h-full min-h-[280px] object-cover object-top rounded-2xl"
        />
        {/* LinkedIn badge */}
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#4355d9] flex items-center justify-center hover:bg-[#0077b5] transition-colors shadow-lg"
          onClick={() => trackOutboundLink(member.linkedin, `LinkedIn - ${member.name}`)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </a>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-start flex-1 min-w-0 py-1">
        {/* Role badge */}
        <span className="inline-block self-start px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-[#4355d9]/20 text-[#B9B8EB] mb-2">
          {member.role}
        </span>

        {/* Name */}
        <h3 className="text-white font-bold text-2xl mb-3 leading-tight">
          {member.name}
        </h3>

        {/* Bio - full text visible */}
        <p className="text-[#B9B8EB]/60 text-sm leading-relaxed">
          {member.bio}
        </p>
      </div>
    </div>
  );
}

export function Team() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;

        // Get the width of one set of cards
        const singleSetWidth = scrollContainer.scrollWidth / 2;

        // Reset to beginning when we've scrolled past the first set
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

  // Duplicate team array for infinite scroll effect
  const duplicatedTeam = [...team, ...team];

  return (
    <section className="relative py-[100px] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Conoce al Equipo
          </h2>
          <p className="text-[#B9B8EB]/50 max-w-xl mx-auto">
            Llevamos en el sector de las criptomonedas desde 2018 y sumamos más de 15 años
            de experiencia combinada en finanzas tradicionales y digitales.
          </p>
        </div>
      </div>

      {/* Carousel container - full width */}
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-hidden cursor-grab px-6 py-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedTeam.map((member, i) => (
          <TeamCard key={i} member={member} />
        ))}
      </div>
    </section>
  );
}
