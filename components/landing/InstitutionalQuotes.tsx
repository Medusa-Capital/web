"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const quotes = [
  {
    text: "Bitcoin es oro digital. Es una clase de activo legítima.",
    author: "Larry Fink",
    position: "CEO, BlackRock",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGiyZdHxk5nxZmTQgx9-eF_hCQFrvXybrEuw&s",
  },
  {
    text: "Si optimizas tu cartera, tendrías un 15% en Bitcoin.",
    author: "Ray Dalio",
    position: "Fundador, Bridgewater Associates",
    image: "/img/avatar/raydalio.jpg",
  },
  {
    text: "Creemos que Bitcoin alcanzará los $1.5 millones para 2030.",
    author: "Cathie Wood",
    position: "CEO, ARK Invest",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8yuorO7LkTCEiE6ukb2swyDOwAt6vyrh6Kw&s",
  },
  {
    text: "Tener efectivo es como sostener un cubo de hielo. Se derrite un 7% cada año. BTC es la solución.",
    author: "Michael Saylor",
    position: "CEO y fundador, Strategy",
    image:
      "https://www.strategy.com/_next/image?url=https%3A%2F%2Fimages.contentstack.io%2Fv3%2Fassets%2Fbltf8d808d9b8cebd37%2Fblta9597547a826a86f%2F6889293550671cc10fc38564%2Fexecutive-team_michael-saylor.jpg&w=3840&q=100",
  },
  {
    text: "Bitcoin está basado en energía: puedes emitir dinero fiat falso, pero es imposible falsificar la energía",
    author: "Elon Musk",
    position: "CEO y fundador, Tesla & SpaceX",
    image: "/img/avatar/elonmusk.jpg",
  },
];

function QuoteCard({
  quote,
}: {
  quote: (typeof quotes)[0];
}) {
  return (
    <div
      className="flex-shrink-0 w-[420px] h-[200px] rounded-[20px] px-7 py-5 transition-all duration-300 relative overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(145deg, #1e1d6b, #151450)",
        border: "1px solid rgba(185, 184, 235, 0.12)",
      }}
    >
      {/* Quote text with inline quote mark */}
      <p
        className="text-[15px] leading-[1.7] flex-1 relative z-10"
        style={{
          color: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <span
          className="text-2xl font-serif leading-none mr-1 -ml-0.5 align-text-top"
          style={{ color: "rgba(185, 184, 235, 0.35)" }}
        >
          &ldquo;
        </span>
        {quote.text}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 relative z-10 mt-auto pt-3 shrink-0 border-t border-white/5">
          <div
            className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 p-[1.5px]"
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
            <h4 className="font-semibold text-sm text-white">
              {quote.author}
            </h4>
            <p
              className="text-[11px]"
              style={{ color: "rgba(185, 184, 235, 0.6)" }}
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
              x: isPaused ? undefined : [0, -((420 + 24) * quotes.length)],
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
