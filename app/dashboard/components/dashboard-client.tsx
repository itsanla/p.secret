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
    <div className="min-h-screen text-slate-900">
      <header className="sticky top-0 z-40 bg-[var(--ios-surface-alpha)] backdrop-blur-xl border-b border-[var(--ios-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <span className="font-semibold text-slate-900">p.secret</span>
            </div>

            <nav className="flex bg-[var(--ios-surface-alt)] rounded-xl p-1 gap-0.5">
              <button
                onClick={() => setTab("vault")}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  tab === "vault" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Key Vault
                <span className={`ml-1.5 text-xs ${tab === "vault" ? "text-slate-400" : "text-slate-400"}`}>
                  {credentials.length}
                </span>
              </button>
              <button
                onClick={() => setTab("auth")}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  tab === "auth" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Authenticator
                <span className={`ml-1.5 text-xs ${tab === "auth" ? "text-slate-400" : "text-slate-400"}`}>
                  {totpAccounts.length}
                </span>
              </button>
            </nav>

            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === "vault" ? (
          <CredentialGrid credentials={credentials} />
        ) : (
          <OTPGrid accounts={totpAccounts} />
        )}
      </main>
    </div>
  );
}
