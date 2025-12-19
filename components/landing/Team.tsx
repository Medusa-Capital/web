import { Linkedin } from "lucide-react";

const team = [
  {
    name: "Alex Cuesta",
    role: "FUNDADOR",
    bio: "7+ años analizando mercados financieros. Combina fundamentos macroeconómicos con análisis institucional e investigación fundamental.",
    linkedin: "#",
  },
  {
    name: "Alejandro Garcia",
    role: "PROFESOR",
    bio: "Economista con máster en mercados financieros. Especialista en blockchain desde 2018, enfocado en DeFi y métricas on-chain.",
    linkedin: "#",
  },
  {
    name: "Borja Neira",
    role: "PROFESOR",
    bio: "Especialista en tokenización de activos y analista financiero. Candidato a CFA y Proxy Product Owner en Mercedes-Benz, investigando activos tokenizados, DeFi y RWAs.",
    linkedin: "#",
  },
  {
    name: "Alejandro Gilabert",
    role: "PROFESOR",
    bio: "Ingeniero de telecomunicaciones con experiencia en desarrollo de productos blockchain. Product Owner en ONYZE, una de las principales custodias cripto en España.",
    linkedin: "#",
  },
];

export function Team() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#0a0a2e] to-[#050520]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-[#CCCCE0] leading-tight mb-4">
            Conoce al Equipo
          </h2>
          <p className="text-white/50">
            Llevamos en el sector de las criptomonedas desde 2018
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600" />
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center hover:bg-blue-500 transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-white" />
                  </a>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {member.name}
                  </h3>
                  <span className="inline-block text-purple-400 text-xs font-medium tracking-wider mb-3">
                    • {member.role}
                  </span>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
