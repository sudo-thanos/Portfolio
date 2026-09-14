/**
 * Hand-written schema types for the Supabase tables.
 *
 * Kept by hand rather than generated so the shape lives next to the app code
 * that depends on it; the payoff is that `supabase.from("projects")` infers its
 * row and insert types instead of returning `any`.
 */

import type {
    Project,
    Resume,
    SiteHit,
    Skill,
    SocialLink,
    WorkHistoryEntry,
} from "./types";

/**
 * supabase-js constrains every Row/Insert/Update to `Record<string, unknown>`,
 * and a TypeScript `interface` has no implicit index signature — so passing one
 * straight through makes the entire schema silently resolve to `never`, and
 * every query loses its types. Re-mapping the keys produces an equivalent type
 * alias that does satisfy the constraint.
 */
type Cols<T> = { [K in keyof T]: T[K] };

/** Rows are created with server defaults for id/created_at, so both are optional on insert. */
type Insert<T extends { id: string; created_at: string }> = Cols<
    Omit<T, "id" | "created_at"> & Partial<Pick<T, "id" | "created_at">>
>;

type Table<T extends { id: string; created_at: string }> = {
    Row: Cols<T>;
    Insert: Insert<T>;
    Update: Cols<Partial<T>>;
    // supabase-js only recognises a table definition that declares this; omit
    // it and the schema resolves to `never`.
    Relationships: [];
};

export interface Database {
    public: {
        Tables: {
            projects: Table<Project>;
            skills: Table<Skill>;
            work_history: Table<WorkHistoryEntry>;
            social_links: Table<SocialLink>;
            resumes: Table<Resume>;
            site_hits: {
                Row: Cols<SiteHit>;
                // Writable by visitors, but only ever as a 'visit' — the RLS
                // policy rejects anything else, so the type says so too.
                Insert: { type: "visit"; path?: string | null };
                Update: Cols<Partial<SiteHit>>;
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: {
            get_hit_totals: {
                Args: Record<string, never>;
                Returns: { visits: number; pings: number; total: number };
            };
        };
        Enums: Record<string, never>;
        CompositeTypes: Record<string, never>;
    };
}
