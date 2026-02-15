"use client";

import { useRef, useState } from "react";
import { TrackRecordCard } from "./TrackRecordCard";
import { ThesisPrivateModal } from "./ThesisPrivateModal";

const trackRecordProjects = [
  {
    screenshotUrl:
      "https://s2.coinmarketcap.com/static/img/coins/200x200/38146.png",
    timestamp: "14/01/24",
    projectName: "MetaDAO",
    ticker: "$META",
    roi: "+1.100%",
    duration: "5 meses",
    entryPrice: "$1",
    exitPrice: "$11",
    reasons: [
      "Propuesta única de gobernanza on-chain",
      "Equipo técnico con historial probado",
      "Timing correcto en ciclo alcista",
    ],
  },
  {
    screenshotUrl:
      "https://s2.coinmarketcap.com/static/img/coins/200x200/32196.png",
    timestamp: "08/03/24",
    projectName: "Hyperliquid",
    ticker: "$HYPE",
    roi: "+500%",
    duration: "8 meses",
    entryPrice: "$10",
    exitPrice: "$60",
    reasons: [
      "Tesis sólida (DEX sin VCs)",
      "Tracción real ($2B TVL)",
      "Plan de salida disciplinado",
    ],
  },
  {
    screenshotUrl:
      "https://s2.coinmarketcap.com/static/img/coins/200x200/33824.png",
    timestamp: "22/05/24",
    projectName: "Syrup",
    ticker: "$SYRUP",
    roi: "+250%",
    duration: "6 meses",
    entryPrice: "$0.20",
    exitPrice: "$0.70",
    reasons: [
      "Nicho desatendido en DeFi",
      "Community building excepcional",
      "Tokenomics favorables a largo plazo",
    ],
  },
  {
    screenshotUrl:
      "https://s2.coinmarketcap.com/static/img/coins/200x200/32196.png",
    timestamp: "08/03/24",
    projectName: "Hyperliquid",
    ticker: "$HYPE",
    roi: "+500%",
    duration: "8 meses",
    entryPrice: "$10",
    exitPrice: "$60",
    reasons: [
      "Tesis sólida (DEX sin VCs)",
      "Tracción real ($2B TVL)",
      "Plan de salida disciplinado",
    ],
  },
];

export function TrackRecordCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Carousel container */}
        <div
          ref={scrollRef}
          className="flex justify-center gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 md:px-8 pb-4 scroll-px-4 md:scroll-px-8"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {trackRecordProjects.map((project, index) => (
            <div
              key={index}
              className="snap-center flex-none w-[280px] md:w-[calc((100%-4.5rem)/4)]"
            >
              <TrackRecordCard
                {...project}
                onThesisClick={() => setIsModalOpen(true)}
              />
            </div>
          ))}
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
                  const cardWidth = 420;
                  scrollRef.current.scrollTo({
                    left: cardWidth * index,
                    behavior: "smooth",
                  });
                }
              }}
            />
          ))}
        </div>
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
