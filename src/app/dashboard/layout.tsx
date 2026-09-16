import type { Metadata } from "next";
import DashboardShell from "@/components/dashboard-shell";

// Belt and braces alongside robots.ts: if the dashboard is ever linked from
// anywhere, this header keeps it out of the index.
export const metadata: Metadata = {
    title: "Dashboard",
    robots: { index: false, follow: false, nocache: true },
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <DashboardShell>{children}</DashboardShell>;
}
