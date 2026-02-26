import { SquigglyLine } from "@/components/SquigglyLine";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <section className="w-full flex flex-col items-center justify-center min-h-[80vh] text-lg sm:text-xl md:text-2xl font-medium px-4 sm:px-6">
                <div className="w-full max-w-[60rem] mx-auto">
                    <div>
                        <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] font-bold leading-tight">
                            Hey, I&apos;m{" "}
                            <span className="text-accent">
                                Daniel Udechukwu
                            </span>
                            !
                        </h2>
                        <p className="w-full sm:w-[85%] md:w-[70%] text-base sm:text-lg md:text-[1.3rem] leading-relaxed sm:leading-[1.8rem] md:leading-[2rem] mt-4 md:mt-[1rem]">
                            A freelance full-stack engineer based in Abuja,
                            Nigeria. I specialize in developing applications
                            using the React Ecosystem. Currently, I&apos;m
                            volunteering as the lead front-end developer at{" "}
                            <Link
                                href="https://asteriskrd.tech"
                                className="border-b-2 border-[#f59e0b]"
                            >
                                AsteriskRD.
                            </Link>
                        </p>
                    </div>

                    <SquigglyLine />

                    <div className="mt-6 md:mt-[2rem]">
                        <p className="text-lg sm:text-xl md:text-2xl">
                            Find me on
                        </p>
                        <div className="sm:flex grid grid-cols-2 sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:gap-[3rem] mt-4 md:mt-[1rem]">
                            <div className="flex items-center gap-2">
                                <Link
                                    href="https://x.com/ChumaUdechukwu"
                                    className="text-base sm:text-lg md:text-xl cursor-pointer hover:text-accent transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Twitter
                                </Link>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href="https://github.com/sudo-thanos"
                                    className="text-base sm:text-lg md:text-xl cursor-pointer hover:text-accent transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    GitHub
                                </Link>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href="https://www.linkedin.com/in/udechukwudc/"
                                    className="text-base sm:text-lg md:text-xl cursor-pointer hover:text-accent transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Linkedin
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 md:mt-[2rem]">
                        <p className="text-lg sm:text-xl md:text-2xl">
                            Contact
                        </p>
                        <p className="mt-4 md:mt-[1rem] text-base sm:text-lg md:text-xl leading-relaxed">
                            You can reach me anytime at{" "}
                            <a
                                href="mailto:danieludechukwu117@gmail.com"
                                className="border-b-2 border-[#f59e0b] break-all sm:break-normal"
                            >
                                danieludechukwu117@gmail.com
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
