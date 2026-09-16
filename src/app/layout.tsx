import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ogImages, siteConfig } from "@/lib/site";

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

export const metadata: Metadata = {
    // Makes every relative URL below (and in child pages) resolve to an
    // absolute one, which Open Graph and canonical tags both require.
    metadataBase: new URL(siteConfig.url),
    title: {
        default: `${siteConfig.name} — ${siteConfig.jobTitle}`,
        template: `%s — ${siteConfig.name}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    keywords: [
        "Daniel Udechukwu",
        "full-stack engineer",
        "software engineer Nigeria",
        "React developer",
        "Next.js developer",
        "TypeScript",
        "FastAPI",
        "web developer Abuja",
        "portfolio",
    ],
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: siteConfig.locale,
        url: siteConfig.url,
        siteName: siteConfig.name,
        title: `${siteConfig.name} — ${siteConfig.jobTitle}`,
        description: siteConfig.description,
        images: ogImages,
    },
    twitter: {
        card: "summary_large_image",
        title: `${siteConfig.name} — ${siteConfig.jobTitle}`,
        description: siteConfig.shortDescription,
        images: ogImages,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    category: "technology",
};

export const viewport: Viewport = {
    themeColor: "#0F0D2A",
    colorScheme: "dark",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                {/* Warm up the icon CDN used by the skills grid. */}
                <link rel="preconnect" href="https://cdn.simpleicons.org" />
            </head>
            <body
                className={`${spaceGrotesk.variable} space-grotesk background text-white min-h-dvh flex flex-col antialiased`}
            >
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[#0F0D2A] focus:text-white focus:px-4 focus:py-2 focus:border focus:border-[#E8B84B]"
                >
                    Skip to content
                </a>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
