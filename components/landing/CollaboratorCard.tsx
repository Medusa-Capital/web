"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ExternalLink,
  ShieldCheck,

  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Globe,
} from "lucide-react";
import { trackOutboundLink } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

// Social platform icon mapping
const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  instagram: Instagram,
  website: Globe,
};

export interface CollaboratorSocial {
  platform: "linkedin" | "twitter" | "youtube" | "instagram" | "website";
  url: string;
}

export interface CollaboratorStat {
  label: string;
  value: string;
  subValue?: string;
  icon?: React.ReactNode;
}

export interface CollaboratorData {
  name: string;
  role: string;
  imageUrl: string;
  collaboration: {
    tag: string;
    title: string;
    description: string;
    linkText: string;
    linkUrl: string;
  };
  credentials: React.ReactNode[];
  stats: CollaboratorStat[];
  socials: CollaboratorSocial[];
  accentColor: string;
}

interface CollaboratorCardProps {
  data: CollaboratorData;
  index: number;
}

export function CollaboratorCard({ data, index }: CollaboratorCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="snap-center"
    >
      <div
        className="group w-full rounded-[24px] overflow-hidden flex flex-col lg:flex-row shadow-2xl transition-all duration-500 border bg-gradient-to-br from-[#1b1a64] to-[#0a0a2e] border-[#B9B8EB]/10 hover:border-[#3a54f8]/50"
      >
        {/* COLUMN 1: Identity & Image */}
        <div
          className="relative w-full lg:w-[320px] xl:w-[380px] shrink-0 flex flex-col bg-[#0a0a2e]"
        >
          {/* Image Container */}
          <div className="relative h-[320px] lg:h-full min-h-[300px] overflow-hidden">
            <div
              className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a2e] via-transparent to-transparent"
            />
            <Image
              src={data.imageUrl}
              alt={data.name}
              fill
              className="object-cover"
            />

            {/* Mobile Overlay Name */}
            <div className="absolute bottom-4 left-4 z-20 lg:hidden">
              <h2
                className="text-2xl font-[family-name:var(--font-heading)] font-bold text-white"
              >
                {data.name}
              </h2>
            </div>
          </div>

          {/* Identity Footer (Desktop) */}
          <div
            className="hidden lg:flex flex-col p-6 absolute bottom-0 w-full z-20 border-t bg-[#0a0a2e] border-[#B9B8EB]/5"
          >
            <h2
              className="text-3xl font-[family-name:var(--font-heading)] font-bold leading-tight mb-1 text-white"
            >
              {data.name}
            </h2>
            <p
              className="text-sm font-medium text-[#B9B8EB]/70"
            >
              {data.role}
            </p>

            <div className="flex gap-3 mt-6">
              {data.socials.map((social, idx) => {
                const Icon = socialIcons[social.platform] || Globe;
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackOutboundLink(
                        social.url,
                        `${data.name} - ${social.platform}`
                      )
                    }
                    className="transition-colors duration-300 text-[#B9B8EB]/40 hover:text-white"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMN 2: Value & Authority */}
        <div className="flex-1 flex flex-col relative">
          {/* Subtle texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* SECTION A: The Collaboration */}
          <div
            className="p-6 md:p-8 lg:p-10 border-b bg-[#1b1a64]/50 border-[#B9B8EB]/5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="h-px w-8"
                style={{ background: data.accentColor }}
              />
              <span
                className="text-xs font-mono uppercase tracking-widest"
                style={{ color: data.accentColor }}
              >
                Alianza Estratégica / {data.collaboration.tag}
              </span>
            </div>

            <div className="space-y-4 max-w-2xl">
              <h3
                className="text-2xl md:text-3xl font-bold transition-colors duration-300 text-white/90 group-hover:text-white"
              >
                {data.collaboration.title}
              </h3>
              <p
                className="leading-relaxed text-[#B9B8EB]/70"
              >
                {data.collaboration.description}
              </p>
              {data.collaboration.linkText && (
                <div className="flex items-center gap-3 pt-2">
                  <div
                    className="h-px w-5"
                    style={{ background: `${data.accentColor}60` }}
                  />
                  {data.collaboration.linkUrl !== "#" ? (
                    <a
                      href={data.collaboration.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackOutboundLink(
                          data.collaboration.linkUrl,
                          `${data.name} - collaboration`
                        )
                      }
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest hover:opacity-100 transition-opacity duration-300"
                      style={{ color: `${data.accentColor}cc` }}
                    >
                      {data.collaboration.linkText}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span
                      className="text-xs font-mono uppercase tracking-widest"
                      style={{ color: `${data.accentColor}cc` }}
                    >
                      {data.collaboration.linkText}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* SECTION B: Authority Signals */}
          <div
            className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-[#1b1a64]"
          >
            <h4
              className="text-xs font-mono uppercase tracking-widest mb-6 flex items-center gap-2 text-[#B9B8EB]/50"
            >
              <ShieldCheck className="w-4 h-4" />
              Credenciales destacadas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {data.credentials.map((cred, idx) => (
                <div key={idx} className="flex items-start gap-3 group/item">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 transition-colors duration-300"
                    style={{
                      background: `${data.accentColor}80`,
                    }}
                  />
                  <span
                    className="text-sm transition-colors duration-300 text-[#B9B8EB]/80 group-hover/item:text-white"
                  >
                    {cred}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION C: Stats Ticker */}
          <div
            className="mt-auto border-t p-4 md:px-8 border-[#B9B8EB]/5 bg-[#0a0a2e]/50"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <span
                    className="text-[10px] font-mono uppercase tracking-wider mb-1 text-[#B9B8EB]/40 flex items-center gap-1.5"
                  >
                    {stat.icon && <span className="text-[#B9B8EB]/30">{stat.icon}</span>}
                    {stat.label}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-lg font-bold font-mono text-white/90"
                    >
                      {stat.value}
                    </span>
                    {stat.subValue && (
                      <span
                        className="text-[10px] font-mono"
                        style={{ color: data.accentColor }}
                      >
                        {stat.subValue}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
