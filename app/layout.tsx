import type { Metadata } from "next";
import { Geist_Mono, Inter, Cormorant } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-heading",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Medusa Capital",
  description: "Formación en Criptomonedas para Inversores Exigentes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${cormorant.variable}`}>
      <body className={`${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
