"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageBackground } from "@/components/landing/PageBackground";

export default function TrackRecordPage() {
  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <div className="relative z-10">
        <Header />
        <main className="pt-8 pb-16">
          {/* Hero header */}
          <div className="max-w-6xl mx-auto px-6 mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Track Record
              </h1>
              <p className="text-[#B9B8EB]/60 max-w-2xl mx-auto text-base md:text-lg">
                Transparencia y verificabilidad en nuestros analisis de mercado.
              </p>
            </motion.div>
          </div>

          {/* Coming Soon Card */}
          <div className="max-w-3xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="relative p-8 md:p-12 rounded-3xl border border-[#B9B8EB]/10 bg-gradient-to-br from-[#1b1a64]/80 to-[#0a0a2e]/90 backdrop-blur-sm overflow-hidden"
            >
              {/* Decorative glow */}
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

              {/* Decorative pattern */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/20 mb-6">
                  <svg
                    className="w-8 h-8 text-purple-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>

                <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-white mb-4">
                  Proximamente
                </h2>

                <p className="text-[#B9B8EB]/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-6">
                  Estamos desarrollando una herramienta que te permitira verificar nuestro historial de analisis de mercado directamente en la blockchain.
                </p>

                <p className="text-[#B9B8EB]/50 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
                  Cada analisis que publicamos queda registrado de forma inmutable, permitiendote comprobar cuando se realizo cada prediccion y compararlo con los resultados reales del mercado.
                </p>

                {/* Decorative blockchain icons */}
                <div className="mt-8 flex items-center justify-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500/40" />
                  <div className="w-8 h-0.5 bg-purple-500/30" />
                  <div className="w-3 h-3 rounded-full bg-purple-500/40" />
                  <div className="w-8 h-0.5 bg-purple-500/30" />
                  <div className="w-3 h-3 rounded-full bg-purple-500/40" />
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
