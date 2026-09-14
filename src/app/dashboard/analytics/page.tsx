"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Radio, BarChart3, CalendarClock } from "lucide-react";
import { getHitTotals, getRecentHits } from "@/lib/db";
import type { SiteHit } from "@/lib/types";

const VISIT_COLOR = "#3987e5";
const PING_COLOR = "#c98500";
const DAYS_SHOWN = 14;

function dayKey(d: Date) {
    return d.toISOString().slice(0, 10);
}

function buildDayBuckets() {
    const days: { key: string; label: string; visits: number; pings: number }[] =
        [];
    const now = new Date();
    for (let i = DAYS_SHOWN - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setUTCDate(now.getUTCDate() - i);
        days.push({
            key: dayKey(d),
            label: d.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
            }),
            visits: 0,
            pings: 0,
        });
    }
    return days;
}

export default function AnalyticsPage() {
    const [hits, setHits] = useState<SiteHit[]>([]);
    const [totals, setTotals] = useState({ visits: 0, pings: 0 });
    const [loading, setLoading] = useState(true);
    const [hovered, setHovered] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Totals are aggregated in the database; only the windowed
                // rows the chart actually plots come back over the wire.
                const [totalsData, recent] = await Promise.all([
                    getHitTotals(),
                    getRecentHits(DAYS_SHOWN, 500),
                ]);

                setTotals({
                    visits: totalsData.visits,
                    pings: totalsData.pings,
                });
                setHits(recent);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const dayBuckets = useMemo(() => {
        const buckets = buildDayBuckets();
        const byKey = new Map(buckets.map((b) => [b.key, b]));
        for (const hit of hits) {
            const key = hit.created_at.slice(0, 10);
            const bucket = byKey.get(key);
            if (!bucket) continue;
            if (hit.type === "visit") bucket.visits += 1;
            else bucket.pings += 1;
        }
        return buckets;
    }, [hits]);

    const maxDayValue = Math.max(
        1,
        ...dayBuckets.map((d) => Math.max(d.visits, d.pings)),
    );

    const todayKey = dayKey(new Date());
    const todayBucket = dayBuckets.find((d) => d.key === todayKey);
    const todayCount = (todayBucket?.visits ?? 0) + (todayBucket?.pings ?? 0);

    const recentLog = hits.slice(0, 20);

    const statTiles = [
        { label: "Total Visits", value: totals.visits, icon: Eye },
        { label: "Total Pings", value: totals.pings, icon: Radio },
        {
            label: "Combined Hits",
            value: totals.visits + totals.pings,
            icon: BarChart3,
        },
        { label: "Today", value: todayCount, icon: CalendarClock },
    ];

    return (
        <div className="min-h-screen text-white space-y-8">
            <div className="border-b border-[#E8B84B]/10 pb-6">
                <h2 className="text-xl font-bold tracking-tight">Analytics</h2>
                <p className="text-[11px] text-white/30 mt-1 tracking-widest uppercase">
                    Real visits vs. keep-alive pings
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                {statTiles.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-[#0F0D2A] border border-[#E8B84B]/10 hover:border-[#E8B84B]/25 transition-all duration-200 p-5"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] tracking-widest uppercase text-white/30">
                                    {stat.label}
                                </span>
                                <Icon className="h-3.5 w-3.5 text-[#E8B84B]/40" />
                            </div>
                            <div className="text-2xl font-bold tracking-tight text-white">
                                {loading ? "–" : stat.value.toLocaleString()}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Chart */}
            <div className="bg-[#0F0D2A] border border-[#E8B84B]/10">
                <div className="px-5 py-4 border-b border-[#E8B84B]/10 flex items-center justify-between">
                    <h3 className="text-[11px] tracking-widest uppercase text-white/50">
                        Last {DAYS_SHOWN} Days
                    </h3>
                    <div className="flex items-center gap-4 text-[10px] tracking-widest uppercase text-white/40">
                        <span className="flex items-center gap-1.5">
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: VISIT_COLOR }}
                            />
                            Visits
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: PING_COLOR }}
                            />
                            Pings
                        </span>
                    </div>
                </div>
                <div className="p-5 overflow-x-auto">
                    <div className="flex items-end gap-3 h-48 min-w-160 relative">
                        {dayBuckets.map((day) => (
                            <div
                                key={day.key}
                                className="flex-1 flex flex-col items-center gap-1 h-full justify-end relative"
                                onMouseEnter={() => setHovered(day.key)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                {hovered === day.key && (
                                    <div className="absolute bottom-full mb-2 z-10 bg-[#06031b] border border-[#E8B84B]/20 px-3 py-2 text-[10px] whitespace-nowrap shadow-lg">
                                        <p className="text-white/50 mb-1">
                                            {day.label}
                                        </p>
                                        <p style={{ color: VISIT_COLOR }}>
                                            {day.visits} visits
                                        </p>
                                        <p style={{ color: PING_COLOR }}>
                                            {day.pings} pings
                                        </p>
                                    </div>
                                )}
                                <div className="flex items-end gap-0.5 h-full w-full justify-center">
                                    <div
                                        className="w-2.5 rounded-t-sm transition-all"
                                        style={{
                                            height: `${(day.visits / maxDayValue) * 100}%`,
                                            minHeight: day.visits > 0 ? 3 : 0,
                                            backgroundColor: VISIT_COLOR,
                                        }}
                                    />
                                    <div
                                        className="w-2.5 rounded-t-sm transition-all"
                                        style={{
                                            height: `${(day.pings / maxDayValue) * 100}%`,
                                            minHeight: day.pings > 0 ? 3 : 0,
                                            backgroundColor: PING_COLOR,
                                        }}
                                    />
                                </div>
                                <span className="text-[9px] text-white/25 tracking-wide">
                                    {day.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#0F0D2A] border border-[#E8B84B]/10">
                <div className="px-5 py-4 border-b border-[#E8B84B]/10">
                    <h3 className="text-[11px] tracking-widest uppercase text-white/50">
                        Recent Activity
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-[10px] tracking-widest uppercase text-white/30 border-b border-white/5">
                                <th className="text-left font-medium px-5 py-3">
                                    Type
                                </th>
                                <th className="text-left font-medium px-5 py-3">
                                    Path
                                </th>
                                <th className="text-left font-medium px-5 py-3">
                                    Time
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && recentLog.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-5 py-6 text-center text-white/25 text-xs"
                                    >
                                        No activity recorded yet.
                                    </td>
                                </tr>
                            )}
                            {recentLog.map((hit) => (
                                <tr
                                    key={hit.id}
                                    className="border-b border-white/5 last:border-0"
                                >
                                    <td className="px-5 py-3">
                                        <span
                                            className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase"
                                            style={{
                                                color:
                                                    hit.type === "visit"
                                                        ? VISIT_COLOR
                                                        : PING_COLOR,
                                            }}
                                        >
                                            <span
                                                className="h-1.5 w-1.5 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        hit.type === "visit"
                                                            ? VISIT_COLOR
                                                            : PING_COLOR,
                                                }}
                                            />
                                            {hit.type}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-white/50 text-xs">
                                        {hit.path ?? "—"}
                                    </td>
                                    <td className="px-5 py-3 text-white/30 text-xs">
                                        {new Date(hit.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
