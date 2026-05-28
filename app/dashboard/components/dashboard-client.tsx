"use client";

import { useState } from "react";
import type { Credential, TOTPAccount } from "@/types";
import LogoutButton from "./logout-button";
import OTPGrid from "./otp-grid";
import CredentialGrid from "./credential-grid";

interface DashboardClientProps {
  credentials: Credential[];
  totpAccounts: TOTPAccount[];
}

type Tab = "vault" | "auth";

export default function DashboardClient({ credentials, totpAccounts }: DashboardClientProps) {
  const [tab, setTab] = useState<Tab>("vault");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40"
              style={{ background: "rgba(8,9,14,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 gap-4">

            {/* Logo */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ background: "var(--accent-soft)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <svg className="w-4 h-4" style={{ color: "var(--accent-hover)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>anla secret</span>
            </div>

            {/* Tabs */}
            <nav className="flex rounded-xl p-1 gap-0.5"
                 style={{ background: "var(--surface)" }}>
              {(["vault", "auth"] as Tab[]).map((t) => {
                const active = tab === t;
                const label = t === "vault" ? "Key Vault" : "Authenticator";
                const count = t === "vault" ? credentials.length : totpAccounts.length;
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="px-4 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5"
                    style={{
                      background: active ? "var(--accent)" : "transparent",
                      color: active ? "#fff" : "var(--text-secondary)",
                    }}
                  >
                    {label}
                    <span className="text-xs opacity-60">{count}</span>
                  </button>
                );
              })}
            </nav>

            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {tab === "vault" ? (
          <CredentialGrid credentials={credentials} />
        ) : (
          <OTPGrid accounts={totpAccounts} />
        )}
      </main>
    </div>
  );
}
