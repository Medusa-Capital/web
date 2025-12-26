"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { trackCTAClick, trackOutboundLink } from "@/lib/analytics";

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-6 pt-[25px] pb-16"
      style={{
        backgroundImage: 'url("/img/hero-strokes.webp")',
        backgroundSize: 'contain',
        backgroundPosition: 'center 20px',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        {/* Welcome badge */}
        <Badge variant="hero" className="mb-5">
          <Image
            src="/img/icons/logo-icon.svg"
            alt=""
            width={24}
            height={24}
            className="w-5 h-5 md:w-6 md:h-6"
          />
          Bienvenido a Medusa Capital
        </Badge>

        {/* Main headline */}
        <h1
          className="font-[family-name:var(--font-heading)] font-bold text-white leading-tight mb-6 capitalize"
          style={{ fontSize: 'clamp(1.5rem, 6vw, 4.5rem)' }}
        >
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
          className="relative w-full max-w-[766px] mx-auto mb-8 rounded-[30px] overflow-hidden"
        >
          <div className="aspect-video overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/6vCzfCYs6DE"
              title="Medusa Capital - Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>

        {/* CTA Button */}
        <Button
          variant="primaryGlow"
          size="lg"
          className="px-8 py-6 text-base font-semibold rounded-lg"
          onClick={() => {
            trackCTAClick("hero_cta", "calendly");
            trackOutboundLink("https://calendly.com/contacto-medusacapital/30min", "Quiero Reservar Mi Plaza");
            window.open("https://calendly.com/contacto-medusacapital/30min", "_blank");
          }}
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
        <div className="mt-8 md:mt-12 flex flex-row items-center justify-center gap-4 md:gap-14">
          {/* JF Partners logo */}
          <Image
            src="/img/brand-logo-1.webp"
            alt="JF Partners"
            width={180}
            height={60}
            className="h-12 md:h-20 w-auto"
          />

          <span className="text-white text-lg md:text-2xl font-light">×</span>

          {/* Medusa Capital logo */}
          <Image
            src="/img/brand-logo-2.webp"
            alt="Medusa Capital"
            width={180}
            height={100}
            className="h-12 md:h-20 w-auto"
          />
        </div>
      </div>
    </section>
  );
}
