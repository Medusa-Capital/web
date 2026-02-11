import Image from "next/image";
import { MessageSquare, Star } from "lucide-react";

const miniQuotes = [
  "Ahora las inversiones hacen lo suyo mientras duermo tranquilo",
  "Aprendí a filtrar el ruido y a medir riesgos de verdad",
  "Estáis en el lugar adecuado para desarrollaros como inversores",
];

interface FeaturedTestimonial {
  name: string;
  age: number;
  avatar: string;
  rating: number;
  paragraphs: Array<{
    text: string;
    bold?: boolean;
  }>;
}

const featured: FeaturedTestimonial = {
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
  ],
};

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

  // Parse **bold** markers
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

export function FeaturedTestimonials() {
  return (
    <section className="relative py-16 md:py-[100px] px-4 md:px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(28px,5vw,56px)] font-bold text-white uppercase tracking-wide leading-tight">
            Lo que dicen nuestros alumnos
          </h2>
          <div
            className="mx-auto mt-3 h-[3px] w-24 rounded-full"
            style={{
              background: "linear-gradient(90deg, #B9B8EB, #3a54f8)",
            }}
          />
        </div>

        {/* Mini Quote Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {miniQuotes.map((quote, i) => (
            <MiniQuoteCard key={i} quote={quote} />
          ))}
        </div>

        {/* Featured Testimonial */}
        <div
          className="rounded-[20px] p-6 md:p-8"
          style={{
            background: "rgba(27, 26, 100, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Author header */}
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

          {/* Testimonial paragraphs with left accent border */}
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
