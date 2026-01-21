"use client";

import Image from "next/image";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/components/providers/ThemeProvider";

export function Header() {
  const { theme } = useTheme();
  
  return (
    <header className="relative px-6 py-5 md:py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src={theme === "light" ? "/img/logo-dark.svg" : "/img/logo.svg"}
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
            href="/track-record"
            className="hidden sm:block text-[#B9B8EB]/70 dark:text-[#B9B8EB]/70 light:text-[#010052]/70 hover:text-white dark:hover:text-white light:hover:text-[#010052] transition-colors font-semibold text-lg md:text-xl"
            onClick={() => trackEvent("navigation_click", { destination: "track-record", category: "navigation" })}
          >
            Track record
          </Link>
          <Link
            href="/colaboradores"
            className="hidden sm:block text-[#B9B8EB]/70 dark:text-[#B9B8EB]/70 light:text-[#010052]/70 hover:text-white dark:hover:text-white light:hover:text-[#010052] transition-colors font-semibold text-lg md:text-xl"
            onClick={() => trackEvent("navigation_click", { destination: "colaboradores", category: "navigation" })}
          >
            Colaboradores
          </Link>
          <Link
            href="/blog"
            className="hidden sm:block text-[#B9B8EB]/70 dark:text-[#B9B8EB]/70 light:text-[#010052]/70 hover:text-white dark:hover:text-white light:hover:text-[#010052] transition-colors font-semibold text-lg md:text-xl"
            onClick={() => trackEvent("navigation_click", { destination: "blog", category: "navigation" })}
          >
            Blog
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
