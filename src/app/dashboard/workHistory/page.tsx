"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface WorkHistory {
    id: string;
    role: string;
    company: string;
    location: string;
    type: string;
    period: string;
    description: string[];
    sort_order: number;
}

const WORK_TYPES = [
    "Full-Time",
    "Part-Time",
    "Contract",
    "Internship",
    "Volunteer",
    "Freelance",
];

const typeColors: Record<string, string> = {
    "Full-Time": "bg-[#E8B84B]/10 text-[#E8B84B] border-[#E8B84B]/20",
    Internship: "bg-white/5 text-white/40 border-white/10",
    Volunteer: "bg-[#E8394D]/10 text-[#E8394D]/80 border-[#E8394D]/20",
    Contract: "bg-white/5 text-white/40 border-white/10",
    "Part-Time": "bg-white/5 text-white/40 border-white/10",
    Freelance: "bg-white/5 text-white/40 border-white/10",
};

const empty: Omit<WorkHistory, "id"> = {
    role: "",
    company: "",
    location: "",
    type: "Full-Time",
    period: "",
    description: [],
    sort_order: 0,
};

export default function WorkHistoryPage() {
    const [entries, setEntries] = useState<WorkHistory[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<WorkHistory | null>(null);
    const [form, setForm] = useState(empty);
    const [descInput, setDescInput] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [reordering, setReordering] = useState<string | null>(null);

    const inputClass =
        "w-full bg-white/[0.04] border border-[#E8B84B]/15 focus:border-[#E8B84B]/50 text-white text-sm px-4 py-2.5 outline-none transition-colors placeholder-white/20";
    const labelClass =
        "block text-[11px] tracking-widest uppercase text-[#E8B84B]/60 mb-2";

    const fetchEntries = async () => {
        setIsFetching(true);
        const { data, error } = await supabase
            .from("work_history")
            .select("*")
            .order("sort_order", { ascending: true });
        if (error) console.error(error);
        else setEntries(data ?? []);
        setIsFetching(false);
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const openAdd = () => {
        setEditing(null);
        setForm({ ...empty, sort_order: entries.length });
        setDescInput("");
        setShowForm(true);
    };

    const openEdit = (entry: WorkHistory) => {
        setEditing(entry);
        setForm({ ...entry });
        setDescInput((entry.description ?? []).join("\n"));
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditing(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            ...form,
            description: descInput
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
        };

        try {
            if (editing) {
                const { error } = await supabase
                    .from("work_history")
                    .update(payload)
                    .eq("id", editing.id);
                if (error) throw new Error(error.message);
            } else {
                const { error } = await supabase
                    .from("work_history")
                    .insert(payload);
                if (error) throw new Error(error.message);
            }
            await fetchEntries();
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
            .from("work_history")
            .delete()
            .eq("id", id);
        if (error) console.error(error);
        else {
            await fetchEntries();
            setDeleteId(null);
        }
        setIsDeleting(false);
    };

    const moveUp = async (index: number) => {
        if (index === 0) return;
        const current = entries[index];
        const above = entries[index - 1];
        setReordering(current.id);
        await supabase
            .from("work_history")
            .update({ sort_order: above.sort_order })
            .eq("id", current.id);
        await supabase
            .from("work_history")
            .update({ sort_order: current.sort_order })
            .eq("id", above.id);
        await fetchEntries();
        setReordering(null);
    };

    const moveDown = async (index: number) => {
        if (index === entries.length - 1) return;
        const current = entries[index];
        const below = entries[index + 1];
        setReordering(current.id);
        await supabase
            .from("work_history")
            .update({ sort_order: below.sort_order })
            .eq("id", current.id);
        await supabase
            .from("work_history")
            .update({ sort_order: current.sort_order })
            .eq("id", below.id);
        await fetchEntries();
        setReordering(null);
    };

    return (
        <div className="min-h-screen text-white">
            {/* Header */}
            <div className="border-b border-[#E8B84B]/10 flex items-center justify-between pb-6 mb-6">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">
                        Work History
                    </h1>
                    <p className="text-[11px] text-white/30 mt-1 tracking-widest uppercase">
                        {entries.length} entr
                        {entries.length !== 1 ? "ies" : "y"}
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="bg-[#E8394D] hover:bg-[#E8394D]/80 text-white text-[11px] font-medium tracking-widest uppercase px-5 py-2.5 transition-colors cursor-pointer"
                >
                    + New Entry
                </button>
            </div>

            {/* List */}
            <div className="space-y-2">
                {isFetching ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-[#0F0D2A] border border-[#E8B84B]/10 flex items-center gap-5 px-5 py-4 animate-pulse"
                        >
                            <div className="shrink-0 w-8 h-8 bg-white/5 rounded" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3.5 bg-white/8 rounded w-1/3" />
                                <div className="h-2.5 bg-white/5 rounded w-1/4" />
                            </div>
                            <div className="h-6 w-20 bg-white/5 rounded" />
                            <div className="flex gap-2">
                                <div className="h-7 w-12 bg-white/5 rounded" />
                                <div className="h-7 w-14 bg-white/5 rounded" />
                            </div>
                        </div>
                    ))
                ) : entries.length === 0 ? (
                    <div className="text-center py-24 text-white/20 text-xs tracking-widest uppercase">
                        No work history yet. Add your first entry.
                    </div>
                ) : (
                    entries.map((entry, index) => (
                        <div
                            key={entry.id}
                            className={`bg-[#0F0D2A] border border-[#E8B84B]/10 hover:border-[#E8B84B]/25 transition-all duration-200 flex items-center gap-4 px-5 py-4 group ${
                                reordering === entry.id ? "opacity-50" : ""
                            }`}
                        >
                            {/* Order indicator + arrows */}
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
                                        index === entries.length - 1 ||
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

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-sm font-semibold text-white truncate">
                                        {entry.role}
                                    </h3>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                    <span className="text-[11px] text-white/45">
                                        {entry.company}
                                    </span>
                                    {entry.location && (
                                        <>
                                            <span className="text-white/20 text-[10px]">
                                                ·
                                            </span>
                                            <span className="text-[11px] text-white/30">
                                                {entry.location}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Period */}
                            <div className="shrink-0 hidden sm:block">
                                <span className="text-[11px] text-white/25 tracking-wider">
                                    {entry.period}
                                </span>
                            </div>

                            {/* Type badge */}
                            <div className="shrink-0">
                                <span
                                    className={`text-[9px] tracking-widest uppercase px-2.5 py-1 border ${typeColors[entry.type] ?? "bg-white/5 text-white/40 border-white/10"}`}
                                >
                                    {entry.type}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="shrink-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                <button
                                    onClick={() => openEdit(entry)}
                                    className="text-[11px] tracking-wider uppercase px-3 py-1.5 border border-white/10 text-white/35 hover:border-[#E8B84B]/40 hover:text-[#E8B84B] transition-all cursor-pointer"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setDeleteId(entry.id)}
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
                        <div className="px-7 py-5 border-b border-[#E8B84B]/10 flex items-center justify-between">
                            <h2 className="text-base font-bold tracking-tight">
                                {editing ? "Edit Entry" : "New Entry"}
                            </h2>
                            <button
                                onClick={closeForm}
                                className="text-white/30 hover:text-white text-xl leading-none transition-colors cursor-pointer"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-7 space-y-5">
                            {/* Role */}
                            <div>
                                <label className={labelClass}>Role *</label>
                                <input
                                    className={inputClass}
                                    value={form.role}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            role: e.target.value,
                                        })
                                    }
                                    placeholder="e.g. Frontend Developer"
                                    required
                                />
                            </div>

                            {/* Company + Location */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>
                                        Company *
                                    </label>
                                    <input
                                        className={inputClass}
                                        value={form.company}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                company: e.target.value,
                                            })
                                        }
                                        placeholder="Company name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>
                                        Location
                                    </label>
                                    <input
                                        className={inputClass}
                                        value={form.location}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                location: e.target.value,
                                            })
                                        }
                                        placeholder="e.g. Nigeria"
                                    />
                                </div>
                            </div>

                            {/* Type + Period */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Type</label>
                                    <select
                                        className={`${inputClass} cursor-pointer`}
                                        value={form.type}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                type: e.target.value,
                                            })
                                        }
                                    >
                                        {WORK_TYPES.map((t) => (
                                            <option
                                                key={t}
                                                value={t}
                                                className="bg-[#0F0D2A]"
                                            >
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Period</label>
                                    <input
                                        className={inputClass}
                                        value={form.period}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                period: e.target.value,
                                            })
                                        }
                                        placeholder="e.g. Jan 2024 - Present"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className={labelClass}>
                                    Description
                                </label>
                                <textarea
                                    className={`${inputClass} resize-none min-h-[140px]`}
                                    value={descInput}
                                    onChange={(e) =>
                                        setDescInput(e.target.value)
                                    }
                                    placeholder={
                                        "One bullet point per line...\nLed frontend development...\nOptimized performance..."
                                    }
                                />
                                <p className="text-[10px] text-white/20 mt-1.5">
                                    One point per line — each line becomes a
                                    bullet
                                </p>
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
                                          : "Add Entry"}
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
                            Delete entry?
                        </h3>
                        <p className="text-[11px] text-white/35 leading-relaxed mb-7">
                            This action cannot be undone. This work history
                            entry will be permanently removed.
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
