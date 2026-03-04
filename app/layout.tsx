import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Suspense } from "react";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = localFont({
  src: [
    { path: "../public/fonts/inter/inter-regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/inter/inter-medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/inter/inter-semibold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/inter/inter-bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = localFont({
  src: [{ path: "../public/fonts/cormorant/cormorant-bold.ttf", weight: "700", style: "normal" }],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Medusa Capital",
  description: "Formación en Criptomonedas para Inversores Exigentes",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${cormorant.variable} dark`}>
      <body className="antialiased">
        <Suspense fallback={null}>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </Suspense>
        <SpeedInsights />
      </body>
      {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
    </html>
  );
}
