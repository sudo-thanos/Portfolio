"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Cardio } from "ldrs/react";
import "ldrs/react/Cardio.css";

interface Project {
    id: string;
    title: string;
    description: string;
    tech_stack: string[];
    tag: string;
    live_url: string;
    repo_url: string;
    featured: boolean;
    thumbnail_url: string;
}

const empty: Omit<Project, "id"> = {
    title: "",
    description: "",
    tech_stack: [],
    tag: "",
    live_url: "",
    repo_url: "",
    featured: false,
    thumbnail_url: "",
};

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
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

    const openAdd = () => {
        setEditing(null);
        setForm(empty);
        setImageFile(null);
        setImagePreview("");
        setTechInput("");
        setTagInput("");
        setShowForm(true);
    };

    const openEdit = (project: Project) => {
        setEditing(project);
        setForm({ ...project });
        setImagePreview(project.thumbnail_url);
        // setTechInput(project.tech_stack.join(", "));
        // setTagInput(project.tag.join(", "));
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

        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);

        console.log(data);

        setProjects(data);
        setIsFetching(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        editing ? setIsEdting(true) : setIsCreating(true);

        try {
            let thumbnailUrl = form.thumbnail_url; // keep existing url by default

            if (imageFile) {
                const fileExt = imageFile.name.split(".").pop();
                const filePath = `thumbnails/${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from("project-images")
                    .upload(filePath, imageFile);

                if (uploadError) throw new Error(uploadError.message);

                const {
                    data: { publicUrl },
                } = supabase.storage
                    .from("project-images")
                    .getPublicUrl(filePath);

                thumbnailUrl = publicUrl;
            }

            const payload = {
                title: form.title,
                description: form.description,
                tech_stack: techInput
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                tag: tagInput,
                live_url: form.live_url,
                repo_url: form.repo_url,
                featured: form.featured,
                thumbnail_url: thumbnailUrl,
            };

            if (editing) {
                // UPDATE existing project
                const { error } = await supabase
                    .from("projects")
                    .update(payload)
                    .eq("id", editing.id);

                if (error) throw new Error(error.message);
            } else {
                // INSERT new project
                const { error } = await supabase
                    .from("projects")
                    .insert(payload);

                if (error) throw new Error(error.message);
            }

            fetchProjects();
            closeForm();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsCreating(false);
            setIsEdting(false);
        }
    };

    const handleDelete = async (id: string) => {
        setIsDeleting(true);

        const { error } = await supabase.from("projects").delete().eq("id", id);

        if (error) {
            throw new Error(error.message);
        } else {
            setIsDeleting(false);
            setDeleteId(null);
            fetchProjects();
        }

        // remove from local state so UI updates instantly
        // setProjects((prev) => prev.filter((p) => p.id !== id));
        // setDeleteId(null);
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
            {/* Header */}
            <div className="border-b border-[#E8B84B]/10 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">
                        Projects
                    </h1>
                    <p className="text-[11px] text-white/30 mt-1 tracking-widest uppercase">
                        {projects.length} project
                        {projects.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="bg-[#E8394D] hover:bg-[#E8394D]/80 text-white text-[11px] font-medium tracking-widest uppercase px-5 py-2.5 transition-colors cursor-pointer"
                >
                    + New Project
                </button>
            </div>

            {/* List */}
            <div className="py-6 space-y-2">
                {isFetching ? (
                    // Skeleton
                    Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-[#0F0D2A] border border-[#E8B84B]/10 flex items-center gap-5 px-5 py-4 animate-pulse"
                        >
                            {/* Thumbnail skeleton */}
                            <div className="shrink-0 w-24 h-16 bg-white/5" />

                            {/* Info skeleton */}
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-white/8 rounded w-1/3" />
                                <div className="h-2.5 bg-white/5 rounded w-2/3" />
                                <div className="flex gap-2">
                                    <div className="h-4 w-12 bg-white/5 rounded" />
                                    <div className="h-4 w-16 bg-white/5 rounded" />
                                </div>
                            </div>

                            {/* Actions skeleton */}
                            <div className="shrink-0 flex gap-2">
                                <div className="h-7 w-12 bg-white/5 rounded" />
                                <div className="h-7 w-14 bg-white/5 rounded" />
                            </div>
                        </div>
                    ))
                ) : projects.length === 0 ? (
                    <div className="text-center py-24 text-white/20 text-xs tracking-widest uppercase">
                        No projects yet. Add your first one.
                    </div>
                ) : (
                    projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-[#0F0D2A] border border-[#E8B84B]/10 hover:border-[#E8B84B]/25 transition-all duration-200 flex items-center gap-5 px-5 py-4 group"
                        >
                            {/* Thumbnail */}
                            <div className="shrink-0 w-24 h-16 bg-white/5 border border-white/5 overflow-hidden">
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
                                <p className="text-[11px] text-white/35 truncate mb-2.5 leading-relaxed">
                                    {project.description || "No description."}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {project.tech_stack.map((t) => (
                                        <span
                                            key={t}
                                            className="text-[10px] px-2 py-0.5 bg-white/5 text-white/45"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                    <span
                                        key={project.tag}
                                        className="text-[10px] px-2 py-0.5 bg-[#E8B84B]/8 text-[#E8B84B]/65 border border-[#E8B84B]/15"
                                    >
                                        {project.tag}
                                    </span>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="shrink-0 hidden sm:flex flex-col gap-1.5 items-end pr-2">
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

                            {/* Actions — visible on hover */}
                            <div className="shrink-0 flex gap-2 transition-opacity duration-150">
                                <button
                                    onClick={() => openEdit(project)}
                                    className="text-[11px] tracking-wider uppercase px-3 py-1.5 border border-white/10 text-white/35 hover:border-[#E8B84B]/40 hover:text-[#E8B84B] transition-all cursor-pointer"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setDeleteId(project.id)}
                                    className="text-[11px] tracking-wider uppercase px-3 py-1.5 border border-[#E8394D]/20 text-[#E8394D]/55 hover:border-[#E8394D] hover:text-[#E8394D] transition-all cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add / Edit Modal */}
            {showForm && (
                <div
                    className="fixed inset-0 bg-[#050414]/80 backdrop-blur-sm z-50 flex items-center justify-center p-5"
                    onClick={(e) => e.target === e.currentTarget && closeForm()}
                >
                    <div className="bg-[#0F0D2A] border border-[#E8B84B]/20 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="px-7 py-5 border-b border-[#E8B84B]/10 flex items-center justify-between">
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

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-7 space-y-5">
                            {/* Title */}
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

                            {/* Description */}
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

                            {/* Tech Stack + tag */}
                            <div className="grid grid-cols-2 gap-4">
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
                                    <label className={labelClass}>tag</label>
                                    <input
                                        className={inputClass}
                                        value={tagInput}
                                        onChange={(e) =>
                                            setTagInput(e.target.value)
                                        }
                                        placeholder="freelance, personal"
                                    />
                                    <p className="text-[10px] text-white/20 mt-1.5">
                                        comma separated
                                    </p>
                                </div>
                            </div>

                            {/* URLs */}
                            <div className="grid grid-cols-2 gap-4">
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

                            {/* Image Upload */}
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
                                    <label className="flex flex-col items-center justify-center border border-dashed border-[#E8B84B]/25 hover:border-[#E8B84B]/50 hover:bg-[#E8B84B]/3 transition-all px-6 py-8 cursor-pointer">
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

                            {/* Featured */}
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

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#E8394D] hover:bg-[#E8394D]/80 text-white text-[11px] tracking-widest uppercase py-3 transition-colors cursor-pointer font-medium"
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
                                className="px-7 py-2.5 text-[11px] tracking-widest uppercase border border-[#E8394D]/40 text-[#E8394D] hover:bg-[#E8394D]/10 hover:border-[#E8394D] transition-all cursor-pointer"
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
