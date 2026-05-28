"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-[var(--ios-surface-alt)] hover:bg-[var(--ios-border)] rounded-xl transition-colors"
    >
      Logout
    </button>
  );
}
