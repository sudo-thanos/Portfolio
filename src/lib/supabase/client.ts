"use client";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/**
 * Browser client — one instance for the whole app.
 *
 * The session lives in localStorage and is refreshed automatically, which is
 * what keeps the dashboard logged in across reloads. Row Level Security is what
 * actually protects the data: the anon key is public by design, and every write
 * is gated on an authenticated role in the database, not in this file.
 */
export const supabase = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            // The dashboard uses email + password, never a magic-link callback,
            // so there is never a session to pick out of the URL.
            detectSessionInUrl: false,
        },
    },
);
