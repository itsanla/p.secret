"use client";

import { useState, useEffect } from "react";
import type { Credential, CredentialType, ServiceType } from "@/types";

const SERVICES: ServiceType[] = ["aws", "google", "azure", "github", "facebook", "docker", "groq", "gmail", "dns", "payment", "brave", "other"];
const TYPES: CredentialType[] = ["api_key", "password", "token", "pem", "json", "other"];

interface CredentialModalProps {
  isOpen: boolean;
  editTarget: Credential | null;
  onClose: () => void;
  onSave: (data: Omit<Credential, "id" | "createdAt" | "updatedAt">) => Promise<void>;
}

type FormState = { service: ServiceType; name: string; value: string; type: CredentialType; tags: string[] };
const empty: FormState = { service: "other", name: "", value: "", type: "api_key", tags: [] };

export default function CredentialModal({ isOpen, editTarget, onClose, onSave }: CredentialModalProps) {
  const [form, setForm] = useState<FormState>(empty);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editTarget) {
      setForm({ service: editTarget.service, name: editTarget.name, value: editTarget.value, type: editTarget.type, tags: editTarget.tags });
      setTagInput("");
    } else {
      setForm(empty);
      setTagInput("");
    }
    setError("");
  }, [editTarget, isOpen]);

  const commitTags = () => {
    if (!tagInput.trim()) return;
    const next = tagInput.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
    setForm((f) => ({ ...f, tags: Array.from(new Set([...f.tags, ...next])) }));
    setTagInput("");
  };

  const removeTag = (tag: string) => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.value.trim()) {
      setError("Name and value are required.");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      await onSave(form);
      onClose();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--ios-surface)] rounded-3xl border border-[var(--ios-border)] p-6 w-full max-w-md shadow-[0_30px_80px_rgba(15,23,42,0.15)] animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-900">{editTarget ? "Edit Credential" : "Add Credential"}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--ios-surface-alt)] text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-rose-500 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Service</label>
              <select
                value={form.service}
                onChange={(e) => setForm((f) => ({ ...f, service: e.target.value as ServiceType }))}
                className="w-full px-3 py-2.5 bg-[var(--ios-surface-alt)] border border-[var(--ios-border)] rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as CredentialType }))}
                className="w-full px-3 py-2.5 bg-[var(--ios-surface-alt)] border border-[var(--ios-border)] rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. anlayx.01 groq key"
              className="w-full px-3 py-2.5 bg-[var(--ios-surface-alt)] border border-[var(--ios-border)] rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Value</label>
            <textarea
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
              placeholder="Paste your key, password, or PEM content here..."
              rows={4}
              className="w-full px-3 py-2.5 bg-[var(--ios-surface-alt)] border border-[var(--ios-border)] rounded-xl text-sm font-code text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Tags</label>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[var(--ios-accent-soft)] text-slate-700">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-slate-700">×</button>
                  </span>
                ))}
              </div>
            )}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commitTags(); } }}
              onBlur={commitTags}
              placeholder="Add tags (press Enter or comma)"
              className="w-full px-3 py-2.5 bg-[var(--ios-surface-alt)] border border-[var(--ios-border)] rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-[var(--ios-surface-alt)] rounded-2xl hover:bg-[var(--ios-border)] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="flex-1 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-2xl hover:bg-slate-700 transition-colors disabled:opacity-50">
              {isSaving ? "Saving..." : (editTarget ? "Update" : "Add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
