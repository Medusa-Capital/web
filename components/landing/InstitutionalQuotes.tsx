"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const quotes = [
  {
    text: "Bitcoin es oro digital. Es una clase de activo legítima.",
    author: "Larry Fink",
    position: "CEO de BlackRock",
    company: "$10 trillones bajo gestión",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGiyZdHxk5nxZmTQgx9-eF_hCQFrvXybrEuw&s",
  },
  {
    text: "Creemos que Bitcoin alcanzará los $1.5 millones para 2030.",
    author: "Cathie Wood",
    position: "CEO de ARK Invest",
    company: "Gestora institucional",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8yuorO7LkTCEiE6ukb2swyDOwAt6vyrh6Kw&s",
  },
  {
    text: "Bitcoin es la salida de emergencia de un sistema monetario fallido.",
    author: "Michael Saylor",
    position: "CEO de MicroStrategy",
    company: "$5.9B invertidos en BTC",
    image:
      "https://www.strategy.com/_next/image?url=https%3A%2F%2Fimages.contentstack.io%2Fv3%2Fassets%2Fbltf8d808d9b8cebd37%2Fblta9597547a826a86f%2F6889293550671cc10fc38564%2Fexecutive-team_michael-saylor.jpg&w=3840&q=100",
  },
  {
    text: "Las monedas digitales están aquí para quedarse.",
    author: "Christine Lagarde",
    position: "Presidenta del BCE",
    company: "Banco Central Europeo",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLwnNHhXspAs8joJlsTBG3R2LeBgaWEQA3OA&s",
  },
  {
    text: "Adoptar Bitcoin fue la mejor decisión económica de El Salvador.",
    author: "Nayib Bukele",
    position: "Presidente de El Salvador",
    company: "Primer país en adoptar BTC",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Nayib_Bukele_in_the_White_House%2C_2025_%28cropped%29.jpg/330px-Nayib_Bukele_in_the_White_House%2C_2025_%28cropped%29.jpg",
  },
  {
    text: "Los bancos deben evolucionar hacia blockchain o desaparecer.",
    author: "Jamie Dimon",
    position: "CEO de JP Morgan",
    company: "Banco más grande de EEUU",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkDyGkGgaBE4JqiO2EYiXMedDKLXQ5ua9HpA&s",
  },
];

function QuoteCard({
  quote,
}: {
  quote: (typeof quotes)[0];
}) {
  return (
    <div
      className="flex-shrink-0 w-[400px] rounded-[20px] p-6 transition-all duration-300 relative overflow-hidden"
      style={{
        background: "#1b1a64",
        border: "1px solid rgba(185, 184, 235, 0.15)",
      }}
    >
      {/* Quote icon */}
      <div
        className="mb-4 transition-colors duration-300"
        style={{
          color: "rgba(185, 184, 235, 0.3)",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.3 5.2C7.1 7.1 4.9 9.8 4.9 13.3c0 2.8 1.8 4.7 4.1 4.7 2 0 3.6-1.5 3.6-3.5 0-1.9-1.4-3.4-3.2-3.5.4-1.6 1.8-3.1 3.9-4.4L11.3 5.2zM19.8 5.2c-4.2 1.9-6.4 4.6-6.4 8.1 0 2.8 1.8 4.7 4.1 4.7 2 0 3.6-1.5 3.6-3.5 0-1.9-1.4-3.4-3.2-3.5.4-1.6 1.8-3.1 3.9-4.4L19.8 5.2z"/>
        </svg>
      </div>

      {/* Quote text */}
      <p
        className="text-base leading-relaxed mb-5 transition-colors duration-300 relative z-10"
        style={{
          color: "rgba(255, 255, 255, 0.95)",
        }}
      >
        {quote.text}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 relative z-10">
        <div
          className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 p-[2px]"
          style={{
            background: "linear-gradient(135deg, #4355d9, #B9B8EB)",
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden">
            <Image
              src={quote.image}
              alt={quote.author}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
        <div className="min-w-0">
          <h4
            className="font-semibold text-sm transition-colors duration-300"
            style={{
              color: "white",
            }}
          >
            {quote.author}
          </h4>
          <p
            className="text-xs transition-colors duration-300"
            style={{
              color: "rgba(185, 184, 235, 0.8)",
            }}
          >
            {quote.position}
          </p>
        </div>
      </div>
    </div>
  );
}

export function InstitutionalQuotes() {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Duplicate quotes for seamless loop
  const duplicatedQuotes = [...quotes, ...quotes, ...quotes];

  return (
    <section className="relative py-12 md:py-16 overflow-hidden" style={{ background: "transparent" }}>
      {/* Header */}
      <div className="text-center mb-8 md:mb-10 px-4">
        <p
          className="text-sm uppercase tracking-widest mb-3 transition-colors duration-300"
          style={{
            color: "rgba(185, 184, 235, 0.5)",
          }}
        >
          Lo que dicen los líderes mundiales
        </p>
        <h2
          className="font-[family-name:var(--font-heading)] text-[clamp(36px,6vw,72px)] font-bold leading-tight transition-colors duration-300"
          style={{
            color: "white",
          }}
        >
          El consenso institucional es claro
        </h2>
      </div>

      {/* Carousel container */}
      <div
        className="relative"
        style={{ background: "transparent" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Scrolling track */}
        <div ref={containerRef} className="overflow-hidden" style={{ background: "transparent" }}>
          <motion.div
            className="flex gap-6 py-2"
            animate={{
              x: isPaused ? undefined : [0, -((400 + 24) * quotes.length)],
            }}
            transition={{
              x: {
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            style={{
              width: "fit-content",
              background: "transparent",
            }}
          >
            {duplicatedQuotes.map((quote, index) => (
              <QuoteCard key={index} quote={quote} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
