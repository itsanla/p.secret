"use client";

import { useState } from "react";
import type { Credential } from "@/types";

const SERVICE_BADGE: Record<string, string> = {
  aws: "bg-orange-100 text-orange-700",
  google: "bg-blue-100 text-blue-700",
  azure: "bg-sky-100 text-sky-700",
  github: "bg-slate-800 text-white",
  facebook: "bg-indigo-100 text-indigo-700",
  docker: "bg-cyan-100 text-cyan-700",
  groq: "bg-green-100 text-green-700",
  gmail: "bg-red-100 text-red-700",
  dns: "bg-purple-100 text-purple-700",
  payment: "bg-emerald-100 text-emerald-700",
  brave: "bg-orange-100 text-orange-700",
  other: "bg-slate-100 text-slate-600",
};

interface CredentialCardProps {
  credential: Credential;
  onEdit: (credential: Credential) => void;
  onDelete: (id: string) => void;
}

export default function CredentialCard({ credential, onEdit, onDelete }: CredentialCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const copyValue = async () => {
    await navigator.clipboard.writeText(credential.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isLong = credential.value.length > 60;
  const badgeClass = SERVICE_BADGE[credential.service] ?? SERVICE_BADGE.other;

  return (
    <div className="relative bg-[var(--ios-surface)] rounded-3xl border border-[var(--ios-border)] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.07)] flex flex-col gap-4 animate-in zoom-in-95">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${badgeClass}`}>
              {credential.service}
            </span>
            <span className="text-xs text-slate-400 bg-[var(--ios-surface-alt)] px-2 py-0.5 rounded-full">
              {credential.type.replace("_", " ")}
            </span>
          </div>
          <p className="text-slate-900 font-semibold truncate">{credential.name}</p>
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(credential)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[var(--ios-surface-alt)] transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Value */}
      <div className="relative">
        {revealed ? (
          <div
            className={`font-code text-sm text-slate-800 bg-[var(--ios-surface-alt)] rounded-2xl p-3 break-all cursor-pointer ${isLong ? "max-h-28 overflow-y-auto" : ""}`}
            onClick={copyValue}
            title="Click to copy"
          >
            {credential.value}
          </div>
        ) : (
          <div className="font-code text-xl tracking-widest text-slate-300 bg-[var(--ios-surface-alt)] rounded-2xl px-4 py-3 select-none">
            ••••••••••••••••
          </div>
        )}

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setRevealed((v) => !v)}
            className="flex-1 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 bg-[var(--ios-surface-alt)] hover:bg-[var(--ios-border)] rounded-xl transition-colors"
          >
            {revealed ? "Hide" : "Reveal"}
          </button>
          <button
            onClick={copyValue}
            className="flex-1 py-2 text-xs font-medium text-slate-900 bg-slate-900 hover:bg-slate-700 text-white rounded-xl transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Tags */}
      {credential.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {credential.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[var(--ios-accent-soft)] text-slate-600">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Delete confirm overlay */}
      {confirmDelete && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-3 z-10 p-4">
          <p className="text-sm font-medium text-slate-900 text-center">Delete this credential?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-4 py-2 text-sm text-slate-600 bg-[var(--ios-surface-alt)] rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={() => { setConfirmDelete(false); onDelete(credential.id); }}
              className="px-4 py-2 text-sm text-white bg-rose-500 hover:bg-rose-600 rounded-xl"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
