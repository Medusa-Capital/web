"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { trackCTAClick, trackOutboundLink } from "@/lib/analytics";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};
const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      className="relative flex flex-col items-center px-4 md:px-6 pt-8 pb-16"
      style={{
        backgroundImage: 'url("/img/hero-strokes.webp")',
        backgroundSize: 'contain',
        backgroundPosition: 'center 20px',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="relative z-10 w-full max-w-[946px] mx-auto text-center">
        {/* Welcome badge */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, ease, delay: 0 }}
        >
          <Badge variant="hero" className="mb-5">
            <Image
              src="/img/icons/logo-icon.svg"
              alt=""
              width={24}
              height={24}
              className="w-5 h-5 md:w-6 md:h-6"
            />
            +250 inversores formados con un track record documentado
          </Badge>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="font-[family-name:var(--font-heading)] text-[clamp(40px,6vw,72px)] font-bold leading-[1.1] mb-4 text-white"
        >
          Nuestras tesis de inversión han
          <br />
          batido a BTC un <span className="text-[#B9B8EB]">+106%</span> en 2025
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
          className="text-lg md:text-xl leading-relaxed text-[#B9B8EB]/60 w-[90%] mx-auto mb-8"
        >
          Deja de improvisar. Aprende a invertir en criptomonedas con el mismo
          rigor que usarías en acciones o fondos: análisis fundamental, gestión
          de riesgo, y plan de salida desde día 1.
        </motion.p>

        {/* Social proof - people group image */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-3 pb-[35px]"
        >
          <Image
            src="/img/people-group.webp"
            alt="Inversores"
            width={160}
            height={40}
            className="h-10 w-auto"
          />
          <p className="text-[#cccce0]/60 text-sm">
          Más de {" "}
            <span className="text-[#3a54f8] font-semibold">250 inversores</span> ya están aplicando el Sistema Medusa para batir
            a Bitcoin sin estar 24/7 pegados al gráfico
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, ease, delay: 0.4 }}
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
        </motion.div>

        {/* CTA Button */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, ease, delay: 0.5 }}
        >
          <Button
            variant="secondaryGlow"
            size="lg"
            className="px-8 py-6 text-base font-semibold rounded-lg"
            onClick={() => {
              trackCTAClick("hero_cta", "calendly");
              trackOutboundLink("https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon?month=2026-01", "Reserva tu sesión estratégica");
              window.open("https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon?month=2026-01", "_blank");
            }}
          >
            Reserva tu sesión estratégica
          </Button>
          <p className="mt-3 text-sm text-[#B9B8EB]/50">
            Sin compromiso · 30 min · Personalizada según tu perfil
          </p>
        </motion.div>

      </div>
    </section>
  );
}
