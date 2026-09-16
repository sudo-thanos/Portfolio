"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { usePanelVisible } from "./ProjectsTabs";
import type { Project } from "@/lib/types";

/**
 * Mobile-only carousel. Projects arrive as props from the server, so the cards
 * are present in the server-rendered HTML — the interactivity is progressive.
 */
export default function ProjectsCarousel({ projects }: { projects: Project[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        containScroll: "trimSnaps",
    });
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback(
        (index: number) => emblaApi?.scrollTo(index),
        [emblaApi],
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    // A carousel inside an inactive tab panel is display:none, so embla measures
    // every slide as zero-width and the arrows and dots come out wrong. Re-measure
    // the moment the panel is shown. Outside a tabbed page this is always true
    // and the effect is a no-op after the first run.
    const visible = usePanelVisible();
    useEffect(() => {
        if (visible) emblaApi?.reInit();
    }, [visible, emblaApi]);

    return (
        <div className="block md:hidden">
            <div className="embla overflow-hidden" ref={emblaRef}>
                <div className="embla__container flex gap-4">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="embla__slide flex-[0_0_88%] min-w-0"
                        >
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-center mt-8 gap-5">
                <button
                    onClick={scrollPrev}
                    disabled={!canScrollPrev}
                    aria-label="Previous project"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center border border-[#E8B84B]/20 hover:border-[#E8B84B]/50 disabled:opacity-20 transition-all"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-[#E8B84B]">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="flex gap-2">
                    {projects.map((project, index) => (
                        <button
                            key={project.id}
                            onClick={() => scrollTo(index)}
                            aria-label={`Go to ${project.title}`}
                            aria-current={index === selectedIndex}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                index === selectedIndex
                                    ? "bg-[#E8B84B] w-6"
                                    : "bg-white/20 w-1.5"
                            }`}
                        />
                    ))}
                </div>

                <button
                    onClick={scrollNext}
                    disabled={!canScrollNext}
                    aria-label="Next project"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center border border-[#E8B84B]/20 hover:border-[#E8B84B]/50 disabled:opacity-20 transition-all"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-[#E8B84B]">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
