"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface SocialLink {
    id: string;
    platform: string;
    slug: string;
    url: string;
    sort_order: number;
    created_at: string;
}

const empty: Omit<SocialLink, "id" | "created_at"> = {
    platform: "",
    slug: "",
    url: "",
    sort_order: 0,
};

const PRESETS = [
    { platform: "GitHub", slug: "github" },
    { platform: "LinkedIn", slug: "linkedin" },
    { platform: "Twitter / X", slug: "x" },
    { platform: "Instagram", slug: "instagram" },
    { platform: "Discord", slug: "discord" },
];

export default function SocialLinksPage() {
    const [links, setLinks] = useState<SocialLink[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<SocialLink | null>(null);
    const [form, setForm] = useState(empty);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [reordering, setReordering] = useState<string | null>(null);

    const inputClass =
        "w-full bg-white/[0.04] border border-[#E8B84B]/15 focus:border-[#E8B84B]/50 text-white text-sm px-4 py-2.5 outline-none transition-colors placeholder-white/20";
    const labelClass =
        "block text-[11px] tracking-widest uppercase text-[#E8B84B]/60 mb-2";

    const fetchLinks = async () => {
        setIsFetching(true);
        const { data, error } = await supabase
            .from("social_links")
            .select("*")
            .order("sort_order", { ascending: true });
        if (error) console.error(error);
        else setLinks(data ?? []);
        setIsFetching(false);
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const openAdd = () => {
        setEditing(null);
        setForm({ ...empty, sort_order: links.length });
        setShowForm(true);
    };

    const openEdit = (link: SocialLink) => {
        setEditing(link);
        setForm({
            platform: link.platform,
            slug: link.slug,
            url: link.url,
            sort_order: link.sort_order,
        });
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditing(null);
    };

    const applyPreset = (preset: { platform: string; slug: string }) => {
        setForm({ ...form, platform: preset.platform, slug: preset.slug });
    };

    const handleNameChange = (value: string) => {
        const autoSlug = value
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/[^a-z0-9]/g, "");
        setForm({ ...form, platform: value, slug: autoSlug });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editing) {
                const { error } = await supabase
                    .from("social_links")
                    .update(form)
                    .eq("id", editing.id);
                if (error) throw new Error(error.message);
            } else {
                const { error } = await supabase
                    .from("social_links")
                    .insert(form);
                if (error) throw new Error(error.message);
            }
            await fetchLinks();
            closeForm();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        setIsDeleting(true);
        const { error } = await supabase
            .from("social_links")
            .delete()
            .eq("id", id);
        if (error) console.error(error);
        else {
            await fetchLinks();
            setDeleteId(null);
        }
        setIsDeleting(false);
    };

    const moveUp = async (index: number) => {
        if (index === 0) return;
        const current = links[index];
        const above = links[index - 1];
        setReordering(current.id);
        await supabase
            .from("social_links")
            .update({ sort_order: above.sort_order })
            .eq("id", current.id);
        await supabase
            .from("social_links")
            .update({ sort_order: current.sort_order })
            .eq("id", above.id);
        await fetchLinks();
        setReordering(null);
    };

    const moveDown = async (index: number) => {
        if (index === links.length - 1) return;
        const current = links[index];
        const below = links[index + 1];
        setReordering(current.id);
        await supabase
            .from("social_links")
            .update({ sort_order: below.sort_order })
            .eq("id", current.id);
        await supabase
            .from("social_links")
            .update({ sort_order: current.sort_order })
            .eq("id", below.id);
        await fetchLinks();
        setReordering(null);
    };

    return (
        <div className="min-h-screen text-white">
            {/* Header */}
            <div className="border-b border-[#E8B84B]/10 flex items-center justify-between pb-6 mb-6">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">
                        Social Links
                    </h1>
                    <p className="text-[11px] text-white/30 mt-1 tracking-widest uppercase">
                        {links.length} link{links.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="bg-[#E8394D] hover:bg-[#E8394D]/80 text-white text-[11px] font-medium tracking-widest uppercase px-5 py-2.5 transition-colors cursor-pointer"
                >
                    + Add Link
                </button>
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-3 bg-[#E8B84B]/5 border border-[#E8B84B]/15 px-5 py-4 mb-6">
                <span className="text-[#E8B84B]/60 text-xs mt-0.5">ℹ</span>
                <p className="text-[11px] text-white/35 leading-relaxed">
                    Icons are served from{" "}
                    <a
                        href="https://simpleicons.org"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#E8B84B]/70 hover:text-[#E8B84B] border-b border-[#E8B84B]/30 transition-colors"
                    >
                        simpleicons.org
                    </a>
                    . Use the preset buttons or search for the correct slug
                    manually.
                </p>
            </div>

            {/* List */}
            <div className="space-y-2">
                {isFetching ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-[#0F0D2A] border border-[#E8B84B]/10 flex items-center gap-4 px-5 py-4 animate-pulse"
                        >
                            <div className="shrink-0 w-8 h-8 bg-white/5 rounded" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3.5 bg-white/8 rounded w-24" />
                                <div className="h-2.5 bg-white/5 rounded w-40" />
                            </div>
                            <div className="flex gap-2">
                                <div className="h-7 w-12 bg-white/5 rounded" />
                                <div className="h-7 w-14 bg-white/5 rounded" />
                            </div>
                        </div>
                    ))
                ) : links.length === 0 ? (
                    <div className="text-center py-24 text-white/20 text-xs tracking-widest uppercase">
                        No social links yet. Add your first one.
                    </div>
                ) : (
                    links.map((link, index) => (
                        <div
                            key={link.id}
                            className={`bg-[#0F0D2A] border border-[#E8B84B]/10 hover:border-[#E8B84B]/25 transition-all duration-200 flex items-center gap-4 px-5 py-3.5 group ${
                                reordering === link.id ? "opacity-50" : ""
                            }`}
                        >
                            {/* Order + arrows */}
                            <div className="shrink-0 flex flex-col items-center gap-1">
                                <button
                                    onClick={() => moveUp(index)}
                                    disabled={index === 0 || !!reordering}
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
                                    onClick={() => moveDown(index)}
                                    disabled={
                                        index === links.length - 1 ||
                                        !!reordering
                                    }
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

                            {/* Icon */}
                            <div className="shrink-0 w-8 h-8 bg-white/5 border border-white/5 flex items-center justify-center">
                                <img
                                    src={`https://cdn.simpleicons.org/${link.slug}`}
                                    alt={link.platform}
                                    className="w-4 h-4"
                                    onError={(e) => {
                                        (
                                            e.target as HTMLImageElement
                                        ).style.display = "none";
                                    }}
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white">
                                    {link.platform}
                                </p>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] text-white/25 hover:text-[#E8B84B]/70 transition-colors truncate block"
                                >
                                    {link.url}
                                </a>
                            </div>

                            {/* Actions */}
                            <div className="shrink-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                <button
                                    onClick={() => openEdit(link)}
                                    className="text-[11px] tracking-wider uppercase px-3 py-1.5 border border-white/10 text-white/35 hover:border-[#E8B84B]/40 hover:text-[#E8B84B] transition-all cursor-pointer"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setDeleteId(link.id)}
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
                    className="fixed inset-0 bg-[#050414]/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-5"
                    onClick={(e) => e.target === e.currentTarget && closeForm()}
                >
                    <div className="bg-[#0F0D2A] border border-[#E8B84B]/20 w-full sm:max-w-md">
                        <div className="px-7 py-5 border-b border-[#E8B84B]/10 flex items-center justify-between">
                            <h2 className="text-base font-bold tracking-tight">
                                {editing ? "Edit Link" : "New Link"}
                            </h2>
                            <button
                                onClick={closeForm}
                                className="text-white/30 hover:text-white text-xl leading-none transition-colors cursor-pointer"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-7 space-y-5">
                            {/* Presets */}
                            <div>
                                <label className={labelClass}>
                                    Quick Presets
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {PRESETS.map((preset) => (
                                        <button
                                            key={preset.slug}
                                            type="button"
                                            onClick={() => applyPreset(preset)}
                                            className="flex items-center gap-2 px-3 py-1.5 border border-white/10 hover:border-[#E8B84B]/30 hover:text-[#E8B84B] text-white/40 text-[11px] tracking-wider transition-all cursor-pointer"
                                        >
                                            <img
                                                src={`https://cdn.simpleicons.org/${preset.slug}`}
                                                alt={preset.platform}
                                                className="w-3.5 h-3.5"
                                            />
                                            {preset.platform}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Platform name */}
                            <div>
                                <label className={labelClass}>
                                    Platform Name *
                                </label>
                                <input
                                    className={inputClass}
                                    value={form.platform}
                                    onChange={(e) =>
                                        handleNameChange(e.target.value)
                                    }
                                    placeholder="e.g. GitHub"
                                    required
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className={labelClass}>
                                    Simple Icons Slug *
                                </label>
                                <input
                                    className={inputClass}
                                    value={form.slug}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            slug: e.target.value,
                                        })
                                    }
                                    placeholder="e.g. github"
                                    required
                                />
                                <p className="text-[10px] text-white/20 mt-1.5">
                                    Auto-generated from name — override if
                                    incorrect
                                </p>
                            </div>

                            {/* Icon preview */}
                            {form.slug && (
                                <div className="flex items-center gap-4 border border-[#E8B84B]/10 bg-[#E8B84B]/3 px-4 py-3">
                                    <div className="w-8 h-8 bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                                        <img
                                            src={`https://cdn.simpleicons.org/${form.slug}`}
                                            alt={form.platform}
                                            className="w-4 h-4"
                                        />
                                    </div>
                                    <p className="text-xs text-white/40">
                                        Icon preview — if blank, the slug may be
                                        incorrect
                                    </p>
                                </div>
                            )}

                            {/* URL */}
                            <div>
                                <label className={labelClass}>URL *</label>
                                <input
                                    className={inputClass}
                                    value={form.url}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            url: e.target.value,
                                        })
                                    }
                                    placeholder="https://github.com/username"
                                    type="url"
                                    required
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-[#E8394D] hover:bg-[#E8394D]/80 disabled:opacity-50 text-white text-[11px] tracking-widest uppercase py-3 transition-colors cursor-pointer font-medium"
                                >
                                    {isSubmitting
                                        ? "Saving..."
                                        : editing
                                          ? "Save Changes"
                                          : "Add Link"}
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
                            Delete link?
                        </h3>
                        <p className="text-[11px] text-white/35 leading-relaxed mb-7">
                            This social link will be permanently removed.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => handleDelete(deleteId)}
                                disabled={isDeleting}
                                className="px-7 py-2.5 text-[11px] tracking-widest uppercase border border-[#E8394D]/40 text-[#E8394D] hover:bg-[#E8394D]/10 hover:border-[#E8394D] disabled:opacity-50 transition-all cursor-pointer"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
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
