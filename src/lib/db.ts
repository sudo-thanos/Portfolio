"use client";

/**
 * Dashboard data access — reads and writes, straight from the browser to
 * Supabase.
 *
 * Authorisation lives in Row Level Security, not here: the anon key ships to
 * every visitor, so "only the admin may write" has to be a database rule. These
 * helpers only shape the calls and normalise errors.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "./supabase/client";
import { BUCKETS } from "./supabase/env";
import type {
    HitTotals,
    Project,
    Resume,
    SiteHit,
    Skill,
    SocialLink,
    WorkHistoryEntry,
} from "./types";

export class DbError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DbError";
    }
}

/**
 * A write that matched no rows.
 *
 * PostgREST answers an UPDATE or DELETE that changed nothing with 204 and no
 * error — and Row Level Security filters rows out rather than refusing the
 * request. So a write the policies disallow is indistinguishable from a
 * successful one unless the affected rows are asked for and counted. Left
 * unchecked it looks like "the dashboard silently ignored my edit".
 */
class NoRowsAffected extends DbError {
    constructor(what: string) {
        super(
            `${what} changed nothing. The row may have been deleted, or your ` +
                `account may not have permission to write it — check the ` +
                `table's row-level security policies for the "authenticated" role.`,
        );
        this.name = "NoRowsAffected";
    }
}

function unwrap<T>({
    data,
    error,
}: {
    data: T | null;
    error: { message: string } | null;
}): T {
    if (error) throw new DbError(error.message);
    return data as T;
}

/** Sortable content tables share one shape, so they share one set of helpers. */
type OrderedTable = "projects" | "skills" | "work_history" | "social_links";

type RowOf = {
    projects: Project;
    skills: Skill;
    work_history: WorkHistoryEntry;
    social_links: SocialLink;
};

/**
 * supabase-js infers row and payload types from a *literal* table name. These
 * helpers take the name as a parameter, which defeats that inference entirely,
 * so they go through an untyped view of the client and restore the types at the
 * boundary — where `RowOf` states what each table actually holds. Every
 * exported function below still has a fully typed signature.
 */
const db = supabase as unknown as SupabaseClient;

async function listOrdered<T extends OrderedTable>(
    table: T,
): Promise<RowOf[T][]> {
    const { data, error } = await db
        .from(table)
        .select("*")
        .order("sort_order", { ascending: true });
    if (error) throw new DbError(error.message);
    return (data ?? []) as RowOf[T][];
}

async function insertRow<T extends OrderedTable>(
    table: T,
    payload: Partial<RowOf[T]>,
): Promise<void> {
    // select() so the inserted row comes back and can be counted; see NoRowsAffected.
    const { data, error } = await db
        .from(table)
        .insert(payload as Record<string, unknown>)
        .select("id");
    if (error) throw new DbError(error.message);
    if (!data?.length) throw new NoRowsAffected(`Creating the ${table} row`);
}

async function updateRow<T extends OrderedTable>(
    table: T,
    id: string,
    payload: Partial<RowOf[T]>,
): Promise<void> {
    // Forms are populated by spreading the row being edited, so the payload can
    // carry id/created_at back in. Writing them would be a no-op at best and a
    // rewritten primary key at worst, so drop them here rather than trusting
    // every call site to.
    const {
        id: _id,
        created_at: _created,
        ...fields
    } = payload as Record<string, unknown>;

    const { data, error } = await db
        .from(table)
        .update(fields)
        .eq("id", id)
        .select("id");
    if (error) throw new DbError(error.message);
    if (!data?.length) throw new NoRowsAffected(`Updating the ${table} row`);
}

async function deleteRow(table: OrderedTable, id: string): Promise<void> {
    const { data, error } = await db
        .from(table)
        .delete()
        .eq("id", id)
        .select("id");
    if (error) throw new DbError(error.message);
    if (!data?.length) throw new NoRowsAffected(`Deleting the ${table} row`);
}

/**
 * Persist a new ordering.
 *
 * `ids` is the full list in its new order; sort_order becomes the position.
 * Only rows whose position actually moved are written, so an adjacent swap
 * costs two updates rather than one per row. The writes are issued together and
 * awaited as a batch — Supabase has no client-side transaction, so a failure
 * mid-batch is surfaced rather than silently leaving a half-applied order.
 */
