import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProjectStatus } from "@/components/dashboard/ProjectStatus";
import { currentLessonNumber, getLesson, lessonHref, project } from "@/lib/mock/aluno";

export const metadata: Metadata = { title: "Meu projeto | DEV NO BOLSO" };

export default function ProjetoPage() {
  const n = currentLessonNumber();
  const lesson = getLesson(n);
  const done = project.steps.filter((s) => s.status === "feito").length;
  const percent = Math.round((done / project.steps.length) * 100);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader eyebrow="Meu projeto" title={project.name} subtitle="O site que você está colocando no ar neste módulo." />

      <div className="mt-6 flex flex-col gap-5 lg:mt-8 lg:gap-6">
        <section aria-label="Progresso do projeto" className="rounded-2xl border border-white/[0.08] bg-[#0A0F0D] p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-semibold text-slate-300">Progresso do projeto</h2>
            <p className="font-mono text-sm text-slate-400">
              <span className="font-bold text-[#F5F7F6]">{done}</span>/{project.steps.length} etapas
            </p>
          </div>
          <p className="mt-2 text-4xl font-black tracking-tight">
            {percent}
            <span className="text-xl text-slate-500">%</span>
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.08]" role="img" aria-label={`${percent}% concluído`}>
            <div className="h-full rounded-full bg-[#00FF88]" style={{ width: `${percent}%` }} />
          </div>
        </section>

        <ProjectStatus project={project} lessonHref={lessonHref(n)} />

        {lesson && (
          <Link
            href={lessonHref(n)}
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#0A0F0D] px-5 py-4 transition-colors hover:border-[#00FF88]/40"
          >
            <span className="min-w-0">
              <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Aula atual · {n}
              </span>
              <span className="mt-1 block text-[15px] font-semibold">{lesson.title}</span>
            </span>
            <ArrowRight className="w-4 h-4 shrink-0 text-[#00FF88]" aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}
