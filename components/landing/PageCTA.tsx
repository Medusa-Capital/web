"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getOutboundUrl } from "@/lib/utm";

interface PageCTAProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref?: string;
  buttonEmail?: string;
  buttonExternalUrl?: string;
}

export function PageCTA({
  title,
  description,
  buttonText,
  buttonHref,
  buttonEmail,
  buttonExternalUrl,
}: PageCTAProps) {
  const buttonContent = (
    <Button
      variant="secondaryGlow"
      className="rounded-xl px-8 py-4 h-auto text-lg font-semibold"
    >
      {buttonText}
    </Button>
  );

  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[1000px] mx-auto relative"
      >
        {/* Glassmorphism container */}
        <div
          className="relative backdrop-blur-md rounded-[32px] p-12 border overflow-hidden"
          style={{
            background: "rgba(27, 26, 100, 0.5)",
            borderColor: "rgba(185, 184, 235, 0.2)",
          }}
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 60%)",
            }}
          />

          <div className="relative z-10 text-center">
            <h2
              className="font-[family-name:var(--font-heading)] text-[clamp(32px,4vw,48px)] font-bold leading-[1.2] mb-4"
              style={{
                color: "#ffffff",
              }}
            >
              {title}
            </h2>
            <p
              className="text-lg leading-relaxed max-w-[600px] mx-auto mb-8"
              style={{
                color: "rgba(204, 204, 224, 0.7)",
              }}
            >
              {description}
            </p>

            {buttonEmail ? (
              <a href={`mailto:${buttonEmail}`}>{buttonContent}</a>
            ) : buttonExternalUrl ? (
              <a href={getOutboundUrl(buttonExternalUrl)} target="_blank" rel="noopener noreferrer">{buttonContent}</a>
            ) : buttonHref ? (
              <Link href={buttonHref}>{buttonContent}</Link>
            ) : (
              buttonContent
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
