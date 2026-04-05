"use client";

import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { trackBookCallClick } from "@/lib/analytics";
import { getOutboundUrl } from "@/lib/utm";

const MUX_PLAYBACK_ID = "Nl5WHghvNYY19hHNnMfHObKNRyB8r3WVeicBeBiFMaY";
const MUX_THUMBNAIL = `https://image.mux.com/${MUX_PLAYBACK_ID}/thumbnail.webp?time=2&width=960`;

const MuxPlayer = lazy(() => import("@mux/mux-player-react/lazy"));

function VideoPlayer() {
  const [active, setActive] = useState(false);

  if (!active) {
    return (
      <button
        type="button"
        onClick={() => setActive(true)}
        className="relative block w-full cursor-pointer bg-black rounded-[30px] overflow-hidden"
        style={{ aspectRatio: "16/9" }}
        aria-label="Reproducir vídeo"
      >
        <Image
          src={MUX_THUMBNAIL}
          alt="Medusa Capital VSL"
          fill
          sizes="(max-width: 946px) 100vw, 946px"
          className="object-cover"
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#6366f1]/90 flex items-center justify-center transition-transform hover:scale-110">
            <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 md:w-9 md:h-9 ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </button>
    );
  }

  return (
    <Suspense
      fallback={
        <div
          className="w-full bg-black rounded-[30px] flex items-center justify-center"
          style={{ aspectRatio: "16/9" }}
        >
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <MuxPlayer
        playbackId={MUX_PLAYBACK_ID}
        autoPlay
        metadata={{
          video_id: "vsl-landing",
          video_title: "Medusa Capital VSL",
        }}
        accentColor="#6366f1"
        primaryColor="#FFFFFF"
        secondaryColor="#000000"
        nohotkeys
        style={{
          aspectRatio: "16/9",
          borderRadius: "30px",
          "--seek-backward-button": "none",
          "--seek-forward-button": "none",
          "--time-range": "none",
          "--time-display": "none",
          "--duration-display": "none",
          "--playback-rate-button": "none",
          "--pip-button": "none",
        }}
      />
    </Suspense>
  );
}

export function Hero() {
  return (
    <section className="relative flex flex-col items-center px-4 md:px-6 pt-8 pb-16">
      {/* Hero background — uses <Image priority> so the preload scanner discovers it immediately */}
      <Image
        src="/img/hero-strokes.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-contain pointer-events-none"
        style={{ objectPosition: "center 20px" }}
      />
      <div className="relative z-10 w-full max-w-[946px] mx-auto text-center">
        {/* Welcome badge */}
        <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
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
        </div>

        {/* Main headline */}
        <h1
          className="animate-fade-up font-[family-name:var(--font-heading)] text-[clamp(40px,6vw,72px)] font-bold leading-[1.1] mb-4 text-white"
          style={{ animationDelay: "100ms" }}
        >
          Nuestras tesis de inversión han
          <br />
          batido a BTC un <span className="text-[#B9B8EB]">+86%</span> en 2025
        </h1>

        {/* Subheadline */}
        <p
          className="animate-fade-up text-lg md:text-xl leading-relaxed text-[#B9B8EB]/60 w-[90%] mx-auto mb-8"
          style={{ animationDelay: "200ms" }}
        >
          Deja de improvisar. Aprende a invertir en criptomonedas con el mismo
          rigor que usarías en acciones o fondos: análisis fundamental, gestión
          de riesgo, y plan de salida desde día 1.
        </p>

        {/* Social proof - people group image */}
        <div
          className="animate-fade-up mt-10 flex flex-col items-center gap-3 pb-[35px]"
          style={{ animationDelay: "300ms" }}
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
        </div>

        {/* Video Container — poster image until user clicks play */}
        <div
          className="animate-fade-up relative w-full mx-auto mb-8"
          style={{ animationDelay: "400ms" }}
        >
          <VideoPlayer />
        </div>

        {/* CTA Button */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "500ms" }}
        >
          <Button
            variant="secondaryGlow"
            size="lg"
            className="px-8 py-6 text-base font-semibold rounded-lg"
            onClick={() => {
              trackBookCallClick("hero");
              window.open(getOutboundUrl("https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon?month=2026-01"), "_blank");
            }}
          >
            Reserva tu sesión estratégica
          </Button>
          <p className="mt-3 text-sm text-[#B9B8EB]/50">
            Sin compromiso · 30 min · Personalizada según tu perfil
          </p>
        </div>

      </div>
    </section>
  );
}
