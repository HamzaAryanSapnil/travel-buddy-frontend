import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents: true,
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
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
