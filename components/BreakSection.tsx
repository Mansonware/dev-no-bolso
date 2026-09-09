"use client";

import { Flame } from "lucide-react";

export function BreakSection() {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-[#0A0F0D] via-[#050807] to-[#0A0F0D] border-t border-b border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#00FF88]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] text-xs font-mono font-bold uppercase tracking-widest mb-6">
          <Flame className="w-3.5 h-3.5" />
          FOCO EM CONSTRUÇÃO REAL
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#F5F7F6] uppercase leading-tight mb-6">
          NÃO É UM CURSO PARA FICAR SÓ ASSISTINDO TEORIA.
        </h2>

        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-[#050807]/80 border border-white/10 backdrop-blur-md shadow-2xl">
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
            A proposta da primeira turma é acompanhar um processo real de desenvolvimento,
            entendendo como as ferramentas se conectam e como sair de uma ideia até um
            projeto publicado.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
            Sem enrolação teórica
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />
            Passo a passo no terminal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
            Aplicação viva na internet
          </span>
        </div>
      </div>
    </section>
  );
}
