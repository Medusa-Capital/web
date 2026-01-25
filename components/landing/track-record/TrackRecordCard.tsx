"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";

export type TrackRecordCardProps = {
  screenshotUrl: string;
  timestamp: string;
  projectName: string;
  ticker: string;
  roi: string;
  duration: string;
  entryPrice: string;
  exitPrice: string;
  reasons: string[];
  onThesisClick: () => void;
};

export function TrackRecordCard({
  screenshotUrl,
  timestamp,
  projectName,
  ticker,
  roi,
  duration,
  entryPrice,
  exitPrice,
  reasons,
  onThesisClick,
}: TrackRecordCardProps) {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl border overflow-hidden w-full max-w-[400px] mx-auto transition-all duration-300 group"
      style={{
        background:
          theme === "light"
            ? "rgba(255, 255, 255, 0.9)"
            : "rgba(27, 26, 100, 0.5)",
        borderColor:
          theme === "light"
            ? "rgba(1, 0, 82, 0.12)"
            : "rgba(185, 184, 235, 0.2)",
      }}
    >
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{
          background:
            theme === "light"
              ? "linear-gradient(to bottom right, rgba(58, 84, 248, 0.05), transparent)"
              : "linear-gradient(to bottom right, rgba(99, 102, 241, 0.08), transparent)",
        }}
      />

      {/* Screenshot area with logo */}
      <div
        className="relative h-[200px] overflow-hidden flex items-center justify-center"
        style={{
          background:
            theme === "light"
              ? "linear-gradient(to bottom right, rgba(58, 84, 248, 0.08), rgba(1, 0, 82, 0.05))"
              : "linear-gradient(to bottom right, rgba(27, 26, 100, 0.6), rgba(1, 0, 82, 0.8))",
        }}
      >
        <Image
          src={screenshotUrl}
          alt={`${projectName} logo`}
          width={100}
          height={100}
          className="w-24 h-24 object-contain"
          unoptimized
        />

        {/* Timestamp badge */}
        <div
          className="absolute top-4 right-4 px-3 py-1.5 rounded-lg border"
          style={{
            background:
              theme === "light"
                ? "rgba(255, 255, 255, 0.95)"
                : "rgba(1, 0, 82, 0.9)",
            borderColor:
              theme === "light"
                ? "rgba(1, 0, 82, 0.15)"
                : "rgba(185, 184, 235, 0.3)",
          }}
        >
          <p
            className="text-xs font-medium"
            style={{
              color: theme === "light" ? "#010052" : "#ffffff",
            }}
          >
            {timestamp}
          </p>
        </div>
      </div>

      {/* Card content */}
      <div className="relative p-6 space-y-4">
          {/* Title and ROI */}
          <div className="space-y-2">
            <h3
              className="font-[family-name:var(--font-heading)] text-[26px] font-bold leading-tight"
              style={{ color: theme === "light" ? "#010052" : "#ffffff" }}
            >
              {projectName}
              <span
                className="block"
                style={{
                  color: theme === "light" ? "#3a54f8" : "#b9b8eb",
                }}
              >
                {ticker}
              </span>
            </h3>
            <div
              className="inline-block rounded-lg px-3 py-1.5"
              style={{
                background:
                  theme === "light"
                    ? "rgba(34, 197, 94, 0.15)"
                    : "linear-gradient(to right, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))",
                border:
                  theme === "light"
                    ? "1px solid rgba(34, 197, 94, 0.3)"
                    : "1px solid rgba(34, 197, 94, 0.3)",
              }}
            >
              <p className="text-[#22c55e] text-lg font-bold">{roi}</p>
            </div>
          </div>

          {/* Details grid */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div
                className="rounded-lg p-2"
                style={{
                  background:
                    theme === "light"
                      ? "rgba(1, 0, 82, 0.05)"
                      : "rgba(185, 184, 235, 0.05)",
                }}
              >
                <p
                  className="text-xs mb-0.5"
                  style={{
                    color:
                      theme === "light"
                        ? "rgba(1, 0, 82, 0.5)"
                        : "rgba(185, 184, 235, 0.6)",
                  }}
                >
                  Entrada
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: theme === "light" ? "#010052" : "#ffffff" }}
                >
                  {entryPrice}
                </p>
              </div>
              <div
                className="rounded-lg p-2"
                style={{
                  background:
                    theme === "light"
                      ? "rgba(1, 0, 82, 0.05)"
                      : "rgba(185, 184, 235, 0.05)",
                }}
              >
                <p
                  className="text-xs mb-0.5"
                  style={{
                    color:
                      theme === "light"
                        ? "rgba(1, 0, 82, 0.5)"
                        : "rgba(185, 184, 235, 0.6)",
                  }}
                >
                  Salida
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: theme === "light" ? "#010052" : "#ffffff" }}
                >
                  {exitPrice}
                </p>
              </div>
            </div>

            <div
              className="rounded-lg p-2"
              style={{
                background:
                  theme === "light"
                    ? "rgba(1, 0, 82, 0.05)"
                    : "rgba(185, 184, 235, 0.05)",
              }}
            >
              <p
                className="text-xs mb-0.5"
                style={{
                  color:
                    theme === "light"
                      ? "rgba(1, 0, 82, 0.5)"
                      : "rgba(185, 184, 235, 0.6)",
                }}
              >
                Duracion
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color: theme === "light" ? "#010052" : "#ffffff" }}
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
              color:
                theme === "light"
                  ? "rgba(1, 0, 82, 0.5)"
                  : "rgba(185, 184, 235, 0.6)",
            }}
          >
            Por qué funcionó
          </p>
          <div className="space-y-1.5">
            {reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-[#6366f1] mt-0.5 shrink-0">&#10003;</span>
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color:
                      theme === "light"
                        ? "rgba(1, 0, 82, 0.75)"
                        : "rgba(204, 204, 224, 0.85)",
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
          className="w-full mt-4 rounded-xl px-6 py-3 h-auto text-sm font-semibold"
        >
          <span>Ver tesis completa</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}
