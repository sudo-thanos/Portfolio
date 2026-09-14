import type { NextConfig } from "next";

/**
 * Project thumbnails and CVs are served from Supabase Storage, so the allowed
 * image host is derived from the same env var the client connects with —
 * keeping the two from drifting apart. simpleicons serves the skill icons.
 */
function supabaseHostname(): string | null {
    const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!raw) return null;
    try {
        return new URL(raw.startsWith("http") ? raw : `https://${raw}`).hostname;
    } catch {
        return null;
    }
}

const host = supabaseHostname();

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            ...(host
                ? [
                      {
                          protocol: "https" as const,
                          hostname: host,
                          pathname: "/storage/v1/object/public/**",
                      },
                  ]
                : []),
            {
                protocol: "https" as const,
                hostname: "cdn.simpleicons.org",
            },
        ],
    },
};

export default nextConfig;
