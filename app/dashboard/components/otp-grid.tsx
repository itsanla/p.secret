"use client";

import { useMemo, useState } from "react";
import OTPCard from "./otp-card";
import type { TOTPAccount } from "@/types";

interface OTPGridProps {
  accounts: TOTPAccount[];
}

export default function OTPGrid({ accounts }: OTPGridProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return accounts;
    return accounts.filter(
      (a) => a.issuer.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
    );
  }, [accounts, query]);

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24" style={{ color: "var(--text-muted)" }}>
        <p className="text-sm">No authenticator accounts configured.</p>
        <p className="text-xs mt-1">Add TOTP_1_SECRET / TOTP_1_NAME / TOTP_1_ISSUER to .env</p>
      </div>
    );
  }

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
          placeholder="Search by service or account..."
          className="input-dark w-full pl-11 pr-10"
        />
        {query && (
          <button onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-md"
                  style={{ color: "var(--text-muted)", background: "var(--surface-hover)" }}>
            Clear
          </button>
        )}
      </div>

      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        {filtered.length} of {accounts.length} accounts
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((account) => (
          <OTPCard key={`${account.issuer}-${account.name}`} {...account} />
        ))}
      </div>
    </div>
  );
}
