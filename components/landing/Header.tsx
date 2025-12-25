"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

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
        <div className="flex items-center gap-6">
          <Link
            href="/blog"
            className="text-[#B9B8EB]/70 hover:text-white transition-colors font-medium"
          >
            Blog
          </Link>

          {/* Dark/Light mode toggle - pill style matching legacy */}
          <button
          onClick={() => setIsDark(!isDark)}
          className="relative flex items-center w-24 h-10 rounded-full bg-white/20 dark:bg-white/30 cursor-pointer transition-colors duration-300"
        >
          {/* Toggle circle */}
          <div
            className={`absolute top-1 w-8 h-8 rounded-full bg-white flex items-center justify-center transition-all duration-300 ease-in-out ${
              isDark ? "left-1" : "left-[calc(100%-36px)]"
            }`}
          >
            {/* Decorative arc on the circle */}
            <svg width="34" height="35" viewBox="0 0 34 35" fill="none" className="w-full h-full">
              <path
                d="M7.02771 26.9605C1.56668 21.4995 1.58718 12.6248 7.07351 7.13855"
                stroke="#9392DF"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Moon icon */}
          <div className="absolute left-2 w-6 h-6 flex items-center justify-center">
            <svg
              className={`w-5 h-5 transition-opacity ${isDark ? "opacity-0" : "opacity-100"}`}
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </div>

          {/* Sun icon */}
          <div className="absolute right-2 w-6 h-6 flex items-center justify-center">
            <svg
              className={`w-5 h-5 transition-opacity ${isDark ? "opacity-100" : "opacity-0"}`}
              viewBox="0 0 25 25"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M12.0835 18.5675C15.6601 18.5675 18.5596 15.6681 18.5596 12.0914C18.5596 8.51479 15.6601 5.61536 12.0835 5.61536C8.50686 5.61536 5.60742 8.51479 5.60742 12.0914C5.60742 15.6681 8.50686 18.5675 12.0835 18.5675Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>
        </div>
      </div>
    </header>
  );
}
