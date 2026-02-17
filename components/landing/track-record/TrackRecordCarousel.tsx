"use client";

import { useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TrackRecordCard } from "./TrackRecordCard";
import { ThesisPrivateModal } from "./ThesisPrivateModal";

const VISIBLE_COUNT = 3;

function calculateDuration(entryDate: string): string {
  const entry = new Date(entryDate);
  const now = new Date();
  const monthDiff =
    (now.getFullYear() - entry.getFullYear()) * 12 +
    (now.getMonth() - entry.getMonth());
  let months: number;
  if (now.getDate() < entry.getDate()) {
    months = monthDiff;
  } else if (now.getDate() > entry.getDate()) {
    months = monthDiff + 1;
  } else {
    months = monthDiff;
  }
  return `${Math.max(1, months)} meses`;
}

const trackRecordProjects = [
  {
    screenshotUrl: "/img/projects/metadao.avif",
    glowColor: "#ff4444",
    timestamp: "23/08/25",
    projectName: "MetaDAO",
    ticker: "$META",
    allTimeHigh: "+1.058%",
    closingReturn: "+647%",
    entryDate: "2025-08-23",
    entryPrice: "$0.96",
    reasons: [
      "Solución real a varios problemas estructurales del mercado",
      "Primer proyecto centrado en los derechos de los inversores",
      "Primer protocolo de futarquía sin competencia directa",
    ],
  },
  {
    screenshotUrl: "/img/projects/maple.webp",
    glowColor: "#ff8c00",
    timestamp: "22/05/24",
    projectName: "Maple Finance",
    ticker: "$SYRUP",
    allTimeHigh: "+215%",
    closingReturn: "+56%",
    entryDate: "2024-05-22",
    entryPrice: "$0.213",
    reasons: [
      "Ventaja competitiva clara frente a compañías tradicionales",
      "Equipo excelente",
      "Diseño de la economía del token favorable en el largo plazo",
    ],
  },
  {
    screenshotUrl: "/img/hyperliquid.png",
    glowColor: "#22c55e",
    timestamp: "15/09/24",
    projectName: "Hyperliquid",
    ticker: "$HYPE",
    allTimeHigh: "+455%",
    closingReturn: "+138%",
    entryDate: "2024-09-15",
    entryPrice: "$10.7",
    reasons: [
      "DEX con mejor UX y velocidad que exchanges centralizados",
      "Product-market fit comprobado: $2B+ en volumen diario",
      "100% del supply distribuido a la comunidad, cero VCs",
    ],
  },
  {
    screenshotUrl: "/img/projects/pumpfun.avif",
    glowColor: "#22c55e",
    timestamp: "08/11/24 09:15",
    projectName: "Pump.fun",
    ticker: "$PUMP",
    allTimeHigh: "+124%",
    closingReturn: "-10%",
    duration: "2 meses",
    entryPrice: "$0.004",
    reasonsLabel: "Factores clave",
    reasons: [
      "Modelo de negocio cíclico",
      "Equipo poco competente y comunicativo en momentos clave",
      "Bajas expectativas de crecimiento",
    ],
  },
];

export function TrackRecordCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);

  const maxPage = Math.max(0, trackRecordProjects.length - VISIBLE_COUNT);
  const canGoLeft = page > 0;
  const canGoRight = page < maxPage;

  const goLeft = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);
  const goRight = useCallback(
    () => setPage((p) => Math.min(maxPage, p + 1)),
    [maxPage],
  );

  return (
    <div className="w-full relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Desktop carousel */}
        <div className="hidden md:block relative">
          {/* Navigation arrows */}
          {canGoLeft && (
            <button
              onClick={goLeft}
              className="absolute -left-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-110"
              style={{
                background: "rgba(27, 26, 100, 0.8)",
                border: "1px solid rgba(185, 184, 235, 0.3)",
              }}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}
          {canGoRight && (
            <button
              onClick={goRight}
              className="absolute -right-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-110"
              style={{
                background: "rgba(27, 26, 100, 0.8)",
                border: "1px solid rgba(185, 184, 235, 0.3)",
              }}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          )}

          {/* Cards track */}
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: `translateX(calc(-${page} * (100% / ${VISIBLE_COUNT} + 24px * ${VISIBLE_COUNT - 1} / ${VISIBLE_COUNT})))`,
              }}
            >
              {trackRecordProjects.map((project, index) => {
                const { entryDate, ...rest } = project;
                const duration = entryDate ? calculateDuration(entryDate) : rest.duration!;
                return (
                  <div
                    key={index}
                    className="flex-none"
                    style={{ width: `calc((100% - ${(VISIBLE_COUNT - 1) * 24}px) / ${VISIBLE_COUNT})` }}
                  >
                    <TrackRecordCard
                      {...rest}
                      duration={duration}
                      onThesisClick={() => setIsModalOpen(true)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots indicator for desktop */}
          {trackRecordProjects.length > VISIBLE_COUNT && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: maxPage + 1 }).map((_, index) => (
                <button
                  key={index}
                  className="w-2 h-2 rounded-full transition-all cursor-pointer"
                  style={{
                    background:
                      index === page
                        ? "rgba(185, 184, 235, 0.9)"
                        : "rgba(185, 184, 235, 0.3)",
                  }}
                  onClick={() => setPage(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile carousel (scroll-snap) */}
        <div
          ref={scrollRef}
          className="flex md:hidden gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 pb-4 scroll-px-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {trackRecordProjects.map((project, index) => {
            const { entryDate, ...rest } = project;
            const duration = entryDate ? calculateDuration(entryDate) : rest.duration!;
            return (
              <div key={index} className="snap-center flex-none w-[280px]">
                <TrackRecordCard
                  {...rest}
                  duration={duration}
                  onThesisClick={() => setIsModalOpen(true)}
                />
              </div>
            );
          })}
        </div>

        {/* Dots indicator for mobile */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {trackRecordProjects.map((_, index) => (
            <button
              key={index}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: "rgba(185, 184, 235, 0.4)",
              }}
              onClick={() => {
                if (scrollRef.current) {
                  const cardWidth = 304;
                  scrollRef.current.scrollTo({
                    left: cardWidth * index,
                    behavior: "smooth",
                  });
                }
              }}
            />
          ))}
        </div>

        {/* Disclaimer */}
        <p
          className="text-xs text-center mt-8 max-w-3xl mx-auto leading-relaxed"
          style={{ color: "rgba(185, 184, 235, 0.4)" }}
        >
          ROI 2025 calculado sobre cartera ponderada por peso de posición. Entrada documentada con timestamp. Cierre valorado a 31/12/2025. Rentabilidades pasadas no garantizan resultados futuros.
        </p>
      </div>

      <ThesisPrivateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
