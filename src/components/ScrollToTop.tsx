"use client";

import { useEffect, useState } from "react";

/** How far down the page the button appears, in pixels. */
const THRESHOLD = 600;

/**
 * Back-to-top button for the long pages (projects, resume).
 *
 * Hidden until you are far enough down that scrolling back is actually tedious,
 * and never rendered for a keyboard or screen-reader user as a surprise — it is
 * a real button, last in the tab order, that moves focus to the top of the page
 * rather than only moving the viewport.
 */
export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > THRESHOLD);
        onScroll();
        // passive: this listener never calls preventDefault, and saying so keeps
        // it off the main scroll path.
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const toTop = () => {
        // Honour a reduced-motion preference — a long smooth scroll is exactly
        // the kind of motion that setting exists to suppress.
        const reduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });

        // Scrolling alone leaves focus stranded at the bottom, so the next Tab
        // would drop the user back where they started.
        document.getElementById("main")?.focus({ preventScroll: true });
    };

    return (
        <button
            type="button"
            onClick={toTop}
            aria-label="Back to top"
            // Kept mounted so it can animate, and hidden from assistive tech and
            // the tab order while it is off-screen.
            aria-hidden={!visible}
            tabIndex={visible ? 0 : -1}
            className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center border border-[#E8B84B]/25 bg-[#0F0D2A]/90 text-[#E8B84B] backdrop-blur-sm transition-all duration-300 hover:border-[#E8B84B]/60 hover:bg-[#E8B84B]/10 cursor-pointer ${
                visible
                    ? "opacity-100 translate-y-0"
                    : "pointer-events-none opacity-0 translate-y-3"
            }`}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M12 19V5M12 5L5 12M12 5L19 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
}
