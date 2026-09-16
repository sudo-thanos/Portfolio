/**
 * Projects page — a Server Component. The project list is fetched on the server
 * and rendered into the HTML, so crawlers see the actual content.
 *
 * Projects are shown in two sections, client and personal, because they answer
 * different questions: one is evidence of shipped production work, the other is
 * evidence of what I build unprompted.
 */

import type { Metadata } from "next";
import { SquigglyLine } from "@/components/SquigglyLine";
import ProjectSection from "@/components/ProjectSection";
import ProjectsTabs from "@/components/ProjectsTabs";
import { BreadcrumbJsonLd, ProjectsJsonLd } from "@/components/JsonLd";
import { getProjectsByType } from "@/lib/api";
import { PROJECT_TYPES, PROJECT_TYPE_META } from "@/lib/types";
import { ogImages } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
    title: "Projects",
    description:
        "Client and personal projects by Daniel Udechukwu — web applications built with React, Next.js, TypeScript and modern web tooling.",
    alternates: { canonical: "/projects" },
    openGraph: {
        title: "Projects — Daniel Udechukwu",
        description:
            "Client and personal projects built with React, Next.js and TypeScript.",
        url: "/projects",
        type: "website",
        images: ogImages,
    },
};

export default async function Projects() {
    const grouped = await getProjectsByType();
    const sections = PROJECT_TYPES.map((type) => ({
        type,
        meta: PROJECT_TYPE_META[type],
        projects: grouped[type],
    })).filter(({ projects }) => projects.length > 0);

    const all = sections.flatMap(({ projects }) => projects);

    return (
        <section className="w-full text-white max-w-6xl mt-16 md:mt-24 pb-16 md:pb-24 mx-auto px-4 sm:px-6 md:px-8">
            <ProjectsJsonLd projects={all} />
            <BreadcrumbJsonLd
                items={[
                    { name: "Home", path: "/" },
                    { name: "Projects", path: "/projects" },
                ]}
            />

            {/* Header */}
            <div className="border-b border-[#E8B84B]/10 pb-8 mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                    My Projects
                </h1>
                <p className="text-md text-white/50 mt-3 max-w-xl leading-relaxed">
                    A collection of web applications and development projects
                    showcasing my expertise in the React ecosystem.
                </p>
                <SquigglyLine />
            </div>

            {sections.length === 0 ? (
                <p className="text-white/40">
                    Projects are being updated — check back shortly.
                </p>
            ) : sections.length === 1 ? (
                // A tablist with one tab is just a label — show the section plain
                // until there is something to toggle to.
                <ProjectSection
                    id={sections[0].type}
                    heading={sections[0].meta.heading}
                    blurb={sections[0].meta.blurb}
                    projects={sections[0].projects}
                />
            ) : (
                <ProjectsTabs
                    tabs={sections.map(({ type, meta, projects }) => ({
                        id: type,
                        label: meta.label,
                        count: projects.length,
                    }))}
                    panels={sections.map(({ type, meta, projects }) => (
                        <ProjectSection
                            key={type}
                            id={type}
                            heading={meta.heading}
                            blurb={meta.blurb}
                            projects={projects}
                            variant="panel"
                        />
                    ))}
                />
            )}
        </section>
    );
}
