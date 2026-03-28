import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "czkbxdqxzuvjbcbnoqer.supabase.co",
      },
    ],
  },
};

export default nextConfig;
