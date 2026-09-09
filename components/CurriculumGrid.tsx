"use client";

import { Terminal, Bot, GitBranch, MessageSquareCode, Bug, CloudUpload } from "lucide-react";

const curriculumItems = [
  {
    title: "Termux",
    desc: "Seu ambiente de desenvolvimento no celular.",
    icon: Terminal,
    tag: "Mobile CLI",
    accent: "#00FF88",
  },
  {
    title: "IA para desenvolvimento",
    desc: "Como estruturar solicitações e trabalhar com agentes.",
    icon: Bot,
    tag: "Copilotos & Agentes",
    accent: "#00D9FF",
  },
  {
    title: "Git + GitHub",
    desc: "Versionamento e organização do projeto.",
    icon: GitBranch,
    tag: "Controle de Versão",
    accent: "#00FF88",
  },
  {
    title: "Prompts",
    desc: "Como orientar IA sem ficar apenas copiando código.",
    icon: MessageSquareCode,
    tag: "Engenharia de Contexto",
    accent: "#00D9FF",
  },
  {
    title: "Debug",
    desc: "Como identificar e corrigir problemas.",
    icon: Bug,
    tag: "Resolução Rápida",
    accent: "#00FF88",
  },
  {
    title: "Deploy",
    desc: "Como publicar o projeto na internet.",
    icon: CloudUpload,
    tag: "Produção & Domínio",
    accent: "#00D9FF",
  },
];

export function CurriculumGrid() {
  return (
    <section className="py-16 sm:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0F0D] border border-white/10 text-[11px] font-mono uppercase tracking-widest text-[#00D9FF] mb-3">
            CONTEÚDO DIRETO AO PONTO
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#F5F7F6]">
            O que você vai dominar na prática
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Ferramentas reais e o fluxo de trabalho que você vai usar do celular ou do computador.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {curriculumItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative p-6 rounded-2xl bg-[#0A0F0D] border border-white/10 hover:border-[#00FF88]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,136,0.08)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0D1512] border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" style={{ color: item.accent }} />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#F5F7F6] group-hover:text-[#00FF88] transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Módulo 100% aplicado</span>
                  <span className="text-[#00FF88] opacity-0 group-hover:opacity-100 transition-opacity">
                    ● Prática
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
