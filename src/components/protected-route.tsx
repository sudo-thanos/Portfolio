"use client";

import { useAuth } from "@/context/auth-context";
import { Cardio } from "ldrs/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "ldrs/react/Cardio.css";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Cardio size="200" stroke="10" speed="2" color="white" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return children;
}
