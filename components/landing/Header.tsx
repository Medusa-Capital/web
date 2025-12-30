"use client";

import Image from "next/image";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export function Header() {
  return (
    <header className="relative px-6 py-5 md:py-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/img/logo.svg"
            alt="Medusa Capital"
            width={180}
            height={60}
            className="h-12 md:h-14 w-auto"
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 md:gap-8">
          <Link
            href="/colaboradores"
            className="text-[#B9B8EB]/70 hover:text-white transition-colors font-semibold text-lg md:text-xl"
            onClick={() => trackEvent("navigation_click", { destination: "colaboradores", category: "navigation" })}
          >
            Colaboradores
          </Link>
          <Link
            href="/blog"
            className="text-[#B9B8EB]/70 hover:text-white transition-colors font-semibold text-lg md:text-xl"
            onClick={() => trackEvent("navigation_click", { destination: "blog", category: "navigation" })}
          >
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
