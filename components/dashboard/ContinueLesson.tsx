import Link from "next/link";
import { ArrowRight, Check, Lock } from "lucide-react";
import type { currentLesson as CurrentLesson } from "@/lib/mock/aluno";

type Props = { lesson: typeof CurrentLesson; lessonIndex: number; lessonCount: number; href: string };

export function ContinueLesson({ lesson, lessonIndex, lessonCount, href }: Props) {
  return (
    <section
      aria-labelledby="continuar-titulo"
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0F0D]"
    >
      {/* Faixa lateral: único acento forte da tela */}
      <span className="absolute inset-y-0 left-0 w-1 bg-[#00FF88]" aria-hidden />

      <div className="p-5 sm:p-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
          <span className="text-[#00FF88]">Continuar aprendendo</span>
          <span className="block sm:inline">
            <span className="hidden sm:inline"> · </span>Módulo {lesson.moduleNumber} · Aula {lessonIndex} de{" "}
            {lessonCount}
          </span>
        </p>

        <h2 id="continuar-titulo" className="mt-3 text-2xl sm:text-3xl font-black tracking-tight leading-tight">
          {lesson.title}
        </h2>

        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-300">
          <span className="font-mono text-[#00FF88]">missão ›</span> {lesson.mission}
        </p>

        {/* Ritmo da aula: teoria curta → missão → validação */}
        <ol className="mt-6 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-[12px] sm:gap-x-2 sm:text-[13px]">
          {lesson.steps.map((step, i) => (
            <li key={step.label} className="flex items-center gap-2">
              {i > 0 && <span className="hidden sm:block h-px w-4 bg-white/15" aria-hidden />}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 sm:px-2.5 py-1 border ${
                  step.status === "feito"
                    ? "border-[#00FF88]/25 text-[#00FF88]"
                    : step.status === "atual"
                      ? "border-white/25 bg-white/[0.06] text-[#F5F7F6] font-semibold"
                      : "border-white/10 text-slate-500"
                }`}
              >
                {step.status === "feito" && <Check className="w-3.5 h-3.5" aria-hidden />}
                {step.status === "pendente" && <Lock className="w-3 h-3" aria-hidden />}
                {step.status === "atual" && <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" aria-hidden />}
                {step.label}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
          <Link
            href={href}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-6 text-[15px] font-bold text-[#050807] transition-colors hover:bg-[#33FFA0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF88] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F0D]"
          >
            Continuar missão
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
          <span className="text-sm text-slate-400 sm:ml-2">{lesson.moduleTitle}</span>
        </div>
      </div>
    </section>
  );
}
