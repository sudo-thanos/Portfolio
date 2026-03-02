/**
 * Project page
 */

"use client";

import { SquigglyLine } from "@/components/SquigglyLine";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Project {
    id: string;
    title: string;
    description: string;
    tech_stack: string[];
    tag: string;
    live_url: string;
    repo_url: string;
    featured: boolean;
    thumbnail_url: string;
}

export default function Projects() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        containScroll: "trimSnaps",
    });
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [projects, setProjects] = useState<Project[]>([]);

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("sort_order", { ascending: true });

        if (error) throw new Error(error.message);

        console.log(data);

        setProjects(data);
    };

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback(
        (index: number) => {
            if (emblaApi) emblaApi.scrollTo(index);
        },
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

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <section className="w-full text-white max-w-6xl mt-16 md:mt-24 pb-16 md:pb-24 mx-auto px-4 sm:px-6 md:px-8">
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

            {/* Mobile Carousel */}
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

                {/* Carousel Controls */}
                <div className="flex items-center justify-center mt-8 gap-5">
                    <button
                        onClick={scrollPrev}
                        disabled={!canScrollPrev}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center border border-[#E8B84B]/20 hover:border-[#E8B84B]/50 disabled:opacity-20 transition-all"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-[#E8B84B]"
                        >
                            <path
                                d="M15 18L9 12L15 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    <div className="flex gap-2">
                        {projects.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollTo(index)}
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
                        className="flex h-9 w-9 cursor-pointer items-center justify-center border border-[#E8B84B]/20 hover:border-[#E8B84B]/50 disabled:opacity-20 transition-all"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-[#E8B84B]"
                        >
                            <path
                                d="M9 18L15 12L9 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Desktop Grid — 2 cols, generous gap */}
            <div className="hidden md:grid grid-cols-2 gap-6 lg:gap-8">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </section>
    );
}

const ProjectCard = ({ project }: { project: Project }) => {
    // const { id, name, category, image, description, technologies, projectUrl } =
    //     project;

    const {
        id,
        title,
        description,
        tech_stack,
        tag,
        live_url,
        repo_url,
        featured,
        thumbnail_url,
    } = project;

    return (
        <div
            key={id}
            className="group bg-[#0F0D2A] border border-[#E8B84B]/10 hover:border-[#E8B84B]/30 transition-all duration-300 flex flex-col h-full"
        >
            {/* Image */}
            <div className="relative w-full overflow-hidden">
                <Image
                    src={thumbnail_url}
                    width={1448}
                    height={1448}
                    alt={`${title} project`}
                    className="h-52 sm:h-60 md:h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0F0D2A]/80 via-transparent to-transparent" />

                {/* Category + Link */}
                <div className="absolute top-4 flex w-full items-center justify-between px-5">
                    <span className="text-[10px] tracking-widest uppercase px-3 py-1 bg-[#E8B84B]/10 text-[#E8B84B] border border-[#E8B84B]/25">
                        {tag}
                    </span>
                    <Link
                        href={live_url}
                        target="_blank"
                        className="flex h-8 w-8 items-center justify-center border border-white/15 bg-black/40 hover:border-[#E8B84B]/50 hover:bg-[#E8B84B]/10 transition-all duration-300 backdrop-blur-sm"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-white/60 group-hover:text-[#E8B84B] transition-colors"
                        >
                            <path
                                d="M20 44L44 20M44 20H24M44 20V40"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M7 17L17 7M17 7H9M17 7V15"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 px-6 py-6 space-y-5">
                <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                    {title}
                </h3>

                {/* Description */}
                <div>
                    <p className="text-[10px] tracking-widest uppercase text-[#E8B84B]/50 mb-2">
                        Description
                    </p>
                    <p className="text-sm text-white/45 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Tech stack */}
                <div>
                    <p className="text-[10px] tracking-widest uppercase text-white/30 mb-2.5">
                        Stack
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {tech_stack.map((tech, index) => (
                            <span
                                key={index}
                                className="text-[10px] px-2.5 py-1 bg-white/5 text-white/45 border border-white/8 tracking-wider"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Visit link */}
                <div className="pt-2 mt-auto">
                    <Link
                        href={live_url}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#E8B84B]/60 hover:text-[#E8B84B] transition-colors group/link"
                    >
                        View Project
                        <span className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform inline-block">
                            ↗
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};
