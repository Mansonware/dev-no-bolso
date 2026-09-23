"use client";

import { useState } from "react";
import { Check, Lock } from "lucide-react";
import { lessonStages, type LessonStatus, type StageId } from "@/lib/mock/aluno";

type StageState = "feito" | "atual" | "pendente";

// MOCK — estado das etapas derivado do status da aula (sem persistência).
function stageStates(lessonStatus: LessonStatus): Record<StageId, StageState> {
  if (lessonStatus === "feita") return { teoria: "feito", missao: "feito", validacao: "feito" };
  return { teoria: "feito", missao: "atual", validacao: "pendente" };
}

// MOCK — textos provisórios. O conteúdo definitivo será escrito após o Gate em Android físico.
const placeholder: Record<StageId, string> = {
  teoria: "A explicação curta desta aula ainda está sendo produzida.",
  missao: "Os passos da missão serão publicados depois do teste em um Android real.",
  validacao: "Aqui você vai enviar a prova de que a missão foi concluída.",
};

export function LessonStages({ lessonStatus }: { lessonStatus: LessonStatus }) {
  const states = stageStates(lessonStatus);
  const initial = lessonStages.find((s) => states[s.id] === "atual")?.id ?? "teoria";
  const [tab, setTab] = useState<StageId>(initial);
  const isDone = lessonStatus === "feita";

  return (
    <section className="mt-8">
      <div role="tablist" aria-label="Etapas da aula" className="grid grid-cols-3 gap-1 rounded-xl border border-white/[0.08] bg-[#0A0F0D] p-1">
        {lessonStages.map((s) => {
          const state = states[s.id];
          const selected = tab === s.id;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={selected}
              aria-controls={`painel-${s.id}`}
              onClick={() => setTab(s.id)}
              className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-lg text-[13px] font-semibold transition-colors ${
                selected ? "bg-white/[0.08] text-[#F5F7F6]" : "text-slate-400 hover:text-[#F5F7F6]"
              }`}
            >
              {state === "feito" && <Check className="w-3.5 h-3.5 text-[#00FF88]" aria-hidden />}
              {state === "atual" && <span className="h-1.5 w-1.5 rounded-full bg-[#00FF88]" aria-hidden />}
              {state === "pendente" && <Lock className="w-3 h-3" aria-hidden />}
              {s.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`painel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="mt-4 rounded-2xl border border-white/[0.08] bg-[#0A0F0D] p-5 sm:p-6"
      >
        <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">Em produção</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{placeholder[tab]}</p>
        </div>

        {tab === "validacao" && (
          <div className="mt-5">
            <button
              type="button"
              disabled
              className="inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-xl border border-white/10 text-sm font-semibold text-slate-500"
            >
              {isDone ? "Missão validada" : "Enviar para validação"}
            </button>
            <p className="mt-2 text-center font-mono text-[11px] text-slate-500">
              {isDone ? "Esta aula já foi concluída." : "A validação automática ainda não está disponível."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
