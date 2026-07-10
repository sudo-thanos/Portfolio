"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const SESSION_KEY = "portfolio_visit_logged";

/**
 * Logs one "visit" row per browser session (not per page load) so refreshes
 * and SPA navigation don't inflate the count. Keep-alive "ping" rows are
 * written separately, server-side, by the Supabase cron job.
 */
export default function VisitTracker() {
    useEffect(() => {
        if (sessionStorage.getItem(SESSION_KEY)) return;
        sessionStorage.setItem(SESSION_KEY, "1");

        supabase
            .from("site_hits")
            .insert({ type: "visit", path: window.location.pathname })
            .then();
    }, []);

    return null;
}
