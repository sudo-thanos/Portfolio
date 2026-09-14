import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";

export default function ProjectCard({ project }: { project: Project }) {
    const {
        title,
        description,
        tech_stack,
        tag,
        live_url,
        thumbnail_url,
    } = project;

    return (
        <article className="group bg-[#0F0D2A] border border-[#E8B84B]/10 hover:border-[#E8B84B]/30 transition-all duration-300 flex flex-col h-full">
            {/* Image */}
            <div className="relative w-full overflow-hidden">
                {thumbnail_url ? (
                    <Image
                        src={thumbnail_url}
                        width={1448}
                        height={1448}
                        alt={`Screenshot of the ${title} project`}
                        className="h-52 sm:h-60 md:h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="h-52 sm:h-60 md:h-64 w-full bg-white/5" />
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0F0D2A]/80 via-transparent to-transparent" />

                {/* Category + Link */}
                <div className="absolute top-4 flex w-full items-center justify-between px-5">
                    <span className="text-[10px] tracking-widest uppercase px-3 py-1 bg-[#E8B84B]/10 text-[#E8B84B] border border-[#E8B84B]/25">
                        {tag}
                    </span>
                    {live_url && (
                        <Link
                            href={live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open the live ${title} site in a new tab`}
                            className="flex h-8 w-8 items-center justify-center border border-white/15 bg-black/40 hover:border-[#E8B84B]/50 hover:bg-[#E8B84B]/10 transition-all duration-300 backdrop-blur-sm"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                                className="text-white/60 group-hover:text-[#E8B84B] transition-colors"
                            >
                                <path
                                    d="M7 17L17 7M17 7H9M17 7V15"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </Link>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 px-6 py-6 space-y-5">
                <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
                    {title}
                </h2>

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
                    <ul className="flex flex-wrap gap-2">
                        {tech_stack.map((tech) => (
                            <li
                                key={tech}
                                className="text-[10px] px-2.5 py-1 bg-white/5 text-white/45 border border-white/8 tracking-wider"
                            >
                                {tech}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Visit link */}
                {live_url && (
                    <div className="pt-2 mt-auto">
                        <Link
                            href={live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#E8B84B]/60 hover:text-[#E8B84B] transition-colors group/link"
                        >
                            View Project
                            <span aria-hidden="true" className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform inline-block">
                                ↗
                            </span>
                        </Link>
                    </div>
                )}
            </div>
        </article>
    );
}
