"use client";

import { useMemo, useState } from "react";
import CredentialCard from "./credential-card";
import CredentialModal from "./credential-modal";
import type { Credential, ServiceType } from "@/types";

const SERVICES: Array<ServiceType | "all"> = ["all", "groq", "aws", "google", "azure", "github", "facebook", "docker", "gmail", "dns", "payment", "brave", "other"];

interface CredentialGridProps {
  credentials: Credential[];
  onAdd: (data: Omit<Credential, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onUpdate: (id: string, data: Omit<Credential, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function CredentialGrid({ credentials, onAdd, onUpdate, onDelete }: CredentialGridProps) {
  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState<ServiceType | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Credential | null>(null);

  const usedServices = useMemo(() => {
    const present = new Set(credentials.map((c) => c.service));
    return SERVICES.filter((s) => s === "all" || present.has(s as ServiceType));
  }, [credentials]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return credentials.filter((c) => {
      const matchService = serviceFilter === "all" || c.service === serviceFilter;
      const matchQuery = !q || c.name.toLowerCase().includes(q) || c.service.includes(q) || c.tags.some((t) => t.includes(q));
      return matchService && matchQuery;
    });
  }, [credentials, query, serviceFilter]);

  const openAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (c: Credential) => {
    setEditTarget(c);
    setModalOpen(true);
  };

  const handleSave = async (data: Omit<Credential, "id" | "createdAt" | "updatedAt">) => {
    if (editTarget) {
      await onUpdate(editTarget.id, data);
    } else {
      await onAdd(data);
    }
  };

  return (
    <>
      <div className="space-y-5">
        {/* Search & Add bar */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                 style={{ color: "var(--text-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search credentials..."
              className="input-dark w-full pl-11 pr-10"
            />
            {query && (
              <button onClick={() => setQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-md transition-colors"
                      style={{ color: "var(--text-muted)", background: "var(--surface-hover)" }}>
                Clear
              </button>
            )}
          </div>
          <button
            onClick={openAdd}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-700 transition-colors border border-slate-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Credential
          </button>
        </div>

        {/* Service filter chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {usedServices.map((svc) => {
            const active = serviceFilter === svc;
            return (
              <button
                key={svc}
                onClick={() => setServiceFilter(svc)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: active ? "var(--accent-soft)" : "var(--surface)",
                  border: `1px solid ${active ? "rgba(99,102,241,0.35)" : "var(--border)"}`,
                  color: active ? "var(--accent-hover)" : "var(--text-secondary)",
                }}
              >
                {svc === "all" ? `All · ${credentials.length}` : svc}
              </button>
            );
          })}
        </div>

        {/* Count */}
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {filtered.length} of {credentials.length} credentials
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20" style={{ color: "var(--text-muted)" }}>
            <p className="text-sm">No results found.</p>
            {credentials.length === 0 && (
              <button onClick={openAdd} className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline">
                Add your first credential
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((c) => (
              <CredentialCard
                key={c.id}
                credential={c}
                onEdit={openEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>

      <CredentialModal
        isOpen={modalOpen}
        editTarget={editTarget}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
