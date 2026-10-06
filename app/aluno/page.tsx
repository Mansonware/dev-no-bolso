import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { ContinueLesson } from "@/components/dashboard/ContinueLesson";
import { ModuleList } from "@/components/dashboard/ModuleList";
import { ProjectStatus } from "@/components/dashboard/ProjectStatus";
import { requireUser } from "@/lib/auth";
import {
  currentLesson,
  currentLessonNumber,
  lessonHref,
  modules,
  progressStats,
  project,
} from "@/lib/mock/aluno";

export default async function AlunoDashboardPage() {
  const user = await requireUser("/aluno");
  const stats = progressStats();
  const currentModule = modules.find((m) => m.number === currentLesson.moduleNumber);
  const lessonIndex = (currentModule?.lessons.findIndex((l) => l.status === "atual") ?? 0) + 1;
  const currentHref = lessonHref(currentLessonNumber());
  const isNewStudent = stats.done === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <section id="inicio" className="scroll-mt-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#00FF88]">Olá, {user.firstName}</p>
        <h1 className="mt-2 text-[28px] sm:text-4xl font-black tracking-tight leading-tight">
          {isNewStudent ? "Comece sua primeira missão" : "Continue de onde parou"}
        </h1>
        <div
          className="mt-3 flex items-center gap-3"
          role="progressbar"
          aria-label="Progresso geral"
          aria-valuemin={0}
          aria-valuemax={stats.total}
          aria-valuenow={stats.done}
        >
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08] sm:max-w-xs">
            <span className="block h-full rounded-full bg-[#00FF88]" style={{ width: `${stats.percent}%` }} />
          </div>
          <span className="shrink-0 font-mono text-xs text-slate-400">
            {stats.done} de {stats.total} missões
          </span>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-5 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6">
        <div className="lg:col-start-1 lg:row-start-1">
          <ContinueLesson
            lesson={currentLesson}
            lessonIndex={lessonIndex}
            lessonCount={currentModule?.lessons.length ?? 0}
            href={currentHref}
            ctaLabel={isNewStudent ? "Começar primeira missão" : "Continuar missão"}
          />
        </div>

        <div className="flex flex-col gap-5 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:gap-6">
          <div>
            <ProjectStatus project={project} lessonHref={currentHref} detailsHref="/aluno/projeto" />
          </div>
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <ModuleList modules={modules} />
        </div>
      </div>

      <section className="mt-8 flex flex-col gap-3 rounded-2xl border border-dashed border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[15px] font-semibold">Travou em alguma missão?</p>
          <p className="mt-0.5 text-sm text-slate-400">Manda print no suporte. A gente responde pelo WhatsApp.</p>
        </div>
        <Link
          href="/aluno/suporte"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-semibold transition-colors hover:border-[#00FF88]/50"
        >
          <MessageCircle className="w-4 h-4 text-[#00FF88]" aria-hidden />
          Falar com o suporte
        </Link>
      </section>
    </div>
  );
}
