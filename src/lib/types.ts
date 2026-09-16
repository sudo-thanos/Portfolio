/** The two kinds of work shown on the projects page. */
export const PROJECT_TYPES = ["client", "personal"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

/** Section headings and copy, so the public page and the dashboard agree. */
export const PROJECT_TYPE_META: Record<
    ProjectType,
    { label: string; heading: string; blurb: string }
> = {
    client: {
        label: "Client",
        heading: "Client Projects",
        blurb: "Production work built for clients and teams — shipped, maintained and used in the real world.",
    },
    personal: {
        label: "Personal",
        heading: "Personal Projects",
        blurb: "Things I build for myself — experiments, tools I wanted to exist, and ideas worth chasing.",
    },
};

export function isProjectType(value: unknown): value is ProjectType {
    return PROJECT_TYPES.includes(value as ProjectType);
}

/**
 * Rows written before the client/personal split carry no project_type, so
 * anything unrecognised falls back to "client" — which is what every project
 * predating the split actually was.
 */
export function projectTypeOf(project: Pick<Project, "project_type">): ProjectType {
    return isProjectType(project.project_type) ? project.project_type : "client";
}

export interface Project {
    id: string;
    title: string;
    description: string;
    tech_stack: string[];
    tag: string;
    project_type: ProjectType;
    live_url: string;
    repo_url: string;
    featured: boolean;
    thumbnail_url: string;
    sort_order: number;
    created_at: string;
}

export interface Skill {
    id: string;
    name: string;
    slug: string;
    sort_order: number;
    created_at: string;
}

export interface WorkHistoryEntry {
    id: string;
    role: string;
    company: string;
    location: string;
    type: string;
    period: string;
    description: string[];
    sort_order: number;
    created_at: string;
}

export interface SocialLink {
    id: string;
    platform: string;
    slug: string;
    url: string;
    sort_order: number;
    created_at: string;
}

export interface Resume {
    id: string;
    label: string;
    file_url: string;
    file_name: string;
    is_current: boolean;
    created_at: string;
}

export interface SiteHit {
    id: number;
    type: "visit" | "ping";
    path: string | null;
    created_at: string;
}

export interface HitTotals {
    visits: number;
    pings: number;
    total: number;
}
