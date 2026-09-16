import { revalidateTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env";
import { CONTENT_TAG } from "@/lib/supabase/server";

/**
 * Drop the cached copy of the public pages.
 *
 * The dashboard writes straight from the browser to Supabase, so Next never
 * sees the change and keeps serving whatever it rendered last — for up to
 * REVALIDATE seconds. From the other side of the screen that is
 * indistinguishable from the edit not having saved. The dashboard calls this
 * after every successful write.
 *
 * Gated on a real Supabase session rather than a shared secret: the only people
 * allowed to bust the cache are the ones allowed to change the content, and
 * that is already what Supabase Auth tells us. A secret would be a second thing
 * to store in the browser and a second thing to leak.
 */
export async function POST(request: Request) {
    const header = request.headers.get("authorization") ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

    if (!token) {
        return Response.json({ error: "Missing bearer token" }, { status: 401 });
    }

    // A throwaway client: no persisted session (this is a shared server, and
    // adopting the caller's token as ambient state would leak it across
    // requests) and no cached fetch (verifying a token against a cache is not
    // verifying it).
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
    });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
        return Response.json({ error: "Not signed in" }, { status: 401 });
    }

    // { expire: 0 }: don't keep serving the stale render while the new one is
    // built. The point of this route is that the edit shows up now, so a
    // grace period would defeat it.
    revalidateTag(CONTENT_TAG, { expire: 0 });
    return Response.json({ revalidated: true, at: Date.now() });
}
