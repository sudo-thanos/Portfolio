/**
 * Resume page — a Server Component. Skills and work history render into the
 * HTML so they are indexable.
 */

import type { Metadata } from "next";
import { SquigglyLine } from "@/components/SquigglyLine";
import WorkHistory from "@/components/WorkHistory";
import { BreadcrumbJsonLd, PersonJsonLd } from "@/components/JsonLd";
import { getCurrentResume, getSkills, getSocialLinks, getWorkHistory } from "@/lib/api";
import { ogImages } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
    title: "Resume & Technical Skills",
    description:
        "The technical skills, frameworks and work history of Daniel Udechukwu, a full-stack engineer with 3 years of professional experience building web applications.",
    alternates: { canonical: "/resume" },
    openGraph: {
        title: "Resume & Technical Skills — Daniel Udechukwu",
        description:
            "Technical skills, frameworks and professional work history.",
        url: "/resume",
        type: "profile",
        images: ogImages,
    },
};

export default async function Resume() {
    const [skills, workHistory, socialLinks, resume] = await Promise.all([
        getSkills(),
        getWorkHistory(),
        getSocialLinks(),
        getCurrentResume(),
    ]);

    // The API returns ascending sort_order; the timeline shows newest first.
    const timeline = [...workHistory].sort((a, b) => b.sort_order - a.sort_order);

    return (
        <section className="w-full text-white max-w-6xl mt-16 md:mt-24 pb-16 md:pb-24 mx-auto px-4 sm:px-6 md:px-8">
            <PersonJsonLd
                skills={skills}
                socialLinks={socialLinks}
                workHistory={timeline}
            />
            <BreadcrumbJsonLd
                items={[
                    { name: "Home", path: "/" },
                    { name: "Resume", path: "/resume" },
                ]}
            />

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
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-md tracking-widest uppercase text-[#E8B84B]/60">
                        Technical Skills
                    </h2>
                    <div className="flex-1 h-px bg-[#E8B84B]/10" />
                </div>

                <p className="text-md text-white/50 mb-8 max-w-2xl leading-relaxed">
                    Frameworks, libraries, services and runtimes I have
                    experience with. Constantly gaining new skills so this list
                    may be slightly outdated.
                </p>

                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {skills.map(({ id, name, slug }) => (
                        <li
                            key={id}
                            className="flex items-center gap-3 px-4 py-3 bg-[#0F0D2A] border border-[#E8B84B]/10 hover:border-[#E8B84B]/30 transition-all duration-200 group"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`https://cdn.simpleicons.org/${slug}`}
                                width={20}
                                height={20}
                                loading="lazy"
                                alt=""
                                aria-hidden="true"
                            />
                            <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors tracking-wide truncate">
                                {name}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Work History Section */}
            <div>
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-md tracking-widest uppercase text-[#E8B84B]/60">
                        Work History
                    </h2>
                    <div className="flex-1 h-px bg-[#E8B84B]/10" />
                </div>

                <WorkHistory
                    entries={timeline}
                    resumeUrl={resume?.file_url ?? null}
                />
            </div>
        </section>
    );
}
