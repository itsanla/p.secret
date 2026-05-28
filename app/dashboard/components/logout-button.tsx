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
      className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
      style={{ color: "var(--text-secondary)", background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      Logout
    </button>
  );
}
