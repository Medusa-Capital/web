import Image from "next/image";
import { Star } from "lucide-react";

const featured = {
  name: "Bruno",
  age: 51,
  avatar: "/img/avatar/testimonials/testi-1.webp",
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
    name: "MadLex",
    role: "Alumno",
    text: "En el bullrun anterior estuve en grupos que eran puro humo. Llegué hecho un lío, más emocional que un novato en una montaña rusa. Gracias a las tesis y el material de Axel, aprendí a filtrar el ruido, a medir riesgos de verdad y a decidir con la cabeza fría. Cuando el mercado se fue al carajo y la gente salió corriendo, ahí seguía Axel investigando y explicando todo. Es lo mejor que hay en la comunidad hispana.",
    avatar: "/img/avatar/testimonials/testi-1.webp",
  },
  {
    name: "isaac81.",
    role: "Alumno",
    text: "Ya tenía conocimientos y portafolio, me he formado en otras academias y tenía algo de experiencia. Lo que he encontrado aquí es muy top, la formación no la había visto de esta calidad ni de cerca. Hay gente con conocimientos brutales y con ganas de ayudarte a las 1000 dudas que puedas tener.",
    avatar: "/img/avatar/testimonials/testi-2.webp",
  },
  {
    name: "Sharkmode9",
    role: "Alumno",
    text: "La cantidad de valor que da Axel, ya sea en el aspecto macroeconómico con gente top, análisis semanales del mercado, DeFi, airdrops y prácticamente cualquier sector relacionado con este mundo, es muy muy grande. Si invierte el tiempo necesario, va a aprender el triple de rápido que si lo hiciese por su cuenta.",
    avatar: "/img/avatar/testimonials/testi-3.webp",
  },
  {
    name: "kaver",
    role: "Alumno",
    text: "Llevo en la comunidad desde el día 1. He pasado por varias comunidades de pago donde solo se enviaban señales y se usaba a la comunidad de exit liquidity. Aquí se hace todo lo contrario: se intenta que cada persona aprenda cómo funciona el mercado y sea capaz de tomar sus propias decisiones. Si buscáis un sitio donde desarrollaros como inversores, estáis en el lugar adecuado.",
    avatar: "/img/avatar/testimonials/testi-4.webp",
  },
  {
    name: "battanik",
    role: "Alumno",
    text: "Después de más de un año puedo afirmar totalmente convencido de que merece la pena. Lo que más he valorado respecto a otras comunidades es la filosofía de conocernos a nosotros mismos como inversores y operar según nuestras necesidades personales. Su objetivo no es lucrarse a corto plazo, sino construir algo mucho más grande con personas que busquen ser rentables a largo plazo.",
    avatar: "/img/avatar/testimonials/testi-5.webp",
  },
  {
    name: "Jordi77",
    role: "Alumno",
    text: "Material de primera y comunidad muy activa. Una de las cosas que me gustan de la blockchain es que todo queda registrado y se puede demostrar si alguien es rentable o no. Se hizo pública una wallet con muchas ganancias y se explicó con detalle cómo se operó. Ese contenido no es nada frecuente en las redes.",
    avatar: "/img/avatar/testimonials/testi-6.webp",
  },
  {
    name: "AleChain",
    role: "Alumno",
    text: "He pasado por muchas comunidades, pero ninguna me había aportado tanto valor como esta. Las explicaciones son claras, profundas y con un enfoque práctico que marca la diferencia. Las tesis de inversión me parecen brillantes, un verdadero plus para quienes buscamos un enfoque más arriesgado pero con base sólida.",
    avatar: "/img/avatar/testimonials/testi-7.webp",
  },
  {
    name: "Casual Red",
    role: "Alumno",
    text: "Tras un año y pocos meses dentro de Medusa Capital solo puedo decir que la decisión fue más que acertada. La implicación de Axel es total, tanto en sus análisis y tesis de inversión como a la hora de resolver cualquier duda. En cuanto a los miembros, es lo más parecido a una gran familia. Recomendable 100%.",
    avatar: "/img/avatar/testimonials/testi-8.webp",
  },
  {
    name: "Oppenheimer(AI)",
    role: "Alumno",
    text: "Integrante desde los inicios. He vivido toda la evolución de esta comunidad. Desde ser trader de meme coins con las emociones a flor de piel hasta la inversión más a largo plazo e inteligente. Axel ha sabido adaptarse a este mercado tan loco y su dedicación es excepcional. Si alguien quiere formarse en este mundo, esta comunidad es la bomba.",
    avatar: "/img/avatar/testimonials/testi-9.webp",
  },
];

// Split into 3 columns for scroll effect
const column1 = [testimonials[0], testimonials[3], testimonials[6], testimonials[1], testimonials[4], testimonials[7]];
const column2 = [testimonials[1], testimonials[4], testimonials[7], testimonials[2], testimonials[5], testimonials[8]];
const column3 = [testimonials[2], testimonials[5], testimonials[8], testimonials[0], testimonials[3], testimonials[6]];

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
          animationDuration: "75s",
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
            Lo Que Dicen Nuestros Inversores
          </h2>
          <p className="text-[#B9B8EB]/50 text-xl md:text-2xl max-w-4xl mx-auto transition-colors duration-300">
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
