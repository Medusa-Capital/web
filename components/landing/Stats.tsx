"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Users, Star, TrendingUp } from "lucide-react";
import { trackBookCallClick } from "@/lib/analytics";
import { getOutboundUrl } from "@/lib/utm";

export function MissionSection() {
  const stats = [
    {
      value: "+250",
      label: "Inversores formados",
      icon: Users,
    },
    {
      value: "+50",
      label: "Reseñas de 5 estrellas",
      icon: Star,
    },
    {
      value: "+20.000",
      label: "Seguidores en redes",
      icon: TrendingUp,
    },
  ];

  return (
    <section className="relative py-[100px] px-6 mt-0">
      <div className="max-w-6xl mx-auto text-center">
        {/* Content wrapper with gradient border - matching legacy content-sec */}
        <div
          className="relative rounded-[clamp(30px,4vw,44px)] px-[clamp(40px,6vw,96px)] py-[70px] gradient-border transition-all duration-300"
          style={{
            background: "linear-gradient(0deg, rgba(1, 0, 82, 1) 0%, rgba(185, 184, 235, 0.1) 100%)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-left">
              <h2 className="font-[family-name:var(--font-heading)] text-[clamp(28px,4vw,48px)] font-bold text-white leading-tight mb-6 text-left transition-colors duration-300">
                Conviértete en un inversor experto en Bitcoin y otros activos
                digitales
              </h2>
              <p className="text-[#cccce0] text-lg leading-relaxed mb-8 text-left transition-colors duration-300">
                En Medusa Capital aprenderás a navegar por el mercado de las
                criptomonedas, estrategias de inversión rentables, y sabrás
                cómo moverte por el universo DeFi de manera segura. Obtendrás{" "}
                <span className="text-white font-medium">conocimiento</span>,{" "}
                <span className="text-white font-medium">criterio propio</span> y{" "}
                <span className="text-white font-medium">herramientas para encontrar
                las mejores oportunidades del mercado</span>.
              </p>
              {/* CTA button */}
              <Button
                variant="secondaryGlow"
                size="lg"
                className="px-8 py-6 text-base font-semibold rounded-lg"
                onClick={() => {
                  trackBookCallClick("mission");
                  window.open(getOutboundUrl("https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon?month=2026-01"), "_blank");
                }}
              >
                Reserva tu sesión estratégica
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
          {/* Medusa coin logo */}
          <div className="mt-16 mb-10 flex justify-center">
            <Image
              src="/img/content-logo.webp"
              alt="Medusa Capital"
              width={96}
              height={96}
              className="w-20 h-20 md:w-24 md:h-24"
            />
          </div>

          {/* Headline - matching legacy styling */}
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(28px,4vw,48px)] font-bold text-white leading-tight mb-16 max-w-4xl mx-auto transition-colors duration-300">
            Te ayudamos a entender el mercado de activos digitales con el mismo rigor con el que analizan empresas tradicionales.
          </h2>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full border border-[#B9B8EB]/25 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-[#B9B8EB]/60" strokeWidth={1.5} />
                  </div>
                  <div className="font-[family-name:var(--font-heading)] text-[clamp(40px,5vw,60px)] font-bold text-[#B9B8EB] mb-2 transition-colors duration-300">
                    {stat.value}
                  </div>
                  <p className="text-[#cccce0]/60 text-sm leading-relaxed max-w-[200px] mx-auto transition-colors duration-300">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
