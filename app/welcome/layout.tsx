import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bienvenido - Medusa Capital",
  description:
    "Gracias por unirte a Medusa Capital. Pronto recibirás contenido personalizado sobre inversión institucional en activos digitales.",
};

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
