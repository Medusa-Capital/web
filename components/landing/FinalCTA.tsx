"use client";

import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="relative py-[100px] px-6 overflow-hidden">
      <div className="max-w-[973px] mx-auto relative">
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
