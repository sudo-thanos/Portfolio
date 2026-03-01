"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

interface AuthContextType {
    user: any | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Get initial session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // Listen for auth changes (login, logout, token refresh)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw new Error(error.message);
        // no need to setUser here — onAuthStateChange handles it
    };

    const logout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        // no need to setUser(null) — onAuthStateChange handles it
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
