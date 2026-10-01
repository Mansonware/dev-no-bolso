import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { LessonStages } from "@/components/dashboard/LessonStages";
import { conteudoModulo01 } from "@/lib/aulas/modulo-01";
import { allLessons, getLesson, lessonHref } from "@/lib/mock/aluno";

export const dynamicParams = false;

export function generateStaticParams() {
  return allLessons.map((_, i) => ({ n: String(i + 1) }));
}

type Props = { params: Promise<{ n: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  const lesson = getLesson(Number(n));
  return { title: `${lesson?.title ?? "Aula"} | DEV NO BOLSO` };
}

export default async function AulaPage({ params }: Props) {
  const { n } = await params;
  const number = Number(n);
  const lesson = getLesson(number);
  if (!lesson) notFound();

  const total = allLessons.length;
  const isLocked = lesson.status === "bloqueada";
  const next = getLesson(number + 1);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <Link
        href="/aluno/trilha"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-[#F5F7F6]"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Voltar para a trilha
      </Link>

      <header className="mt-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
          Módulo {lesson.moduleNumber} · Aula {number} de {total}
        </p>
        <h1 className="mt-2 text-[26px] sm:text-3xl font-black tracking-tight leading-tight">{lesson.title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-300">
          <span className="font-mono text-[#00FF88]">objetivo ›</span> {lesson.objective}
        </p>

        {/* Progresso no módulo: uma marca por aula */}
        <div className="mt-5 flex gap-1.5" role="img" aria-label={`Aula ${number} de ${total}`}>
          {allLessons.map((l, i) => (
            <span
              key={l.id}
              className={`h-1.5 flex-1 rounded-full ${
                i + 1 === number
                  ? "bg-[#00FF88]"
                  : l.status === "feita"
                    ? "bg-[#00FF88]/40"
                    : "bg-white/[0.08]"
              }`}
            />
          ))}
        </div>
      </header>

      {/* Sem progresso salvo ainda: o bloqueio é só uma recomendação, o roteiro fica sempre acessível. */}
      {isLocked && (
        <p className="mt-6 flex items-start gap-2 rounded-xl border border-dashed border-white/10 px-4 py-3 text-sm text-slate-400">
          <Lock className="mt-0.5 w-4 h-4 shrink-0 text-slate-500" aria-hidden />
          Faça esta aula depois de concluir a anterior.
        </p>
      )}

      <LessonStages lessonStatus={lesson.status} validacao={lesson.validacao} conteudo={conteudoModulo01[lesson.id]} />

      {next && (
        <Link
          href={lessonHref(number + 1)}
          className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#0A0F0D] px-5 py-4 transition-colors hover:border-[#00FF88]/40"
        >
          <span className="min-w-0">
            <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Próxima aula · {number + 1}
            </span>
            <span className="mt-1 block text-[15px] font-semibold">{next.title}</span>
          </span>
          <ArrowRight className="w-4 h-4 shrink-0 text-[#00FF88]" aria-hidden />
        </Link>
      )}
    </div>
  );
}
