/** Single source of truth for canonical URLs and site-wide SEO copy. */

export const siteConfig = {
    name: "Daniel Udechukwu",
    jobTitle: "Full-Stack Engineer",
    url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://danielu.dev").replace(
        /\/$/,
        "",
    ),
    locale: "en_US",
    description:
        "Full-stack engineer in Abuja, Nigeria, building fast, accessible web applications with React, Next.js and TypeScript. See selected projects, technical skills and work history.",
    shortDescription:
        "Full-stack engineer building fast, accessible web applications with React, Next.js and TypeScript.",
    location: {
        city: "Abuja",
        country: "Nigeria",
        countryCode: "NG",
    },
    ogImage: "/opengraph-image",
} as const;

/**
 * A page that declares its own `openGraph` replaces the parent's object
 * wholesale, which drops the file-convention image. Spread this into every such
 * override so each page keeps a social card.
 */
export const ogImages = [
    {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.jobTitle}`,
    },
];

export const absoluteUrl = (path = "/") =>
    `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
