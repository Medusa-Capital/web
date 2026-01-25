"use client";

import { useTheme } from "@/components/providers/ThemeProvider";

export function Disclaimer() {
  const { theme } = useTheme();

  return (
    <div
      className={`relative pt-6 border-t transition-colors duration-300 ${
        theme === "light"
          ? "border-[#010052]/10"
          : "border-[rgba(185,184,235,0.2)]"
      }`}
    >
      <h3
        className={`font-semibold text-sm mb-3 transition-colors duration-300 ${
          theme === "light"
            ? "text-[#3d3d6b]/60"
            : "text-[rgba(185,184,235,0.6)]"
        }`}
      >
        Disclaimer
      </h3>
      <p
        className={`text-xs leading-[18px] transition-colors duration-300 ${
          theme === "light"
            ? "text-[#3d3d6b]/40"
            : "text-[rgba(185,184,235,0.4)]"
        }`}
      >
        Invertir conlleva riesgos de perder su dinero. El contenido de todos
        nuestros servicios, videos, textos y/o imágenes no constituye una oferta
        o recomendación de compra o venta de instrumentos financieros. El
        receptor del contenido debe ser consciente de que los valores e
        instrumentos financieros a que se refieren pueden no ser adecuados a su
        perfil, ni a sus objetivos concretos de inversión, por lo que el
        receptor debe adoptar sus propias decisiones en el caso de realizar
        alguna inversión, procurándose a tal fin el asesoramiento especializado
        que considere necesario y asumiendo plenamente toda la responsabilidad
        tanto por los medios como por los resultados. Los autores no se hacen
        responsables del uso e interpretación que se haga de su contenido ni de
        los eventuales daños y/o perjuicios que pudiera sufrir el receptor
        formalizando operaciones y/o adoptando cualquier decisión en las que
        tome como referencia el contenido de este. Medusa Capital no ofrece
        servicios de asesoramiento ni servicios de compra o venta de productos
        financieros.
      </p>
    </div>
  );
}
