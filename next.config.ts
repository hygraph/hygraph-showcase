import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.hygraph.com',
      },
      {
        protocol: 'https',
        hostname: 'eu-central-1-staging.cdn.hygraph.com',
      },
      {
        protocol: 'https',
        hostname: '**.graphassets.com',
      },
    ],
  },
  // Enable static exports for better performance
  output: 'standalone',
};

export default nextConfig;
