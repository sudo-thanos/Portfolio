/**
 * Footer component
 */
"use client";

// import StackScroll from "./StackScroll";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Footer() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const [hitCount, setHitCount] = useState<number | null>(null);

    useEffect(() => {
        let cancelled = false;

        supabase
            .rpc("get_hit_totals")
            .then(({ data }: { data: { total?: number } | null }) => {
                if (!cancelled && typeof data?.total === "number") {
                    setHitCount(data.total);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <>
            <footer className="py-4 sm:py-6 md:py-[1.5rem] border-t border-[#94a3b8]/50">
                <div className=" mx-auto px-4 md:px-[3rem]">
                    {/* Desktop Layout - Side by Side */}
                    <div className="flex flex-wrap-reverse items-center justify-between">
                        <div className="flex items-center gap-1 sm:gap-2 md:gap-[.4rem]">
                            <span className="font-bold text-lg sm:text-xl md:text-[1.5rem]">
                                ©
                            </span>
                            <span className="text-sm sm:text-base">{year}</span>
                            <p className="text-xs sm:text-sm md:text-[.9rem]">
                                Built by Daniel Udechukwu
                            </p>
                        </div>
                        <div className="flex items-center gap-4 md:gap-[1.5rem]">
                            {hitCount !== null && (
                                <span className="text-xs sm:text-sm md:text-[.9rem] text-secondary">
                                    {hitCount.toLocaleString()} hits
                                </span>
                            )}
                            <Link
                                href="/resume"
                                className="font-medium text-sm sm:text-base md:text-[1rem] cursor-pointer hover:text-accent transition-colors"
                            >
                                Tech Stack
                            </Link>
                        </div>
                    </div>
                </div>
                {/* <StackScroll /> */}
            </footer>
        </>
    );
}
