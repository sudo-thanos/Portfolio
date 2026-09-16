"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

const SESSION_KEY = "portfolio_visit_logged";

/**
 * Logs one "visit" row per browser session (not per page load) so refreshes and
 * SPA navigation don't inflate the count. Keep-alive "ping" rows are written
 * separately by the Supabase cron job, using the service_role key — the RLS
 * policy only lets anon insert type = 'visit', so a visitor can't fake them.
 */
export default function VisitTracker() {
    useEffect(() => {
        try {
            if (sessionStorage.getItem(SESSION_KEY)) return;
            sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
            // Private mode / blocked storage — skip rather than double-count.
            return;
        }

        supabase
            .from("site_hits")
            .insert({ type: "visit", path: window.location.pathname })
            .then(({ error }) => {
                // Analytics must never surface an error to a visitor.
                if (error) console.error("Visit not logged:", error.message);
            });
    }, []);

    return null;
}
