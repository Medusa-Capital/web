"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { trackEvent } from "@/lib/analytics";
import { useTheme } from "@/components/providers/ThemeProvider";

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

function CustomArrowIcon({ className, theme }: { className?: string; theme: "dark" | "light" }) {
  return (
    <svg
      width="22"
      height="18"
      viewBox="0 0 22 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M20.3871 14.3825L18.785 5.71902M20.3871 14.3825L11.5591 15.9547M20.3871 14.3825L1.61295 1.61824"
        stroke={theme === "light" ? "#010052" : "white"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FAQ() {
  const { theme } = useTheme();
  
  const handleAccordionChange = (value: string) => {
    if (value) {
      const index = parseInt(value.replace("item-", ""));
      trackEvent("faq_expand", {
        faq_index: index,
        faq_question: faqs[index]?.question || "unknown",
        category: "engagement",
      });
    }
  };

  return (
    <section className="relative pt-16 md:pt-[100px] px-4 md:px-6 pb-0">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-4 md:gap-6">
          {/* Left header - col-lg-5 */}
          <div className="mb-4 lg:mb-0">
            <Badge variant="section" className="mb-3 md:mb-4">
              FAQs
            </Badge>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-4xl lg:text-5xl font-bold dark:text-white light:text-[#010052] leading-tight transition-colors duration-300">
              Preguntas que consideramos relevantes
            </h2>
          </div>

          {/* Right accordion - col-lg-7 */}
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="w-full"
            onValueChange={handleAccordionChange}
          >
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className={cn(
                  "dark:border-white/50 light:border-[#010052]/20 border-b transition-colors duration-300",
                  i === faqs.length - 1 && "border-b-0"
                )}
              >
                <AccordionTrigger
                  className={cn(
                    "relative w-full text-left pr-10 py-5 md:py-6 lg:py-7 cursor-pointer group hover:no-underline",
                    "[&>svg]:hidden" // Hide default chevron icons
                  )}
                >
                  <span
                    className={cn(
                      "dark:text-white light:text-[#010052] font-bold text-base md:text-lg transition-colors duration-300",
                      "dark:group-hover:text-[#B9B8EB] light:group-hover:text-[#3a54f8]"
                    )}
                  >
                    {faq.question}
                  </span>
                  {/* Custom arrow icon positioned absolute right */}
                  <div
                    className={cn(
                      "absolute top-1/2 right-0 -translate-y-1/2 transition-transform duration-300 origin-center",
                      "group-data-[state=open]:-rotate-[70deg]"
                    )}
                  >
                    <CustomArrowIcon theme={theme} />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-7">
                  <p className="dark:text-[#B9B8EB]/80 light:text-[#3d3d6b] text-sm md:text-base leading-relaxed pr-10 transition-colors duration-300">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
