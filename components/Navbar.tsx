"use client";

import Link from "next/link";
import { Terminal, Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#050807]/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Marca */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#0A0F0D] border border-[#00FF88]/30 flex items-center justify-center text-[#00FF88] group-hover:border-[#00FF88]/60 transition-colors">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-mono font-black text-base sm:text-lg tracking-wider text-[#F5F7F6]">
            DEV<span className="text-[#00FF88]">_</span>NO<span className="text-[#00D9FF]">_</span>BOLSO
          </span>
        </Link>

        {/* Badge Turma Fundadora */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-[#0A0F0D] border border-white/10 text-[11px] sm:text-xs font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            <span className="hidden xs:inline">TURMA FUNDADORA •</span>
            <span className="text-[#00FF88]">15 VAGAS</span>
          </div>

          <a
            href="#oferta"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#F5F7F6] border border-white/10 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00FF88]" />
            Garantir Vaga
          </a>
        </div>
      </div>
    </header>
  );
}
