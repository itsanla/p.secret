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
}

export default function CredentialCard({ credential }: CredentialCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const style = SERVICE_STYLE[credential.service] ?? SERVICE_STYLE.other;

  const copyValue = async () => {
    await navigator.clipboard.writeText(credential.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
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
