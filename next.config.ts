import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Accept all HTTPS domains
      },
      {
        protocol: 'http',
        hostname: '**', // Accept all HTTP domains (for development)
      }
    ]
  }
};

export default nextConfig;
