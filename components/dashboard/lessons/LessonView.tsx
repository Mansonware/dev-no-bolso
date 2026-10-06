"use client";

import { ArrowRight, BookOpen, Check, CheckCircle2, ExternalLink, Lightbulb, ListChecks, Sparkles } from "lucide-react";
import { getLessonByNumber } from "@/lib/course";
import { missionShortcuts } from "@/lib/githubLinks";
import type { LessonStatus, ProgressRecord } from "@/lib/progressCore";
import { SITE_TEMPLATE } from "@/lib/siteTemplate";
import { CopyBlock } from "./CopyBlock";
import { LessonDelivery } from "./LessonDelivery";
import { RichText } from "./RichText";
import { useStoredState } from "./useStoredState";

type Tab = "teoria" | "missao" | "concluir";

const TABS: { id: Tab; label: string; icon: typeof BookOpen }[] = [
  { id: "teoria", label: "Teoria", icon: BookOpen },
  { id: "missao", label: "Missão", icon: ListChecks },
  { id: "concluir", label: "Concluir", icon: CheckCircle2 },
];

type Props = {
  lessonNumber: number;
  status: LessonStatus;
  record: ProgressRecord;
  nextHref: string;
  isLast: boolean;
};

const primaryButton =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-5 text-[15px] font-bold text-[#050807] transition-colors hover:bg-[#33FFA0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FF88] sm:w-auto";

export function LessonView({ lessonNumber, status, record, nextHref, isLast }: Props) {
  const lesson = getLessonByNumber(lessonNumber);
  const [tab, setTab] = useStoredState<Tab>(`dnb_tab_${lesson?.id ?? lessonNumber}`, "teoria");
  const [checked, setChecked] = useStoredState<number[]>(`dnb_steps_${lesson?.id ?? lessonNumber}`, []);

  if (!lesson) return null;

  const isDone = status === "feita";
  const shortcuts = missionShortcuts(lesson.id, record);
  const steps = lesson.mission.steps;
  const checkedCount = steps.filter((_, i) => checked.includes(i)).length;

  function go(next: Tab) {
    setTab(next);
    document.getElementById("etapas-aula")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleStep(index: number) {
    setChecked(checked.includes(index) ? checked.filter((i) => i !== index) : [...checked, index]);
  }

  return (
    <section className="mt-6 scroll-mt-20" id="etapas-aula">
      <div
        role="tablist"
        aria-label={`Etapas da aula ${lessonNumber}`}
        className="grid grid-cols-3 gap-1 rounded-2xl border border-white/[0.08] bg-[#0A0F0D] p-1"
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const selected = tab === id;
          const showCheck = (id === "concluir" && isDone) || (id === "missao" && checkedCount === steps.length);
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={selected}
              aria-controls={`painel-${id}`}
              onClick={() => setTab(id)}
              className={`flex h-12 items-center justify-center gap-1.5 rounded-xl text-[13px] font-semibold transition-colors sm:text-sm ${
                selected ? "bg-white/[0.09] text-[#F5F7F6]" : "text-slate-400 hover:text-[#F5F7F6]"
              }`}
            >
              <Icon className={`h-4 w-4 ${selected ? "text-[#00FF88]" : ""}`} aria-hidden />
              {label}
              {showCheck && <Check className="h-3.5 w-3.5 text-[#00FF88]" aria-label="feito" />}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`painel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="mt-4 space-y-5 rounded-2xl border border-white/[0.08] bg-[#0A0F0D] p-5 sm:p-7"
      >
        {tab === "teoria" && (
          <>
            <h2 className="text-xl font-bold leading-snug tracking-tight sm:text-2xl">{lesson.theory.heading}</h2>
            {lesson.theory.paragraphs.map((p) => (
              <p key={p} className="text-[15px] leading-relaxed text-slate-300 sm:text-base">
                <RichText text={p} />
              </p>
            ))}

            <ol className="grid gap-2.5 sm:grid-cols-3">
              {lesson.theory.cards.map((card) => {
                const isNow = card.label === "Agora";
                return (
                  <li
                    key={card.title}
                    className={`rounded-xl border p-4 ${
                      isNow ? "border-[#00FF88]/30 bg-[#00FF88]/[0.04]" : "border-white/[0.06] bg-[#050807]"
                    }`}
                  >
                    <p className={`font-mono text-[11px] uppercase tracking-wider ${isNow ? "text-[#00FF88]" : "text-slate-500"}`}>
                      {card.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{card.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-400">{card.text}</p>
                  </li>
                );
              })}
            </ol>

            <div className="pt-1">
              <button type="button" onClick={() => go("missao")} className={primaryButton}>
                Ir para a missão
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </>
        )}

        {tab === "missao" && (
          <>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-bold leading-snug tracking-tight sm:text-2xl">{lesson.mission.heading}</h2>
              <span className="mt-1 shrink-0 rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-xs text-slate-400">
                {checkedCount}/{steps.length}
              </span>
            </div>

            {shortcuts.length > 0 && (
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {shortcuts.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#00FF88]/40 px-4 text-sm font-semibold text-[#F5F7F6] transition-colors hover:bg-[#00FF88]/[0.06]"
                  >
                    {s.label}
                    <ExternalLink className="h-4 w-4 text-[#00FF88]" aria-hidden />
                  </a>
                ))}
              </div>
            )}

            <fieldset>
              <legend className="text-sm text-slate-400">Faça no celular e marque cada passo:</legend>
              <ol className="mt-3 space-y-2">
                {steps.map((step, i) => {
                  const isChecked = checked.includes(i);
                  const inputId = `passo-${lesson.id}-${i}`;
                  return (
                    <li key={step.title}>
                      <label
                        htmlFor={inputId}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                          isChecked ? "border-[#00FF88]/35 bg-[#00FF88]/[0.04]" : "border-white/[0.06] bg-[#050807] hover:border-white/15"
                        }`}
                      >
                        <input
                          id={inputId}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleStep(i)}
                          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#00FF88]"
                        />
                        <span className="min-w-0">
                          <span className={`block text-[15px] font-semibold ${isChecked ? "text-[#00FF88]" : ""}`}>
                            {i + 1}. {step.title}
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-slate-400">
                            <RichText text={step.description} />
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ol>
            </fieldset>

            {lesson.mission.showTemplate && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Modelo do index.html</h3>
                <p className="text-sm text-slate-400">Se o editor do GitHub abrir vazio, copie e cole este código.</p>
                <CopyBlock label="index.html" text={SITE_TEMPLATE} copyLabel="Copiar modelo" />
              </div>
            )}

            {lesson.mission.tips.length > 0 && (
              <div className="rounded-xl border border-white/[0.06] bg-[#050807] p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Lightbulb className="h-4 w-4 text-[#00D9FF]" aria-hidden />
                  Se travar
                </p>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-slate-400">
                  {lesson.mission.tips.map((tip) => (
                    <li key={tip}>
                      <RichText text={tip} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <details className="group rounded-xl border border-white/[0.06] bg-[#050807]">
              <summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                <Sparkles className="h-4 w-4 text-[#00D9FF]" aria-hidden />
                Peça ajuda para a IA
                <span className="ml-auto text-xs font-normal text-slate-500 group-open:hidden">ver prompt</span>
              </summary>
              <div className="space-y-2 px-4 pb-4">
                <p className="text-sm text-slate-400">
                  Copie, troque o que está entre colchetes e cole no ChatGPT, Gemini ou Claude. Confira a resposta antes de
                  aplicar.
                </p>
                <CopyBlock label="Prompt" text={lesson.mission.aiPrompt} maxHeightClass="max-h-40" />
              </div>
            </details>

            <div className="pt-1">
              <button type="button" onClick={() => go("concluir")} className={primaryButton}>
                Terminei, quero concluir
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </>
        )}

        {tab === "concluir" && (
          <LessonDelivery
            lessonId={lesson.id}
            delivery={lesson.delivery}
            isDone={isDone}
            record={record}
            nextHref={nextHref}
            isLast={isLast}
          />
        )}
      </div>
    </section>
  );
}
