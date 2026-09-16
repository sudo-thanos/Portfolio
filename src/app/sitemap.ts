import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/api";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const projects = await getProjects();

    // Most recent project edit is the best available proxy for "the projects
    // page changed", which is what tells Google to recrawl it.
    const latestProject = projects
        .map((p) => new Date(p.created_at))
        .filter((d) => !Number.isNaN(d.getTime()))
        .sort((a, b) => b.getTime() - a.getTime())[0];

    const now = new Date();

    return [
        {
            url: absoluteUrl("/"),
            lastModified: now,
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: absoluteUrl("/projects"),
            lastModified: latestProject ?? now,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: absoluteUrl("/resume"),
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: absoluteUrl("/contact"),
            lastModified: now,
            changeFrequency: "yearly",
            priority: 0.5,
        },
    ];
}
