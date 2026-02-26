"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Redirect if already authenticated
    if (isAuthenticated) {
        router.push("/dashboard");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        console.log("Autenticating");

        try {
            await login(username, password);
            router.push("/dashboard");
        } catch (err) {
            setError("Invalid credentials");
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="w-full flex items-center justify-center min-h-[100vh]">
            <div className="w-full max-w-md">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Login</h1>
                    <p className="text-gray-400">
                        Enter your credentials to access the dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-500/20 text-red-400 rounded border border-red-500/30">
                            {error}
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium mb-2"
                        >
                            Email
                        </label>
                        <input
                            id="text"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 bg-[#0F0D2A] border border-[#E8B84B] rounded text-white placeholder-[#6B6890] focus:outline-none focus:border-accent"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium mb-2"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-[#0F0D2A] border border-[#E8B84B] rounded text-white placeholder-[#6B6890] focus:outline-none focus:border-accent"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-2 bg-[#E8394D] cursor-pointer text-white font-bold rounded hover:bg-accent/90 disabled:opacity-50 transition"
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </section>
    );
}
