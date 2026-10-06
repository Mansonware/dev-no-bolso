import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { ContinueLesson } from "@/components/dashboard/ContinueLesson";
import { ModuleList } from "@/components/dashboard/ModuleList";
import { ProgressNotice } from "@/components/dashboard/ProgressNotice";
import { ProjectStatus } from "@/components/dashboard/ProjectStatus";
import { requireStudent } from "@/lib/auth";
import { getStudentProgress } from "@/lib/progress";

export default async function AlunoDashboardPage() {
  const user = await requireStudent("/aluno");
  const progress = await getStudentProgress(user.id);
  const isNewStudent = progress.done === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <section id="inicio" className="scroll-mt-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#00FF88]">Olá, {user.firstName}</p>
        <h1 className="mt-2 text-[28px] font-black leading-tight tracking-tight sm:text-4xl">
          {progress.finished ? "Você terminou o módulo" : isNewStudent ? "Bem-vindo ao Dev no Bolso" : "Continue de onde parou"}
        </h1>
        <div
          className="mt-3 flex items-center gap-3"
          role="progressbar"
          aria-label="Progresso geral"
          aria-valuemin={0}
          aria-valuemax={progress.total}
          aria-valuenow={progress.done}
        >
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08] sm:max-w-xs">
            <span className="block h-full rounded-full bg-[#00FF88]" style={{ width: `${progress.percent}%` }} />
          </div>
          <span className="shrink-0 font-mono text-xs text-slate-400">
            {progress.done} de {progress.total} aulas
          </span>
        </div>
      </section>

      {progress.unavailable && <ProgressNotice />}

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-5 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6">
        <div className="lg:col-start-1 lg:row-start-1">
          <ContinueLesson
            current={progress.current}
            total={progress.total}
            isNewStudent={isNewStudent}
            siteUrl={progress.record.site}
          />
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <ProjectStatus progress={progress} detailsHref="/aluno/projeto" />
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <ModuleList modules={progress.modules} />
        </div>
      </div>

      <section className="mt-8 flex flex-col gap-3 rounded-2xl border border-dashed border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[15px] font-semibold">Travou em alguma missão?</p>
          <p className="mt-0.5 text-sm text-slate-400">Mande um print e diga em qual aula está. Uma pessoa responde pelo WhatsApp.</p>
        </div>
        <Link
          href="/aluno/suporte"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-semibold transition-colors hover:border-[#00FF88]/50"
        >
          <MessageCircle className="h-4 w-4 text-[#00FF88]" aria-hidden />
          Falar com o suporte
        </Link>
      </section>
    </div>
  );
}
