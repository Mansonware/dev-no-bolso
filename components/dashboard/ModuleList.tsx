"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, ChevronRight, Lock, Play } from "lucide-react";
import { lessonHref, lessonNumber, type Lesson, type Module } from "@/lib/mock/aluno";

export function ModuleList({ modules }: { modules: Module[] }) {
  const current = modules.find((m) => m.lessons.some((l) => l.status === "atual"));
  const [open, setOpen] = useState<string | null>(current?.id ?? modules[0]?.id ?? null);

  return (
    <section id="trilha" aria-labelledby="trilha-titulo" className="scroll-mt-20">
      <div className="flex items-baseline justify-between gap-4 px-1">
        <h2 id="trilha-titulo" className="text-sm font-semibold text-slate-300">
          Trilha
        </h2>
        <span className="text-xs text-slate-500">cada aula libera a próxima quando a missão é validada</span>
      </div>

      <ul className="mt-3 divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0F0D]">
        {modules.map((m) => {
          const done = m.lessons.filter((l) => l.status === "feita").length;
          const allDone = done === m.lessons.length;
          const locked = m.lessons.every((l) => l.status === "bloqueada");
          const isOpen = open === m.id;

          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : m.id)}
                aria-expanded={isOpen}
                aria-controls={`${m.id}-aulas`}
                className="flex w-full items-center gap-4 px-4 py-4 sm:px-5 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span
                  className={`font-mono text-sm font-bold ${
                    allDone ? "text-[#00FF88]" : locked ? "text-slate-600" : "text-[#F5F7F6]"
                  }`}
                >
                  {m.number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-[15px] font-semibold ${locked ? "text-slate-400" : "text-[#F5F7F6]"}`}>
                    {m.title}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-slate-500 truncate">{m.summary}</span>
                </span>
                <span className="shrink-0 font-mono text-xs text-slate-500">
                  {done}/{m.lessons.length}
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>

              {isOpen && (
                <ol id={`${m.id}-aulas`} className="pb-3">
                  {m.lessons.map((l, i) => (
                    <li key={l.id}>
                      <LessonRow lesson={l} index={i} />
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function LessonRow({ lesson: l, index: i }: { lesson: Lesson; index: number }) {
  const isLocked = l.status === "bloqueada";

  const inner = (
    <>
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          l.status === "feita"
            ? "bg-[#00FF88]/10 text-[#00FF88]"
            : l.status === "atual"
              ? "bg-[#00FF88] text-[#050807]"
              : "bg-white/[0.04] text-slate-600"
        }`}
      >
        {l.status === "feita" && <Check className="w-3.5 h-3.5" aria-hidden />}
        {l.status === "atual" && <Play className="w-3 h-3 fill-current" aria-hidden />}
        {isLocked && <Lock className="w-3 h-3" aria-hidden />}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`flex text-sm ${
            isLocked ? "text-slate-500" : l.status === "atual" ? "font-semibold text-[#F5F7F6]" : "text-slate-300"
          }`}
        >
          <span className="w-6 shrink-0 font-mono text-slate-600">{i + 1}.</span>
          <span>{l.title}</span>
        </span>
        <span className="mt-0.5 block pl-6 text-[12.5px] text-slate-500">
          {isLocked ? "Bloqueada · libera quando a aula anterior for concluída" : l.objective}
        </span>
      </span>
      {!isLocked && <ChevronRight className="w-4 h-4 shrink-0 text-slate-600" aria-hidden />}
    </>
  );

  const base = "mx-2 sm:mx-3 flex items-center gap-3 rounded-xl px-3 py-3";

  if (isLocked) {
    return (
      <div aria-disabled="true" className={`${base} cursor-not-allowed opacity-70`} title="Aula bloqueada">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={lessonHref(lessonNumber(l.id))}
      className={`${base} transition-colors hover:bg-white/[0.04] ${l.status === "atual" ? "bg-white/[0.05]" : ""}`}
    >
      {inner}
    </Link>
  );
}
