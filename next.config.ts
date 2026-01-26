import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/img/**",
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

export default nextConfig;
