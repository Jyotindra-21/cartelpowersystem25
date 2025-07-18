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
    serverComponentsExternalPackages: ["lightningcss"],
    externalDir: true,
  },
  // Enhanced webpack configuration
  webpack: (config, { isServer, webpack }) => {
    // Resolve path aliases (if you use them)
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };

    if (!isServer) {
      config.externals = {
        ...config.externals,
        lightningcss: "lightningcss",
        // Add other client-side only packages if needed
      };
    }

    // Important for Vercel builds
    config.module = {
      ...config.module,
      exprContextCritical: false,
    };

    return config;
  },
  // Vercel-specific optimizations
  compress: true,
  productionBrowserSourceMaps: false, // Disable for faster builds
};

export default nextConfig;
