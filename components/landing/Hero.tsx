import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#050520] to-[#0a0a2e]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Welcome badge */}
        <Badge
          variant="outline"
          className="mb-6 px-4 py-2 border-white/20 bg-white/5 text-white/80"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 34 35"
            fill="none"
            className="mr-2"
          >
            <circle cx="17" cy="17.5" r="14" fill="white" />
            <path
              d="M7 27C1.5 21.5 1.5 12.6 7 7.1"
              stroke="#9392DF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          Bienvenido a Medusa Capital
        </Badge>

        {/* Main headline */}
        <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl lg:text-8xl font-bold text-[#CCCCE0] leading-tight mb-6">
          Formación En Criptomonedas
          <br />
          Para Inversores Exigentes
        </h1>

        {/* Subheadline */}
        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Un programa formativo completo diseñado para que el pequeño y mediano
          inversor no sólo no pierda poder adquisitivo, sino que pueda
          rentabilizar su patrimonio
        </p>

        {/* YouTube Video Embed */}
        <div className="relative w-full max-w-3xl mx-auto mb-10 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10 border border-white/10">
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Medusa Capital x JF Partners"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0"
            />
          </div>
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
          onClick={() => window.open("https://calendly.com/medusacapital", "_blank")}
        >
          Quiero Reservar Mi Plaza
        </Button>

        {/* Social proof */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 border-2 border-[#0a0a2e]"
              />
            ))}
          </div>
          <p className="text-white/50 text-sm">
            Medusa Capital ha ayudado a{" "}
            <span className="text-white font-medium">200+</span> inversores a
            entender el mercado de las criptomonedas
          </p>
        </div>

        {/* Partner logos */}
        <div className="mt-12 flex items-center justify-center gap-6 text-white/40">
          <span className="text-lg font-medium">JF PARTNERS</span>
          <span className="text-2xl">×</span>
          <span className="text-lg font-medium">MEDUSA CAPITAL</span>
        </div>
      </div>
    </section>
  );
}
