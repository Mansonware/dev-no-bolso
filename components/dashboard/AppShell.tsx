"use client";

import { useEffect, useState } from "react";
import { House, Route, FolderGit2, MessageCircle } from "lucide-react";
import { Brand } from "./Brand";

const nav = [
  { id: "inicio", label: "Início", icon: House },
  { id: "trilha", label: "Trilha", icon: Route },
  { id: "projeto", label: "Meu projeto", icon: FolderGit2 },
];

type Props = {
  studentName: string;
  children: React.ReactNode;
};

export function AppShell({ studentName, children }: Props) {
  const [active, setActive] = useState("inicio");

  // Destaca no menu a seção visível na tela.
  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        if (window.scrollY < 80) return setActive("inicio");
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    const onTop = () => window.scrollY < 80 && setActive("inicio");
    sections.forEach((s) => observer.observe(s));
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, []);

  const initial = studentName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#050807] text-[#F5F7F6]">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col border-r border-white/[0.06] bg-[#060A08] px-4 py-6">
        <div className="px-2">
          <Brand />
        </div>

        <nav className="mt-10 flex flex-col gap-1" aria-label="Navegação principal">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/[0.06] text-[#F5F7F6]"
                    : "text-slate-400 hover:text-[#F5F7F6] hover:bg-white/[0.03]"
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${isActive ? "text-[#00FF88]" : ""}`} aria-hidden />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <a
            href="#suporte"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-[#F5F7F6] hover:bg-white/[0.03] transition-colors"
          >
            <MessageCircle className="w-[18px] h-[18px]" aria-hidden />
            Suporte no WhatsApp
          </a>
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
        <Brand />
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
        {[...nav, { id: "suporte", label: "Ajuda", icon: MessageCircle }].map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium ${
                isActive ? "text-[#F5F7F6]" : "text-slate-500"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-[#00FF88]" : ""}`} aria-hidden />
              {item.label === "Meu projeto" ? "Projeto" : item.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
