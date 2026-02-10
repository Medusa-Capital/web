"use client";

import Image from "next/image";
import { MessageSquare, Star } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

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

function MiniQuoteCard({ quote, theme }: { quote: string; theme: "dark" | "light" }) {
  return (
    <div
      className="rounded-[16px] p-5 transition-all duration-300"
      style={{
        background:
          theme === "light"
            ? "rgba(255, 255, 255, 0.9)"
            : "rgba(27, 26, 100, 0.6)",
        border:
          theme === "light"
            ? "1px solid rgba(1, 0, 82, 0.1)"
            : "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow:
          theme === "light" ? "0 2px 12px rgba(1, 0, 82, 0.05)" : "none",
      }}
    >
      <MessageSquare
        className="mb-3 dark:text-[#B9B8EB]/60 light:text-[#3a54f8]/60 transition-colors duration-300"
        size={20}
      />
      <p className="dark:text-[#cccce0] light:text-[#3d3d6b] text-sm leading-relaxed transition-colors duration-300">
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
        className="dark:text-[#cccce0]/80 light:text-[#3d3d6b] text-sm md:text-base leading-relaxed transition-colors duration-300"
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
      className="dark:text-[#cccce0]/80 light:text-[#3d3d6b] text-sm md:text-base leading-relaxed transition-colors duration-300"
    >
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="dark:text-white light:text-[#010052] font-bold">
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
  const { theme } = useTheme();

  return (
    <section className="relative py-16 md:py-[100px] px-4 md:px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(28px,5vw,56px)] font-bold dark:text-white light:text-[#010052] uppercase tracking-wide leading-tight transition-colors duration-300">
            Lo que dicen nuestros alumnos
          </h2>
          <div
            className="mx-auto mt-3 h-[3px] w-24 rounded-full transition-colors duration-300"
            style={{
              background:
                theme === "light"
                  ? "linear-gradient(90deg, #3a54f8, #010052)"
                  : "linear-gradient(90deg, #B9B8EB, #3a54f8)",
            }}
          />
        </div>

        {/* Mini Quote Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {miniQuotes.map((quote, i) => (
            <MiniQuoteCard key={i} quote={quote} theme={theme} />
          ))}
        </div>

        {/* Featured Testimonial */}
        <div
          className="rounded-[20px] p-6 md:p-8 transition-all duration-300"
          style={{
            background:
              theme === "light"
                ? "rgba(255, 255, 255, 0.95)"
                : "rgba(27, 26, 100, 0.5)",
            border:
              theme === "light"
                ? "1px solid rgba(1, 0, 82, 0.1)"
                : "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow:
              theme === "light"
                ? "0 4px 24px rgba(1, 0, 82, 0.06)"
                : "none",
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
              <h4 className="dark:text-white light:text-[#010052] font-semibold text-lg italic transition-colors duration-300">
                {featured.name}, {featured.age} años
              </h4>
              <StarRating count={featured.rating} />
            </div>
          </div>

          {/* Testimonial paragraphs with left accent border */}
          <div
            className="pl-5 flex flex-col gap-4 transition-colors duration-300"
            style={{
              borderLeft:
                theme === "light"
                  ? "3px solid rgba(58, 84, 248, 0.3)"
                  : "3px solid rgba(185, 184, 235, 0.25)",
            }}
          >
            {featured.paragraphs.map((p, i) => renderParagraph(p, i))}
          </div>
        </div>
      </div>
    </section>
  );
}
