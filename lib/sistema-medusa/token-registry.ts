// Token brand registry — per-ticker metadata for visual treatment.
//
// Manually curated. Add a new entry when publishing a new token analysis.
// `logo_url` should point to a small, square, transparent-PNG-friendly source
// (CoinGecko 'standard' size works well — ~256px). Native <img> is used so no
// next.config.ts remotePatterns update is required.
//
// `brand_color` is the project's signature color (used for ambient glows,
// avatar fallback background, and accent strips). Verdict colors (emerald /
// amber / red) are *not* overridden — they continue to signal semantic
// status (passed / mixed / failed) on badges and the scorecard.

export interface TokenBrand {
  name: string;
  logo_url?: string;
  brand_color: string; // hex, used for glows and accents
}

const REGISTRY: Record<string, TokenBrand> = {
  AERO: {
    name: "Aerodrome",
    // Drop the file at apps/website/public/img/tokens/aero.png (or .svg/.webp).
    logo_url: "/img/tokens/aero.png",
    brand_color: "#E63946",
  },
  HYPE: {
    name: "Hyperliquid",
    logo_url: "/img/tokens/hype.png",
    brand_color: "#50D2C1",
  },
  META: {
    name: "MetaDAO",
    logo_url: "/img/tokens/meta.png",
    brand_color: "#DC2626",
  },
  MORPHO: {
    name: "Morpho",
    logo_url: "/img/tokens/morpho.png",
    brand_color: "#2470FF",
  },
  SYRUP: {
    name: "Maple Finance",
    logo_url: "/img/tokens/syrup.png",
    brand_color: "#F2783A",
  },
};

const DEFAULT_BRAND: TokenBrand = {
  name: "",
  brand_color: "#6366f1",
};

export function getTokenBrand(ticker: string): TokenBrand {
  return REGISTRY[ticker.toUpperCase()] ?? DEFAULT_BRAND;
}
