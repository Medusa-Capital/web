"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Team data matching the original site (2 professors: Borja Neira & Alejandro Gilabert)
const team = [
  {
    name: "Borja Neira",
    role: "PROFESOR",
    bio: "Especialista en tokenización de activos y analista financiero. Candidato a CFA y Proxy Product Owner en Mercedes-Benz, trabaja investigando cómo los activos tokenizados impactan en la lógica tradicional de asignación de carteras. Combina formación financiera rigurosa con un enfoque puramente económico sobre cripto, centrado en DeFi, RWAs y la transformación estructural de los mercados privados.",
    linkedin: "#",
    photo: "/img/member-1.webp",
  },
  {
    name: "Alejandro Gilabert",
    role: "PROFESOR",
    bio: "Ingeniero de telecomunicaciones con experiencia en desarrollo de productos blockchain, es Product Owner en ONYZE, una de las principales custodias cripto en España. Profesor universitario en CEDEU, ha trabajado en soluciones DeFi y estrategias de tokenización para startups del sector. Combina perfil técnico y visión de negocio para enseñar cómo funciona la infraestructura blockchain más allá de la especulación.",
    linkedin: "#",
    photo: "/img/member-2.webp",
  },
];

function TeamCard({ member }: { member: typeof team[0] }) {
  return (
    <div className="flex-shrink-0 w-[calc(100vw-70px)] max-w-[734px] mr-[clamp(20px,4vw,40px)] glass-card">
      {/* LinkedIn icon in top right */}
      <a
        href={member.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3.5 right-3.5 w-[42px] h-[42px] rounded-full bg-[#B9B8EB]/30 flex items-center justify-center hover:bg-[#0077b5] transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      </a>

      {/* Avatar */}
      <div className="mb-4">
        <Image
          src={member.photo}
          alt={member.name}
          width={80}
          height={80}
          className="w-20 h-20 rounded-full object-cover"
        />
      </div>

      {/* Content */}
      <div>
        <h3 className="text-[#e8a060] font-semibold text-lg">
          {member.name}
        </h3>
        <span className="text-[#cccce0]/60 text-[17px] font-semibold uppercase tracking-wider">
          • {member.role}
        </span>
        <p className="text-[#cccce0]/70 text-sm leading-relaxed mt-3">
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
    <section className="relative py-24 overflow-hidden bg-[#010052] z-20">
      <div className="max-w-6xl mx-auto px-6">
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
        className="flex gap-6 overflow-x-hidden cursor-grab px-6"
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
