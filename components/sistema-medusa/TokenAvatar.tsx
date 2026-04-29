"use client";

import { useState } from "react";

interface TokenAvatarProps {
  ticker: string;
  logoUrl?: string;
  brandColor: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZE_CLASS: Record<NonNullable<TokenAvatarProps["size"]>, string> = {
  sm: "h-9 w-9 text-[12px]",
  md: "h-12 w-12 text-[14px]",
  lg: "h-[60px] w-[60px] text-[18px]",
  xl: "h-[88px] w-[88px] text-[26px]",
};

export function TokenAvatar({
  ticker,
  logoUrl,
  brandColor,
  size = "md",
}: TokenAvatarProps) {
  const [errored, setErrored] = useState(false);
  const showImage = Boolean(logoUrl) && !errored;
  const initials = ticker.slice(0, 2).toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${SIZE_CLASS[size]}`}
      style={{
        // Soft brand-tinted disk so transparent logos remain visible on dark bg
        backgroundColor: showImage ? `${brandColor}1f` : brandColor,
        boxShadow: `inset 0 0 0 1px ${brandColor}40, 0 10px 30px -10px ${brandColor}66`,
      }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt=""
          className="h-[78%] w-[78%] object-contain"
          onError={() => setErrored(true)}
          loading="lazy"
        />
      ) : (
        <span
          className="font-mono font-bold text-white"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
        >
          {initials}
        </span>
      )}
    </span>
  );
}
