import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb", // 5MB ছবির জন্য সামান্য হেডরুমসহ
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Accept all HTTPS domains
      },
      {
        protocol: "http",
        hostname: "**", // Accept all HTTP domains (for development)
      },
    ],
  },
};

export default nextConfig;
