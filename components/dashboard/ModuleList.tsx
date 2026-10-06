import Link from "next/link";
import { Check, ChevronRight, Lock, Play } from "lucide-react";
import type { LessonSummary, ModuleSummary } from "@/lib/progress";

// Lista das aulas por módulo. Com um módulo só, não há o que recolher: tudo fica visível.
export function ModuleList({ modules }: { modules: ModuleSummary[] }) {
  return (
    <section id="trilha" aria-labelledby="trilha-titulo" className="scroll-mt-20">
      <h2 id="trilha-titulo" className="px-1 text-sm font-semibold text-slate-300">
        Aulas
      </h2>

      <div className="mt-3 space-y-4">
        {modules.map((m) => {
          const done = m.lessons.filter((l) => l.status === "feita").length;
          return (
            <div key={m.id} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0F0D]">
              <div className="flex items-center gap-4 px-4 py-4 sm:px-5">
                <span className="font-mono text-sm font-bold text-[#00FF88]">{m.number}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold">{m.title}</span>
                  <span className="mt-0.5 block text-[13px] text-slate-500">{m.summary}</span>
                </span>
                <span className="shrink-0 font-mono text-xs text-slate-500">
                  {done}/{m.lessons.length}
                </span>
              </div>
              <ol className="border-t border-white/[0.06] py-2">
                {m.lessons.map((l) => (
                  <li key={l.id}>
                    <LessonRow lesson={l} />
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LessonRow({ lesson: l }: { lesson: LessonSummary }) {
  const isLocked = l.status === "bloqueada";
  const statusText = l.status === "feita" ? "Concluída" : l.status === "atual" ? "Próxima" : "Bloqueada";

  const inner = (
    <>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          l.status === "feita"
            ? "bg-[#00FF88]/10 text-[#00FF88]"
            : l.status === "atual"
              ? "bg-[#00FF88] text-[#050807]"
              : "bg-white/[0.04] text-slate-500"
        }`}
      >
        {l.status === "feita" && <Check className="h-4 w-4" aria-hidden />}
        {l.status === "atual" && <Play className="h-3.5 w-3.5 fill-current" aria-hidden />}
        {isLocked && <Lock className="h-3.5 w-3.5" aria-hidden />}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-[15px] ${isLocked ? "text-slate-400" : l.status === "atual" ? "font-semibold" : "text-slate-200"}`}>
          {l.number}. {l.title}
        </span>
        <span className="mt-0.5 block text-[13px] text-slate-500">
          <span className="sr-only">{statusText}. </span>
          {isLocked ? "Libera quando você concluir a aula anterior" : l.objective}
        </span>
      </span>
      {!isLocked && <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />}
    </>
  );

  const base = "mx-2 flex items-center gap-3 rounded-xl px-3 py-3 sm:mx-3";

  if (isLocked) {
    return <div className={`${base} opacity-80`}>{inner}</div>;
  }

  return (
    <Link
      href={l.href}
      aria-current={l.status === "atual" ? "step" : undefined}
      className={`${base} transition-colors hover:bg-white/[0.04] ${l.status === "atual" ? "bg-white/[0.04]" : ""}`}
    >
      {inner}
    </Link>
  );
}
