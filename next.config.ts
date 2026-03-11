import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
   async headers() {
    return [
      {
        source: "/favicon.ico",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ]
  },
};

export default nextConfig;
