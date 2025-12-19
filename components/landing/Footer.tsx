import { Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative py-16 px-6 bg-[#050510] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Left - Logo and tagline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg
                width="34"
                height="35"
                viewBox="0 0 34 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="17" cy="17.5" r="16" fill="white" />
                <path
                  d="M7.02771 26.9605C1.56668 21.4995 1.58718 12.6248 7.07351 7.13855"
                  stroke="#9392DF"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-white font-medium tracking-wider text-sm">
                MEDUSA
                <span className="block text-[10px] tracking-[0.3em] text-white/70">
                  CAPITAL
                </span>
              </span>
            </div>
            <p className="text-white/40 text-sm max-w-sm">
              Únete a la única formación de habla hispana con resultados
              probados y profesores de alto nivel.
            </p>
          </div>

          {/* Right - Social links */}
          <div className="md:text-right">
            <h4 className="text-white/60 font-medium mb-4">
              Síguenos en Redes Sociales
            </h4>
            <div className="flex gap-4 md:justify-end">
              <a
                href="https://twitter.com/Axel_Mnvn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
                <span className="text-sm">@Axel_Mnvn</span>
              </a>
              <a
                href="https://substack.com/@axelmnvn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                </svg>
                <span className="text-sm">@axelmnvn</span>
              </a>
              <a
                href="https://youtube.com/@Axel_mnvn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
                <span className="text-sm">@Axel_mnvn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-white/30 text-sm">
            ©Medusa Capital 2025. Todos los Derechos Reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
