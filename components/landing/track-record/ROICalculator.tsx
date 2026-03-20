"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { trackBookCallClick } from "@/lib/analytics";
import { getOutboundUrl } from "@/lib/utm";

interface Project {
  id: string;
  name: string;
  ticker: string;
  roi: number;
  roiDisplay: string;
  athRoi: number;
  athRoiDisplay: string;
  description: string;
  logoUrl: string;
}

const projects: Project[] = [
  {
    id: "metadao",
    name: "MetaDAO",
    ticker: "META",
    roi: 6.47,
    roiDisplay: "+647%",
    athRoi: 10.58,
    athRoiDisplay: "+1.058%",
    description: "Entrada temprana con producto probado + plan de salida escalonado.",
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/38146.png",
  },
  {
    id: "syrup",
    name: "Maple Finance",
    ticker: "SYRUP",
    roi: 0.56,
    roiDisplay: "+56%",
    athRoi: 2.15,
    athRoiDisplay: "+215%",
    description: "Tokenomics innovadores + equipo con track record + timing correcto.",
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/33824.png",
  },
  {
    id: "hyperliquid",
    name: "Hyperliquid",
    ticker: "HYPE",
    roi: 1.38,
    roiDisplay: "+138%",
    athRoi: 4.55,
    athRoiDisplay: "+455%",
    description: "DEX de perpetuals sin VCs extractivos. Tesis sólida + producto funcionando.",
    logoUrl: "/img/hyperliquid.webp",
  },
  {
    id: "pumpfun",
    name: "Pump.fun",
    ticker: "PUMP",
    roi: -0.53,
    roiDisplay: "-53%",
    athRoi: 1.24,
    athRoiDisplay: "+124%",
    description: "Modelo de negocio cíclico con bajas expectativas de crecimiento.",
    logoUrl: "/img/projects/pumpfun.avif",
  },
];

