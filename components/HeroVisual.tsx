"use client";

import { GitBranch, Globe, Cpu, Smartphone, Check, Zap } from "lucide-react";

export function HeroVisual() {
  return (
    <div className="relative w-full max-w-[460px] mx-auto lg:max-w-none flex items-center justify-center">
      {/* Luzes de ambiência */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#00FF88]/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#00D9FF]/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Frame do Celular / Terminal de Bolso */}
      <div className="relative w-full rounded-[32px] p-2 sm:p-3 bg-gradient-to-b from-white/15 via-white/5 to-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 backdrop-blur-xl">
        {/* Notch / Speaker bar */}
        <div className="mx-auto w-24 h-4 bg-[#050807] rounded-b-xl border-x border-b border-white/10 mb-2 flex items-center justify-center">
          <div className="w-8 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Tela do Celular (Ambiente Termux + IA) */}
        <div className="w-full bg-[#050807] rounded-[24px] border border-white/10 overflow-hidden shadow-inner font-mono text-[11px] sm:text-xs text-slate-300">
          {/* Header do Terminal Termux */}
          <div className="bg-[#0A0F0D] px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88]/80" />
              <span className="ml-1 text-[10px] text-slate-400 font-mono tracking-tight flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-[#00D9FF]" />
                termux:dev-environment
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-ping" />
              <span>LIVE</span>
            </div>
          </div>

          {/* Corpo do Terminal com Sessão Real */}
          <div className="p-3.5 sm:p-4 space-y-2.5 leading-relaxed bg-[#050807]/95">
            {/* Comando 1: Setup */}
            <div>
              <div className="text-slate-400 flex items-center gap-1.5">
                <span className="text-[#00FF88] font-bold">~/mobile-workspace</span>
                <span className="text-slate-600">$</span>
                <span className="text-white">pkg install git nodejs python</span>
              </div>
              <p className="text-slate-500 text-[10px] pl-3 pt-0.5">
                [OK] Ambiente Unix configurado no celular (ARM64)
              </p>
            </div>

            {/* Comando 2: Agente IA */}
            <div className="border-l-2 border-[#00D9FF]/40 pl-2.5 py-0.5 bg-[#00D9FF]/5 rounded-r">
              <div className="text-[#00D9FF] flex items-center gap-1.5 font-semibold text-[10px]">
                <Cpu className="w-3 h-3" />
                <span>AGENTE IA DE CÓDIGO</span>
              </div>
              <p className="text-white text-[11px] font-sans italic mt-0.5">
                &ldquo;Transformar conceito em projeto Next.js pronto para deploy&rdquo;
              </p>
              <p className="text-[#00FF88] text-[10px] mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" /> 14 arquivos gerados e testados
              </p>
            </div>

            {/* Comando 3: Git */}
            <div>
              <div className="text-slate-400 flex items-center gap-1.5">
                <span className="text-[#00FF88] font-bold">~/projeto</span>
                <span className="text-slate-600">$</span>
                <span className="text-white">git commit -m &quot;feat: v1 em prod&quot;</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 pl-3 pt-0.5">
                <GitBranch className="w-3 h-3 text-[#00FF88]" />
                <span>[main a7d9e2] 12 files changed, 482 insertions(+)</span>
              </div>
            </div>

            {/* Comando 4: Deploy */}
            <div className="p-2.5 rounded-xl bg-[#0D1512] border border-[#00FF88]/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-[#00FF88] uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" /> Deploy Concluído
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                  HTTP/2 200 OK
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-white font-mono text-[10px] sm:text-[11px]">
                <Globe className="w-3.5 h-3.5 text-[#00D9FF] shrink-0" />
                <span className="truncate text-slate-200">https://projeto-web.vercel.app</span>
              </div>
            </div>

            {/* Prompt interativo piscando */}
            <div className="flex items-center gap-1.5 text-slate-400 pt-1">
              <span className="text-[#00FF88]">dev@android:~$</span>
              <span className="w-2 h-4 bg-[#00FF88] animate-pulse inline-block" />
            </div>
          </div>
        </div>

        {/* Floating Tag 1: Git & Versionamento */}
        <div className="absolute -bottom-4 -left-3 sm:-left-5 bg-[#0A0F0D] border border-white/15 px-3 py-2 rounded-xl shadow-xl flex items-center gap-2.5 backdrop-blur-md">
          <div className="w-7 h-7 rounded-lg bg-[#00FF88]/10 border border-[#00FF88]/30 flex items-center justify-center text-[#00FF88]">
            <GitBranch className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Versionamento</p>
            <p className="text-[11px] font-bold text-white font-mono">Git + GitHub</p>
          </div>
        </div>

        {/* Floating Tag 2: Status Publicado */}
        <div className="absolute -top-4 -right-3 sm:-right-4 bg-[#0A0F0D] border border-[#00D9FF]/40 px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" />
          <span className="text-[11px] font-bold text-white tracking-wide">
            PROJETO PUBLICADO
          </span>
        </div>
      </div>
    </div>
  );
}
