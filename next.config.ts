import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const isDev = process.env.NODE_ENV === "development";

// Content-Security-Policy: split by environment so dev hot-reload and Vercel
// preview URLs don't bleed into production headers.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.whop.com https://cdn.whop.com",
  isDev
    ? "connect-src 'self' https://api.whop.com *.sentry.io https://vercel.live https://vitals.vercel-insights.com ws://localhost:*"
    : "connect-src 'self' https://api.whop.com *.sentry.io",
  "frame-ancestors 'none'",
]
  .filter(Boolean)
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/img/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "www.strategy.com",
      },
      {
        protocol: "https",
        hostname: "s2.coinmarketcap.com",
      },
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // SPA fallback for the Figma Vite app root
        {
          source: "/figma",
          destination: "/figma/index.html",
        },
        // SPA fallback for the Figma Vite app sub-routes (excluding assets)
        {
          source: "/figma/:path((?!assets/).*)",
          destination: "/figma/index.html",
        },
      ],
    };
  },
};

export default withAnalyzer(nextConfig);
