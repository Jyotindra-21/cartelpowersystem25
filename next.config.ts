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
  // Remove experimental.optimizeCss completely
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add these new configurations:
  webpack: (config) => {
    // Exclude lightningcss from being processed
    config.externals = config.externals || {};
    config.externals['lightningcss'] = 'lightningcss';
    return config;
  },
  // Enable SWC minification (alternative to lightningcss)
  swcMinify: true,
};

export default nextConfig;