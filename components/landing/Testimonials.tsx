import Image from "next/image";
import { MessageSquare, Star } from "lucide-react";

const miniQuotes = [
  "Ahora las inversiones hacen lo suyo mientras duermo tranquilo",
  "Aprendí a filtrar el ruido y a medir riesgos de verdad",
  "Estáis en el lugar adecuado para desarrollaros como inversores",
];

function MiniQuoteCard({ quote }: { quote: string }) {
  return (
    <div
      className="rounded-[16px] p-5"
      style={{
        background: "rgba(27, 26, 100, 0.6)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <MessageSquare
        className="mb-3 text-[#B9B8EB]/60"
        size={20}
      />
      <p className="text-[#cccce0] text-sm leading-relaxed">
        &ldquo;{quote}&rdquo;
      </p>
    </div>
  );
}

const featured = {
  name: "Bruno",
  age: 51,
  avatar: "/img/avatar/testi-1.webp",
  rating: 5,
  paragraphs: [
    {
      text: '"Siendo muy sincero, he dejado de ganar mucho dinero por hacer el TONTO durante 3 ciclos de BTC. Perdiendo con ICOs, altcoins, con memes... Doy las gracias por haber encontrado este equipo que me facilita la vida y me da tiempo para otras cosas más importantes, las inversiones siguen haciendo lo suyo mientras duermo plácidamente, cosas que antes ni podía hacer tranquilo por jugármela directamente en el casino día tras día.',
    },
    {
      text: "GRACIAS DE VERDAD, aquí nada de peloteo, el trabajo que hace no vale lo que cuesta. (Que por cierto ya está más que rentabilizado)",
    },
    {
      text: 'Seguramente entren muchos en fomo, pero **el momento de hacer patrimonio es AHORA**"',
      bold: true,
    },
  ] as Array<{ text: string; bold?: boolean }>,
};

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className="fill-amber-400 text-amber-400"
        />
      ))}
    </div>
  );
}

function renderParagraph(paragraph: { text: string; bold?: boolean }, index: number) {
  if (!paragraph.bold) {
    return (
      <p
        key={index}
        className="text-[#cccce0]/80 text-sm md:text-base leading-relaxed"
      >
        {paragraph.text}
      </p>
    );
  }

  const parts = paragraph.text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p
      key={index}
      className="text-[#cccce0]/80 text-sm md:text-base leading-relaxed"
    >
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="text-white font-bold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </p>
  );
}

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
      className="gap-6 overflow-hidden text-sm group/card flex flex-col relative rounded-[20px] p-6 pb-[50px] mb-4 transition-all duration-300"
      style={{
        background: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(40px) saturate(150%)',
        WebkitBackdropFilter: 'blur(40px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Header with avatar */}
      <div className="flex items-center gap-3 mb-4 relative z-10">
        {/* Avatar image */}
        <Image
          src={testimonial.avatar}
          alt={testimonial.name}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="text-cyan-400 font-medium transition-colors duration-300">
            {testimonial.name}
          </h4>
          <span className="text-[#cccce0]/50 text-xs transition-colors duration-300">{testimonial.role}</span>
        </div>
      </div>
      {/* Content */}
      <p className="text-[#cccce0]/70 text-sm leading-relaxed relative z-10 transition-colors duration-300">
        {testimonial.text}
      </p>
    </div>
  );
}

function ScrollingColumn({
  testimonials,
  direction,
}: {
  testimonials: typeof column1;
  direction: "up" | "down";
}) {
  // Duplicate testimonials multiple times for seamless infinite scroll
  const duplicated = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <div className="relative h-[600px] md:h-[880px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
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
    <section className="relative py-16 md:py-[100px] px-4 md:px-6 overflow-hidden">
      {/* Background gradient orbs - positioned behind the cards */}
      <div
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          top: '35%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(67, 85, 217, 0.5) 0%, rgba(67, 85, 217, 0.2) 35%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          top: '25%',
          left: '20%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.45) 0%, rgba(99, 102, 241, 0.15) 40%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          top: '50%',
          right: '15%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(67, 85, 217, 0.4) 0%, rgba(99, 102, 241, 0.1) 45%, transparent 70%)',
          filter: 'blur(45px)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(36px,6vw,72px)] font-bold text-white leading-tight mb-4 transition-colors duration-300">
            Qué dicen Nuestros Alumnos
          </h2>
          <p className="text-[#B9B8EB]/50 text-xl md:text-2xl max-w-4xl mx-auto transition-colors duration-300">
            Nuestra formación ha cambiado la manera en la que nuestros alumnos
            perciben el sistema monetario. Ahora conocen el sistema y tienen las
            herramientas para rentabilizar su dinero. Aquí tienes algunos testimonios sobre su aprendizaje.
          </p>
        </div>

        {/* Mini Quote Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 md:mb-16">
          {miniQuotes.map((quote, i) => (
            <MiniQuoteCard key={i} quote={quote} />
          ))}
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

        {/* Featured Testimonial */}
        <div
          className="rounded-[20px] p-6 md:p-8 mt-10 md:mt-16"
          style={{
            background: "rgba(27, 26, 100, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="flex items-center gap-4 mb-5">
            <Image
              src={featured.avatar}
              alt={featured.name}
              width={56}
              height={56}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <h4 className="text-white font-semibold text-lg italic">
                {featured.name}, {featured.age} años
              </h4>
              <StarRating count={featured.rating} />
            </div>
          </div>
          <div
            className="pl-5 flex flex-col gap-4"
            style={{
              borderLeft: "3px solid rgba(185, 184, 235, 0.25)",
            }}
          >
            {featured.paragraphs.map((p, i) => renderParagraph(p, i))}
          </div>
        </div>
      </div>
    </section>
  );
}
