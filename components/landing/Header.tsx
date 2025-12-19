"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg
            width="34"
            height="35"
            viewBox="0 0 34 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="17" cy="17.5" r="16" fill="white" />
            <path
              d="M7.02771 26.9605C1.56668 21.4995 1.58718 12.6248 7.07351 7.13855"
              stroke="#9392DF"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-white font-medium tracking-wider text-sm">
            MEDUSA
            <span className="block text-[10px] tracking-[0.3em] text-white/70">
              CAPITAL
            </span>
          </span>
        </div>

        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDark(!isDark)}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
}
