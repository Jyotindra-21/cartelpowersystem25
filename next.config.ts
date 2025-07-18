import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
        pathname: "/**", // Add this to allow all paths from this host
      },
    ],
  },
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizeCss: false,
    // Add these for better Vercel compatibility
    optimizePackageImports: ["lightningcss"],
    serverComponentsExternalPackages: ["lightningcss", "@vercel/og"],
  },
  // Enhanced webpack configuration
  // Update webpack config:
  webpack: (config) => {
    config.externals = config.externals || {};
    config.externals["lightningcss"] = "lightningcss";
    return config;
  },
  // Vercel-specific optimizations
  compress: true,
  productionBrowserSourceMaps: false, // Disable for faster builds
};

export default nextConfig;
