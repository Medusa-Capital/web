"use client";

import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[#010052] z-20">
      {/* Background radial gradient glow - matches legacy .sec-bg SVG */}
      <svg
        width="1440"
        height="1396"
        viewBox="0 0 1440 1396"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <g filter="url(#filter0_f_cta)">
          <path
            d="M692.468 738.326C290.095 687.776 -43 187 -43 187V1087.92C-43 1087.92 492.96 717.366 935.937 821.523C1268.06 899.615 1483 1244 1483 1244V329.689C1483 329.689 1090.39 788.318 692.468 738.326Z"
            fill="url(#paint0_radial_cta)"
            style={{ mixBlendMode: "screen" }}
          />
        </g>
        <defs>
          <filter
            id="filter0_f_cta"
            x="-229.8"
            y="0.199997"
            width="1899.6"
            height="1430.6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="93.4" result="effect1_foregroundBlur" />
          </filter>
          <radialGradient
            id="paint0_radial_cta"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(738.118 755.912) rotate(1.39414) scale(1608.51 3058.64)"
          >
            <stop stopColor="#C9C8FD" />
            <stop offset="1" stopColor="#010052" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <div className="max-w-[973px] mx-auto relative" style={{ zIndex: 1 }}>
        {/* Outer card with gradient border - matches legacy .cta-main-wrapper.card */}
        <div
          className="relative rounded-[44px] p-[2px]"
          style={{
            background: "linear-gradient(180deg, rgba(185, 184, 235, 0.6) 0%, rgba(67, 85, 217, 0.3) 100%)",
          }}
        >
          {/* Inner padding wrapper */}
          <div
            className="rounded-[42px] p-[10px] md:p-[20px]"
            style={{ backgroundColor: "rgba(1, 0, 82, 0.8)" }}
          >
            {/* Inner card with background image - matches legacy .cta-wrapper */}
            <div
              className="relative rounded-[30px] py-[40px] md:py-[60px] px-5 text-center"
              style={{
                backgroundColor: "#010052",
                backgroundImage: "url('/img/cta-bg.webp')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 max-w-[500px] mx-auto italic">
                Comienza a Invertir
                <br />
                con Confianza.
              </h2>
              <p className="text-[#B9B8EB]/80 text-base leading-relaxed mb-6 max-w-[500px] mx-auto">
                El mundo cripto no es humo… si sabes interpretarlo. Aquí
                aprenderás a analizar activos digitales como lo harías con cualquier
                otra clase de activo: con fundamentos, contexto y gestión del
                riesgo.
              </p>
              <Button
                variant="primaryGlow"
                size="lg"
                className="px-8 py-6 text-base font-medium rounded-lg"
                onClick={() => window.open("https://calendly.com/contacto-medusacapital/30min", "_blank")}
              >
                Quiero Reservar Mi Plaza
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
