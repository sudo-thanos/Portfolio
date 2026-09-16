"use client";

/**
 * Dashboard error banner.
 *
 * Every write in here used to fail into console.error, which meant a rejected
 * edit looked exactly like a saved one: the modal closed, the list refetched,
 * and the change simply wasn't there. Failures belong on screen.
 */
export default function DashboardError({
    message,
    onDismiss,
}: {
    message: string | null;
    onDismiss: () => void;
}) {
    if (!message) return null;

    return (
        <div
            role="alert"
            className="mb-5 flex items-start gap-3 border border-[#E8394D]/35 bg-[#E8394D]/10 px-4 py-3"
        >
            <span aria-hidden="true" className="text-[#E8394D] leading-5">
                !
            </span>
            <p className="flex-1 text-[12px] leading-relaxed text-[#E8394D]">
                {message}
            </p>
            <button
                type="button"
                onClick={onDismiss}
                aria-label="Dismiss error"
                className="shrink-0 text-[#E8394D]/60 hover:text-[#E8394D] text-lg leading-none transition-colors cursor-pointer"
            >
                ×
            </button>
        </div>
    );
}

/** Whatever a thrown value is, get something worth showing a human. */
export function errorMessage(err: unknown): string {
    if (err instanceof Error && err.message) return err.message;
    if (typeof err === "string" && err) return err;
    return "Something went wrong. Check the browser console for details.";
}
