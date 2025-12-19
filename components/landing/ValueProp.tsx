import { Button } from "@/components/ui/button";

export function ValueProp() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#050520] to-[#0a0a2e]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold text-[#CCCCE0] leading-tight mb-6">
              Conviértete en un Inversor Experto en Bitcoin y otros Activos
              Digitales
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              En Medusa Capital aprenderás a navegar por el mercado de las
              criptomonedas, aprenderás estrategias de inversión probadas, y
              sabrás cómo moverte por el universo DeFi de manera segura. No te
              prometemos rentabilidad inmediata. Obtendrás{" "}
              <span className="text-white">conocimiento</span>,{" "}
              <span className="text-white">criterio propio</span> y{" "}
              <span className="text-white">herramientas para ser rentable</span>.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300"
              onClick={() => window.open("https://calendly.com/medusacapital", "_blank")}
            >
              Empezar Ahora
            </Button>
          </div>

          {/* Right graphic */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 blur-xl" />
              {/* Main circle */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-purple-500/30 flex items-center justify-center">
                {/* Inner shield icon */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-purple-500/30 to-indigo-500/30 border border-purple-400/30 flex items-center justify-center">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 34 35"
                    fill="none"
                  >
                    <circle cx="17" cy="17.5" r="14" fill="white" />
                    <path
                      d="M7 27C1.5 21.5 1.5 12.6 7 7.1"
                      stroke="#9392DF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              {/* Decorative dots */}
              <div className="absolute top-0 right-8 w-2 h-2 rounded-full bg-purple-400" />
              <div className="absolute bottom-8 left-0 w-3 h-3 rounded-full bg-indigo-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
