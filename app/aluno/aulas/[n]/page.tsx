import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { LessonView } from "@/components/dashboard/lessons/LessonView";
import { TrackFirstLessonStart } from "@/components/TrackEvent";
import { requireStudent } from "@/lib/auth";
import { ALL_LESSONS, getLessonByNumber, lessonHref } from "@/lib/course";
import { getStudentProgress } from "@/lib/progress";

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_LESSONS.map((_, i) => ({ n: String(i + 1) }));
}

type Props = { params: Promise<{ n: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  const lesson = getLessonByNumber(Number(n));
  return { title: `${lesson?.title ?? "Aula"} | Dev no Bolso` };
}

export default async function AulaPage({ params }: Props) {
  const { n } = await params;
  const user = await requireStudent(`/aluno/aulas/${encodeURIComponent(n)}`);
  const number = Number(n);
  const lesson = getLessonByNumber(number);
  if (!lesson) notFound();

  const progress = await getStudentProgress(user.id);
  const summary = progress.lessons[number - 1];
  const total = progress.total;
  const isLocked = summary.status === "bloqueada";
  const isLast = number === total;
  const prev = number > 1 ? progress.lessons[number - 2] : null;
  const next = !isLast ? progress.lessons[number] : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <Link
        href="/aluno/trilha"
        className="-ml-1 inline-flex h-10 items-center gap-2 px-1 text-sm font-semibold text-slate-400 hover:text-[#F5F7F6]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Trilha
      </Link>

      <header className="mt-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
          Módulo {lesson.moduleNumber} · Aula {number} de {total}
        </p>
        <h1 className="mt-2 text-[26px] font-black leading-tight tracking-tight sm:text-3xl">{lesson.title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-300">
          <span className="text-slate-500">Objetivo:</span> {lesson.objective}
        </p>

        <div className="mt-5 flex gap-1.5" role="img" aria-label={`${progress.done} de ${total} aulas concluídas`}>
          {progress.lessons.map((l) => (
            <span
              key={l.id}
              className={`h-1.5 flex-1 rounded-full ${
                l.number === number ? "bg-[#00FF88]" : l.status === "feita" ? "bg-[#00FF88]/40" : "bg-white/[0.08]"
              }`}
            />
          ))}
        </div>
      </header>

      {isLocked ? (
        <section className="mt-8 rounded-2xl border border-dashed border-white/10 px-5 py-8 text-center">
          <Lock className="mx-auto h-6 w-6 text-slate-500" aria-hidden />
          <h2 className="mt-3 text-[15px] font-semibold">Esta aula libera quando você concluir a anterior</h2>
          {progress.current && (
            <Link
              href={progress.current.href}
              className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-5 text-[15px] font-bold text-[#050807] hover:bg-[#33FFA0]"
            >
              Ir para a Aula {progress.current.number}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </section>
      ) : (
        <>
          <TrackFirstLessonStart />
          <LessonView
            lessonNumber={number}
            status={summary.status}
            record={progress.record}
            nextHref={next ? lessonHref(next.number) : "/aluno/projeto"}
            isLast={isLast}
          />
        </>
      )}

      <nav aria-label="Navegação entre aulas" className="mt-10 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-6">
        {prev ? (
          <Link
            href={prev.href}
            className="flex min-h-14 flex-col justify-center rounded-xl border border-white/[0.08] px-4 py-2 hover:border-white/20"
          >
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Anterior
            </span>
            <span className="mt-0.5 line-clamp-1 text-sm font-semibold">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && next.status !== "bloqueada" ? (
          <Link
            href={next.href}
            className="flex min-h-14 flex-col items-end justify-center rounded-xl border border-white/[0.08] px-4 py-2 text-right hover:border-white/20"
          >
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              Próxima <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="mt-0.5 line-clamp-1 text-sm font-semibold">{next.title}</span>
          </Link>
        ) : next ? (
          <span className="flex min-h-14 flex-col items-end justify-center rounded-xl border border-dashed border-white/[0.06] px-4 py-2 text-right text-slate-500">
            <span className="inline-flex items-center gap-1 text-xs">
              <Lock className="h-3.5 w-3.5" aria-hidden /> Próxima
            </span>
            <span className="mt-0.5 line-clamp-1 text-sm">Conclua esta aula</span>
          </span>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
