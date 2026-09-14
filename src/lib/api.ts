/**
 * Server-side data access.
 *
 * Everything here runs on the server (Server Components, sitemap, metadata) so
 * the rendered HTML already contains the content — which is the whole point:
 * crawlers never executed the old client-side fetches.
 *
 * Reads go straight to Supabase through the cached server client; there is no
 * backend service in between.
 */

import type { PostgrestError } from "@supabase/supabase-js";
import { supabaseServer } from "./supabase/server";
import {
    PROJECT_TYPES,
    projectTypeOf,
    type HitTotals,
    type Project,
    type ProjectType,
    type Resume,
    type Skill,
    type SocialLink,
    type WorkHistoryEntry,
} from "./types";

export { REVALIDATE } from "./supabase/server";

/**
 * A build or render must not hard-fail because Supabase blipped; the page
 * degrades to empty rather than 500ing and losing the crawl.
 */
function fallbackOnError<T>(
    label: string,
    { data, error }: { data: T | null; error: PostgrestError | null },
    fallback: T,
): T {
    if (error) {
        console.error(`Supabase ${label} failed:`, error.message);
        return fallback;
    }
    return data ?? fallback;
}

export async function getProjects(): Promise<Project[]> {
    const result = await supabaseServer
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });

    return fallbackOnError("projects", result, []);
}

/**
 * Projects bucketed by kind, in the order the page renders them. Every project
 * lands in exactly one bucket, so nothing can silently disappear from the page
 * because of an unexpected `project_type` value.
 */
export async function getProjectsByType(): Promise<
    Record<ProjectType, Project[]>
> {
    const projects = await getProjects();
    const grouped = Object.fromEntries(
        PROJECT_TYPES.map((type) => [type, [] as Project[]]),
    ) as Record<ProjectType, Project[]>;

    for (const project of projects) {
        grouped[projectTypeOf(project)].push(project);
    }
    return grouped;
}

export async function getSkills(): Promise<Skill[]> {
    const result = await supabaseServer
        .from("skills")
        .select("*")
        .order("sort_order", { ascending: true });

    return fallbackOnError("skills", result, []);
}

export async function getWorkHistory(): Promise<WorkHistoryEntry[]> {
    const result = await supabaseServer
        .from("work_history")
        .select("*")
        .order("sort_order", { ascending: true });

    return fallbackOnError("work_history", result, []);
}

export async function getSocialLinks(): Promise<SocialLink[]> {
    const result = await supabaseServer
        .from("social_links")
        .select("*")
        .order("sort_order", { ascending: true });

    return fallbackOnError("social_links", result, []);
}

export async function getCurrentResume(): Promise<Resume | null> {
    // maybeSingle, not single: "no CV uploaded yet" is a normal state, and
    // single() would report it as an error every time.
    const result = await supabaseServer
        .from("resumes")
        .select("*")
        .eq("is_current", true)
        .maybeSingle();

    return fallbackOnError("resumes/current", result, null);
}

export async function getHitTotals(): Promise<HitTotals | null> {
    // An RPC, not a table read: the aggregate is public but the raw rows are
    // not, and get_hit_totals() is the only thing anon is granted.
    const result = await supabaseServer.rpc("get_hit_totals");
    return fallbackOnError("analytics/totals", result, null);
}
