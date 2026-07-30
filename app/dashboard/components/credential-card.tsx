"use client";

import { useState } from "react";
import type { Credential } from "@/types";

const SERVICE_STYLE: Record<string, { badge: string; ring: string; initial: string }> = {
  aws:      { badge: "text-orange-400 bg-orange-500/10 border-orange-500/25",  ring: "bg-orange-500/15 text-orange-300",  initial: "#f97316" },
  google:   { badge: "text-blue-400   bg-blue-500/10   border-blue-500/25",    ring: "bg-blue-500/15   text-blue-300",    initial: "#3b82f6" },
  azure:    { badge: "text-sky-400    bg-sky-500/10    border-sky-500/25",     ring: "bg-sky-500/15    text-sky-300",     initial: "#0ea5e9" },
  github:   { badge: "text-slate-300  bg-white/5       border-white/15",       ring: "bg-white/10      text-white",       initial: "#94a3b8" },
  facebook: { badge: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25",  ring: "bg-indigo-500/15 text-indigo-300",  initial: "#6366f1" },
  docker:   { badge: "text-cyan-400   bg-cyan-500/10   border-cyan-500/25",    ring: "bg-cyan-500/15   text-cyan-300",    initial: "#06b6d4" },
  groq:     { badge: "text-green-400  bg-green-500/10  border-green-500/25",   ring: "bg-green-500/15  text-green-300",   initial: "#22c55e" },
  gmail:    { badge: "text-red-400    bg-red-500/10    border-red-500/25",     ring: "bg-red-500/15    text-red-300",     initial: "#ef4444" },
  dns:      { badge: "text-purple-400 bg-purple-500/10 border-purple-500/25",  ring: "bg-purple-500/15 text-purple-300",  initial: "#a855f7" },
  payment:  { badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", ring: "bg-emerald-500/15 text-emerald-300", initial: "#10b981" },
  brave:    { badge: "text-orange-300 bg-orange-400/10 border-orange-400/25",  ring: "bg-orange-400/15 text-orange-200",  initial: "#fb923c" },
  other:    { badge: "text-slate-400  bg-white/5       border-white/10",       ring: "bg-white/8       text-slate-400",   initial: "#64748b" },
};

interface CredentialCardProps {
  credential: Credential;
  onEdit: (c: Credential) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function CredentialCard({ credential, onEdit, onDelete }: CredentialCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const style = SERVICE_STYLE[credential.service] ?? SERVICE_STYLE.other;

  const copyValue = async () => {
    await navigator.clipboard.writeText(credential.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDeleteClick = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete(credential.id);
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  const isLong = credential.value.length > 80;

  return (
    <div className="card card-hover animate-in flex flex-col gap-3.5 p-5 transition-all duration-200">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Service initial */}
          <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${style.ring}`}>
            {credential.service.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm leading-tight truncate" style={{ color: "var(--text)" }}>
              {credential.name}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${style.badge}`}>
                {credential.service}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md"
                    style={{ color: "var(--text-muted)", background: "var(--surface-alt)", border: "1px solid var(--border)" }}>
                {credential.type.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(credential)}
            className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-slate-400 hover:text-slate-200 transition-colors"
            title="Edit"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          
          <button
            onClick={handleDeleteClick}
            className={`p-1.5 rounded-lg transition-colors ${confirmDelete ? "bg-rose-500/20 text-rose-400" : "hover:bg-rose-500/10 text-slate-400 hover:text-rose-400"}`}
            title={confirmDelete ? "Click again to confirm delete" : "Delete"}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : confirmDelete ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Value area */}
      <div>
        {revealed ? (
          <div
            onClick={copyValue}
            title="Click to copy"
            className={`font-code text-xs rounded-xl p-3 cursor-pointer break-all select-all transition-colors ${isLong ? "max-h-28 overflow-y-auto" : ""}`}
            style={{
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(99,102,241,0.2)",
              color: "#86efac",
            }}
          >
            {credential.value}
          </div>
        ) : (
          <div className="font-code rounded-xl px-4 py-3.5 select-none"
               style={{
                 background: "rgba(0,0,0,0.25)",
                 border: "1px solid var(--border)",
                 color: "var(--text-muted)",
                 letterSpacing: "0.15em",
                 fontSize: "1.1rem",
               }}>
            ● ● ● ● ● ● ● ● ● ●
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => setRevealed((v) => !v)}
          className="flex-1 py-2 text-xs font-medium rounded-xl transition-colors"
          style={{
            background: "var(--surface-alt)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          {revealed ? "Hide" : "Reveal"}
        </button>
        <button
          onClick={copyValue}
          className="flex-1 py-2 text-xs font-medium rounded-xl transition-all"
          style={{
            background: copied ? "rgba(34,197,94,0.15)" : "var(--accent-soft)",
            border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(99,102,241,0.25)"}`,
            color: copied ? "#4ade80" : "var(--accent-hover)",
          }}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* Tags */}
      {credential.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {credential.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ color: "var(--text-muted)", border: "1px solid var(--border)", background: "transparent" }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
