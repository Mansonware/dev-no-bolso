"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Route, FolderGit2, MessageCircle } from "lucide-react";
import { Brand } from "./Brand";

const nav = [
  { id: "inicio", href: "/aluno", label: "Início", short: "Início", icon: House },
  { id: "trilha", href: "/aluno/trilha", label: "Trilha", short: "Trilha", icon: Route },
  { id: "projeto", href: "/aluno/projeto", label: "Meu projeto", short: "Projeto", icon: FolderGit2 },
  { id: "suporte", href: "/aluno/suporte", label: "Suporte", short: "Ajuda", icon: MessageCircle },
];

function activeId(pathname: string) {
  if (pathname.startsWith("/aluno/trilha") || pathname.startsWith("/aluno/aulas")) return "trilha";
  if (pathname.startsWith("/aluno/projeto")) return "projeto";
  if (pathname.startsWith("/aluno/suporte")) return "suporte";
  return "inicio";
}

type Props = {
  studentName: string;
  children: React.ReactNode;
};

export function AppShell({ studentName, children }: Props) {
  const active = activeId(usePathname() ?? "/aluno");
  const initial = studentName.charAt(0).toUpperCase();
  const mainNav = nav.filter((n) => n.id !== "suporte");
  const support = nav.find((n) => n.id === "suporte")!;

  return (
    <div className="min-h-screen bg-[#050807] text-[#F5F7F6]">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col border-r border-white/[0.06] bg-[#060A08] px-4 py-6">
        <Link href="/aluno" className="px-2" aria-label="Início">
          <Brand />
        </Link>

        <nav className="mt-10 flex flex-col gap-1" aria-label="Navegação principal">
          {mainNav.map((item) => (
            <SideLink key={item.id} item={item} isActive={active === item.id} />
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <SideLink item={support} isActive={active === "suporte"} />
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] px-3 py-3">
            <div className="w-8 h-8 rounded-full bg-[#0D1512] border border-white/10 flex items-center justify-center text-sm font-bold text-[#00FF88]">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{studentName}</p>
              <p className="text-[11px] font-mono text-slate-500">Plano Core</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Header — mobile */}
      <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.06] bg-[#050807]/90 px-4 backdrop-blur-md">
        <Link href="/aluno" aria-label="Início">
          <Brand />
        </Link>
        <div className="w-8 h-8 rounded-full bg-[#0D1512] border border-white/10 flex items-center justify-center text-sm font-bold text-[#00FF88]">
          {initial}
        </div>
      </header>

      <main className="lg:pl-60 pb-24 lg:pb-0">{children}</main>

      {/* Tab bar — mobile (área do polegar) */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 grid grid-cols-4 border-t border-white/[0.08] bg-[#060A08]/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
        aria-label="Navegação principal"
      >
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium ${
                isActive ? "text-[#F5F7F6]" : "text-slate-500"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-[#00FF88]" : ""}`} aria-hidden />
              {item.short}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function SideLink({ item, isActive }: { item: (typeof nav)[number]; isActive: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive ? "bg-white/[0.06] text-[#F5F7F6]" : "text-slate-400 hover:text-[#F5F7F6] hover:bg-white/[0.03]"
      }`}
    >
      <Icon className={`w-[18px] h-[18px] ${isActive ? "text-[#00FF88]" : ""}`} aria-hidden />
      {item.label}
    </Link>
  );
}
