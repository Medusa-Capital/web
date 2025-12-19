const features = [
  {
    icon: "📚",
    title: "Formación estructurada en 7 módulos clave",
    description:
      "Del funcionamiento de Bitcoin y la blockchain hasta estrategias de inversión, DeFi y gestión del riesgo. Todo explicado paso a paso, con ejemplos y sin tecnicismos innecesarios.",
  },
  {
    icon: "💬",
    title: "Comunidad de Discord",
    description:
      "Aprende de aquellos que han recorrido el camino que tú estás emprendiendo. A través de Discord compartimos análisis diarios del mercado, informes de proyectos y recursos académicos para que te mantengas informado.",
  },
  {
    icon: "♾️",
    title: "Acceso de por vida y actualizaciones",
    description:
      "Podrás revisar todo el contenido siempre que lo necesites, y recibirás nuevas lecciones cuando cambien las condiciones del mercado.",
  },
  {
    icon: "📊",
    title: "Casos reales de portafolios y decisiones de inversión",
    description:
      "Compartimos nuestras operaciones reales (aciertos y errores), gestión de carteras y ejemplos prácticos para ayudarte a aplicar lo aprendido con criterio y confianza.",
  },
];

export function Features() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#0a0a2e] to-[#050520]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left content */}
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-[#CCCCE0] leading-tight mb-6">
              Un Método Claro para Entender, Evaluar e Invertir en Cripto con
              Criterio
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Desde Bitcoin hasta DeFi, pasando por tokenomics, ciclos de
              mercado y gestión del riesgo. Una formación paso a paso diseñada
              para ayudarte a interpretar este nuevo ecosistema con el mismo
              rigor con el que analizas cualquier otro activo financiero.
            </p>
          </div>

          {/* Right timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent" />

            <div className="space-y-8">
              {features.map((feature, i) => (
                <div key={i} className="relative flex gap-6">
                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center text-2xl">
                    {feature.icon}
                  </div>
                  {/* Content */}
                  <div className="pt-2">
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