async function reorder(table: OrderedTable, ids: string[]): Promise<void> {
    const current = await listOrdered(table);
    const positionOf = new Map(ids.map((id, index) => [id, index]));

    const moved = current.filter(
        (row) =>
            positionOf.has(row.id) && positionOf.get(row.id) !== row.sort_order,
    );

    const results = await Promise.all(
        moved.map((row) =>
            db
                .from(table)
                .update({ sort_order: positionOf.get(row.id)! })
                .eq("id", row.id)
                .select("id"),
        ),
    );

    const failed = results.find((r) => r.error);
    if (failed?.error) throw new DbError(failed.error.message);
    if (results.some((r) => !r.data?.length)) {
        throw new NoRowsAffected(`Reordering ${table}`);
    }
}

/**
 * Tell the site to drop its cached copy of the public pages.
 *
 * Writes go straight from this browser to Supabase, so Next never learns that
 * anything changed and keeps serving its cached render. Without this an edit
 * takes up to five minutes to appear on the live site, which reads as "the
 * dashboard isn't syncing".
 *
 * Best-effort on purpose: the database write has already succeeded by this
 * point, so a failure here means the site is briefly stale, not that the edit
 * was lost. Surfacing it as a failed save would be a lie.
 */
async function revalidatePublicSite(): Promise<void> {
    try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) return;

        const res = await fetch("/api/revalidate", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
            console.error(
                `Public pages may be stale for up to ${5} minutes: revalidate returned ${res.status}`,
            );
        }
    } catch (err) {
        console.error("Public pages may be stale:", err);
    }
}

/**
 * Wrap a write so the public site is refreshed once it lands. Applied at the
 * export boundary rather than inside each helper, so there is exactly one list
 * of "things that change what visitors see" and it is visible below.
 */
function publishes<A extends unknown[]>(
    write: (...args: A) => Promise<void>,
): (...args: A) => Promise<void> {
    return async (...args: A) => {
        await write(...args);
        await revalidatePublicSite();
    };
}

// --- Storage -----------------------------------------------------------------

/**
 * Upload to a public bucket and return the URL the site will serve it from.
 * The timestamped path keeps two files with the same name from colliding.
 */
async function uploadTo(
    bucket: string,
    folder: string,
    file: File,
): Promise<{ url: string; path: string }> {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = folder ? `${folder}/${Date.now()}_${safeName}` : `${Date.now()}_${safeName}`;

    const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
    });
    if (error) throw new DbError(error.message);

    const {
        data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);

    return { url: publicUrl, path };
}

/**
 * Recover the object path from a stored public URL, so deleting a row can also
 * drop its blob. Returns null for URLs that don't belong to the bucket (rows
 * written by hand, or images hotlinked from elsewhere) — those are DB-only
 * deletes rather than an error.
 */
function pathInBucket(url: string, bucket: string): string | null {
    const marker = `/storage/v1/object/public/${bucket}/`;
    const index = url.indexOf(marker);
    if (index === -1) return null;
    return decodeURIComponent(url.slice(index + marker.length)) || null;
}

async function removeFromBucket(url: string, bucket: string): Promise<void> {
    const path = pathInBucket(url, bucket);
    if (!path) return;
    // A failed blob delete must not block the row delete — an orphaned file is
    // a smaller problem than a row that won't go away.
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) console.error(`Could not remove ${bucket}/${path}:`, error.message);
}

// --- Projects ----------------------------------------------------------------

export type ProjectInput = Omit<Project, "id" | "created_at">;

export const listProjects = () => listOrdered("projects");
export const createProject = publishes((payload: ProjectInput) =>
    insertRow("projects", payload),
);
export const updateProject = publishes((id: string, payload: ProjectInput) =>
    updateRow("projects", id, payload),
);
export const reorderProjects = publishes((ids: string[]) =>
    reorder("projects", ids),
);

export const deleteProject = publishes(async (project: Project) => {
    await deleteRow("projects", project.id);
    if (project.thumbnail_url) {
        await removeFromBucket(project.thumbnail_url, BUCKETS.projectImages);
    }
});

export const uploadProjectImage = (file: File) =>
    uploadTo(BUCKETS.projectImages, "thumbnails", file);

// --- Skills ------------------------------------------------------------------

export type SkillInput = Omit<Skill, "id" | "created_at">;

