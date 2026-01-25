"use client";

import { Button } from "@/components/ui/button";
import { trackCTAClick, trackOutboundLink } from "@/lib/analytics";
import { useTheme } from "@/components/providers/ThemeProvider";

export function FinalCTA() {
  const { theme } = useTheme();
  
  return (
    <section className="relative py-[100px] px-6 overflow-hidden">
      <div className="max-w-[973px] mx-auto relative">
        {/* Outer card with gradient border - matches legacy .cta-main-wrapper.card */}
        <div
          className="relative rounded-[44px] p-[2px] transition-all duration-300"
          style={{
            background: theme === "light"
              ? "linear-gradient(180deg, rgba(58, 84, 248, 0.4) 0%, rgba(1, 0, 82, 0.2) 100%)"
              : "linear-gradient(180deg, rgba(185, 184, 235, 0.6) 0%, rgba(67, 85, 217, 0.3) 100%)",
          }}
        >
          {/* Inner padding wrapper */}
          <div
            className="rounded-[42px] p-[10px] md:p-[20px] transition-colors duration-300"
            style={{ backgroundColor: theme === "light" ? "rgba(255, 255, 255, 0.95)" : "rgba(1, 0, 82, 0.8)" }}
          >
            {/* Inner card with background image - matches legacy .cta-wrapper */}
            <div
              className="relative rounded-[30px] py-[40px] md:py-[60px] px-5 text-center transition-all duration-300"
              style={{
                backgroundColor: theme === "light" ? "#f5f3f0" : "#010052",
                backgroundImage: theme === "light" ? "none" : "url('/img/cta-bg.webp')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="flex flex-col items-center w-fit mx-auto">
                <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl font-bold dark:text-white light:text-[#010052] leading-tight mb-4 italic transition-colors duration-300 whitespace-nowrap">
                  Comienza a invertir con confianza.
                </h2>
                <p className="dark:text-[#B9B8EB]/80 light:text-[#3d3d6b] text-base leading-relaxed mb-6 transition-colors duration-300 w-[75%]">
                  El mundo cripto no es humo… si sabes interpretarlo. Aquí
                  aprenderás a analizar activos digitales como lo harías con cualquier
                  otra clase de activo: con fundamentos, contexto y gestión del
                  riesgo.
                </p>
              </div>
              <Button
                variant="secondaryGlow"
                size="lg"
                className="px-8 py-6 text-base font-semibold rounded-lg !bg-gradient-to-t !from-[#50d98a] !to-[#68fe9a]"
                onClick={() => {
                  trackCTAClick("final_cta", "calendly");
                  trackOutboundLink("https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon?month=2026-01", "Quiero Reservar Mi Plaza");
                  window.open("https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon?month=2026-01", "_blank");
                }}
              >
                Quiero reservar mi plaza
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
