/**
 * Structured data. This is what lets Google render a knowledge-panel-style
 * result for a person rather than a plain blue link, and it only works if the
 * JSON is in the server-rendered HTML — hence a Server Component.
 */

import type { Project, SocialLink, Skill, WorkHistoryEntry } from "@/lib/types";
import { absoluteUrl, siteConfig } from "@/lib/site";

function Script({ data }: { data: Record<string, unknown> }) {
    return (
        <script
            type="application/ld+json"
            // Content is our own API data, not user input.
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

export function PersonJsonLd({
    socialLinks = [],
    skills = [],
    workHistory = [],
}: {
    socialLinks?: SocialLink[];
    skills?: Skill[];
    workHistory?: WorkHistoryEntry[];
}) {
    return (
        <Script
            data={{
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": absoluteUrl("/#person"),
                name: siteConfig.name,
                url: siteConfig.url,
                jobTitle: siteConfig.jobTitle,
                description: siteConfig.shortDescription,
                address: {
                    "@type": "PostalAddress",
                    addressLocality: siteConfig.location.city,
                    addressCountry: siteConfig.location.countryCode,
                },
                knowsAbout: skills.map((s) => s.name),
                sameAs: socialLinks.map((l) => l.url),
                worksFor: workHistory.slice(0, 1).map((w) => ({
                    "@type": "Organization",
                    name: w.company,
                })),
                hasOccupation: workHistory.map((w) => ({
                    "@type": "Occupation",
                    name: w.role,
                    occupationLocation: {
                        "@type": "Place",
                        name: w.location || siteConfig.location.city,
                    },
                })),
            }}
        />
    );
}

export function WebSiteJsonLd() {
    return (
        <Script
            data={{
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": absoluteUrl("/#website"),
                url: siteConfig.url,
                name: siteConfig.name,
                description: siteConfig.description,
                inLanguage: "en",
                publisher: { "@id": absoluteUrl("/#person") },
            }}
        />
    );
}

export function ProjectsJsonLd({ projects }: { projects: Project[] }) {
    return (
        <Script
            data={{
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "@id": absoluteUrl("/projects#collection"),
                url: absoluteUrl("/projects"),
                name: `Projects by ${siteConfig.name}`,
                isPartOf: { "@id": absoluteUrl("/#website") },
                mainEntity: {
                    "@type": "ItemList",
                    numberOfItems: projects.length,
                    itemListElement: projects.map((project, index) => ({
                        "@type": "ListItem",
                        position: index + 1,
                        item: {
                            "@type": "CreativeWork",
                            name: project.title,
                            description: project.description,
                            url: project.live_url || undefined,
                            image: project.thumbnail_url || undefined,
                            keywords: project.tech_stack.join(", "),
                            author: { "@id": absoluteUrl("/#person") },
                        },
                    })),
                },
            }}
        />
    );
}

export function BreadcrumbJsonLd({
    items,
}: {
    items: { name: string; path: string }[];
}) {
    return (
        <Script
            data={{
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: items.map((item, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: item.name,
                    item: absoluteUrl(item.path),
                })),
            }}
        />
    );
}
