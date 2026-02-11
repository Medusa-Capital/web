"use client";

import { motion } from "framer-motion";

const performanceData = [
  { month: "Ene", btc: 100, medusa: 100 },
  { month: "Feb", btc: 115, medusa: 145 },
  { month: "Mar", btc: 125, medusa: 210 },
  { month: "Abr", btc: 118, medusa: 280 },
  { month: "May", btc: 130, medusa: 350 },
  { month: "Jun", btc: 125, medusa: 420 },
  { month: "Jul", btc: 135, medusa: 485 },
  { month: "Ago", btc: 128, medusa: 520 },
  { month: "Sep", btc: 140, medusa: 580 },
  { month: "Oct", btc: 155, medusa: 650 },
  { month: "Nov", btc: 180, medusa: 700 },
  { month: "Dic", btc: 195, medusa: 720 },
];

// Chart dimensions
const chartWidth = 800;
const chartHeight = 350;
const padding = { top: 20, right: 40, bottom: 40, left: 60 };

// Calculate scales
const maxValue = Math.max(...performanceData.map((d) => Math.max(d.btc, d.medusa)));
const minValue = 0;

const xScale = (index: number) =>
  padding.left +
  (index / (performanceData.length - 1)) *
    (chartWidth - padding.left - padding.right);

const yScale = (value: number) =>
  chartHeight -
  padding.bottom -
  ((value - minValue) / (maxValue - minValue)) *
    (chartHeight - padding.top - padding.bottom);

// Generate path data
const generatePath = (data: number[]) => {
  return data
    .map((value, index) => {
      const x = xScale(index);
      const y = yScale(value);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(" ");
};

const btcPath = generatePath(performanceData.map((d) => d.btc));
const medusaPath = generatePath(performanceData.map((d) => d.medusa));

// Generate area path for gradient fill
const generateAreaPath = (data: number[]) => {
  const linePath = generatePath(data);
  const lastX = xScale(data.length - 1);
  const firstX = xScale(0);
  const bottomY = chartHeight - padding.bottom;
  return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
};

const medusaAreaPath = generateAreaPath(performanceData.map((d) => d.medusa));

export function PerformanceChart() {
  const gridLines = [0, 200, 400, 600, 800];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative backdrop-blur-md rounded-3xl p-6 md:p-8 border overflow-hidden"
      style={{
        background: "rgba(27, 26, 100, 0.5)",
        borderColor: "rgba(185, 184, 235, 0.2)",
      }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom right, rgba(99, 102, 241, 0.08), transparent)",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h3
            className="font-[family-name:var(--font-heading)] text-[clamp(28px,3vw,36px)] font-bold mb-2"
            style={{ color: "#ffffff" }}
          >
            Comparativa de rentabilidad desde 2024
          </h3>
          <p
            className="text-base"
            style={{
              color: "rgba(204, 204, 224, 0.7)",
            }}
          >
            Inversión inicial de 100% normalizada a Enero de 2024
          </p>
        </div>

        {/* Chart SVG */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full min-w-[600px]"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Defs for gradients */}
            <defs>
              <linearGradient id="medusaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop
                  offset="0%"
                  stopColor="#6366f1"
                  stopOpacity="0.4"
                />
                <stop
                  offset="100%"
                  stopColor="#6366f1"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {gridLines.map((value) => (
              <g key={value}>
                <line
                  x1={padding.left}
                  y1={yScale(value)}
                  x2={chartWidth - padding.right}
                  y2={yScale(value)}
                  stroke="rgba(185, 184, 235, 0.1)"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 10}
                  y={yScale(value)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="rgba(185, 184, 235, 0.7)"
                  fontFamily="Inter, sans-serif"
                >
                  {value}%
                </text>
              </g>
            ))}

            {/* X-axis labels */}
            {performanceData.map((d, index) => (
              <text
                key={d.month}
                x={xScale(index)}
                y={chartHeight - padding.bottom + 25}
                textAnchor="middle"
                fontSize="12"
                fill="rgba(185, 184, 235, 0.7)"
                fontFamily="Inter, sans-serif"
              >
                {d.month}
              </text>
            ))}

            {/* Medusa area fill */}
            <motion.path
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              d={medusaAreaPath}
              fill="url(#medusaGradient)"
            />

            {/* BTC line */}
            <motion.path
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              d={btcPath}
              fill="none"
              stroke="#f7931a"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Medusa line */}
            <motion.path
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              d={medusaPath}
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points - BTC */}
            {performanceData.map((d, index) => (
              <motion.circle
                key={`btc-${index}`}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                cx={xScale(index)}
                cy={yScale(d.btc)}
                r="4"
                fill="#f7931a"
              />
            ))}

            {/* Data points - Medusa */}
            {performanceData.map((d, index) => (
              <motion.circle
                key={`medusa-${index}`}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                cx={xScale(index)}
                cy={yScale(d.medusa)}
                r="4"
                fill="#6366f1"
              />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-8 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 rounded-full bg-[#f7931a]" />
            <span
              className="text-sm"
              style={{
                color: "rgba(204, 204, 224, 0.8)",
              }}
            >
              Bitcoin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 rounded-full bg-[#6366f1]" />
            <span
              className="text-sm"
              style={{
                color: "rgba(204, 204, 224, 0.8)",
              }}
            >
              Medusa Capital
            </span>
          </div>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t"
          style={{
            borderColor: "rgba(185, 184, 235, 0.15)",
          }}
        >
          <div className="text-center">
            <p
              className="text-sm mb-1 uppercase tracking-wider"
              style={{
                color: "rgba(185, 184, 235, 0.6)",
              }}
            >
              Rentabilidad de Bitcoin
            </p>
            <p className="font-[family-name:var(--font-heading)] text-[32px] font-bold text-[#f7931a]">
              +95%
            </p>
          </div>
          <div className="text-center">
            <p
              className="text-sm mb-1 uppercase tracking-wider"
              style={{
                color: "rgba(185, 184, 235, 0.6)",
              }}
            >
              Rentabilidad de Medusa Capital
            </p>
            <p className="font-[family-name:var(--font-heading)] text-[32px] font-bold text-[#6366f1]">
              +620%
            </p>
          </div>
          <div className="text-center">
            <p
              className="text-sm mb-1 uppercase tracking-wider"
              style={{
                color: "rgba(185, 184, 235, 0.6)",
              }}
            >
              Outperformance (vs Bitcoin)
            </p>
            <p className="font-[family-name:var(--font-heading)] text-[32px] font-bold text-[#22c55e]">
              +525%
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
