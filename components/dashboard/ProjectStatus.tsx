import Link from "next/link";
import { ArrowRight, Check, ChevronRight, Globe } from "lucide-react";
import type { project as Project } from "@/lib/mock/aluno";

type Props = {
  project: typeof Project;
  /** Aula que destrava a etapa atual do projeto. */
  lessonHref: string;
  /** Quando definido, o título do card leva para a página do projeto. */
  detailsHref?: string;
};

export function ProjectStatus({ project, lessonHref, detailsHref }: Props) {
  const doneCount = project.steps.filter((s) => s.status === "feito").length;

  return (
    <section
      id="projeto"
      aria-labelledby="projeto-titulo"
      className="scroll-mt-20 rounded-2xl border border-white/[0.08] bg-[#0A0F0D] p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 id="projeto-titulo" className="text-sm font-semibold text-slate-300">
          {detailsHref ? (
            <Link href={detailsHref} className="inline-flex items-center gap-1 hover:text-[#F5F7F6] transition-colors">
              Meu primeiro projeto
              <ChevronRight className="w-4 h-4" aria-hidden />
            </Link>
          ) : (
            "Meu primeiro projeto"
          )}
        </h2>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            project.published ? "bg-[#00FF88]/15 text-[#00FF88]" : "bg-amber-400/10 text-amber-300"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${project.published ? "bg-[#00FF88]" : "bg-amber-300"}`}
            aria-hidden
          />
          {project.published ? "No ar" : "Não publicado"}
        </span>
      </div>

      {/* Endereço público — o objetivo de tudo */}
      <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#050807] px-3.5 py-3">
        <Globe className={`w-4 h-4 shrink-0 ${project.published ? "text-[#00FF88]" : "text-slate-600"}`} aria-hidden />
        <span
          className={`min-w-0 flex-1 truncate font-mono text-[13px] ${
            project.published ? "text-[#F5F7F6]" : "text-slate-500"
          }`}
          title={project.publicUrl}
        >
          {project.publicUrl}
        </span>
      </div>
      <p className="mt-2 px-1 font-mono text-[11px] text-slate-500">
        {doneCount} de {project.steps.length} etapas concluídas
      </p>

      <ol className="mt-5 space-y-0">
        {project.steps.map((step, i) => {
          const isLast = i === project.steps.length - 1;
          return (
            <li key={step.id} className="relative flex gap-3 pb-4 last:pb-0">
              {!isLast && (
                <span
                  className={`absolute left-[11px] top-6 bottom-0 w-px ${
                    step.status === "feito" ? "bg-[#00FF88]/30" : "bg-white/10"
                  }`}
                  aria-hidden
                />
              )}
              <span
                className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                  step.status === "feito"
                    ? "border-[#00FF88]/40 bg-[#00FF88]/10 text-[#00FF88]"
                    : step.status === "atual"
                      ? "border-[#00FF88] bg-[#050807]"
                      : "border-white/15 bg-[#050807]"
                }`}
              >
                {step.status === "feito" && <Check className="w-3.5 h-3.5" aria-hidden />}
                {step.status === "atual" && <span className="h-2 w-2 rounded-full bg-[#00FF88]" aria-hidden />}
              </span>
              <div className="min-w-0">
                <p
                  className={`text-sm ${
                    step.status === "pendente" ? "text-slate-500" : "text-[#F5F7F6]"
                  } ${step.status === "atual" ? "font-semibold" : ""}`}
                >
                  {step.label}
                  {step.status === "atual" && (
                    <span className="ml-2 font-mono text-[11px] font-normal text-[#00FF88]">você está aqui</span>
                  )}
                </p>
                <p className="mt-0.5 font-mono text-[12px] text-slate-500 truncate">{step.hint}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <Link
        href={lessonHref}
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/15 text-sm font-semibold text-[#F5F7F6] transition-colors hover:border-[#00FF88]/50 hover:bg-white/[0.03]"
      >
        Ativar o GitHub Pages agora
        <ArrowRight className="w-4 h-4" aria-hidden />
      </Link>
    </section>
  );
}
