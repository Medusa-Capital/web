"use client";

import { Button } from "@/components/ui/button";
import { trackCTAClick, trackOutboundLink } from "@/lib/analytics";

export function BlogCTA() {
  return (
    <section className="relative py-[100px] px-6 overflow-hidden">
      <div className="max-w-[973px] mx-auto relative">
        <div
          className="relative rounded-[44px] p-[2px] transition-all duration-300"
          style={{
            background:
              "linear-gradient(180deg, rgba(185, 184, 235, 0.6) 0%, rgba(67, 85, 217, 0.3) 100%)",
          }}
        >
          <div
            className="rounded-[42px] p-[10px] md:p-[20px] transition-colors duration-300"
            style={{ backgroundColor: "rgba(1, 0, 82, 0.8)" }}
          >
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
                  ¿Listo para dar el siguiente paso?
                </h3>
                <p className="text-[#B9B8EB]/80 text-base leading-relaxed mb-6 transition-colors duration-300">
                  Análisis semanales del mercado cripto y tesis de inversión
                  directamente en tu email. Gratis.
                </p>
              </div>
              <Button
                variant="secondaryGlow"
                size="lg"
                className="px-8 py-6 text-base font-semibold rounded-lg"
                onClick={() => {
                  trackCTAClick("blog_cta", "calendly");
                  trackOutboundLink(
                    "https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon?month=2026-01",
                    "Reserva tu sesión estratégica",
                  );
                  window.open(
                    "https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon?month=2026-01",
                    "_blank",
                  );
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
