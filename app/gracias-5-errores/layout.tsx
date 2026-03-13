import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gracias - Los 5 Errores en Cripto - Medusa Capital",
  description:
    "Descarga gratis los 5 errores que cuestan 5 cifras en cripto. 14 páginas con los patrones que separan a los que pierden de los que acumulan.",
};

export default function GraciasSistemaMedusaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