export const listSkills = () => listOrdered("skills");
export const createSkill = publishes((payload: SkillInput) =>
    insertRow("skills", payload),
);
export const updateSkill = publishes((id: string, payload: SkillInput) =>
    updateRow("skills", id, payload),
);
export const deleteSkill = publishes((id: string) => deleteRow("skills", id));
export const reorderSkills = publishes((ids: string[]) =>
    reorder("skills", ids),
);

// --- Work history ------------------------------------------------------------

export type WorkHistoryInput = Omit<WorkHistoryEntry, "id" | "created_at">;

export const listWorkHistory = () => listOrdered("work_history");
export const createWorkHistory = publishes((payload: WorkHistoryInput) =>
    insertRow("work_history", payload),
);
export const updateWorkHistory = publishes(
    (id: string, payload: WorkHistoryInput) =>
        updateRow("work_history", id, payload),
);
export const deleteWorkHistory = publishes((id: string) =>
    deleteRow("work_history", id),
);
export const reorderWorkHistory = publishes((ids: string[]) =>
    reorder("work_history", ids),
);

// --- Social links ------------------------------------------------------------

export type SocialLinkInput = Omit<SocialLink, "id" | "created_at">;

export const listSocialLinks = () => listOrdered("social_links");
export const createSocialLink = publishes((payload: SocialLinkInput) =>
    insertRow("social_links", payload),
);
export const updateSocialLink = publishes(
    (id: string, payload: SocialLinkInput) =>
        updateRow("social_links", id, payload),
);
export const deleteSocialLink = publishes((id: string) =>
    deleteRow("social_links", id),
);
export const reorderSocialLinks = publishes((ids: string[]) =>
    reorder("social_links", ids),
);

// --- Resumes -----------------------------------------------------------------

export async function listResumes(): Promise<Resume[]> {
    const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) throw new DbError(error.message);
    return data ?? [];
}

export async function uploadResume(
    label: string,
    file: File,
): Promise<void> {
    const { url, path } = await uploadTo(BUCKETS.resumes, "", file);

    const { data, error } = await supabase.from("resumes").insert({
        label: label || file.name,
        file_url: url,
        file_name: file.name,
        // The very first upload becomes the live CV, so the Download button is
        // never pointing at nothing.
        is_current: (await listResumes()).length === 0,
    }).select("id");

    if (error || !data?.length) {
        // The row is the thing that matters; don't leave a blob behind for a
        // record that was never created.
        await supabase.storage.from(BUCKETS.resumes).remove([path]);
        throw error
            ? new DbError(error.message)
            : new NoRowsAffected("Creating the resume row");
    }
}

export async function setCurrentResume(id: string): Promise<void> {
    // Clear first, then set: `is_current` is a single-winner flag, and doing it
    // the other way round would briefly leave two rows marked current.
    unwrap(
        await supabase
            .from("resumes")
            .update({ is_current: false })
            .eq("is_current", true)
            .select("id"),
    );
    const promoted = unwrap(
        await supabase
            .from("resumes")
            .update({ is_current: true })
            .eq("id", id)
            .select("id"),
    );
    if (!promoted?.length) throw new NoRowsAffected("Setting the current resume");
}

export async function deleteResume(resume: Resume): Promise<void> {
    const { data, error } = await supabase
        .from("resumes")
        .delete()
        .eq("id", resume.id)
        .select("id");
    if (error) throw new DbError(error.message);
    if (!data?.length) throw new NoRowsAffected("Deleting the resume");

    await removeFromBucket(resume.file_url, BUCKETS.resumes);

    // Never leave the site with no downloadable CV.
    if (resume.is_current) {
        const remaining = await listResumes();
        if (remaining.length > 0) await setCurrentResume(remaining[0].id);
    }
}

// --- Analytics ---------------------------------------------------------------

export async function getHitTotals(): Promise<HitTotals> {
    const { data, error } = await supabase.rpc("get_hit_totals");
    if (error) throw new DbError(error.message);
    return data ?? { visits: 0, pings: 0, total: 0 };
}

/** Raw rows for the dashboard charts. Admin-only, enforced by RLS. */
export async function getRecentHits(days: number, limit = 500): Promise<SiteHit[]> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
        .from("site_hits")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(limit);
    if (error) throw new DbError(error.message);
    return data ?? [];
}
