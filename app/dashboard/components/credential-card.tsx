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
  brave: "bg-orange-100 text-orange-600",
  other: "bg-slate-100 text-slate-600",
};

interface CredentialCardProps {
  credential: Credential;
}

export default function CredentialCard({ credential }: CredentialCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyValue = async () => {
    await navigator.clipboard.writeText(credential.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isLong = credential.value.length > 80;
  const badgeClass = SERVICE_BADGE[credential.service] ?? SERVICE_BADGE.other;

  return (
    <div className="bg-[var(--ios-surface)] rounded-3xl border border-[var(--ios-border)] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.07)] flex flex-col gap-4 animate-in zoom-in-95">
      {/* Header */}
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${badgeClass}`}>
              {credential.service}
            </span>
            <span className="text-[10px] text-slate-400 bg-[var(--ios-surface-alt)] px-2 py-0.5 rounded-full">
              {credential.type.replace("_", " ")}
            </span>
          </div>
          <p className="text-slate-900 font-semibold text-sm truncate">{credential.name}</p>
        </div>
      </div>

      {/* Value */}
      <div>
        {revealed ? (
          <div
            className={`font-code text-xs text-slate-800 bg-[var(--ios-surface-alt)] rounded-2xl p-3 break-all cursor-pointer select-all ${isLong ? "max-h-32 overflow-y-auto" : ""}`}
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
            className={`flex-1 py-2 text-xs font-medium rounded-xl transition-colors ${
              copied ? "bg-emerald-500 text-white" : "bg-slate-900 hover:bg-slate-700 text-white"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Tags */}
      {credential.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {credential.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--ios-accent-soft)] text-slate-500">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
