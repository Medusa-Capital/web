"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type TrackRecordCardProps = {
  screenshotUrl: string;
  timestamp: string;
  projectName: string;
  ticker: string;
  allTimeHigh: string;
  closingReturn: string;
  duration: string;
  entryPrice: string;
  reasons: string[];
  reasonsLabel?: string;
  glowColor?: string;
  onThesisClick: () => void;
};

export function TrackRecordCard({
  screenshotUrl,
  timestamp,
  projectName,
  ticker,
  allTimeHigh,
  closingReturn,
  duration,
  entryPrice,
  reasons,
  reasonsLabel = "Por qué funcionó",
  glowColor,
  onThesisClick,
}: TrackRecordCardProps) {
  return (
    <div
      className="relative rounded-3xl border overflow-hidden w-full max-w-[400px] h-full mx-auto transition-all duration-300 group flex flex-col"
      style={{
        background: "rgba(27, 26, 100, 0.5)",
        borderColor: "rgba(185, 184, 235, 0.2)",
      }}
    >
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{
          background:
            "linear-gradient(to bottom right, rgba(99, 102, 241, 0.08), transparent)",
        }}
      />

      {/* Screenshot area with logo */}
      <div
        className="relative h-[200px] overflow-hidden flex items-center justify-center"
        style={{
          background:
            "linear-gradient(to bottom right, rgba(27, 26, 100, 0.6), rgba(1, 0, 82, 0.8))",
        }}
      >
        {glowColor && (
          <div
            className="absolute w-40 h-40 rounded-full blur-3xl pointer-events-none"
            style={{ background: glowColor, opacity: 0.55 }}
          />
        )}
        <Image
          src={screenshotUrl}
          alt={`${projectName} logo`}
          width={100}
          height={100}
          className="relative z-10 w-24 h-24 object-contain"
        />
      </div>

      {/* Card content */}
      <div className="relative p-6 space-y-4 flex flex-col flex-1">
          {/* Title row with timestamp */}
          <div className="flex items-start justify-between">
            <h3
              className="font-[family-name:var(--font-heading)] text-[26px] font-bold leading-tight"
              style={{ color: "#ffffff" }}
            >
              {projectName}
              <span
                className="block text-sm font-normal mt-0.5"
                style={{
                  color: "#b9b8eb",
                }}
              >
                {ticker}
              </span>
            </h3>
            <p
              className="text-xs shrink-0 mt-1.5"
              style={{
                color: "rgba(185, 184, 235, 0.5)",
              }}
            >
              {timestamp}
            </p>
          </div>

          {/* Performance box */}
          <div
            className="rounded-xl p-4 text-center border"
            style={{
              background: "rgba(1, 0, 82, 0.6)",
              borderColor: "rgba(185, 184, 235, 0.15)",
            }}
          >
            <p className={`text-[36px] leading-tight font-bold ${allTimeHigh.startsWith("-") ? "text-[#FF6B6B]" : "text-[#4DFF88]"}`}>
              {allTimeHigh}
            </p>
            <p
              className="text-xs uppercase tracking-wider mt-1 mb-3"
              style={{ color: "rgba(185, 184, 235, 0.5)" }}
            >
              ALL-TIME HIGH
            </p>
            <div
              className="mb-3"
              style={{ borderTop: "1px solid rgba(185, 184, 235, 0.15)" }}
            />
            <p className="text-xl font-bold text-white">
              {closingReturn}
            </p>
            <p
              className="text-xs uppercase tracking-wider mt-0.5"
              style={{ color: "rgba(185, 184, 235, 0.5)" }}
            >
              CIERRE 2025
            </p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-2">
            <div
              className="rounded-lg p-3 text-center border"
              style={{
                background: "rgba(185, 184, 235, 0.05)",
                borderColor: "rgba(185, 184, 235, 0.15)",
              }}
            >
              <p
                className="text-xs uppercase tracking-wider mb-1"
                style={{
                  color: "rgba(185, 184, 235, 0.6)",
                }}
              >
                Entrada
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color: "#ffffff" }}
              >
                {entryPrice}
              </p>
            </div>
            <div
              className="rounded-lg p-3 text-center border"
              style={{
                background: "rgba(185, 184, 235, 0.05)",
                borderColor: "rgba(185, 184, 235, 0.15)",
              }}
            >
              <p
                className="text-xs uppercase tracking-wider mb-1"
                style={{
                  color: "rgba(185, 184, 235, 0.6)",
                }}
              >
                Duración
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color: "#ffffff" }}
              >
                {duration}
              </p>
            </div>
          </div>

        {/* Reasons */}
        <div className="space-y-2">
          <p
            className="text-xs uppercase tracking-wider"
            style={{
              color: "rgba(185, 184, 235, 0.6)",
            }}
          >
            {reasonsLabel}
          </p>
          <div className="space-y-1.5">
            {reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-[#6366f1] mt-0.5 shrink-0">&#10003;</span>
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: "rgba(204, 204, 224, 0.85)",
                  }}
                >
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onThesisClick}
          variant="secondaryGlow"
          className="w-full mt-auto pt-4 rounded-xl px-6 py-3 h-auto text-sm font-semibold !bg-none !bg-[#6965F1] !shadow-[inset_0px_0px_6px_rgba(105,101,241,0.3)] hover:!bg-[#7f7cf4]"
        >
          <span>Ver análisis completo</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
