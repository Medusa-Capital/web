"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageBackground } from "@/components/landing/PageBackground";
import { PageCTA } from "@/components/landing/PageCTA";
import { Badge } from "@/components/ui/badge";
import {
  TrackRecordCarousel,
  ROICalculator,
  PerformanceChart,
} from "@/components/landing/track-record";

export default function TrackRecordPage() {

  const stats = [
    {
      label: "Performance",
      value: "+80%",
      subtext: "ROI 2025",
      description: "Mientras BTC cayó -6%",
    },
    {
      label: "Alpha",
      value: "+64%",
      subtext: "VS S&P 500",
      description: "+80% vs +16%",
    },
    {
      label: "Accuracy",
      value: "75%",
      subtext: "WIN RATE",
      description: "3/4 tesis de inversión rentables",
    },
  ];

  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <div className="relative z-10">
        <Header />

        <main className="pt-8 pb-16">
          {/* Hero Section */}
          <section className="pb-16 px-6 flex flex-col items-center">
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <Badge variant="hero">
                <Image
                  src="/img/icons/logo-icon.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="w-5 h-5 md:w-6 md:h-6"
                />
                Track record verificable y documentado
              </Badge>
            </motion.div>

            {/* Hero Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="max-w-[900px] text-center mb-8"
            >
              <h1
                className="font-[family-name:var(--font-heading)] text-[clamp(40px,6vw,72px)] font-bold leading-[1.1] mb-4"
                style={{ color: "#ffffff" }}
              >
                No vendemos humo.
                <br />
                <span
                  style={{
                    color: "#b9b8eb",
                  }}
                >
                  Mostramos resultados
                </span>
              </h1>
              <p
                className="text-lg md:text-xl leading-relaxed text-[#B9B8EB]/60 max-w-[700px] mx-auto"
              >
                Deja de improvisar. Aprende a invertir en criptomonedas con el mismo rigor que usarías en acciones o fondos: análisis fundamental, gestión de riesgo, y plan de salida desde día 1.
              </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1000px] mt-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: index * 0.1,
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="relative backdrop-blur-md rounded-3xl p-8 border"
                  style={{
                    background: "rgba(27, 26, 100, 0.4)",
                    borderColor: "rgba(185, 184, 235, 0.2)",
                  }}
                >
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to bottom right, rgba(99, 102, 241, 0.1), transparent)",
                    }}
                  />
                  <div className="relative z-10">
                    <span
                      className="inline-block text-xs uppercase tracking-wider px-3 py-1 rounded-full border mb-4"
                      style={{
                        color: "rgba(185, 184, 235, 0.8)",
                        borderColor: "rgba(185, 184, 235, 0.3)",
                        backgroundColor: "rgba(185, 184, 235, 0.1)",
                      }}
                    >
                      {stat.label}
                    </span>
                    <p
                      className="font-[family-name:var(--font-heading)] text-[48px] leading-[56px] font-bold mb-1"
                      style={{
                        color: "#ffffff",
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="text-sm uppercase tracking-wider mb-4"
                      style={{
                        color: "rgba(185, 184, 235, 0.5)",
                      }}
                    >
                      {stat.subtext}
                    </p>
                    <div
                      className="mb-4"
                      style={{
                        borderTop: "1px solid rgba(185, 184, 235, 0.15)",
                      }}
                    />
                    <p
                      className="text-sm"
                      style={{
                        color: "rgba(185, 184, 235, 0.4)",
                      }}
                    >
                      {stat.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <p
              className="text-xs text-center mt-6 max-w-3xl mx-auto leading-relaxed"
              style={{ color: "rgba(185, 184, 235, 0.35)" }}
            >
              ROI 2025 calculado sobre cartera ponderada por peso de posición. Entrada documentada con timestamp. Cierre valorado a 31/12/2025. Rentabilidades pasadas no garantizan resultados futuros.
            </p>
          </section>

          {/* Track Record Carousel Section */}
          <section className="py-24 px-6 relative">
            {/* Background glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
                filter: "blur(60px)",
              }}
            />

            <div className="relative z-10">
              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-[800px] mx-auto text-center mb-16"
              >
                <h2
                  className="font-[family-name:var(--font-heading)] text-[clamp(36px,4.5vw,56px)] font-bold leading-[1.2] mb-4"
                  style={{ color: "#ffffff" }}
                >
                  Tesis documentadas
                </h2>
                <p
                  className="text-lg leading-relaxed"
                  style={{
                    color: "rgba(204, 204, 224, 0.7)",
                  }}
                >
                  4 tesis publicadas con fecha y precio exacto de entrada. 3 de 4 rentables. Resultados verificables.
                </p>
              </motion.div>

              <TrackRecordCarousel />
            </div>
          </section>

          {/* ROI Calculator Section */}
          <section className="py-24 px-6 relative">
            {/* Background glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(185, 184, 235, 0.06) 0%, transparent 70%)",
                filter: "blur(80px)",
              }}
            />

            <div className="relative z-10">
              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-[800px] mx-auto text-center mb-16"
              >
                <h2
                  className="font-[family-name:var(--font-heading)] text-[clamp(36px,4.5vw,56px)] font-bold leading-[1.2] mb-4"
                  style={{ color: "#ffffff" }}
                >
                  ¿Cuánto habrías ganado?
                </h2>
                <p
                  className="text-lg leading-relaxed"
                  style={{
                    color: "rgba(204, 204, 224, 0.7)",
                  }}
                >
                  Calcula cuanto habrías multiplicado tu inversión siguiendo
                  nuestras tesis desde 2024.
                </p>
              </motion.div>

              <ROICalculator />
            </div>
          </section>

          {/* Performance Chart Section */}
          <section className="py-24 px-6 relative">
            {/* Background glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
                filter: "blur(60px)",
              }}
            />

            <div className="relative z-10 max-w-6xl mx-auto">
              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-[800px] mx-auto text-center mb-16"
              >
                <h2
                  className="font-[family-name:var(--font-heading)] text-[clamp(36px,4.5vw,56px)] font-bold leading-[1.2] mb-4"
                  style={{ color: "#ffffff" }}
                >
                  Rendimiento histórico
                </h2>
                <p
                  className="text-lg leading-relaxed"
                  style={{
                    color: "rgba(204, 204, 224, 0.7)",
                  }}
                >
                  Visualiza el rendimiento de nuestras tesis de inversión a lo
                  largo del tiempo.
                </p>
              </motion.div>

              <PerformanceChart />
            </div>
          </section>

          {/* CTA Section */}
          <PageCTA
            title="¿Listo para invertir con criterio?"
            description="La misma metodología detrás del +80%. Reserva tu sesión y te la explicamos."
            buttonText="Reserva tu sesión estratégica"
            buttonExternalUrl="https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon?month=2026-01"
          />
        </main>

        <Footer />
      </div>
    </div>
  );
}
