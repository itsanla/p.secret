"use client";

import { useMemo, useState } from "react";
import CredentialCard from "./credential-card";
import CredentialModal from "./credential-modal";
import type { Credential, ServiceType } from "@/types";

const SERVICES: Array<ServiceType | "all"> = ["all", "aws", "google", "azure", "github", "facebook", "docker", "groq", "gmail", "dns", "payment", "brave", "other"];

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return credentials.filter((c) => {
      const matchService = serviceFilter === "all" || c.service === serviceFilter;
      const matchQuery = !q || c.name.toLowerCase().includes(q) || c.service.toLowerCase().includes(q) || c.tags.some((t) => t.includes(q));
      return matchService && matchQuery;
    });
  }, [credentials, query, serviceFilter]);

  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (c: Credential) => { setEditTarget(c); setModalOpen(true); };

  const handleSave = async (data: Omit<Credential, "id" | "createdAt" | "updatedAt">) => {
    if (editTarget) {
      await onUpdate(editTarget.id, data);
    } else {
      await onAdd(data);
    }
  };

  const usedServices = useMemo(() => {
    const s = new Set(credentials.map((c) => c.service));
    return SERVICES.filter((svc) => svc === "all" || s.has(svc as ServiceType));
  }, [credentials]);

  return (
    <>
      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, service, or tag..."
              className="w-full px-4 py-3 bg-[var(--ios-surface)] border border-[var(--ios-border)] rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600">
                Clear
              </button>
            )}
          </div>
          <button
            onClick={openAdd}
            className="shrink-0 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-2xl hover:bg-slate-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>

        {/* Service filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {usedServices.map((svc) => (
            <button
              key={svc}
              onClick={() => setServiceFilter(svc)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                serviceFilter === svc
                  ? "bg-slate-900 text-white"
                  : "bg-[var(--ios-surface)] border border-[var(--ios-border)] text-slate-600 hover:bg-[var(--ios-surface-alt)]"
              }`}
            >
              {svc === "all" ? `All (${credentials.length})` : svc}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <p className="text-sm">{credentials.length === 0 ? "No credentials yet." : "No results found."}</p>
            {credentials.length === 0 && (
              <button onClick={openAdd} className="mt-3 text-sm text-slate-900 font-medium underline">
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
