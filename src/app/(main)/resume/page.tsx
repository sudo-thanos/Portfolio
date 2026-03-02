/**
 * Resume page
 */

"use client";
import { SquigglyLine } from "@/components/SquigglyLine";
import WorkHistory from "@/components/WorkHistory";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Skill {
    id: number;
    name: string;
    slug: string;
}

export default function Resume() {
    const [skills, setSkills] = useState<Skill[]>([]);

    const fetchSkills = async () => {
        const { data, error } = await supabase
            .from("skills")
            .select("*")
            .order("sort_order", { ascending: true });

        if (error) throw new Error(error.message);

        console.log(data);

        setSkills(data);
    };

    useEffect(() => {
        fetchSkills();
    }, []);

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
                    {skills.map(({ id, name, slug }) => (
                        <li
                            key={id}
                            className="flex items-center gap-3 px-4 py-3 bg-[#0F0D2A] border border-[#E8B84B]/10 hover:border-[#E8B84B]/30 transition-all duration-200 group"
                        >
                            <img
                                src={`https://cdn.simpleicons.org/${slug}`}
                                width={20}
                                height={20}
                                alt={`${slug} icon`}
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
