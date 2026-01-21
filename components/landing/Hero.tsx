"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { trackCTAClick, trackOutboundLink } from "@/lib/analytics";
import { useTheme } from "@/components/providers/ThemeProvider";

export function Hero() {
  const { theme } = useTheme();
  
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-6 pt-0 pb-0 mt-0"
      style={{
        backgroundImage: theme === "light" ? 'none' : 'url("/img/hero-strokes.webp")',
        backgroundSize: 'contain',
        backgroundPosition: 'center 20px',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Light theme decorative elements */}
      {theme === "light" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-[#3a54f8]/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-48 h-48 bg-[#010052]/5 rounded-full blur-3xl" />
        </div>
      )}
      
      <div className="relative z-10 w-full max-w-[946px] mx-auto text-center">
        {/* Welcome badge */}
        <Badge variant="hero" className="mb-5">
          <Image
            src="/img/icons/logo-icon.svg"
            alt=""
            width={24}
            height={24}
            className={`w-5 h-5 md:w-6 md:h-6 ${theme === "light" ? "brightness-0" : ""}`}
          />
          +250 inversores formados con un track record documentado
        </Badge>

        {/* Main headline */}
        <h1
          className="font-[family-name:var(--font-heading)] font-bold leading-tight mb-6 capitalize transition-colors duration-300 dark:text-white light:text-[#010052]"
          style={{ fontSize: 'clamp(1.5rem, 6vw, 4.5rem)' }}
        >
          Nuestras tesis de inversión han
          <br />
          <span className="dark:text-[#B9B8EB] light:text-[#3a54f8]"> batido a BTC un +500%</span>
        </h1>

        {/* Subheadline */}
        <p className="dark:text-[#cccce0] light:text-[#3d3d6b] text-[clamp(16px,2vw,20px)] w-[90%] mx-auto mb-8 transition-colors duration-300">
          Deja de improvisar. Aprende a invertir en criptomonedas con el mismo
          rigor que usarías en acciones o fondos: análisis fundamental, gestión
          de riesgo, y plan de salida desde día 1.
        </p>

        {/* Social proof - people group image */}
        <div className="mt-10 flex flex-col items-center gap-3 pb-[35px]">
          <Image
            src="/img/people-group.webp"
            alt="Inversores"
            width={160}
            height={40}
            className="h-10 w-auto"
          />
          <p className="dark:text-[#cccce0]/60 light:text-[#3d3d6b]/70 text-sm transition-colors duration-300">
          Más de {" "}
            <span className="text-[#3a54f8] font-semibold">250</span> inversores ya están aplicando el Sistema Medusa para batir
            a Bitcoin sin estar 24/7 pegados al gráfico
          </p>
        </div>

        {/* Video Container */}
        <div
          className="relative w-full mx-auto mb-8 rounded-[30px] overflow-hidden"
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
          variant="secondaryGlow"
          size="lg"
          className="px-8 py-6 text-base font-semibold rounded-lg !bg-gradient-to-t !from-[#50d98a] !to-[#68fe9a]"
          onClick={() => {
            trackCTAClick("hero_cta", "calendly");
            trackOutboundLink("https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon?month=2026-01", "Quiero Reservar Mi Plaza");
            window.open("https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon?month=2026-01", "_blank");
          }}
        >
          Quiero reservar mi plaza
        </Button>

      </div>
    </section>
  );
}