export function ROICalculator() {
  const [amount, setAmount] = useState<number>(1000);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 1000000) {
      setAmount(numValue);
      if (selectedProject) {
        setShowResults(false);
        setTimeout(() => setShowResults(true), 50);
      }
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setShowResults(false);
    setTimeout(() => setShowResults(true), 100);
    setIsDropdownOpen(false);
  };

  const calculateResults = () => {
    if (!selectedProject || amount < 100) return null;

    const closeFinalAmount = amount * (1 + selectedProject.roi);
    const closeProfit = closeFinalAmount - amount;

    const athFinalAmount = amount * (1 + selectedProject.athRoi);
    const athProfit = athFinalAmount - amount;

    return {
      closeFinalAmount,
      closeProfit,
      athFinalAmount,
      athProfit,
    };
  };

  const results = calculateResults();

  const bulletPoints = [
    "Rentabilidades reales documentadas",
    "Sin promesas de '100x' imposibles",
    "Basado en proyectos con tesis sólida",
  ];

  return (
    <section className="w-full py-16 px-6 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left column - Copy */}
          <div className="flex flex-col justify-start pt-4">
            <h2
              className="font-[family-name:var(--font-heading)] text-[clamp(36px,4vw,48px)] font-bold leading-[1.2] mb-4"
              style={{ color: "#ffffff" }}
            >
              Rendimiento histórico por proyecto
            </h2>

            <p
              className="text-lg leading-[1.6] mb-6 max-w-[480px]"
              style={{
                color: "rgba(204, 204, 224, 0.7)",
              }}
            >
              Consulta el rendimiento documentado de cada tesis publicada desde 2024.
            </p>

            {/* Bullet Points */}
            <div className="flex flex-col gap-3">
              {bulletPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    <Check
                      className="w-5 h-5 text-[#6366f1]"
                      strokeWidth={2.5}
                    />
                  </div>
                  <span
                    className="font-medium text-[15px]"
                    style={{
                      color: "rgba(204, 204, 224, 0.85)",
                    }}
                  >
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Calculator card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative backdrop-blur-md rounded-3xl p-8 border"
            style={{
              background: "rgba(27, 26, 100, 0.4)",
              borderColor: "rgba(185, 184, 235, 0.2)",
            }}
          >
            {/* Background gradient */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom right, rgba(99, 102, 241, 0.1), transparent)",
              }}
            />

            <div className="relative z-10">
              {/* Field 1: Investment Amount */}
              <div className="mb-6">
                <label
                  className="block font-semibold text-sm mb-3 uppercase tracking-wider"
                  style={{
                    color: "rgba(185, 184, 235, 0.8)",
                  }}
                >
                  ¿Con cuánto quieres simular?
                </label>

                <div className="relative">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[22px] pointer-events-none"
                    style={{
                      color: "rgba(185, 184, 235, 0.5)",
                    }}
                  >
                    &euro;
                  </span>
                  <input
                    type="text"
                    value={amount.toLocaleString("es-ES")}
                    onChange={handleAmountChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 font-semibold text-[22px] transition-all duration-200 outline-none"
                    placeholder="1000"
                    style={{
                      background: "rgba(1, 0, 82, 0.5)",
                      borderColor: "rgba(185, 184, 235, 0.2)",
                      color: "#ffffff",
                    }}
                  />
                </div>
              </div>

              {/* Field 2: Project Selector */}
              <div className="mb-6">
                <label
                  className="block font-semibold text-sm mb-3 uppercase tracking-wider"
                  style={{
                    color: "rgba(185, 184, 235, 0.8)",
                  }}
                >
                  Selecciona un proyecto
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-4 py-3 rounded-xl border-2 font-semibold text-base transition-all duration-200 outline-none cursor-pointer flex items-center justify-between"
                    style={{
                      background: "rgba(1, 0, 82, 0.5)",
                      borderColor: selectedProject
                        ? "#6366f1"
                        : "rgba(185, 184, 235, 0.2)",
                      color: "#ffffff",
                      boxShadow: selectedProject
                        ? "0 0 0 3px rgba(99, 102, 241, 0.15)"
                        : "none",
                    }}
                  >
                    {selectedProject ? (
                      <div className="flex items-center gap-3">
                        <Image
                          src={selectedProject.logoUrl}
                          alt={selectedProject.name}
                          width={24}
                          height={24}
                          className="rounded-full object-cover"
                          unoptimized
                        />
                        <span>{selectedProject.name}</span>
                        <span className={selectedProject.roi >= 0 ? "text-[#4DFF88]" : "text-[#FF6B6B]"}>
                          {selectedProject.roiDisplay}
                        </span>
                      </div>
                    ) : (
                      <span
                        style={{
                          color: "rgba(185, 184, 235, 0.5)",
                        }}
                      >
                        Selecciona un proyecto...
                      </span>
                    )}

                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                      style={{
                        color: "rgba(185, 184, 235, 0.5)",
                      }}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-2 rounded-xl border overflow-hidden z-50 backdrop-blur-md"
                        style={{
                          background: "rgba(1, 0, 82, 0.95)",
                          borderColor: "rgba(185, 184, 235, 0.2)",
                          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        {projects.map((project) => (
                          <button
                            key={project.id}
                            type="button"
                            onClick={() => handleProjectSelect(project)}
                            className="w-full px-4 py-3 flex items-center gap-3 font-semibold text-[15px] transition-all duration-150 cursor-pointer border-none text-left hover:bg-[rgba(99,102,241,0.1)]"
                            style={{
                              background:
                                selectedProject?.id === project.id
                                  ? "rgba(99, 102, 241, 0.15)"
                                  : "transparent",
                              borderBottom:
                                "1px solid rgba(185, 184, 235, 0.1)",
                              color: "#ffffff",
                            }}
                          >
                            <Image
                              src={project.logoUrl}
                              alt={project.name}
                              width={32}
                              height={32}
                              className="rounded-full object-cover"
                              unoptimized
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span>{project.name}</span>
                                <span className={`font-bold text-sm ${project.roi >= 0 ? "text-[#4DFF88]" : "text-[#FF6B6B]"}`}>
                                  {project.roiDisplay}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Field 3: Results */}
              <AnimatePresence>
                {results && amount >= 100 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: showResults ? 1 : 0, y: showResults ? 0 : 20 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col gap-4 mb-5"
                  >
                    {/* CIERRE 2025 Card */}
                    <div
                      className="rounded-2xl p-6 relative overflow-hidden"
                      style={{
                        background: "linear-gradient(to bottom right, #6366f1, #8b5cf6)",
                        boxShadow: "0 8px 24px rgba(99, 102, 241, 0.4)",
                      }}
                    >
                      {selectedProject && (
                        <div className="absolute top-0 right-0 w-[140px] h-[140px] pointer-events-none opacity-10 translate-x-[20%] -translate-y-[20%]">
                          <Image
                            src={selectedProject.logoUrl}
                            alt=""
                            fill
                            className="object-contain brightness-125 saturate-50"
                            unoptimized
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-2 relative z-10">
                        <p className="font-medium text-xs text-white/70 uppercase tracking-wider">
                          CIERRE 2025
                        </p>
                        <span className="text-sm font-bold text-white/90 bg-white/15 rounded-full px-3 py-1">
                          {selectedProject?.roiDisplay}
                        </span>
                      </div>

                      <div className="font-[family-name:var(--font-heading)] font-bold text-[36px] leading-none text-white mb-4 relative z-10">
                        {formatCurrency(results.closeFinalAmount)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20 relative z-10">
                        <div>
                          <p className="text-xs text-white/70 mb-1">Inversión inicial</p>
                          <p className="font-semibold text-base text-white">
                            {formatCurrency(amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-white/70 mb-1">Ganancia neta</p>
                          <p className="font-semibold text-base text-white">
                            {formatCurrency(results.closeProfit)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ALL-TIME HIGH Card */}
                    <div
                      className="rounded-2xl p-6 relative overflow-hidden"
                      style={{
                        background: "linear-gradient(to bottom right, #7c3aed, #a855f7)",
                        boxShadow: "0 8px 24px rgba(124, 58, 237, 0.4)",
                      }}
                    >
                      {selectedProject && (
                        <div className="absolute top-0 right-0 w-[140px] h-[140px] pointer-events-none opacity-10 translate-x-[20%] -translate-y-[20%]">
                          <Image
                            src={selectedProject.logoUrl}
                            alt=""
                            fill
                            className="object-contain brightness-125 saturate-50"
                            unoptimized
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-2 relative z-10">
                        <p className="font-medium text-xs text-white/70 uppercase tracking-wider">
                          ALL-TIME HIGH (ATH)
                        </p>
                        <span className="text-sm font-bold text-white/90 bg-white/15 rounded-full px-3 py-1">
                          {selectedProject?.athRoiDisplay}
                        </span>
                      </div>

                      <div className="font-[family-name:var(--font-heading)] font-bold text-[36px] leading-none text-white mb-4 relative z-10">
                        {formatCurrency(results.athFinalAmount)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20 relative z-10">
                        <div>
                          <p className="text-xs text-white/70 mb-1">Inversión inicial</p>
                          <p className="font-semibold text-base text-white">
                            {formatCurrency(amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-white/70 mb-1">Ganancia máxima</p>
                          <p className="font-semibold text-base text-white">
                            {formatCurrency(results.athProfit)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA Section */}
              <div
                className="rounded-xl p-5 border"
                style={{
                  background: "rgba(185, 184, 235, 0.05)",
                  borderColor: "rgba(185, 184, 235, 0.1)",
                }}
              >
                <p
                  className="text-[13px] leading-[1.6] text-center mb-4"
                  style={{
                    color: "rgba(204, 204, 224, 0.7)",
                  }}
                >
                  Metodología basada en tesis documentada, gestión de riesgo y plan de salida desde día 1.
                </p>

                <Button
                  variant="secondaryGlow"
                  className="w-full rounded-xl px-6 py-3 h-auto text-[15px] font-semibold"
                  onClick={() => {
                    trackBookCallClick("roi_calculator");
                    window.open(getOutboundUrl("https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon?month=2026-01"), "_blank");
                  }}
                >
                  Reserva tu sesión estratégica
                </Button>
              </div>

              {/* Disclaimer */}
              <p
                className="text-[11px] leading-[1.5] text-center mt-4"
                style={{
                  color: "rgba(185, 184, 235, 0.4)",
                }}
              >
                Disclaimer: Rentabilidades pasadas no garantizan resultados
                futuros. Este cálculo muestra resultados históricos de tesis
                documentadas en Medusa Capital. La inversión en criptomonedas
                conlleva riesgo de pérdida total del capital.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
