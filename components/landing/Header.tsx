"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { trackEvent, trackBookCallClick } from "@/lib/analytics";
import { getOutboundUrl } from "@/lib/utm";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 px-6 py-5 md:py-5 transition-all duration-300 ${
        isScrolled
          ? "bg-[#010052]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/img/logo.svg"
            alt="Medusa Capital"
            width={180}
            height={60}
            className="h-12 md:h-14 w-auto transition-opacity duration-300"
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4 md:gap-8">
          <Link
            href="/colaboradores"
            className="hidden sm:block text-[#B9B8EB]/70 hover:text-white transition-colors font-semibold text-lg md:text-xl"
            onClick={() => trackEvent("navigation_click", { destination: "colaboradores", category: "navigation" })}
          >
            Colaboradores
          </Link>
          <Link
            href="/blog"
            className="hidden sm:block text-[#B9B8EB]/70 hover:text-white transition-colors font-semibold text-lg md:text-xl"
            onClick={() => trackEvent("navigation_click", { destination: "blog", category: "navigation" })}
          >
            Blog
          </Link>
          <Link
            href="/track-record"
            className="hidden sm:block text-[#B9B8EB]/70 hover:text-white transition-colors font-semibold text-lg md:text-xl"
            onClick={() => trackEvent("navigation_click", { destination: "track-record", category: "navigation" })}
          >
            Track record
          </Link>

          {/* CTA Button - appears on scroll */}
          <Button
            variant="secondaryGlow"
            size="lg"
            className={`hidden sm:flex px-8 py-6 text-base font-semibold rounded-lg transition-all duration-300 ${
              isScrolled
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4 pointer-events-none"
            }`}
            onClick={() => {
              trackBookCallClick("header");
              window.open(getOutboundUrl("https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon?month=2026-01"), "_blank");
            }}
          >
            Reserva tu sesión estratégica
          </Button>
        </nav>
      </div>
    </header>
  );
}
