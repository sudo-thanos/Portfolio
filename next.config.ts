import type { NextConfig } from "next";

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ehulysecnfbmcxgjinsp.supabase.co",
            },
            {
                protocol: "https",
                hostname: "cdn.simpleicons.org",
            },
        ],
    },
};

export default nextConfig;
