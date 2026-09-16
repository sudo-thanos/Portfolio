"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardError, { errorMessage } from "@/components/DashboardError";
import {
    createProject,
    deleteProject,
    listProjects,
    reorderProjects,
    updateProject,
    uploadProjectImage,
    type ProjectInput,
} from "@/lib/db";
import {
    PROJECT_TYPES,
    PROJECT_TYPE_META,
    projectTypeOf,
    type Project,
} from "@/lib/types";
import { Cardio } from "ldrs/react";
import "ldrs/react/Cardio.css";

const empty: ProjectInput = {
    title: "",
    description: "",
    tech_stack: [],
    tag: "",
    project_type: "client",
    live_url: "",
    repo_url: "",
    featured: false,
    thumbnail_url: "",
    sort_order: 0,
};

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Project | null>(null);
    const [form, setForm] = useState(empty);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [techInput, setTechInput] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [loading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEdting] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [reordering, setReordering] = useState<string | null>(null);

    const openAdd = () => {
        setEditing(null);
        setForm({ ...empty, sort_order: projects.length });
        setImageFile(null);
        setImagePreview("");
        setTechInput("");
        setTagInput("");
        setShowForm(true);
    };

    const openEdit = (project: Project) => {
        setEditing(project);
        setForm({ ...project, project_type: projectTypeOf(project) });
        setImagePreview(project.thumbnail_url);
        setTechInput((project.tech_stack ?? []).join(", "));
        setTagInput(project.tag ?? "");
        setImageFile(null);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditing(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const fetchProjects = async () => {
        setIsFetching(true);
        try {
            setProjects(await listProjects());
        } catch (err) {
            setError(errorMessage(err));
            console.error(err);
        }
        setIsFetching(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        editing ? setIsEdting(true) : setIsCreating(true);

        try {
            let thumbnailUrl = form.thumbnail_url;

            if (imageFile) {
                const { url } = await uploadProjectImage(imageFile);
                thumbnailUrl = url;
            }

            const payload: ProjectInput = {
                title: form.title,
                description: form.description,
                tech_stack: techInput
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                tag: tagInput,
                project_type: form.project_type,
                live_url: form.live_url,
                repo_url: form.repo_url,
                featured: form.featured,
                thumbnail_url: thumbnailUrl,
                sort_order: form.sort_order,
            };

            if (editing) {
                await updateProject(editing.id, payload);
            } else {
                await createProject(payload);
            }

            await fetchProjects();
            closeForm();
        } catch (err) {
            setError(errorMessage(err));
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsCreating(false);
            setIsEdting(false);
        }
    };

    const handleDelete = async (id: string) => {
        const project = projects.find((p) => p.id === id);
        if (!project) return;

        setIsDeleting(true);
        try {
            await deleteProject(project);
            setDeleteId(null);
            await fetchProjects();
        } catch (err) {
            setError(errorMessage(err));
            console.error(err);
        }
        setIsDeleting(false);
    };

    // Projects are stored in one flat, globally-ordered list but shown in two
    // sections, so ordering has to be per-section: a project can only move past
    // its neighbours of the same kind.
    const sections = useMemo(
        () =>
            PROJECT_TYPES.map((type) => ({
                type,
                meta: PROJECT_TYPE_META[type],
                items: projects.filter((p) => projectTypeOf(p) === type),
            })),
        [projects],
    );

    // One reorder call that writes only the rows whose position changed,
    // instead of two racing per-row writes.
    const move = async (group: Project[], index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= group.length) return;

        const shuffled = [...group];
        [shuffled[index], shuffled[target]] = [
            shuffled[target],
            shuffled[index],
        ];

        // Slot the section's new order back into the slots it already occupies
        // in the full list, leaving every other section's rows untouched.
        const queue = shuffled.map((p) => p.id);
        const inGroup = new Set(group.map((p) => p.id));
        const ids = projects.map((p) =>
            inGroup.has(p.id) ? queue.shift()! : p.id,
        );

        setReordering(group[index].id);
        try {
            await reorderProjects(ids);
            await fetchProjects();
        } catch (err) {
            setError(errorMessage(err));
            console.error(err);
        }
        setReordering(null);
    };

    const inputClass =
        "w-full bg-white/[0.04] border border-[#E8B84B]/15 focus:border-[#E8B84B]/50 text-white text-sm px-4 py-2.5 outline-none transition-colors placeholder-white/20";
    const labelClass =
        "block text-[11px] tracking-widest uppercase text-[#E8B84B]/60 mb-2";

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="min-h-screen text-white">
            <DashboardError
                message={error}
                onDismiss={() => setError(null)}
            />

            {/* Header */}
            <div className="border-b border-[#E8B84B]/10 pb-5 mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">
                        Projects
                    </h1>
                    <p className="text-[11px] text-white/30 mt-1 tracking-widest uppercase">
                        {projects.length} project
                        {projects.length !== 1 ? "s" : ""}
                        {projects.length > 0 && (
                            <span className="text-white/20">
                                {" · "}
                                {sections
                                    .map(
                                        ({ meta, items }) =>
                                            `${items.length} ${meta.label}`,
                                    )
                                    .join(" · ")}
                            </span>
                        )}
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="shrink-0 bg-[#E8394D] hover:bg-[#E8394D]/80 text-white text-[11px] font-medium tracking-widest uppercase px-4 sm:px-5 py-2.5 transition-colors cursor-pointer"
                >
                    + New Project
                </button>
            </div>

            {/* List — one section per project kind */}
            {isFetching ? (
                <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-[#0F0D2A] border border-[#E8B84B]/10 flex items-center gap-4 px-4 py-4 animate-pulse"
                        >
                            <div className="shrink-0 w-8 h-8 bg-white/5 rounded" />
                            <div className="shrink-0 w-16 h-12 sm:w-24 sm:h-16 bg-white/5" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-white/8 rounded w-1/3" />
                                <div className="h-2.5 bg-white/5 rounded w-2/3" />
                                <div className="flex gap-2">
                                    <div className="h-4 w-12 bg-white/5 rounded" />
                                    <div className="h-4 w-16 bg-white/5 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-24 text-white/20 text-xs tracking-widest uppercase">
                    No projects yet. Add your first one.
                </div>
            ) : (
                <div className="space-y-10">
                    {sections.map(({ type, meta, items }) => (
                        <section key={type}>
                            <div className="flex items-baseline justify-between gap-3 mb-3">
                                <h2 className="text-[11px] tracking-widest uppercase text-[#E8B84B]/70">
                                    {meta.heading}
                                </h2>
                                <span className="text-[10px] text-white/20 tabular-nums">
                                    {items.length}
                                </span>
                            </div>

                            {items.length === 0 ? (
                                <p className="border border-dashed border-white/8 px-4 py-8 text-center text-[11px] text-white/20 tracking-wider">
                                    Nothing here yet — set a project&apos;s kind
                                    to {meta.label} to list it in this section.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {items.map((project, index) => (
                                        <ProjectRow
                                            key={project.id}
                                            project={project}
                                            index={index}
                                            count={items.length}
                                            busy={!!reordering}
                                            isMoving={reordering === project.id}
                                            onMoveUp={() =>
                                                move(items, index, -1)
                                            }
                                            onMoveDown={() =>
                                                move(items, index, 1)
                                            }
                                            onEdit={() => openEdit(project)}
                                            onDelete={() =>
                                                setDeleteId(project.id)
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    ))}
                </div>
            )}

            {/* Add / Edit Modal */}
            {showForm && (
                <div
                    className="fixed inset-0 bg-[#050414]/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-5"
                    onClick={(e) => e.target === e.currentTarget && closeForm()}
                >
                    <div className="bg-[#0F0D2A] border border-[#E8B84B]/20 w-full sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                        <div className="px-5 sm:px-7 py-5 border-b border-[#E8B84B]/10 flex items-center justify-between sticky top-0 bg-[#0F0D2A] z-10">
                            <h2 className="text-base font-bold tracking-tight">
                                {editing ? "Edit Project" : "New Project"}
                            </h2>
                            <button
                                onClick={closeForm}
                                className="text-white/30 hover:text-white text-xl leading-none transition-colors cursor-pointer"
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="p-5 sm:p-7 space-y-5"
                        >
                            <div>
                                <label className={labelClass}>Title *</label>
                                <input
                                    className={inputClass}
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="Project name"
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Description
                                </label>
                                <textarea
                                    className={`${inputClass} resize-none min-h-20`}
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Brief description..."
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Kind</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {PROJECT_TYPES.map((type) => {
                                        const selected =
                                            form.project_type === type;
                                        return (
                                            <button
                                                key={type}
                                                type="button"
                                                aria-pressed={selected}
                                                onClick={() =>
                                                    setForm({
                                                        ...form,
                                                        project_type: type,
                                                    })
                                                }
                                                className={`text-[11px] tracking-widest uppercase py-2.5 border transition-colors cursor-pointer ${
                                                    selected
                                                        ? "border-[#E8B84B]/50 bg-[#E8B84B]/10 text-[#E8B84B]"
                                                        : "border-white/10 text-white/35 hover:border-[#E8B84B]/25 hover:text-white/60"
                                                }`}
                                            >
                                                {PROJECT_TYPE_META[type].label}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-[10px] text-white/20 mt-1.5">
                                    {PROJECT_TYPE_META[form.project_type].blurb}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>
                                        Tech Stack
                                    </label>
                                    <input
                                        className={inputClass}
                                        value={techInput}
                                        onChange={(e) =>
                                            setTechInput(e.target.value)
                                        }
                                        placeholder="React, Node.js"
                                    />
                                    <p className="text-[10px] text-white/20 mt-1.5">
                                        comma separated
                                    </p>
                                </div>
                                <div>
                                    <label className={labelClass}>Tag</label>
                                    <input
                                        className={inputClass}
                                        value={tagInput}
                                        onChange={(e) =>
                                            setTagInput(e.target.value)
                                        }
                                        placeholder="e.g. E-Commerce"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>
                                        Live URL
                                    </label>
                                    <input
                                        className={inputClass}
                                        value={form.live_url}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                live_url: e.target.value,
                                            })
                                        }
                                        placeholder="https://..."
                                        type="url"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>
                                        Repo URL
                                    </label>
                                    <input
                                        className={inputClass}
                                        value={form.repo_url}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                repo_url: e.target.value,
                                            })
                                        }
                                        placeholder="https://github.com/..."
                                        type="url"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Thumbnail</label>
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="preview"
                                            className="w-full h-40 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview("");
                                                setImageFile(null);
                                            }}
                                            className="absolute top-2 right-2 bg-black/70 border border-white/20 text-white w-7 h-7 flex items-center justify-center text-sm hover:bg-black transition-colors cursor-pointer"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center border border-dashed border-[#E8B84B]/25 hover:border-[#E8B84B]/50 transition-all px-6 py-8 cursor-pointer">
                                        <span className="text-[11px] tracking-widest uppercase text-white/25">
                                            Click to upload image
                                        </span>
                                        <span className="text-[10px] text-white/15 mt-1">
                                            PNG, JPG, WEBP
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.featured}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            featured: e.target.checked,
                                        })
                                    }
                                    className="w-4 h-4 accent-[#E8B84B] cursor-pointer"
                                />
                                <span className="text-[11px] text-white/35 tracking-wider">
                                    Mark as featured project
                                </span>
                            </label>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#E8394D] hover:bg-[#E8394D]/80 text-white text-[11px] tracking-widest uppercase py-3 transition-colors cursor-pointer font-medium flex items-center justify-center"
                                >
                                    {editing ? (
                                        isEditing ? (
                                            <Cardio
                                                size="20"
                                                stroke="2"
                                                speed="2"
                                                color="white"
                                            />
                                        ) : (
                                            "Save Changes"
                                        )
                                    ) : isCreating ? (
                                        <Cardio
                                            size="20"
                                            stroke="2"
                                            speed="2"
                                            color="white"
                                        />
                                    ) : (
                                        "Add Project"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="px-6 text-[11px] tracking-widest uppercase border border-white/10 text-white/35 hover:border-[#E8B84B]/30 hover:text-[#E8B84B] transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="fixed inset-0 bg-[#050414]/80 backdrop-blur-sm z-50 flex items-center justify-center p-5">
                    <div className="bg-[#0F0D2A] border border-[#E8394D]/25 p-8 w-full max-w-sm text-center">
                        <h3 className="text-base font-bold mb-2">
                            Delete project?
                        </h3>
                        <p className="text-[11px] text-white/35 leading-relaxed mb-7">
                            This action cannot be undone. The project and its
                            image will be permanently removed.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="px-7 py-2.5 text-[11px] tracking-widest uppercase border border-[#E8394D]/40 text-[#E8394D] hover:bg-[#E8394D]/10 hover:border-[#E8394D] transition-all cursor-pointer flex items-center justify-center min-w-20"
                            >
                                {isDeleting ? (
                                    <Cardio
                                        size="20"
                                        stroke="2"
                                        speed="2"
                                        color="white"
                                    />
                                ) : (
                                    "Delete"
                                )}
                            </button>
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-7 py-2.5 text-[11px] tracking-widest uppercase border border-white/10 text-white/35 hover:border-white/25 hover:text-white/55 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/** One row of the project list. Identical in both sections, so it lives here
 *  rather than being duplicated per section. */
function ProjectRow({
    project,
    index,
    count,
    busy,
    isMoving,
    onMoveUp,
    onMoveDown,
    onEdit,
    onDelete,
}: {
    project: Project;
    index: number;
    count: number;
    busy: boolean;
    isMoving: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div
            className={`bg-[#0F0D2A] border border-[#E8B84B]/10 hover:border-[#E8B84B]/25 transition-all duration-200 group ${
                isMoving ? "opacity-50" : ""
            }`}
        >
            <div className="flex items-center gap-4 px-4 py-4">
                {/* Order + arrows */}
                <div className="shrink-0 flex flex-col items-center gap-1">
                    <button
                        onClick={onMoveUp}
                        disabled={index === 0 || busy}
                        className="text-white/20 hover:text-[#E8B84B] disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer leading-none"
                    >
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M18 15L12 9L6 15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <span className="text-[10px] text-white/20 tabular-nums w-5 text-center">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    <button
                        onClick={onMoveDown}
                        disabled={index === count - 1 || busy}
                        className="text-white/20 hover:text-[#E8B84B] disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer leading-none"
                    >
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M6 9L12 15L18 9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* Divider */}
                <div className="shrink-0 w-px h-10 bg-[#E8B84B]/10" />

                {/* Thumbnail */}
                <div className="shrink-0 w-16 h-12 sm:w-24 sm:h-16 bg-white/5 border border-white/5 overflow-hidden">
                    {project.thumbnail_url ? (
                        <img
                            src={project.thumbnail_url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/15 text-[9px] tracking-widest uppercase">
                            No img
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-white truncate">
                            {project.title}
                        </h3>
                        {project.featured && (
                            <span className="shrink-0 text-[9px] tracking-widest uppercase px-2 py-0.5 bg-[#E8B84B]/10 text-[#E8B84B] border border-[#E8B84B]/20">
                                Featured
                            </span>
                        )}
                    </div>
                    <p className="text-[11px] text-white/35 truncate leading-relaxed">
                        {project.description || "No description."}
                    </p>
                </div>

                {/* Links — desktop only */}
                <div className="shrink-0 hidden md:flex flex-col gap-1.5 items-end pr-2">
                    {project.live_url && (
                        <a
                            href={project.live_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] tracking-widest uppercase text-[#E8B84B] hover:text-[#E8B84B]/60 transition-colors"
                        >
                            Live ↗
                        </a>
                    )}
                    {project.repo_url && (
                        <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] tracking-widest uppercase text-white/25 hover:text-white/50 transition-colors"
                        >
                            Repo ↗
                        </a>
                    )}
                </div>
            </div>

            {/* Bottom row — tags + actions */}
            <div className="flex items-center justify-between gap-3 px-4 pb-3 border-t border-white/5 pt-3">
                <div className="flex flex-wrap gap-1.5 min-w-0">
                    {(project.tech_stack ?? []).slice(0, 3).map((t) => (
                        <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 bg-white/5 text-white/45 shrink-0"
                        >
                            {t}
                        </span>
                    ))}
                    {(project.tech_stack ?? []).length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 bg-white/5 text-white/25 shrink-0">
                            +{(project.tech_stack ?? []).length - 3}
                        </span>
                    )}
                    {project.tag && (
                        <span className="text-[10px] px-2 py-0.5 bg-[#E8B84B]/8 text-[#E8B84B]/65 border border-[#E8B84B]/15 shrink-0">
                            {project.tag}
                        </span>
                    )}
                </div>

                <div className="shrink-0 flex gap-2">
                    {project.live_url && (
                        <a
                            href={project.live_url}
                            target="_blank"
                            rel="noreferrer"
                            className="md:hidden text-[10px] tracking-widest uppercase text-[#E8B84B]/70 hover:text-[#E8B84B] transition-colors px-2 py-1.5 border border-[#E8B84B]/15"
                        >
                            Live ↗
                        </a>
                    )}
                    <button
                        onClick={onEdit}
                        className="text-[11px] tracking-wider uppercase px-3 py-1.5 border border-white/10 text-white/35 hover:border-[#E8B84B]/40 hover:text-[#E8B84B] transition-all cursor-pointer"
                    >
                        Edit
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-[11px] tracking-wider uppercase px-3 py-1.5 border border-[#E8394D]/20 text-[#E8394D]/55 hover:border-[#E8394D] hover:text-[#E8394D] transition-all cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
