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
    unoptimized: false,
    minimumCacheTTL: 60, // Recommended minimum value
  },
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add these new configurations:
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = {
        ...config.externals,
        lightningcss: 'lightningcss'
      };
    }
    return config;
  },
};

export default nextConfig;