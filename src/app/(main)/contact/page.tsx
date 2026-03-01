/**
 * Contact page
 */

import { SquigglyLine } from "@/components/SquigglyLine";
import Link from "next/link";

export default function Contact() {
    return (
        <>
            <section className="w-[90%] px-4 text-base md:text-[1.3rem] max-w-6xl mt-48 pb-16 mx-auto">
                <div>
                    <h2 className="text-3xl md:text-[2.5rem] font-bold">
                        Get in touch
                    </h2>
                    <p className="text-md text-white/50 mt-3 max-w-xl leading-relaxed">
                        {"Do you have an exciting project? Let's talk!"}
                    </p>

                    <SquigglyLine />

                    <div className="mt-8 leading-relaxed">
                        <p>
                            You can reach me anytime at{" "}
                            <a
                                href="mailto:danieludechukwu117@gmail.com"
                                className="border-b-2 cursor-pointer border-[#f59e0b] font-bold"
                            >
                                danieludechukwu117@gmail.com
                            </a>
                        </p>
                        <p>
                            As a backup option, you can{" "}
                            <Link
                                href="https://x.com/ChumaUdechukwu"
                                className="border-b-2 cursor-pointer border-[#f59e0b] font-bold"
                            >
                                DM me on X
                            </Link>
                        </p>

                        <p>I usually respond right away on business days.</p>
                    </div>
                </div>
            </section>
        </>
    );
}
