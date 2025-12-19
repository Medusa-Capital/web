const testimonials = [
  {
    name: "Sharkmodaw",
    role: "Alumno",
    text: "La cantidad de valor que aporta Axel, ya sea en el aspecto macroeconómico con las mejores personas, análisis de mercado semanales, defi, airdrops y prácticamente cualquier sector relacionado con este mundo, es muy, muy grande. Si alguien está dudando si entrar, mi recomendación es que lo prueben sin duda.",
  },
  {
    name: "Doni",
    role: "Alumno",
    text: "Fue gracias a la trinchera que encontré el segundo token que mas he estado acumulando y que mejores ganancias espero de él, creo que no es un spoiler pues Axel lo comparte bastante en sus redes, pero sin la trinchera no hubiera podido pillar HYPE a tiempo.",
  },
  {
    name: "Sergio",
    role: "Alumno",
    text: "Es increíble todo el contenido e información que nos brindan tanto los responsables como el resto de integrantes. A mi me gusta estar al día de todo, es un alivio saber que no me pierdo ni uno. Cuando entré no esperaba tanto conocimiento, análisis y debates sobre macroeconomía o análisis técnico.",
  },
  {
    name: "0xPerezz",
    role: "Alumno",
    text: "Gracias a todo el equipo y familia que hemos logrado en este pedazo de comunidad, y todo muy sano, no lo he podido seguir tan de cerca como quisiera por el tiempo, pero me ha ayudado mucho a la hora de mentalizarme y no caer en mentalidades equivocadas.",
  },
  {
    name: "FXfeno",
    role: "Alumno",
    text: "Hay trabajo, información confiable, aportes de todos, mucha interacción entre los directivos y la comunidad. Los 'jefes' se reúnen como uno más, llaman directamente para preguntar sobre el funcionamiento de la comunidad, mejoras, pero también para sugerir y recibir información de la comunidad sobre sus intereses y necesidades.",
  },
  {
    name: "csadiafrans",
    role: "Alumno",
    text: "Todo muy sano, no lo he podido seguir tan de cerca como quisiera por el tiempo, pero me ha ayudado mucho a la hora de mentalizarme y no caer en mentalidades equivocadas. Muchas gracias y sigue haciendo entradas carajo.",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#050520] to-[#0a0a2e]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-[#CCCCE0] leading-tight mb-4">
            Qué dicen Nuestros Alumnos
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Nuestra formación ha cambiado la manera en la que nuestros alumnos
            perciben el sistema monetario. Ahora conocen el sistema y tienen las
            herramientas para rentabilizar su dinero.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="break-inside-avoid bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors duration-300"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600" />
                <div>
                  <h4 className="text-purple-400 font-medium">
                    {testimonial.name}
                  </h4>
                  <span className="text-white/40 text-xs">{testimonial.role}</span>
                </div>
              </div>
              {/* Content */}
              <p className="text-white/60 text-sm leading-relaxed">
                {testimonial.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
