import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gracias - Los 5 Errores en Cripto - Medusa Capital",
  description:
    "Tu guía está en camino. Revisa tu email para descargar los 5 errores que cuestan 5 cifras en cripto.",
};

export default function GraciasSistemaMedusaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
