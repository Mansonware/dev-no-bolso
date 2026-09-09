"use client";

import { Lightbulb, Bot, Code2, GitFork, Globe2, ArrowDown, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    name: "IDEIA",
    desc: "Definição clara do problema e escopo",
    icon: Lightbulb,
    color: "#00D9FF",
  },
  {
    step: "02",
    name: "IA",
    desc: "Agentes e engenharia de prompts técnicos",
    icon: Bot,
    color: "#00FF88",
  },
  {
    step: "03",
    name: "CÓDIGO",
    desc: "Estruturação limpa e correção guiada",
    icon: Code2,
    color: "#00FF88",
  },
  {
    step: "04",
    name: "GITHUB",
    desc: "Versionamento direto pelo celular ou PC",
    icon: GitFork,
    color: "#00D9FF",
  },
  {
    step: "05",
    name: "INTERNET",
    desc: "Deploy em produção com HTTPS e domínio",
    icon: Globe2,
    color: "#00FF88",
  },
];

export function ProcessFlow() {
  return (
    <section className="relative py-16 sm:py-24 border-t border-b border-white/5 bg-[#070C0A]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0F0D] border border-[#00FF88]/20 text-[11px] font-mono uppercase tracking-widest text-[#00FF88] mb-3">
            WORKFLOW PRÁTICO
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#F5F7F6]">
            Do conceito até a aplicação no ar
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            O objetivo não é ficar em teoria, e sim dominar cada elo da cadeia para colocar soluções reais funcionando.
          </p>
        </div>

        {/* Desktop: Fluxo Horizontal com conectores */}
        <div className="hidden lg:grid grid-cols-5 gap-3 items-center relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === steps.length - 1;

            return (
              <div key={item.name} className="relative flex flex-col items-center text-center group">
                {/* Conector de seta para o próximo item */}
                {!isLast && (
                  <div className="absolute top-8 left-[65%] w-[70%] z-0 flex items-center justify-center">
                    <div className="w-full h-[1px] bg-gradient-to-r from-white/20 via-[#00FF88]/40 to-white/20" />
                    <ArrowRight className="w-3.5 h-3.5 text-[#00FF88] -ml-2 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}

                {/* Card do Passo */}
                <div className="relative z-10 w-full p-4 rounded-2xl bg-[#0A0F0D] border border-white/10 group-hover:border-[#00FF88]/40 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_25px_rgba(0,255,136,0.1)]">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#0D1512] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 font-semibold tracking-wider">
                    PASSO {item.step}
                  </span>
                  <h3 className="text-lg font-black tracking-wide text-white mt-0.5">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile / Tablet: Fluxo Vertical destacado */}
        <div className="lg:hidden flex flex-col items-center max-w-sm mx-auto space-y-3">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === steps.length - 1;

            return (
              <div key={item.name} className="w-full flex flex-col items-center">
                <div className="w-full p-4 rounded-2xl bg-[#0A0F0D] border border-white/10 flex items-center gap-4 shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-[#0D1512] border border-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <div className="text-left flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black tracking-wider text-white">
                        {item.name}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">
                        {item.step}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {!isLast && (
                  <div className="py-1 flex items-center justify-center">
                    <ArrowDown className="w-4 h-4 text-[#00FF88]/70 animate-bounce" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
