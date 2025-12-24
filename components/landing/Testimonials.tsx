"use client";

import Image from "next/image";

const testimonials = [
  {
    name: "Sharkmodaw",
    role: "Alumno",
    text: "La cantidad de valor que aporta Axel, ya sea en el aspecto macroeconómico con las mejores personas, análisis de mercado semanales, defi, airdrops y prácticamente cualquier sector relacionado con este mundo, es muy, muy grande. Si alguien está dudando si entrar, mi recomendación es que lo prueben sin duda.",
    avatar: "/img/avatar/testi-1.webp",
  },
  {
    name: "Doni",
    role: "Alumno",
    text: "Fue gracias a la trinchera que encontré el segundo token que mas he estado acumulando y que mejores ganancias espero de él, creo que no es un spoiler pues Axel lo comparte bastante en sus redes, pero sin la trinchera no hubiera podido pillar HYPE a tiempo.",
    avatar: "/img/avatar/testi-2.webp",
  },
  {
    name: "Sergio",
    role: "Alumno",
    text: "Es increíble todo el contenido e información que nos brindan tanto los responsables como el resto de integrantes. A mi me gusta estar al día de todo, es un alivio saber que no me pierdo ni uno. Cuando entré no esperaba tanto conocimiento, análisis y debates sobre macroeconomía o análisis técnico.",
    avatar: "/img/avatar/testi-3.webp",
  },
  {
    name: "0xPerezz",
    role: "Alumno",
    text: "Gracias a todo el equipo y familia que hemos logrado en este pedazo de comunidad, y todo muy sano, no lo he podido seguir tan de cerca como quisiera por el tiempo, pero me ha ayudado mucho a la hora de mentalizarme y no caer en mentalidades equivocadas. Muchas gracias y sigue haciendo entradas carajo.",
    avatar: "/img/avatar/testi-4.webp",
  },
  {
    name: "FXfeno",
    role: "Alumno",
    text: "Hay trabajo, información confiable, aportes de todos, mucha interacción entre los directivos y la comunidad. Los 'jefes' se reúnen como uno más, llaman directamente para preguntar sobre el funcionamiento de la comunidad, mejoras, pero también para sugerir y recibir información de la comunidad sobre sus intereses y necesidades.",
    avatar: "/img/avatar/testi-5.webp",
  },
  {
    name: "csadiafrans",
    role: "Alumno",
    text: "Todo muy sano, no lo he podido seguir tan de cerca como quisiera por el tiempo, pero me ha ayudado mucho a la hora de mentalizarme y no caer en mentalidades equivocadas. Muchas gracias y sigue haciendo entradas carajo.",
    avatar: "/img/avatar/testi-6.webp",
  },
];

// Split into 3 columns for scroll effect
const column1 = [testimonials[0], testimonials[3], testimonials[1], testimonials[4]];
const column2 = [testimonials[1], testimonials[4], testimonials[2], testimonials[5]];
const column3 = [testimonials[2], testimonials[5], testimonials[0], testimonials[3]];

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div
      className="relative rounded-[clamp(20px,2vw,30px)] p-6 mb-4 glass-card testimonial-card-bg"
      style={{
        paddingBottom: "50px",
      }}
    >
      {/* Header with avatar */}
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar image */}
        <Image
          src={testimonial.avatar}
          alt={testimonial.name}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="text-cyan-400 font-medium">
            {testimonial.name}
          </h4>
          <span className="text-[#cccce0]/50 text-xs">{testimonial.role}</span>
        </div>
      </div>
      {/* Content */}
      <p className="text-[#cccce0]/70 text-sm leading-relaxed">
        {testimonial.text}
      </p>
    </div>
  );
}

function ScrollingColumn({
  testimonials,
  direction
}: {
  testimonials: typeof column1;
  direction: "up" | "down";
}) {
  // Duplicate testimonials multiple times for seamless infinite scroll
  const duplicated = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <div className="relative h-[600px] md:h-[880px] overflow-hidden">
      {/* Gradient overlays for fade effect - matching legacy */}
      <div
        className="absolute top-0 left-0 right-0 h-[160px] md:h-[211px] z-10 pointer-events-none"
        style={{
          background: "linear-gradient(0deg, rgba(1, 0, 82, 0) 0%, rgb(1, 0, 82) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[160px] md:h-[211px] z-10 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(1, 0, 82, 0) 0%, rgb(1, 0, 82) 100%)",
        }}
      />

      {/* Scrolling content */}
      <div
        className={`flex flex-col ${direction === "down" ? "animate-scroll-down" : "animate-scroll-up"}`}
        style={{
          animationDuration: "60s",
        }}
      >
        {duplicated.map((testimonial, i) => (
          <TestimonialCard key={i} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[#010052] z-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Qué dicen Nuestros Alumnos
          </h2>
          <p className="text-[#B9B8EB]/50 max-w-2xl mx-auto">
            Nuestra formación ha cambiado la manera en la que nuestros alumnos
            perciben el sistema monetario. Ahora conocen el sistema y tienen las
            herramientas para rentabilizar su dinero. Aquí tienes algunos testimonios sobre su aprendizaje.
          </p>
        </div>

        {/* 3 Column scrolling testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Column 1 - scrolls down */}
          <div className="hidden lg:block">
            <ScrollingColumn testimonials={column1} direction="down" />
          </div>

          {/* Column 2 - scrolls up */}
          <div className="hidden md:block">
            <ScrollingColumn testimonials={column2} direction="up" />
          </div>

          {/* Column 3 - scrolls down */}
          <div>
            <ScrollingColumn testimonials={column3} direction="down" />
          </div>
        </div>
      </div>
    </section>
  );
}
