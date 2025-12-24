"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "¿En qué se basa la metodología del curso?",
    answer:
      "Explicamos los activos digitales desde una perspectiva fundamental y de asignación de capital siguiendo siempre el ciclo económico. Nada de promesas vacías, sí a marcos racionales de análisis.",
  },
  {
    question: "¿Necesito tener conocimientos previos en blockchain o programación?",
    answer:
      "No. El curso está diseñado para perfiles financieros que buscan entender cripto como una nueva clase de activo, sin necesidad de formación técnica.",
  },
  {
    question: "¿Esto es para traders o para inversores a largo plazo?",
    answer:
      "Ambos. Aunque abordamos herramientas tácticas, el foco está en tomar decisiones bien fundamentadas para construir riqueza a largo plazo. Bitcoin no se creó para tradearse, sino para cambiar la relación con el dinero.",
  },
  {
    question: "¿Qué diferencia hay entre este curso y otros que prometen \"vivir del trading\"?",
    answer:
      "Explicamos los activos digitales desde una perspectiva fundamental y de asignación de capital siguiendo siempre el ciclo económico. Nada de promesas vacías, sí a marcos racionales de análisis.",
  },
  {
    question: "¿Se actualiza el contenido con nuevas tendencias o tecnologías?",
    answer:
      "En el sector de los activos digitales o te adaptas o mueres. Por tanto, sí, incorporamos módulos nuevos y actualizaciones cuando surgen cambios relevantes en protocolos, regulación, narrativas o estrategias de mercado.",
  },
  {
    question: "¿Puedo aplicar lo aprendido si solo quiero invertir en BTC y ETH?",
    answer:
      "Absolutamente. De hecho, el curso parte de esa base y luego te da las herramientas para decidir si tiene sentido diversificar hacia otros sectores como DeFi, RWAs o stablecoins.",
  },
  {
    question: "¿Cómo se compara esto con una formación financiera tradicional?",
    answer:
      "Nuestro enfoque parte de la lógica de la inversión tradicional, pero adaptada al nuevo paradigma cripto. Analizamos tokenomics como si fueran balances, y protocolos como si fueran negocios.",
  },
  {
    question: "¿Qué pasa si el mercado entra en un bear market?",
    answer:
      "La mayoría se forma cuando todo sube. Aquí te damos herramientas para sobrevivir, proteger tu capital y detectar oportunidades cuando el mercado cae. La clave no es solo entrar… es saber mantenerse.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-24 px-6 pb-0 bg-[#010052] z-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-6">
          {/* Left header - col-lg-5 */}
          <div>
            {/* Badge matching legacy .sec-badge */}
            <div
              className="inline-block mb-4 px-5 py-3 rounded-[30px] text-white text-sm font-medium"
              style={{ backgroundColor: "rgba(185, 184, 235, 0.3)" }}
            >
              FAQs
            </div>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Preguntas que consideramos relevantes
            </h2>
          </div>

          {/* Right accordion - col-lg-7 */}
          <div>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={cn(
                  "border-b border-white/50",
                  i === faqs.length - 1 && "border-b-0"
                )}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="relative w-full text-left pr-10 py-5 md:py-6 lg:py-7 cursor-pointer group"
                >
                  <span
                    className={cn(
                      "text-white font-bold text-base md:text-lg transition-colors",
                      "group-hover:text-[#B9B8EB]"
                    )}
                  >
                    {faq.question}
                  </span>
                  {/* Arrow icon positioned absolute right */}
                  <div
                    className={cn(
                      "absolute top-1/2 right-0 -translate-y-1/2 transition-transform duration-300 origin-center",
                      openIndex === i && "-rotate-[70deg]"
                    )}
                  >
                    <svg
                      width="22"
                      height="18"
                      viewBox="0 0 22 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.3871 14.3825L18.785 5.71902M20.3871 14.3825L11.5591 15.9547M20.3871 14.3825L1.61295 1.61824"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
                {/* Accordion content */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    openIndex === i ? "max-h-96 pb-7" : "max-h-0"
                  )}
                >
                  <p className="text-[#B9B8EB]/80 text-sm md:text-base leading-relaxed pr-10">
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
