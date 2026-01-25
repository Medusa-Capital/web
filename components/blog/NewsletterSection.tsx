"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/providers/ThemeProvider";

export function NewsletterSection() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Open Substack subscription page with email pre-filled
    // Using simple=true to skip the recommendations page
    const substackUrl = `https://axelmnvn.substack.com/subscribe?email=${encodeURIComponent(email)}&simple=true`;
    window.open(substackUrl, "_blank", "noopener,noreferrer");

    setStatus("success");
    setEmail("");
  };

  return (
    <section className="relative py-16 md:py-24 px-6">
      <div className="max-w-[800px] mx-auto relative">
        {/* Outer card with gradient border */}
        <div
          className="relative rounded-[32px] p-[2px] transition-all duration-300"
          style={{
            background:
              theme === "light"
                ? "linear-gradient(180deg, rgba(58, 84, 248, 0.4) 0%, rgba(1, 0, 82, 0.2) 100%)"
                : "linear-gradient(180deg, rgba(185, 184, 235, 0.4) 0%, rgba(67, 85, 217, 0.2) 100%)",
          }}
        >
          {/* Inner card */}
          <div
            className="relative rounded-[30px] p-8 md:p-12 overflow-hidden transition-colors duration-300"
            style={{
              backgroundColor:
                theme === "light" ? "rgba(255, 255, 255, 0.95)" : "rgba(27, 26, 100, 0.6)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Background gradient accent */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background:
                  theme === "light"
                    ? "radial-gradient(circle at top right, rgba(58, 84, 248, 0.08), transparent 60%)"
                    : "radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 60%)",
              }}
            />

            <div className="relative z-10 text-center">
              <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-[42px] md:leading-[52px] font-bold dark:text-white light:text-[#010052] mb-4 transition-colors duration-300">
                Suscríbete a nuestra newsletter
              </h2>
              <p className="dark:text-[#cccce0]/70 light:text-[#3d3d6b] text-base leading-relaxed max-w-[500px] mx-auto mb-8 transition-colors duration-300">
                Recibe análisis exclusivos, alertas de proyectos prometedores y
                contenido educativo directamente en tu email.
              </p>

              {status === "success" ? (
                <div className="flex items-center justify-center gap-2 text-[#50d98a] font-medium">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>¡Gracias por suscribirte!</span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-[500px] mx-auto"
                >
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 h-12 px-5 rounded-xl border-2 dark:border-[#B9B8EB]/20 light:border-[#010052]/10 dark:bg-[#010052]/50 light:bg-white dark:text-white light:text-[#010052] dark:placeholder:text-[#B9B8EB]/40 light:placeholder:text-[#3d3d6b]/50 focus-visible:border-[#3a54f8] focus-visible:ring-[#3a54f8]/15 transition-all duration-300"
                  />
                  <Button
                    type="submit"
                    variant="secondaryGlow"
                    className="h-12 px-6 rounded-xl font-semibold"
                  >
                    Suscribirme
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
