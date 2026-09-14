/**
 * Work history timeline. Presentational only — data is fetched on the server by
 * the page and passed in, so the timeline is present in the initial HTML.
 *
 * Entries must arrive newest-first: index 0 gets the "Latest" badge.
 */

import type { WorkHistoryEntry } from "@/lib/types";

const typeColors: Record<string, string> = {
    "Full-Time": "bg-[#E8B84B]/10 text-[#E8B84B] border-[#E8B84B]/20",
    Internship: "bg-white/5 text-white/40 border-white/10",
    Volunteer: "bg-[#E8394D]/10 text-[#E8394D]/80 border-[#E8394D]/20",
    Contract: "bg-white/5 text-white/40 border-white/10",
};

export default function WorkHistory({
    entries,
    resumeUrl,
}: {
    entries: WorkHistoryEntry[];
    resumeUrl?: string | null;
}) {
    return (
        <section className="w-full">
            {/* Download line */}
            <p className="text-base text-white/50 mb-10 leading-relaxed">
                A summary of my past employment experience. You can also{" "}
                <a
                    href={resumeUrl ?? "/files/daniel_resume.pdf"}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#E8B84B]/70 hover:text-[#E8B84B] border-b border-[#E8B84B]/30 hover:border-[#E8B84B] transition-colors"
                >
                    download my resume
                </a>
                .
            </p>

            {entries.length === 0 ? (
                <p className="text-white/40">Work history is being updated.</p>
            ) : (
                <div className="relative pl-8">
                    {/* Vertical line — starts and ends at dot centers */}
                    <div
                        className="absolute left-[7px] top-3.5 w-px bg-[#E8B84B]/15"
                        style={{ bottom: "14px" }}
                    />

                    <ol className="space-y-6">
                        {entries.map((item, index) => {
                            const {
                                id,
                                role,
                                company,
                                location,
                                type,
                                period,
                                description,
                            } = item;
                            const isFirst = index === 0;

                            return (
                                <li key={id} className="relative">
                                    {/* Dot — centered on the line */}
                                    <div
                                        className={`absolute -left-8 top-3.5 -translate-y-1/2 w-4 h-4 rounded-full border-2 z-10 ${
                                            isFirst
                                                ? "bg-[#E8B84B] border-[#E8B84B] shadow-[0_0_12px_rgba(232,184,75,0.45)]"
                                                : "bg-[#0A0820] border-[#E8B84B]/35"
                                        }`}
                                    />

                                    {/* Card */}
                                    <div className="bg-[#0F0D2A] border border-[#E8B84B]/10 hover:border-[#E8B84B]/25 transition-all duration-200 p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2.5 mb-1.5">
                                                    <h3 className="text-lg font-semibold text-white tracking-tight">
                                                        {role}
                                                    </h3>
                                                    {isFirst && (
                                                        <span className="shrink-0 text-[11px] tracking-widest uppercase px-2 py-0.5 bg-[#E8B84B]/10 text-[#E8B84B] border border-[#E8B84B]/20">
                                                            Latest
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                    <span className="text-sm text-white/50 font-medium">
                                                        {company}
                                                    </span>
                                                    <span className="text-white/20 text-[10px]">
                                                        ·
                                                    </span>
                                                    <span className="text-sm text-white/35">
                                                        {location}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Period + type */}
                                            <div className="flex sm:flex-col items-start sm:items-end gap-2 shrink-0">
                                                <span
                                                    className={`text-[11px] tracking-widest uppercase px-2.5 py-1 border ${typeColors[type] ?? "bg-white/5 text-white/40 border-white/10"}`}
                                                >
                                                    {type}
                                                </span>
                                                <span className="text-xs text-white/25 tracking-wider">
                                                    {period}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="h-px bg-[#E8B84B]/8 mb-4" />

                                        <ul className="space-y-2">
                                            {description.map((point, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-start gap-3 text-sm text-white/35 leading-relaxed"
                                                >
                                                    <span className="shrink-0 mt-[5px] w-1 h-1 bg-[#E8B84B]/30 rounded-full" />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            )}
        </section>
    );
}
