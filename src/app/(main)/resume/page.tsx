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
    {
        id: 1,
        skill: "Next.js",
        iconUrl: "/icons/nextjs.svg",
        slug: "nextjs",
    },
    {
        id: 2,
        skill: "React",
        iconUrl: "/icons/react.svg",
        slug: "react",
    },
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
    {
        id: 7,
        skill: "Git",
        iconUrl: "/icons/git.svg",
        slug: "git",
    },
    {
        id: 8,
        skill: "GitHub",
        iconUrl: "/icons/github.svg",
        slug: "github",
    },
    {
        id: 9,
        skill: "Markdown",
        iconUrl: "/icons/markdown.svg",
        slug: "markdown",
    },
    {
        id: 10,
        skill: "Linux",
        iconUrl: "/icons/linux.svg",
        slug: "linux",
    },
];

export default function Resume() {
    return (
        <>
            <section className="w-full max-w-[60rem] pb-12 sm:pb-16 md:pb-[4rem] text-base sm:text-lg md:text-[1.5rem] mx-auto px-4 sm:px-6 md:px-0">
                {/* Introduction Section */}
                <div className="w-full md:w-[90%] mt-[4rem]">
                    <h2 className="text-3xl sm:text-3xl md:text-[2.5rem] font-bold leading-tight">
                        My Resume/CV
                    </h2>
                    <p className="mt-4 md:mt-[1rem] leading-relaxed sm:leading-relaxed md:leading-normal text-base sm:text-base md:text-[1.5rem]">
                        {/* eslint-disable-next-line */}
                        I'm a dedicated full-stack engineer with 3 years of
                        professional experience developing innovative web
                        {/* eslint-disable-next-line */}
                        applications. I'm constantly expanding my skill set and
                        love tackling challenging projects. Discover my
                        {/* eslint-disable-next-line */}
                        technical expertise and the work I've delivered for
                        clients and teams.
                    </p>
                    <SquigglyLine />
                </div>

                {/* Skills Section */}
                <div className="w-full md:w-[90%]">
                    <h2 className="text-3xl sm:text-3xl md:text-[2.5rem] font-bold mt-8 sm:mt-12 md:mt-[4rem] leading-tight">
                        Skills
                    </h2>
                    <p className="text-base sm:text-base md:text-[1.5rem] leading-relaxed sm:leading-relaxed md:leading-normal">
                        Here are the frameworks, libraries, services and
                        runtimes I have experience with. This is not a complete
                        {/* eslint-disable-next-line */}
                        list! I'm constantly gaining new skills, and hence it
                        can be a little bit outdated.
                    </p>

                    {/* Skills Grid */}
                    <ul className="mt-6 sm:mt-8 md:mt-[3rem] grid grid-cols-3 md:grid-cols-4 lg:flex items-center flex-wrap gap-3 sm:gap-4 md:gap-[1rem]">
                        {skills.map((skills) => {
                            const { id, skill, iconUrl, slug } = skills;
                            return (
                                <li
                                    key={id}
                                    className="flex items-center gap-2 sm:gap-3 md:gap-[.8rem] text-sm sm:text-base md:text-[1rem] font-medium p-2 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <Image
                                        src={iconUrl}
                                        width={24}
                                        height={24}
                                        alt={`${slug} Image`}
                                        className="w-5 h-5 sm:w-6 sm:h-6 md:w-[2rem] md:h-[2rem] flex-shrink-0"
                                    />
                                    <span className="truncate">{skill}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Work History Section */}
                <div className="mt-8 sm:mt-12 md:mt-[3rem]">
                    <WorkHistory />
                </div>
            </section>
        </>
    );
}
