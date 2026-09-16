/**
 * Supabase connection details, read once and validated loudly.
 *
 * A missing env var otherwise shows up as "every page renders empty", which is
 * a miserable thing to debug — so fail with a message that names the variable.
 */

function required(name: string, value: string | undefined): string {
    if (!value) {
        throw new Error(
            `${name} is not set. Copy it from your Supabase project (Settings > API) into .env.local.`,
        );
    }
    return value;
}

export const SUPABASE_URL = required(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
).replace(/\/$/, "");

export const SUPABASE_ANON_KEY = required(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/** Storage buckets. Both must be public for the site to serve their files. */
export const BUCKETS = {
    projectImages: "project-images",
    resumes: "resumes",
} as const;
