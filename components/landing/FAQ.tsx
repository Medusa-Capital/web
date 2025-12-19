"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    question: "¿En qué se basa la metodología del curso?",
    answer:
      "Explicamos los activos digitales desde una perspectiva fundamental y de asignación de capital siguiendo siempre el ciclo económico. Nada de promesas vacías, sí a marcos racionales de análisis.",
  },
  {
    question: "¿Necesito tener conocimientos previos en blockchain o programación?",
    answer:
      "No. El curso está diseñado para profesionales financieros que son nuevos en cripto. Empezamos desde los fundamentos.",
  },
  {
    question: "¿Esto es para traders o para inversores a largo plazo?",
    answer:
      "Ambos. El curso cubre tanto estrategias de trading como inversión a largo plazo enfocada en la construcción de patrimonio.",
  },
  {
    question: "¿Qué diferencia hay entre este curso y otros que prometen 'vivir del trading'?",
    answer:
      "Nos enfocamos en fundamentos, no en esquemas de enriquecimiento rápido. Enseñamos análisis riguroso, no promesas vacías.",
  },
  {
    question: "¿Se actualiza el contenido con nuevas tendencias o tecnologías?",
    answer:
      "Sí, los módulos se actualizan regularmente con cambios en protocolos, regulación y narrativas del mercado.",
  },
  {
    question: "¿Puedo aplicar lo aprendido si solo quiero invertir en BTC y ETH?",
    answer:
      "Absolutamente. El curso construye desde los fundamentos de BTC/ETH, que son la base de todo el ecosistema.",
  },
  {
    question: "¿Cómo se compara esto con una formación financiera tradicional?",
    answer:
      "Complementamos la formación tradicional con conocimiento específico de activos digitales, blockchain y DeFi.",
  },
  {
    question: "¿Qué pasa si el mercado entra en un bear market?",
    answer:
      "Proporcionamos herramientas para la preservación de capital e identificación de oportunidades durante mercados bajistas.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#0a0a2e] to-[#050520]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
          {/* Left header */}
          <div>
            <Badge
              variant="outline"
              className="mb-4 border-white/20 bg-white/5 text-white/60"
            >
              FAQs
            </Badge>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-[#CCCCE0] leading-tight">
              Preguntas que consideramos relevantes
            </h2>
          </div>

          {/* Right accordion */}
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border-b border-white/10 last:border-b-0"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between py-4 text-left group"
                >
                  <span className="text-white/80 group-hover:text-white transition-colors pr-4">
                    {faq.question}
                  </span>
                  <ChevronRight
                    className={cn(
                      "w-5 h-5 text-white/40 transition-transform duration-200 flex-shrink-0",
                      openIndex === i && "rotate-90"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    openIndex === i ? "max-h-48 pb-4" : "max-h-0"
                  )}
                >
                  <p className="text-white/50 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
