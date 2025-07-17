import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
    ],
    unoptimized: false, // Keep as false if you want optimized images
    minimumCacheTTL: 0, // Set to 0 to disable cache
  },
  output: "standalone",
  experimental: {
    optimizeCss: process.env.VERCEL ? false : true, // Disable on Vercel
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
