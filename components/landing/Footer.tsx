import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative py-16 px-6 border-t border-[#B9B8EB]/20 bg-[#010052] z-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Left - Logo and tagline */}
          <div>
            <Image
              src="/img/logo.svg"
              alt="Medusa Capital"
              width={180}
              height={60}
              className="h-12 w-auto mb-4"
            />
            <p className="text-[#B9B8EB]/40 text-sm max-w-sm">
              Únete a la única formación de habla hispana con resultados
              probados y profesores de alto nivel.
            </p>
          </div>

          {/* Right - Social links */}
          <div className="md:text-right">
            <h4 className="text-[#A3A3C3] font-semibold mb-4">
              Síguenos en Redes Sociales
            </h4>
            <div className="flex flex-wrap gap-3 md:justify-end">
              {/* X/Twitter - Pill style matching legacy */}
              <a
                href="https://x.com/Axel_Mnvn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1b1a64]/50 border border-[#B9B8EB]/20 text-[#B9B8EB]/70 hover:text-white hover:border-[#B9B8EB]/40 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 19" fill="currentColor">
                  <path d="M15.75 0.890625H18.8175L12.1175 8.18425L20 18.1094H13.8287L8.995 12.0888L3.46375 18.1094H0.395L7.56125 10.3075L0 0.890625H6.32875L10.6975 6.39231L15.75 0.890625ZM14.675 16.3614H16.375L5.40375 2.54719H3.58125L14.675 16.3614Z" />
                </svg>
                <span className="text-sm">@Axel_Mnvn</span>
              </a>
              {/* Substack */}
              <a
                href="https://substack.com/@axelmnvn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1b1a64]/50 border border-[#B9B8EB]/20 text-[#B9B8EB]/70 hover:text-white hover:border-[#B9B8EB]/40 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 19 22" fill="currentColor">
                  <path d="M18.6875 4.9555H0.3125V7.55562H18.6875V4.9555ZM0.3125 9.911V22L9.5 16.6018L18.6875 22V9.911H0.3125ZM18.6875 0H0.3125V2.59875H18.6875V0Z" />
                </svg>
                <span className="text-sm">@axelmnvn</span>
              </a>
              {/* YouTube */}
              <a
                href="https://www.youtube.com/@Axel_mnvn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1b1a64]/50 border border-[#B9B8EB]/20 text-[#B9B8EB]/70 hover:text-white hover:border-[#B9B8EB]/40 transition-colors"
              >
                <svg className="w-5 h-4" viewBox="0 0 25 18" fill="currentColor">
                  <path d="M10.1 12.6429L16.328 9L10.1 5.35714V12.6429ZM23.972 3.135C24.128 3.70571 24.236 4.47071 24.308 5.44214C24.392 6.41357 24.428 7.25143 24.428 7.98L24.5 9C24.5 11.6593 24.308 13.6143 23.972 14.865C23.672 15.9579 22.976 16.6621 21.896 16.9657C21.332 17.1236 20.3 17.2329 18.716 17.3057C17.156 17.3907 15.728 17.4271 14.408 17.4271L12.5 17.5C7.472 17.5 4.34 17.3057 3.104 16.9657C2.024 16.6621 1.328 15.9579 1.028 14.865C0.872 14.2943 0.764 13.5293 0.692 12.5579C0.608 11.5864 0.572 10.7486 0.572 10.02L0.5 9C0.5 6.34071 0.692 4.38571 1.028 3.135C1.328 2.04214 2.024 1.33786 3.104 1.03429C3.668 0.876429 4.7 0.767143 6.284 0.694286C7.844 0.609286 9.272 0.572857 10.592 0.572857L12.5 0.5C17.528 0.5 20.66 0.694286 21.896 1.03429C22.976 1.33786 23.672 2.04214 23.972 3.135Z" />
                </svg>
                <span className="text-sm">@Axel_mnvn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#B9B8EB]/20 text-center">
          <p className="text-[#B9B8EB]/40 text-sm">
            ©Medusa Capital 2025. Todos los Derechos Reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
