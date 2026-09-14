import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/** How long a page may serve stale content before revalidating, in seconds. */
export const REVALIDATE = 300;

/**
 * Server-side client for Server Components, the sitemap and metadata.
 *
 * supabase-js has no notion of Next's data cache, so the cache directives are
 * injected through a custom fetch. Without this every render would hit
 * PostgREST fresh — the reads here are public, unchanging-per-visitor content,
 * so they belong in the ISR cache alongside the rendered HTML.
 *
 * Tagged "content" so a future dashboard write can call
 * `revalidateTag("content")` and refresh every public page at once.
 */
const cachedFetch: typeof fetch = (input, init) =>
    fetch(input, {
        ...init,
        next: { revalidate: REVALIDATE, tags: ["content"] },
    });

export const supabaseServer = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
        auth: {
            // Nothing on the server is "signed in" — these reads are the same
            // for every visitor, and persisting a session would poison the
            // shared cache with one user's credentials.
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
        global: { fetch: cachedFetch },
    },
);
