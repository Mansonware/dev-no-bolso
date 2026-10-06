"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

type Props = {
  compact?: boolean;
};

export function LogoutButton({ compact = false }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.replace("/login");
      router.refresh();
    } catch {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      aria-label={compact ? "Sair da conta" : undefined}
      className={
        compact
          ? "inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.04] hover:text-[#F5F7F6] disabled:opacity-50"
          : "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.03] hover:text-[#F5F7F6] disabled:opacity-50"
      }
    >
      <LogOut className="w-[18px] h-[18px]" aria-hidden />
      {!compact && (pending ? "Saindo…" : "Sair")}
    </button>
  );
}
