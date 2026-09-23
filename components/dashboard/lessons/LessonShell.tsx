"use client";

import type { ReactNode } from "react";
import { BookOpen, Check, Globe, ListChecks } from "lucide-react";
import type { LessonStatus, StageId } from "@/lib/mock/aluno";

export type StageState = "feito" | "atual" | "pendente";

export function stageStates(lessonStatus: LessonStatus): Record<StageId, StageState> {
  if (lessonStatus === "feita") return { teoria: "feito", missao: "feito", validacao: "feito" };
  return { teoria: "feito", missao: "atual", validacao: "pendente" };
}

const TAB_META: Record<StageId, { label: string; icon: typeof BookOpen; activeColor: string }> = {
  teoria: { label: "Teoria", icon: BookOpen, activeColor: "text-[#00D9FF]" },
  missao: { label: "Missão", icon: ListChecks, activeColor: "text-[#00FF88]" },
  validacao: { label: "Validação", icon: Globe, activeColor: "text-[#00FF88]" },
};

const TAB_ORDER: StageId[] = ["teoria", "missao", "validacao"];

type Props = {
  lessonNumber: number;
  activeTab: StageId;
  onTabChange: (tab: StageId) => void;
  states: Record<StageId, StageState>;
  missionBadge?: ReactNode;
  teoria: ReactNode;
  missao: ReactNode;
  validacao: ReactNode;
};

export function LessonShell({
  lessonNumber,
  activeTab,
  onTabChange,
  states,
  missionBadge,
  teoria,
  missao,
  validacao,
}: Props) {
  const panels: Record<StageId, ReactNode> = { teoria, missao, validacao };

  return (
    <section className="mt-7">
      <div
        role="tablist"
        aria-label={`Etapas da aula ${lessonNumber}`}
        className="grid grid-cols-3 gap-1 rounded-2xl border border-white/[0.08] bg-[#0A0F0D] p-1.5 shadow-lg"
      >
        {TAB_ORDER.map((id) => {
          const meta = TAB_META[id];
          const Icon = meta.icon;
          const selected = activeTab === id;
          const state = states[id];
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={selected}
              aria-controls={`painel-${id}`}
              onClick={() => onTabChange(id)}
              className={`flex h-12 items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-semibold transition-all relative ${
                selected
                  ? "bg-white/[0.1] text-[#F5F7F6] shadow-sm"
                  : "text-slate-400 hover:text-[#F5F7F6] hover:bg-white/[0.03]"
              }`}
            >
              <Icon className={`w-4 h-4 ${selected ? meta.activeColor : "text-slate-500"}`} />
              <span>{meta.label}</span>
              {id === "missao" && missionBadge}
              {id === "validacao" && state === "feito" && <Check className="w-3.5 h-3.5 text-[#00FF88]" />}
            </button>
          );
        })}
      </div>

      {TAB_ORDER.map(
        (id) =>
          activeTab === id && (
            <div
              key={id}
              role="tabpanel"
              id={`painel-${id}`}
              aria-labelledby={`tab-${id}`}
              className="mt-5 space-y-5 rounded-2xl border border-white/[0.08] bg-[#0A0F0D] p-5 sm:p-7"
            >
              {panels[id]}
            </div>
          )
      )}
    </section>
  );
}
