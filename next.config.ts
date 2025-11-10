import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/doctoc-main.appspot.com/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      
    },
  },
};

export default nextConfig;
