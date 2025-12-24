"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-16"
      style={{
        backgroundImage: 'url("/img/hero-strokes.webp")',
        backgroundSize: 'contain',
        backgroundPosition: 'center 20px',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Welcome badge - matching legacy .badge-wrapper */}
        <div className="inline-flex items-center gap-3 mb-5 px-3 py-1.5 rounded-full border border-[#535296] bg-white/[0.14] text-white text-sm md:text-base">
          <Image
            src="/img/icons/logo-icon.svg"
            alt=""
            width={24}
            height={24}
            className="w-5 h-5 md:w-6 md:h-6"
          />
          Bienvenido a Medusa Capital
        </div>

        {/* Main headline - matching legacy exactly with Title Case */}
        <h1 className="font-[family-name:var(--font-heading)] text-[clamp(44px,5vw,80px)] font-bold text-white leading-[1.1] mb-6 capitalize">
          Formación En Criptomonedas
          <br />
          <span className="text-[#B9B8EB]">Para Inversores Exigentes</span>
        </h1>

        {/* Subheadline */}
        <p className="text-[#cccce0] text-[clamp(16px,2vw,20px)] max-w-2xl mx-auto mb-8">
          Un programa formativo completo diseñado para que el pequeño y mediano
          inversor no sólo no pierda poder adquisitivo, sino que pueda
          rentabilizar su patrimonio
        </p>

        {/* Video Container */}
        <div
          className="relative w-full max-w-3xl mx-auto mb-8 rounded-[30px] overflow-hidden"
        >
          <div className="aspect-video overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/Ouh-4mbPpbs?si=eVXC12p19VyYwULi"
              title="Medusa Capital - Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>

        {/* CTA Button - matching legacy button gradient */}
        <Button
          size="lg"
          className="btn-primary-glow text-white px-8 py-6 text-base font-semibold rounded-lg"
          onClick={() => window.open("https://calendly.com/contacto-medusacapital/30min", "_blank")}
        >
          Quiero Reservar Mi Plaza
        </Button>

        {/* Social proof - people group image */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <Image
            src="/img/people-group.webp"
            alt="Inversores"
            width={160}
            height={40}
            className="h-10 w-auto"
          />
          <p className="text-[#cccce0]/60 text-sm">
            Medusa Capital ha ayudado a{" "}
            <span className="text-[#3a54f8] font-semibold">200+</span> inversores a
            entender el mercado de las criptomonedas
          </p>
        </div>

        {/* Partner logos - using actual brand logo images */}
        <div className="mt-12 flex items-center justify-center gap-6 md:gap-14">
          {/* JF Partners logo */}
          <Image
            src="/img/brand-logo-1.webp"
            alt="JF Partners"
            width={180}
            height={60}
            className="h-12 md:h-14 w-auto"
          />

          <span className="text-[#B9B8EB]/40 text-2xl font-light">×</span>

          {/* Medusa Capital logo */}
          <Image
            src="/img/brand-logo-2.webp"
            alt="Medusa Capital"
            width={180}
            height={60}
            className="h-12 md:h-14 w-auto"
          />
        </div>
      </div>
    </section>
  );
}
