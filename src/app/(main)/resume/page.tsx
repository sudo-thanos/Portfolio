/**
 * Resume page
 */
import { SquigglyLine } from "@/components/SquigglyLine";
import WorkHistory from "@/components/WorkHistory";
import Image from "next/image";

interface Skill {
    id: number;
    skill: string;
    iconUrl: string;
    slug: string;
}

const skills: Skill[] = [
    { id: 1, skill: "Next.js", iconUrl: "/icons/nextjs.svg", slug: "nextjs" },
    { id: 2, skill: "React", iconUrl: "/icons/react.svg", slug: "react" },
    {
        id: 3,
        skill: "JavaScript",
        iconUrl: "/icons/javascript.svg",
        slug: "javascript",
    },
    {
        id: 4,
        skill: "TypeScript",
        iconUrl: "/icons/typescript.svg",
        slug: "typescript",
    },
    {
        id: 5,
        skill: "Tailwind CSS",
        iconUrl: "/icons/tailwindcss.svg",
        slug: "tailwindcss",
    },
    {
        id: 6,
        skill: "Bootstrap",
        iconUrl: "/icons/bootstrap.svg",
        slug: "bootstrap",
    },
    { id: 7, skill: "Git", iconUrl: "/icons/git.svg", slug: "git" },
    { id: 8, skill: "GitHub", iconUrl: "/icons/github.svg", slug: "github" },
    {
        id: 9,
        skill: "Markdown",
        iconUrl: "/icons/markdown.svg",
        slug: "markdown",
    },
    { id: 10, skill: "Linux", iconUrl: "/icons/linux.svg", slug: "linux" },
];

export default function Resume() {
    return (
        <section className="w-full text-white max-w-6xl mt-16 md:mt-24 pb-16 md:pb-24 mx-auto px-4 sm:px-6 md:px-8">
            {/* Header */}
            <div className="border-b border-[#E8B84B]/10 pb-8 mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                    My Resume / CV
                </h1>
                <p className="text-md text-white/50 mt-3 max-w-2xl leading-relaxed">
                    I&apos;m a dedicated full-stack engineer with 3 years of
                    professional experience developing innovative web
                    applications. I&apos;m constantly expanding my skill set and
                    love tackling challenging projects.
                </p>
                <SquigglyLine />
            </div>

            {/* Skills Section */}
            <div className="mb-16">
                {/* Section label */}
                <div className="flex items-center gap-4 mb-8">
                    <p className="text-md tracking-widest uppercase text-[#E8B84B]/60">
                        Technical Skills
                    </p>
                    <div className="flex-1 h-px bg-[#E8B84B]/10" />
                </div>

                <p className="text-md text-white/50 mb-8 max-w-2xl leading-relaxed">
                    Frameworks, libraries, services and runtimes I have
                    experience with. Constantly gaining new skills so this list
                    may be slightly outdated.
                </p>

                {/* Skills Grid */}
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {skills.map(({ id, skill, iconUrl, slug }) => (
                        <li
                            key={id}
                            className="flex items-center gap-3 px-4 py-3 bg-[#0F0D2A] border border-[#E8B84B]/10 hover:border-[#E8B84B]/30 transition-all duration-200 group"
                        >
                            <Image
                                src={iconUrl}
                                width={20}
                                height={20}
                                alt={`${slug} icon`}
                                className="w-5 h-5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                            <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors tracking-wide truncate">
                                {skill}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Work History Section */}
            <div>
                <div className="flex items-center gap-4 mb-8">
                    <p className="text-md tracking-widest uppercase text-[#E8B84B]/60">
                        Work History
                    </p>
                    <div className="flex-1 h-px bg-[#E8B84B]/10" />
                </div>

                <WorkHistory />
            </div>
        </section>
    );
}
