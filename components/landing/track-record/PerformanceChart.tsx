"use client";

import { motion } from "framer-motion";

// Source: unified_summary_month_end.csv
// Normalized to 100 at 2024-12-31 (value_norm * 100)
const performanceData = [
  { month: "Inicio", btc: 100, sp500: 100, medusa: 100 },
  { month: "Ene", btc: 109.59, sp500: 102.7, medusa: 112.6 },
  { month: "Feb", btc: 90.26, sp500: 101.24, medusa: 83.78 },
  { month: "Mar", btc: 88.35, sp500: 95.41, medusa: 54.34 },
  { month: "Abr", btc: 100.81, sp500: 94.69, medusa: 83.6 },
  { month: "May", btc: 112.02, sp500: 100.51, medusa: 137.39 },
  { month: "Jun", btc: 114.64, sp500: 105.5, medusa: 181.18 },
  { month: "Jul", btc: 123.81, sp500: 107.78, medusa: 160.74 },
  { month: "Ago", btc: 115.81, sp500: 109.84, medusa: 236.71 },
  { month: "Sep", btc: 122.03, sp500: 113.72, medusa: 252.71 },
  { month: "Oct", btc: 117.24, sp500: 116.3, medusa: 592.96 },
  { month: "Nov", btc: 96.73, sp500: 116.45, medusa: 502.7 },
  { month: "Dic", btc: 93.65, sp500: 116.39, medusa: 455.47 },
];

// Chart dimensions
const chartWidth = 800;
const chartHeight = 400;
const padding = { top: 20, right: 40, bottom: 40, left: 60 };

// Calculate scales
const allValues = performanceData.flatMap((d) => [d.btc, d.sp500, d.medusa]);
const maxValue = Math.max(...allValues);
const minValue = Math.min(...allValues);

const yMin = Math.floor(minValue / 100) * 100;
const yMax = Math.ceil(maxValue / 100) * 100;

const xScale = (index: number) =>
  padding.left +
  (index / (performanceData.length - 1)) *
    (chartWidth - padding.left - padding.right);

const yScale = (value: number) =>
  chartHeight -
  padding.bottom -
  ((value - yMin) / (yMax - yMin)) *
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

// Generate area path for gradient fill
const generateAreaPath = (data: number[]) => {
  const linePath = generatePath(data);
  const lastX = xScale(data.length - 1);
  const firstX = xScale(0);
  const bottomY = chartHeight - padding.bottom;
  return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
};

const btcPath = generatePath(performanceData.map((d) => d.btc));
const sp500Path = generatePath(performanceData.map((d) => d.sp500));
const medusaPath = generatePath(performanceData.map((d) => d.medusa));
const medusaAreaPath = generateAreaPath(performanceData.map((d) => d.medusa));

export function PerformanceChart() {
  const gridLines: number[] = [];
  for (let v = yMin; v <= yMax; v += 100) {
    gridLines.push(v);
  }

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
            Comparativa de rentabilidad 2025
          </h3>
          <p
            className="text-base"
            style={{
              color: "rgba(204, 204, 224, 0.7)",
            }}
          >
            Inversión inicial de 100 normalizada a Enero 2025
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
              <linearGradient
                id="medusaGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
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
                  stroke={
                    value === 100
                      ? "rgba(185, 184, 235, 0.3)"
                      : "rgba(185, 184, 235, 0.1)"
                  }
                  strokeDasharray={value === 100 ? "none" : "4 4"}
                  strokeWidth={value === 100 ? 1.5 : 1}
                />
                <text
                  x={padding.left - 10}
                  y={yScale(value)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill={
                    value === 100
                      ? "rgba(185, 184, 235, 0.9)"
                      : "rgba(185, 184, 235, 0.7)"
                  }
                  fontFamily="Inter, sans-serif"
                  fontWeight={value === 100 ? 600 : 400}
                >
                  {value}
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
                fontSize="11"
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

            {/* S&P 500 line */}
            <motion.path
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              d={sp500Path}
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* BTC line */}
            <motion.path
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
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

            {/* Data points - S&P 500 */}
            {performanceData.map((d, index) => (
              <motion.circle
                key={`sp500-${index}`}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                cx={xScale(index)}
                cy={yScale(d.sp500)}
                r="4"
                fill="#22c55e"
              />
            ))}

            {/* Data points - BTC */}
            {performanceData.map((d, index) => (
              <motion.circle
                key={`btc-${index}`}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
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
                transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
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
            <div className="w-4 h-1 rounded-full bg-[#22c55e]" />
            <span
              className="text-sm"
              style={{
                color: "rgba(204, 204, 224, 0.8)",
              }}
            >
              S&P 500
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
              BTC Rentabilidad
            </p>
            <p className="font-[family-name:var(--font-heading)] text-[32px] font-bold text-[#f7931a]">
              -6%
            </p>
          </div>
          <div className="text-center">
            <p
              className="text-sm mb-1 uppercase tracking-wider"
              style={{
                color: "rgba(185, 184, 235, 0.6)",
              }}
            >
              Medusa Capital
            </p>
            <p className="font-[family-name:var(--font-heading)] text-[32px] font-bold text-[#6366f1]">
              +106%
            </p>
          </div>
          <div className="text-center">
            <p
              className="text-sm mb-1 uppercase tracking-wider"
              style={{
                color: "rgba(185, 184, 235, 0.6)",
              }}
            >
              S&P 500
            </p>
            <p className="font-[family-name:var(--font-heading)] text-[32px] font-bold text-[#22c55e]">
              +16%
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
