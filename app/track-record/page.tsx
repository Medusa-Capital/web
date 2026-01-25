"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageBackground } from "@/components/landing/PageBackground";
import { PageCTA } from "@/components/landing/PageCTA";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  TrackRecordCarousel,
  ROICalculator,
  PerformanceChart,
} from "@/components/landing/track-record";

export default function TrackRecordPage() {
  const { theme } = useTheme();
  const [visibleStats, setVisibleStats] = useState(false);

  useEffect(() => {
    setVisibleStats(true);
  }, []);

  const stats = [
    {
      label: "ROI promedio",
      value: "+620%",
      subtext: "En 2024",
    },
    {
      label: "Tesis documentadas",
      value: "12+",
      subtext: "Con pruebas verificables",
    },
    {
      label: "vs BTC",
      value: "+500%",
      subtext: "Outperformance",
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
                style={{ color: theme === "light" ? "#010052" : "#ffffff" }}
              >
                No vendemos humo.
                <br />
                <span
                  style={{
                    color: theme === "light" ? "#3a54f8" : "#b9b8eb",
                  }}
                >
                  Mostramos resultados
                </span>
              </h1>
              <p
                className="text-lg md:text-xl leading-relaxed max-w-[700px] mx-auto"
                style={{
                  color:
                    theme === "light"
                      ? "rgba(1, 0, 82, 0.7)"
                      : "rgba(204, 204, 224, 0.7)",
                }}
              >
                Cada tesis de inversión está documentada con capturas, fechas y
                análisis completo. Transparencia total, sin trucos.
              </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1000px] mt-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: visibleStats ? 1 : 0,
                    y: visibleStats ? 0 : 20,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: index * 0.1,
                  }}
                  className="relative backdrop-blur-md rounded-3xl p-8 border transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background:
                      theme === "light"
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(27, 26, 100, 0.4)",
                    borderColor:
                      theme === "light"
                        ? "rgba(1, 0, 82, 0.12)"
                        : "rgba(185, 184, 235, 0.2)",
                  }}
                >
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{
                      background:
                        theme === "light"
                          ? "linear-gradient(to bottom right, rgba(58, 84, 248, 0.05), transparent)"
                          : "linear-gradient(to bottom right, rgba(99, 102, 241, 0.1), transparent)",
                    }}
                  />
                  <div className="relative z-10">
                    <p
                      className="text-sm mb-2 uppercase tracking-wider"
                      style={{
                        color:
                          theme === "light"
                            ? "rgba(1, 0, 82, 0.5)"
                            : "rgba(185, 184, 235, 0.6)",
                      }}
                    >
                      {stat.label}
                    </p>
                    <p
                      className="font-[family-name:var(--font-heading)] text-[48px] leading-[56px] font-bold mb-1"
                      style={{
                        color: theme === "light" ? "#010052" : "#ffffff",
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="text-sm"
                      style={{
                        color:
                          theme === "light"
                            ? "rgba(1, 0, 82, 0.5)"
                            : "rgba(185, 184, 235, 0.5)",
                      }}
                    >
                      {stat.subtext}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Track Record Carousel Section */}
          <section className="py-24 px-6 relative">
            {/* Background glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
              style={{
                background:
                  theme === "light"
                    ? "radial-gradient(circle, rgba(58, 84, 248, 0.06) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
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
                  style={{ color: theme === "light" ? "#010052" : "#ffffff" }}
                >
                  Tesis documentadas
                </h2>
                <p
                  className="text-lg leading-relaxed"
                  style={{
                    color:
                      theme === "light"
                        ? "rgba(1, 0, 82, 0.7)"
                        : "rgba(204, 204, 224, 0.7)",
                  }}
                >
                  Cada proyecto incluye capturas de Discord con timestamp,
                  análisis completo y resultados verificables.
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
                  theme === "light"
                    ? "radial-gradient(circle, rgba(58, 84, 248, 0.04) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(185, 184, 235, 0.06) 0%, transparent 70%)",
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
                  style={{ color: theme === "light" ? "#010052" : "#ffffff" }}
                >
                  ¿Cuánto habrías ganado?
                </h2>
                <p
                  className="text-lg leading-relaxed"
                  style={{
                    color:
                      theme === "light"
                        ? "rgba(1, 0, 82, 0.7)"
                        : "rgba(204, 204, 224, 0.7)",
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
                  theme === "light"
                    ? "radial-gradient(circle, rgba(58, 84, 248, 0.06) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
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
                  style={{ color: theme === "light" ? "#010052" : "#ffffff" }}
                >
                  Rendimiento histórico
                </h2>
                <p
                  className="text-lg leading-relaxed"
                  style={{
                    color:
                      theme === "light"
                        ? "rgba(1, 0, 82, 0.7)"
                        : "rgba(204, 204, 224, 0.7)",
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
            title="¿Listo para replicar estos resultados?"
            description="Únete a Medusa Capital y aprende la metodología exacta que usamos para identificar estas oportunidades."
            buttonText="Quiero reservar mi plaza"
            buttonExternalUrl="https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon?month=2026-01"
          />
        </main>

        <Footer />
      </div>
    </div>
  );
}
