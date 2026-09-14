import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                // Nothing here is secret, but these pages are useless in an
                // index and would dilute the site's crawl budget.
                disallow: ["/dashboard", "/dashboard/", "/login"],
            },
        ],
        sitemap: absoluteUrl("/sitemap.xml"),
        host: siteConfig.url,
    };
}
