"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { trackEvent, trackBookCallClick } from "@/lib/analytics";
import { getOutboundUrl } from "@/lib/utm";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/colaboradores", label: "Colaboradores" },
  { href: "/blog", label: "Blog" },
  { href: "/track-record", label: "Track record" },
] as const;

export function Header({ minimal = false }: { minimal?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 px-6 py-5 md:py-5 transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? "bg-[#010052]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={() => setMobileMenuOpen(false)}>
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
        {!minimal && (
          <>
            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-4 md:gap-8">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[#B9B8EB]/70 hover:text-white transition-colors font-semibold text-lg md:text-xl"
                  onClick={() => trackEvent("navigation_click", { destination: href.slice(1), category: "navigation" })}
                >
                  {label}
                </Link>
              ))}

              {/* CTA Button - appears on scroll */}
              <Button
                variant="secondaryGlow"
                size="lg"
                className={`px-8 py-6 text-base font-semibold rounded-lg transition-all duration-300 ${
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

            {/* Mobile hamburger */}
            <button
              type="button"
              className="sm:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
              <div className="fixed inset-0 top-[72px] z-40 bg-[#010052]/98 backdrop-blur-md sm:hidden">
                <nav className="flex flex-col items-center gap-8 pt-12">
                  {NAV_LINKS.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="text-[#B9B8EB] hover:text-white transition-colors font-semibold text-2xl"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        trackEvent("navigation_click", { destination: href.slice(1), category: "navigation" });
                      }}
                    >
                      {label}
                    </Link>
                  ))}
                  <Button
                    variant="secondaryGlow"
                    size="lg"
                    className="px-8 py-6 text-base font-semibold rounded-lg mt-4"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      trackBookCallClick("header_mobile");
                      window.open(getOutboundUrl("https://calendly.com/contacto-medusacapital/sesion-estrategica-15-clon?month=2026-01"), "_blank");
                    }}
                  >
                    Reserva tu sesión estratégica
                  </Button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}
