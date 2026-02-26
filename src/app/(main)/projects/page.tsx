"use client";
/**
 * Project page
 */

import { SquigglyLine } from "@/components/SquigglyLine";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

interface ProjectTypes {
    id: number;
    name: string;
    image: string;
    category: string;
    description: string;
    technologies: string[];
    projectUrl: string;
}

export default function Projects() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        containScroll: "trimSnaps",
    });
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const projects: ProjectTypes[] = [
        {
            id: 1,
            name: "Klancy Design Essentials",
            image: "/images/project3.png",
            category: "E-Commerce",
            description:
                "A modern e-commerce platform designed for hair beauty essentials. Features high-quality product galleries, detailed specifications, customer reviews, and an intuitive shopping experience that helps customers make confident purchasing decisions, and a fully working dashboard to manage the website.",
            technologies: ["Next.js", "TailwindCSS", "Python"],
            projectUrl: "https://klancy.netlify.app",
        },
        {
            id: 2,
            name: "AsteriskRD Website",
            image: "/images/project1.png",
            category: "Web-App",
            description:
                "An AI-powered analytics dashboard that delivers real-time insights from complex data streams. Features intelligent data prioritization, custom visualization widgets, and predictive analytics that adapt to user behavior patterns for enhanced decision-making.",
            technologies: ["Next.js", "TailwindCSS", "Real-time", "Data Viz"],
            projectUrl: "https://asteriskrd.tech",
        },
        {
            id: 3,
            name: "Avantlush",
            image: "/images/project2.png",
            category: "E-commerce",
            description:
                "A modern e-commerce platform designed specifically for furniture retail. Features high-quality product galleries, detailed specifications, customer reviews, and an intuitive shopping experience that helps customers make confident purchasing decisions.",
            technologies: ["ReactJS", "TailwindCSS", "E-Commerce"],
            projectUrl: "#",
        },
    ];

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
        [emblaApi]
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

    const ProjectCard = ({ project }: { project: ProjectTypes }) => {
        const {
            id,
            name,
            category,
            image,
            description,
            technologies,
            projectUrl,
        } = project;

        return (
            <div
                key={id}
                className="inter CARD group hover:scale-99 duration-500 transition-transform flex h-full flex-col rounded-[0.75rem] border-2 border-[#FFFFFF]/10"
            >
                <div className="relative w-full rounded-[0.75rem]">
                    <Image
                        src={image}
                        width={1448}
                        height={1448}
                        alt={`${name} project`}
                        className="h-48 sm:h-56 md:h-[16rem] w-full rounded-t-[0.75rem] object-cover"
                    />

                    <div className="absolute top-3 sm:top-[0.813rem] flex w-full items-center justify-between px-4 sm:px-[1.1rem]">
                        <p className="flex h-6 sm:h-[1.7rem] items-center rounded-full border-2 border-[#3C83F6]/60 bg-[#3C83F6]/20 px-2 sm:px-[0.7rem] text-xs sm:text-[0.75rem] font-bold text-[#3C83F6]">
                            {category}
                        </p>

                        <Link
                            href={projectUrl}
                            className="flex h-8 sm:h-[2.188rem] group-hover:border-[#F59E0B] transition-all ease-in-out duration-500 w-8 sm:w-[2.188rem] items-center justify-center rounded-full border-2 border-[#3C83F6]/60 bg-[#3C83F6]/20"
                        >
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 64 64"
                                fill="none"
                                className="h-4 sm:h-[1.3rem] text-[#477EEE] group-hover:text-[#F59E0B] transition-all ease-in-out duration-500 w-4 sm:w-[1.3rem]"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M20 44L44 20M44 20H24M44 20V40"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>

                <div className="h-full rounded-b-[0.75rem] bg-[#06031B] px-4 sm:px-5 md:px-[1.3rem] py-4 sm:py-5 md:py-[1.3rem] text-left">
                    <h3 className="text-lg sm:text-xl md:text-[1.5rem] font-bold">
                        {name}
                    </h3>

                    <div className="mt-4 sm:mt-5 md:mt-[1.5rem] space-y-3 sm:space-y-4 md:space-y-[1rem]">
                        <div>
                            <h3 className="text-xs sm:text-sm md:text-[0.875rem] font-bold text-[#60E6FB] uppercase">
                                Description
                            </h3>
                            <p className="mt-2 md:mt-[0.5rem] text-sm sm:text-base md:text-[0.938rem] font-normal text-[#A1A1AA] leading-relaxed">
                                {description}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xs sm:text-sm md:text-[0.875rem] font-bold text-[#BF83FC] uppercase">
                                Project Stack
                            </h3>
                            <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-2 md:gap-[.3rem]">
                                {technologies.map((tech, index) => {
                                    return (
                                        <p
                                            key={index}
                                            className="flex h-6 sm:h-[1.7rem] items-center rounded-full border-2 border-[#27272A]/50 bg-[#27272A]/20 px-2 sm:px-[0.7rem] text-xs sm:text-[0.75rem] font-bold text-[#A1A1AA]"
                                        >
                                            {tech}
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <section className="w-full text-base sm:text-lg md:text-[1.3rem] max-w-[60rem] mt-12 sm:mt-16 md:mt-[8rem] pb-12 sm:pb-16 md:pb-[4rem] mx-auto px-4 sm:px-6 md:px-0">
                <div className="w-full md:w-[90%]">
                    <h1 className="text-2xl sm:text-3xl md:text-[2.5rem] font-bold leading-tight">
                        My Projects
                    </h1>
                    <h3 className="text-sm sm:text-base md:text-[1.3rem] mt-4 md:mt-[1rem] leading-relaxed">
                        A collection of Web applications and development
                        projects showcasing my expertise in the React ecosystem.
                    </h3>
                    <SquigglyLine />

                    {/* Mobile Carousel */}
                    <div className="block md:hidden mt-6 sm:mt-8">
                        <div className="embla overflow-hidden" ref={emblaRef}>
                            <div className="embla__container flex">
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="embla__slide flex-[0_0_100%] min-w-0 px-2"
                                    >
                                        <ProjectCard project={project} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Carousel Controls */}
                        <div className="flex items-center justify-center mt-6 gap-4">
                            <button
                                onClick={scrollPrev}
                                disabled={!canScrollPrev}
                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-[#3C83F6]/60 bg-[#3C83F6]/20 disabled:opacity-30 transition-all"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="text-[#477EEE]"
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

                            {/* Dots */}
                            <div className="flex gap-2">
                                {projects.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => scrollTo(index)}
                                        className={`h-2 w-2 rounded-full transition-all ${
                                            index === selectedIndex
                                                ? "bg-[#F59E0B] w-4"
                                                : "bg-[#A1A1AA]/40"
                                        }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={scrollNext}
                                disabled={!canScrollNext}
                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-[#3C83F6]/60 bg-[#3C83F6]/20 disabled:opacity-30 transition-all"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="text-[#477EEE]"
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

                    {/* Desktop Grid */}
                    <div className="hidden md:grid grid-cols-2 gap-8 md:gap-[2rem] mt-8 md:mt-[4rem]">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
