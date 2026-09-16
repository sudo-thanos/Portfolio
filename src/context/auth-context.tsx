"use client";

import { useRouter } from "next/navigation";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

interface Admin {
    id: string;
    email: string;
    last_login_at: string | null;
}

interface AuthContextType {
    user: Admin | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toAdmin(session: Session | null): Admin | null {
    if (!session?.user) return null;
    return {
        id: session.user.id,
        email: session.user.email ?? "",
        last_login_at: session.user.last_sign_in_at ?? null,
    };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Admin | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Supabase restores the stored session and refreshes it on its own, so the
    // only job here is to mirror whatever it reports into React state.
    // onAuthStateChange fires immediately with the restored session, which is
    // what ends the initial loading state.
    useEffect(() => {
        let active = true;

        supabase.auth.getSession().then(({ data }) => {
            if (!active) return;
            setUser(toAdmin(data.session));
            setIsLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(toAdmin(session));
            setIsLoading(false);
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw new Error(error.message);
        setUser(toAdmin(data.session));
    }, []);

    const logout = useCallback(async () => {
        try {
            await supabase.auth.signOut();
        } finally {
            setUser(null);
            router.push("/login");
        }
    }, [router]);

    const value = useMemo(
        () => ({
            user,
            isLoading,
            login,
            logout,
            isAuthenticated: !!user,
        }),
        [user, isLoading, login, logout],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
