/**
 * Home — a Server Component. Social links come from the API (the same rows the
 * dashboard edits) rather than being hardcoded, and feed the Person structured
 * data as `sameAs`, which is how Google ties this site to those profiles.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { SquigglyLine } from "@/components/SquigglyLine";
import { PersonJsonLd } from "@/components/JsonLd";
import { getSkills, getSocialLinks, getWorkHistory } from "@/lib/api";

export const revalidate = 300;

const CONTACT_EMAIL = "danieludechukwu117@gmail.com";

export const metadata: Metadata = {
    alternates: { canonical: "/" },
};

export default async function Home() {
    const [socialLinks, skills, workHistory] = await Promise.all([
        getSocialLinks(),
        getSkills(),
        getWorkHistory(),
    ]);

    const timeline = [...workHistory].sort((a, b) => b.sort_order - a.sort_order);

    return (
        <>
            <PersonJsonLd
                socialLinks={socialLinks}
                skills={skills}
                workHistory={timeline}
            />
            <section className="w-full flex flex-col items-center justify-center min-h-[80vh] text-lg sm:text-xl md:text-2xl font-medium px-4 sm:px-6">
                <div className="w-full max-w-6xl mx-auto">
                    <div>
                        <h1 className="text-3xl sm:text-4xl md:text-[2.5rem] font-bold leading-tight">
                            Hey, I&apos;m{" "}
                            <span className="text-accent">
                                Daniel Udechukwu
                            </span>
                            !
                        </h1>
                        <p className="w-full sm:w-[85%] md:w-[70%] text-base sm:text-lg md:text-[1.3rem] leading-relaxed sm:leading-[1.8rem] md:leading-8 mt-4 md:mt-4">
                            Full-stack engineer from Abuja, Nigeria. I turn
                            complex problems into clean, performant web
                            experiences using the React ecosystem. When I&apos;m
                            not shipping code, I&apos;m mentoring developers and
                            leading teams at{" "}
                            <Link
                                href="https://asteriskrd.tech"
                                className="border-b-2 border-[#f59e0b]"
                            >
                                AsteriskRD.
                            </Link>
                        </p>
                    </div>

                    <SquigglyLine />

                    {socialLinks.length > 0 && (
                        <div className="mt-6 md:mt-8">
                            <h2 className="text-lg sm:text-xl md:text-2xl">
                                Find me on
                            </h2>
                            <div className="sm:flex grid grid-cols-2 sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:gap-12 mt-4 md:mt-4">
                                {socialLinks.map(({ id, platform, url }) => (
                                    <div
                                        key={id}
                                        className="flex items-center gap-2"
                                    >
                                        <Link
                                            href={url}
                                            className="text-base sm:text-lg md:text-xl cursor-pointer hover:text-accent transition-colors"
                                            target="_blank"
                                            rel="noopener noreferrer me"
                                        >
                                            {platform}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 md:mt-8">
                        <h2 className="text-lg sm:text-xl md:text-2xl">
                            Contact
                        </h2>
                        <p className="mt-4 md:mt-4 text-base sm:text-lg md:text-xl leading-relaxed">
                            You can reach me anytime at{" "}
                            <a
                                href={`mailto:${CONTACT_EMAIL}`}
                                className="border-b-2 border-[#f59e0b] break-all sm:break-normal"
                            >
                                {CONTACT_EMAIL}
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
