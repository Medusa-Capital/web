"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export function ValueProp() {
  return (
    <section className="relative py-[100px] px-6 mt-0">
      {/* Background content-sec-obj graphic - right side */}
      <div
        className="hidden lg:block absolute pointer-events-none select-none transition-opacity duration-300"
        style={{
          right: 0,
          top: 0,
          width: "522px",
          maxWidth: "50%",
          height: "825px",
          backgroundImage: "url('/img/content-sec-obj.webp')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right",
          zIndex: 0,
          opacity: 1,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(36px,6vw,72px)] font-bold text-white leading-tight mb-6 transition-colors duration-300">
              Conviértete en un inversor experto en Bitcoin y otros activos
              digitales
            </h2>
            <p className="text-[#cccce0] text-lg leading-relaxed mb-8 transition-colors duration-300">
              En Medusa Capital aprenderás a navegar por el mercado de las
              criptomonedas, estrategias de inversión rentables, y sabrás
              cómo moverte por el universo DeFi de manera segura. Obtendrás{" "}
              <span className="text-white font-medium">conocimiento</span>,{" "}
              <span className="text-white font-medium">criterio propio</span> y{" "}
              <span className="text-white font-medium">herramientas para ser encontrar
              las mejores oportunidades del mercado</span>.
            </p>
            {/* Orange CTA button */}
            <Button
              variant="secondaryGlow"
              size="lg"
              className="px-8 py-6 text-base font-semibold rounded-lg"
              onClick={() => window.open("https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon?month=2026-01", "_blank")}
            >
              Empezar ahora
            </Button>
          </div>

          {/* Right graphic - Animated spinning coin */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative" style={{ perspective: "600px" }}>
              {/* Outer glow */}
              <div className="absolute inset-[-20%] rounded-full bg-[#B9B8EB]/15 blur-3xl pointer-events-none" />

              {/* Spinning coin image */}
              <Image
                src="/img/content-coing.webp"
                alt="Medusa Capital Coin"
                width={400}
                height={400}
                className="animate-coin w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px]"
                style={{
                  transformStyle: "preserve-3d",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
