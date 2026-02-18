import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gracias - Sistema Medusa - Medusa Capital",
  description:
    "Tu Sistema Medusa está en camino. Revisa tu email para descargar el PDF con el framework de 4 pasos.",
};

export default function GraciasSistemaMedusaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
