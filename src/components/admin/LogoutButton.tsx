"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm px-4 py-2 border border-line-strong text-ink rounded-sm hover:border-accent hover:text-accent transition-colors"
    >
      Log Out
    </button>
  );
}
