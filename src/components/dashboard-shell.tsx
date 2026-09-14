"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout as DashboardLayoutComponent } from "@/components/dashboard-layout";

/** Client half of the dashboard layout, so the layout itself can be a Server
 *  Component and export `metadata` (a client component cannot). */
export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <DashboardLayoutComponent>{children}</DashboardLayoutComponent>
        </ProtectedRoute>
    );
}
