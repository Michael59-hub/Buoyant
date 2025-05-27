import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
  images: {
    domains: ['jcmfszwaxbdnnugiuwcs.supabase.co'],
  },
};

export default nextConfig;
