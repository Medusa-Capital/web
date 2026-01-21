"use client";

import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";

export function Stats() {
  const { theme } = useTheme();
  
  const stats = [
    {
      value: "+250",
      label: "Alumnos formados",
    },
    {
      value: "+50",
      label: "Reseñas positivas",
    },
    {
      value: "+20.000",
      label: "Seguidores",
    },
  ];

  return (
    <section className="relative py-[100px] px-6 mt-0">
      <div className="max-w-6xl mx-auto text-center">
        {/* Content wrapper with gradient border - matching legacy content-sec */}
        <div
          className="relative rounded-[clamp(30px,4vw,44px)] px-[clamp(40px,6vw,96px)] py-[70px] gradient-border transition-all duration-300"
          style={{
            background: theme === "light" 
              ? "linear-gradient(0deg, rgba(255, 255, 255, 0.95) 0%, rgba(58, 84, 248, 0.05) 100%)"
              : "linear-gradient(0deg, rgba(1, 0, 82, 1) 0%, rgba(185, 184, 235, 0.1) 100%)",
          }}
        >
          {/* Medusa coin logo */}
          <div className="mb-10 flex justify-center">
            <Image
              src="/img/content-logo.webp"
              alt="Medusa Capital"
              width={96}
              height={96}
              className="w-20 h-20 md:w-24 md:h-24"
            />
          </div>

          {/* Headline - matching legacy styling */}
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(36px,4.5vw,60px)] font-bold dark:text-white light:text-[#010052] leading-tight mb-16 max-w-4xl mx-auto transition-colors duration-300">
            Te ayudamos a entender el mercado de activos digitales con el mismo rigor con el que analizan empresas tradicionales.
          </h2>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-[family-name:var(--font-heading)] text-[clamp(40px,5vw,60px)] font-bold dark:text-[#B9B8EB] light:text-[#3a54f8] mb-4 transition-colors duration-300">
                  {stat.value}
                </div>
                <p className="dark:text-[#cccce0]/60 light:text-[#3d3d6b]/70 text-sm leading-relaxed max-w-[200px] mx-auto transition-colors duration-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
