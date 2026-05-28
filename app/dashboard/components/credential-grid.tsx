"use client";

import { useMemo, useState } from "react";
import CredentialCard from "./credential-card";
import type { Credential, ServiceType } from "@/types";

const ALL_SERVICES: Array<ServiceType | "all"> = ["all", "groq", "aws", "google", "azure", "github", "facebook", "docker", "gmail", "dns", "payment", "brave", "other"];

interface CredentialGridProps {
  credentials: Credential[];
}

export default function CredentialGrid({ credentials }: CredentialGridProps) {
  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState<ServiceType | "all">("all");

  const usedServices = useMemo(() => {
    const present = new Set(credentials.map((c) => c.service));
    return ALL_SERVICES.filter((s) => s === "all" || present.has(s as ServiceType));
  }, [credentials]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return credentials.filter((c) => {
      const matchService = serviceFilter === "all" || c.service === serviceFilter;
      const matchQuery = !q || c.name.toLowerCase().includes(q) || c.service.includes(q) || c.tags.some((t) => t.includes(q));
      return matchService && matchQuery;
    });
  }, [credentials, query, serviceFilter]);

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
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

      {/* Service filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
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

      <p className="text-xs text-slate-400">{filtered.length} of {credentials.length} credentials</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <p className="text-sm">No results found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((c) => (
            <CredentialCard key={c.id} credential={c} />
          ))}
        </div>
      )}
    </div>
  );
}
