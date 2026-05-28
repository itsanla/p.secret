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
