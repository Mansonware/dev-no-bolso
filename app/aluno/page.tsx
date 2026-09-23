import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { ContinueLesson } from "@/components/dashboard/ContinueLesson";
import { ModuleList } from "@/components/dashboard/ModuleList";
import { ProgressTrack } from "@/components/dashboard/ProgressTrack";
import { ProjectStatus } from "@/components/dashboard/ProjectStatus";
import {
  aluno,
  currentLesson,
  currentLessonNumber,
  lessonHref,
  modules,
  progressStats,
  project,
} from "@/lib/mock/aluno";

export default function AlunoDashboardPage() {
  const stats = progressStats();
  const currentModule = modules.find((m) => m.number === currentLesson.moduleNumber);
  const lessonIndex = (currentModule?.lessons.findIndex((l) => l.status === "atual") ?? 0) + 1;
  const currentHref = lessonHref(currentLessonNumber());

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <section id="inicio" className="scroll-mt-20">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="text-[26px] sm:text-3xl font-black tracking-tight">Bora, {aluno.firstName}.</h1>
          <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
            demo
          </span>
        </div>
        <p className="mt-1.5 text-[15px] text-slate-400">Próximo passo: colocar o seu site no ar.</p>
      </section>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-5 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6">
        <div className="lg:col-start-1 lg:row-start-1">
          <ContinueLesson
            lesson={currentLesson}
            lessonIndex={lessonIndex}
            lessonCount={currentModule?.lessons.length ?? 0}
            href={currentHref}
          />
        </div>

        <div className="flex flex-col gap-5 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:gap-6">
          <div className="order-2 lg:order-1">
            <ProgressTrack modules={modules} {...stats} />
          </div>
          <div className="order-1 lg:order-2">
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
