/**
 * One titled group of projects — the carousel on mobile, a two-column grid on
 * desktop. A Server Component, so the cards themselves are in the HTML; only
 * the carousel's controls hydrate.
 */

import ProjectCard from "./ProjectCard";
import ProjectsCarousel from "./ProjectsCarousel";
import type { Project } from "@/lib/types";

export default function ProjectSection({
    id,
    heading,
    blurb,
    projects,
    /**
     * "panel" is the tabbed layout: the tab itself is the visible heading and
     * carries the count, so repeating both here would just be noise. The h2
     * stays in the markup for document structure and search results — only its
     * presentation changes.
     */
    variant = "standalone",
}: {
    id: string;
    heading: string;
    blurb: string;
    projects: Project[];
    variant?: "standalone" | "panel";
}) {
    const headingId = `${id}-projects`;
    const inPanel = variant === "panel";

    return (
        <section aria-labelledby={headingId}>
            <div className="mb-8">
                <div className="flex items-baseline gap-3">
                    <h2
                        id={headingId}
                        className={
                            inPanel
                                ? "sr-only"
                                : "text-xl sm:text-2xl font-bold tracking-tight"
                        }
                    >
                        {heading}
                    </h2>
                    {!inPanel && (
                        <span className="text-[11px] tracking-widest uppercase text-[#E8B84B]/50 tabular-nums">
                            {projects.length}
                        </span>
                    )}
                </div>
                <p
                    className={`text-sm text-white/40 max-w-xl leading-relaxed ${
                        inPanel ? "" : "mt-2"
                    }`}
                >
                    {blurb}
                </p>
            </div>

            <ProjectsCarousel projects={projects} />

            {/* Desktop Grid — 2 cols, generous gap */}
            <div className="hidden md:grid grid-cols-2 gap-6 lg:gap-8">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </section>
    );
}
