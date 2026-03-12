"use client";

import { Button } from "@/components/ui/button";
import { trackBookCallClick } from "@/lib/analytics";
import { getOutboundUrl } from "@/lib/utm";

export function FinalCTA() {
  return (
    <section className="relative py-[100px] px-6 overflow-hidden">
      <div className="max-w-[973px] mx-auto relative">
        {/* Outer card with gradient border - matches legacy .cta-main-wrapper.card */}
        <div
          className="relative rounded-[44px] p-[2px] transition-all duration-300"
          style={{
            background: "linear-gradient(180deg, rgba(185, 184, 235, 0.6) 0%, rgba(67, 85, 217, 0.3) 100%)",
          }}
        >
          {/* Inner padding wrapper */}
          <div
            className="rounded-[42px] p-[10px] md:p-[20px] transition-colors duration-300"
            style={{ backgroundColor: "rgba(1, 0, 82, 0.8)" }}
          >
            {/* Inner card with background image - matches legacy .cta-wrapper */}
            <div
              className="relative rounded-[30px] py-[40px] md:py-[60px] px-6 md:px-10 text-center transition-all duration-300"
              style={{
                backgroundColor: "#010052",
                backgroundImage: "url('/img/cta-bg.webp')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="flex flex-col items-center max-w-2xl mx-auto">
                <h3 className="font-[family-name:var(--font-heading)] text-[clamp(28px,5vw,48px)] font-bold text-white leading-tight mb-4 italic transition-colors duration-300">
                  Comienza a invertir con confianza.
                </h3>
                <p className="text-[#B9B8EB]/80 text-base leading-relaxed mb-6 transition-colors duration-300">
                  El mundo cripto no es humo… si sabes interpretarlo. Aquí
                  aprenderás a analizar activos digitales como lo harías con cualquier
                  otra clase de activo: con fundamentos, contexto y gestión del
                  riesgo.
                </p>
              </div>
              <Button
                variant="secondaryGlow"
                size="lg"
                className="px-8 py-6 text-base font-semibold rounded-lg"
                onClick={() => {
                  trackBookCallClick("final_cta");
                  window.open(getOutboundUrl("https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon?month=2026-01"), "_blank");
                }}
              >
                Reserva tu sesión estratégica
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
