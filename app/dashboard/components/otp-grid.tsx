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
    return accounts.filter((a) => a.email.toLowerCase().includes(q));
  }, [accounts, query]);

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <p className="text-sm">No authenticator accounts configured.</p>
        <p className="text-xs mt-1">Add GMAIL1_USERNAME and GMAIL1_AUTHENTICATOR to .env</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by email..."
          className="w-full px-4 py-3 bg-[var(--ios-surface)] border border-[var(--ios-border)] rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600">
            Clear
          </button>
        )}
      </div>

      <p className="text-xs text-slate-400">{filtered.length} of {accounts.length} accounts</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((account) => (
          <OTPCard
            key={account.email}
            email={account.email}
            secret={account.secret}
            backupCodes={account.backupCodes}
          />
        ))}
      </div>
    </div>
  );
}
