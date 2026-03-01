"use client";

import { FileText, Rocket, TrendingUp, Eye } from "lucide-react";

export default function LabOverviewPage() {
    const labStats = [
        {
            label: "Total Projects",
            value: "12",
            icon: Rocket,
            change: "+2 this month",
        },
        {
            label: "Case Studies",
            value: "8",
            icon: FileText,
            change: "+1 this week",
        },
        {
            label: "Technologies",
            value: "4",
            icon: TrendingUp,
            change: "No change",
        },
        {
            label: "Page Views",
            value: "2.4k",
            icon: Eye,
            change: "+12% this month",
        },
    ];

    const recentUpdates = [
        {
            icon: Rocket,
            title: "New project added",
            description: "Teacher-on-Demand Platform published",
            time: "2 hours ago",
        },
        {
            icon: FileText,
            title: "Case study updated",
            description: "DLSim metrics refreshed",
            time: "1 day ago",
        },
    ];

    const quickActions = [
        { icon: Rocket, label: "Add New Project" },
        { icon: FileText, label: "Create Case Study" },
        { icon: TrendingUp, label: "Update Technologies" },
    ];

    return (
        <div className="min-h-screen text-white space-y-8">
            {/* Welcome Section */}
            <div className="border-b border-[#E8B84B]/10 pb-6">
                <h2 className="text-xl font-bold tracking-tight">
                    Welcome back, Daniel!
                </h2>
                <p className="text-[11px] text-white/30 mt-1 tracking-widest uppercase">
                    Here&apos;s what&apos;s happening with your portfolio today
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                {labStats.map((stat, index) => {
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
                                {stat.value}
                            </div>
                            <p className="text-[10px] text-white/25 mt-1.5 tracking-wider">
                                {stat.change}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Grid */}
            <div className="grid gap-3 md:grid-cols-2">
                {/* Recent Updates */}
                <div className="bg-[#0F0D2A] border border-[#E8B84B]/10">
                    <div className="px-5 py-4 border-b border-[#E8B84B]/10">
                        <h3 className="text-[11px] tracking-widest uppercase text-white/50">
                            Recent Updates
                        </h3>
                    </div>
                    <div className="p-5 space-y-4">
                        {recentUpdates.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={index}
                                    className="flex items-start gap-4"
                                >
                                    <div className="shrink-0 w-8 h-8 bg-[#E8B84B]/8 border border-[#E8B84B]/15 flex items-center justify-center">
                                        <Icon className="h-3.5 w-3.5 text-[#E8B84B]/60" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white">
                                            {item.title}
                                        </p>
                                        <p className="text-[11px] text-white/35 mt-0.5">
                                            {item.description}
                                        </p>
                                        <p className="text-[10px] text-white/20 mt-1 tracking-wider">
                                            {item.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#0F0D2A] border border-[#E8B84B]/10">
                    <div className="px-5 py-4 border-b border-[#E8B84B]/10">
                        <h3 className="text-[11px] tracking-widest uppercase text-white/50">
                            Quick Actions
                        </h3>
                    </div>
                    <div className="p-5 space-y-2">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={index}
                                    className="w-full flex items-center gap-3 px-4 py-3 border border-white/8 hover:border-[#E8B84B]/30 hover:bg-[#E8B84B]/3 text-white/40 hover:text-[#E8B84B] transition-all duration-200 cursor-pointer group"
                                >
                                    <Icon className="h-3.5 w-3.5 text-white/25 group-hover:text-[#E8B84B]/60 transition-colors" />
                                    <span className="text-[11px] tracking-widest uppercase">
                                        {action.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
