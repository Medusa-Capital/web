"use client";

import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#050520] to-[#0a0a2e]">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl font-bold text-[#CCCCE0] leading-tight mb-6">
            Comienza a Invertir
            <br />
            con Confianza.
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            El mundo cripto no es humo... si sabes interpretarlo. Aquí
            aprenderás a analizar activos digitales como lo harías con cualquier
            otra clase de activo: con fundamentos, contexto y gestión del
            riesgo.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
            onClick={() => window.open("https://calendly.com/medusacapital", "_blank")}
          >
            Quiero Reservar Mi Plaza
          </Button>
        </div>
      </div>
    </section>
  );
}
