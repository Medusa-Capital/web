import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

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
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        // SPA fallback for the Figma Vite app root
        {
          source: '/figma',
          destination: '/figma/index.html',
        },
        // SPA fallback for the Figma Vite app sub-routes (excluding assets)
        {
          source: '/figma/:path((?!assets/).*)',
          destination: '/figma/index.html',
        },
      ],
    };
  },
};

export default withAnalyzer(nextConfig);
