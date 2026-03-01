"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu,
    GalleryVerticalEnd,
    Layout as LayoutIcon,
    Search,
    House,
    LogOut,
    Braces,
    FolderClock,
    FileUser,
    Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const navItems = [
    {
        icon: House,
        label: "Overview",
        href: "/dashboard",
        disabled: false,
    },
    {
        icon: Braces,
        label: "Projects",
        href: "/dashboard/projects",
        disabled: false,
    },
    {
        icon: FolderClock,
        label: "Work History",
        href: "/dashboard/work-history",
        disabled: false,
    },
    {
        icon: FileUser,
        label: "Resume",
        href: "/dashboard/resume",
        disabled: false,
    },
    {
        icon: Terminal,
        label: "Technical Skills",
        href: "/dashboard/technical-skills",
        disabled: false,
    },
    { icon: Search, label: "SEO Settings", href: "#", disabled: true },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { logout } = useAuth();
    // const router = useRouter();

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className={cn(
                        "fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-300",
                        sidebarOpen
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none",
                    )}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 h-full w-64 border-r border-[#E8B84B]/20 bg-[#0A0820] transition-transform duration-300 lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <div className="flex h-full flex-col">
                    <Link href="" className="px-3 h-16">
                        <p className="text-[2.5rem] lg:text-[2.5rem] font-bold flex gap-2s">
                            {/* eslint-disable-next-line */}
                            <span className="text-accent">//</span>DU
                        </p>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 border-t border-[#f59e0b]/60 px-3 py-4 lg:py-8  overflow-y-auto ">
                        {/* Shared Navigation */}
                        <div className="space-y-1">
                            {navItems.map((item, i) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                if (item.disabled) {
                                    return (
                                        <span
                                            key={i}
                                            className="flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-widest uppercase font-medium border border-transparent text-white/15 cursor-not-allowed"
                                        >
                                            <Icon className="h-4 w-4 shrink-0 text-white/10" />
                                            {item.label}
                                            <span className="ml-auto text-[9px] tracking-widest uppercase text-white/15 border border-white/10 px-1.5 py-0.5">
                                                Soon
                                            </span>
                                        </span>
                                    );
                                }

                                return (
                                    <Link
                                        key={i}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-widest uppercase font-medium transition-all duration-200 cursor-pointer border",
                                            isActive
                                                ? "bg-[#E8B84B]/10 border-[#E8B84B]/30 text-[#E8B84B]"
                                                : "border-transparent text-white/35 hover:bg-[#E8B84B]/5 hover:border-[#E8B84B]/15 hover:text-white/70",
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                "h-4 w-4 shrink-0",
                                                isActive
                                                    ? "text-[#E8B84B]"
                                                    : "text-white/25",
                                            )}
                                        />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-[#f59e0b]/60 p-4">
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2 hover:bg-muted transition-colors cursor-pointer font-bold text-[#f59e0b]"
                        >
                            <LogOut className="h-4 w-4 mt-[0.9] text-muted-foreground" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Header */}
                <header className="sticky top-0 z-30 border-b border-[#f59e0b]/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                    <div className="flex h-16 items-center justify-between px-4 lg:px-8">
                        <div className="flex items-center gap-2 lg:gap-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>

                            <p className="lg:text-2xl text-lg font-bold">
                                {navItems.find((item) => item.href === pathname)
                                    ?.label || "Dashboard"}
                            </p>
                        </div>

                        <button className="w-fit flex items-center gap-3 px-3 py-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                                AD
                            </div>
                            <div className="flex-1 overflow-hidden text-left">
                                <p className="truncate text-sm font-medium">
                                    Admin
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    Thanos
                                </p>
                            </div>
                            {/* <ChevronDown className="h-4 w-4 text-muted-foreground" /> */}
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
