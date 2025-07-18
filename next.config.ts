import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        // port: "", // Can be removed (empty string is default)
        pathname: "/**",
      },
    ],
  },
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizeCss: false,
  },
  transpilePackages: ["lightningcss"],
  webpack: (config, { isServer }) => {
    config.externals = config.externals || {};
    config.externals["lightningcss"] = "lightningcss";

    // Recommended safety checks:
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },
  compress: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
