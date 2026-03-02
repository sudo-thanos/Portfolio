import type { NextConfig } from "next";

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ehulysecnfbmcxgjinsp.supabase.co",
            },
        ],
    },
};

export default nextConfig;
