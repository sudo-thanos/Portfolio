"use client";

import { useEffect, useState } from "react";
import DashboardError, { errorMessage } from "@/components/DashboardError";
import {
    deleteResume,
    listResumes,
    setCurrentResume,
    uploadResume,
} from "@/lib/db";

import type { Resume } from "@/lib/types";

export default function ResumePage() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [label, setLabel] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [settingCurrentId, setSettingCurrentId] = useState<string | null>(
        null,
    );

    const inputClass =
        "w-full bg-white/[0.04] border border-[#E8B84B]/15 focus:border-[#E8B84B]/50 text-white text-sm px-4 py-2.5 outline-none transition-colors placeholder-white/20";
    const labelClass =
        "block text-[11px] tracking-widest uppercase text-[#E8B84B]/60 mb-2";

    const fetchResumes = async () => {
        setIsFetching(true);
        try {
            setResumes(await listResumes());
        } catch (err) {
            setError(errorMessage(err));
            console.error(err);
        }
        setIsFetching(false);
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        setIsUploading(true);

        try {
            // Stores the blob and creates the row together, cleaning up the
            // blob if the row fails — so neither is left orphaned.
            await uploadResume(label, file);

            await fetchResumes();
            setShowForm(false);
            setLabel("");
            setFile(null);
        } catch (err) {
            setError(errorMessage(err));
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    const setAsCurrent = async (id: string) => {
        setSettingCurrentId(id);
        try {
            // Clear-then-set, so two rows are never both current.
            await setCurrentResume(id);
            await fetchResumes();
        } catch (err) {
            setError(errorMessage(err));
            console.error(err);
        } finally {
            setSettingCurrentId(null);
        }
    };

    const handleDelete = async (id: string) => {
        const resume = resumes.find((r) => r.id === id);
        if (!resume) return;

        setIsDeleting(true);
        try {
            // Removes the row, its stored file, and promotes a replacement if
            // this was the live CV.
            await deleteResume(resume);
            await fetchResumes();
            setDeleteId(null);
        } catch (err) {
            setError(errorMessage(err));
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen text-white">
            <DashboardError
                message={error}
                onDismiss={() => setError(null)}
            />

            {/* Header */}
            <div className="border-b border-[#E8B84B]/10 flex items-center justify-between pb-6 mb-6">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Resume</h1>
                    <p className="text-[11px] text-white/30 mt-1 tracking-widest uppercase">
                        {resumes.length} version
                        {resumes.length !== 1 ? "s" : ""} uploaded
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-[#E8394D] hover:bg-[#E8394D]/80 text-white text-[11px] font-medium tracking-widest uppercase px-5 py-2.5 transition-colors cursor-pointer"
                >
                    + Upload Resume
                </button>
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-3 bg-[#E8B84B]/5 border border-[#E8B84B]/15 px-5 py-4 mb-6">
                <span className="text-[#E8B84B]/60 text-xs mt-0.5">ℹ</span>
                <p className="text-[11px] text-white/35 leading-relaxed">
                    Only the <span className="text-[#E8B84B]/70">Current</span>{" "}
                    resume will be served to your portfolio visitors for
                    download. Mark any version as current to make it the active
                    one.
                </p>
            </div>

            {/* List */}
            <div className="space-y-2">
                {isFetching ? (
                    Array.from({ length: 2 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-[#0F0D2A] border border-[#E8B84B]/10 flex items-center gap-5 px-5 py-4 animate-pulse"
                        >
                            <div className="flex-1 space-y-2">
                                <div className="h-3.5 bg-white/8 rounded w-1/3" />
                                <div className="h-2.5 bg-white/5 rounded w-1/4" />
                            </div>
                            <div className="h-6 w-20 bg-white/5 rounded" />
                            <div className="flex gap-2">
                                <div className="h-7 w-16 bg-white/5 rounded" />
                                <div className="h-7 w-14 bg-white/5 rounded" />
                            </div>
                        </div>
                    ))
                ) : resumes.length === 0 ? (
                    <div className="text-center py-24 text-white/20 text-xs tracking-widest uppercase">
                        No resumes uploaded yet.
                    </div>
                ) : (
                    resumes.map((resume) => (
                        <div
                            key={resume.id}
                            className={`bg-[#0F0D2A] border transition-all duration-200 flex items-center gap-5 px-5 py-4 group ${
                                resume.is_current
                                    ? "border-[#E8B84B]/30"
                                    : "border-[#E8B84B]/10 hover:border-[#E8B84B]/20"
                            }`}
                        >
                            {/* PDF icon */}
                            <div className="shrink-0 w-10 h-10 bg-[#E8394D]/10 border border-[#E8394D]/20 flex items-center justify-center">
                                <span className="text-[9px] tracking-widest uppercase text-[#E8394D]/70 font-bold">
                                    PDF
                                </span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-sm font-semibold text-white truncate">
                                        {resume.label}
                                    </h3>
                                    {resume.is_current && (
                                        <span className="shrink-0 text-[9px] tracking-widest uppercase px-2 py-0.5 bg-[#E8B84B]/10 text-[#E8B84B] border border-[#E8B84B]/20">
                                            Current
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-white/25 truncate">
                                        {resume.file_name}
                                    </span>
                                    <span className="text-white/15 text-[10px]">
                                        ·
                                    </span>
                                    <span className="text-[11px] text-white/20">
                                        {formatDate(resume.created_at)}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                {/* Preview */}
                                <a
                                    href={resume.file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] tracking-wider uppercase px-3 py-1.5 border border-white/10 text-white/35 hover:border-[#E8B84B]/40 hover:text-[#E8B84B] transition-all cursor-pointer"
                                >
                                    View
                                </a>

                                {/* Set as current */}
                                {!resume.is_current && (
                                    <button
                                        onClick={() => setAsCurrent(resume.id)}
                                        disabled={!!settingCurrentId}
                                        className="text-[11px] tracking-wider uppercase px-3 py-1.5 border border-[#E8B84B]/20 text-[#E8B84B]/50 hover:border-[#E8B84B] hover:text-[#E8B84B] disabled:opacity-40 transition-all cursor-pointer"
                                    >
                                        {settingCurrentId === resume.id
                                            ? "Setting..."
                                            : "Set Current"}
                                    </button>
                                )}

                                {/* Delete */}
                                <button
                                    onClick={() => setDeleteId(resume.id)}
                                    className="text-[11px] tracking-wider uppercase px-3 py-1.5 border border-[#E8394D]/20 text-[#E8394D]/55 hover:border-[#E8394D] hover:text-[#E8394D] transition-all cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Upload Modal */}
            {showForm && (
                <div
                    className="fixed inset-0 bg-[#050414]/80 backdrop-blur-sm z-50 flex items-center justify-center p-5"
                    onClick={(e) =>
                        e.target === e.currentTarget && setShowForm(false)
                    }
                >
                    <div className="bg-[#0F0D2A] border border-[#E8B84B]/20 w-full max-w-md">
                        <div className="px-7 py-5 border-b border-[#E8B84B]/10 flex items-center justify-between">
                            <h2 className="text-base font-bold tracking-tight">
                                Upload Resume
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-white/30 hover:text-white text-xl leading-none transition-colors cursor-pointer"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="p-7 space-y-5">
                            {/* Label */}
                            <div>
                                <label className={labelClass}>Label</label>
                                <input
                                    className={inputClass}
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    placeholder="e.g. Resume 2025, Frontend Version..."
                                />
                                <p className="text-[10px] text-white/20 mt-1.5">
                                    Optional — defaults to filename if left
                                    empty
                                </p>
                            </div>

                            {/* File upload */}
                            <div>
                                <label className={labelClass}>File *</label>
                                {file ? (
                                    <div className="flex items-center gap-3 border border-[#E8B84B]/20 bg-[#E8B84B]/5 px-4 py-3">
                                        <span className="text-[9px] tracking-widest uppercase text-[#E8394D]/70 font-bold bg-[#E8394D]/10 border border-[#E8394D]/20 px-2 py-1">
                                            PDF
                                        </span>
                                        <span className="text-sm text-white/60 truncate flex-1">
                                            {file.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setFile(null)}
                                            className="text-white/30 hover:text-white transition-colors cursor-pointer text-lg leading-none"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center border border-dashed border-[#E8B84B]/25 hover:border-[#E8B84B]/50 hover:bg-[#E8B84B]/3 transition-all px-6 py-8 cursor-pointer">
                                        <span className="text-[11px] tracking-widest uppercase text-white/25">
                                            Click to upload PDF
                                        </span>
                                        <span className="text-[10px] text-white/15 mt-1">
                                            PDF only
                                        </span>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) =>
                                                setFile(
                                                    e.target.files?.[0] ?? null,
                                                )
                                            }
                                            className="hidden"
                                            required
                                        />
                                    </label>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={isUploading || !file}
                                    className="flex-1 bg-[#E8394D] hover:bg-[#E8394D]/80 disabled:opacity-50 text-white text-[11px] tracking-widest uppercase py-3 transition-colors cursor-pointer font-medium"
                                >
                                    {isUploading ? "Uploading..." : "Upload"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
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
                            Delete resume?
                        </h3>
                        <p className="text-[11px] text-white/35 leading-relaxed mb-7">
                            This will permanently delete the file from storage
                            and cannot be undone.
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
