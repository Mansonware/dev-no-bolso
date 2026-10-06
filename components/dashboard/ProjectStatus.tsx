import Link from "next/link";
import { ArrowRight, Check, ChevronRight, ExternalLink, Globe } from "lucide-react";
import { PROJECT_NAME } from "@/lib/course";
import type { StudentProgress } from "@/lib/progress";

type Props = {
  progress: StudentProgress;
  /** Quando definido, o título do card leva para a página do projeto. */
  detailsHref?: string;
};

// Etapas do projeto = aulas do Módulo 01. O que aparece aqui é o que o próprio aluno informou.
export function ProjectStatus({ progress, detailsHref }: Props) {
  const { record, lessons, current } = progress;
  const published = Boolean(record.site) && lessons[2]?.status === "feita";
  const publicUrl = record.site ?? `${record.github ?? "seu-usuario"}.github.io/${PROJECT_NAME}`;

  const steps = [
    { label: "Conta no GitHub", hint: record.github ? `@${record.github}` : "Aula 1" },
    { label: "Repositório com index.html", hint: record.repo ? record.repo.replace(/^https:\/\//, "") : "Aula 2" },
    { label: "Site publicado no GitHub Pages", hint: "Aula 3" },
    { label: "Alteração publicada", hint: "Aula 4" },
  ].map((step, i) => ({ ...step, status: lessons[i]?.status ?? "bloqueada" }));

  const doneCount = steps.filter((s) => s.status === "feita").length;

  return (
    <section
      id="projeto"
      aria-labelledby="projeto-titulo"
      className="scroll-mt-20 rounded-2xl border border-white/[0.08] bg-[#0A0F0D] p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 id="projeto-titulo" className="text-sm font-semibold text-slate-300">
          {detailsHref ? (
            <Link href={detailsHref} className="inline-flex items-center gap-1 hover:text-[#F5F7F6]">
              Meu primeiro site
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          ) : (
            "Meu primeiro site"
          )}
        </h2>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            published ? "bg-[#00FF88]/15 text-[#00FF88]" : "bg-white/[0.06] text-slate-300"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${published ? "bg-[#00FF88]" : "bg-slate-400"}`} aria-hidden />
          {published ? "No ar" : "Ainda não publicado"}
        </span>
      </div>

      {published ? (
        <a
          href={record.site}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-2.5 rounded-xl border border-[#00FF88]/25 bg-[#050807] px-3.5 py-3 hover:border-[#00FF88]/50"
        >
          <Globe className="h-4 w-4 shrink-0 text-[#00FF88]" aria-hidden />
          <span className="min-w-0 flex-1 truncate font-mono text-[13px]">{publicUrl.replace(/^https:\/\//, "")}</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </a>
      ) : (
        <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#050807] px-3.5 py-3">
          <Globe className="h-4 w-4 shrink-0 text-slate-600" aria-hidden />
          <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-slate-500">{publicUrl}</span>
        </div>
      )}
      <p className="mt-2 px-1 font-mono text-[11px] text-slate-500">
        {doneCount} de {steps.length} etapas concluídas
      </p>

      <ol className="mt-5">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <li key={step.label} className="relative flex gap-3 pb-4 last:pb-0">
              {!isLast && (
                <span
                  className={`absolute bottom-0 left-[11px] top-6 w-px ${step.status === "feita" ? "bg-[#00FF88]/30" : "bg-white/10"}`}
                  aria-hidden
                />
              )}
              <span
                className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                  step.status === "feita"
                    ? "border-[#00FF88]/40 bg-[#00FF88]/10 text-[#00FF88]"
                    : step.status === "atual"
                      ? "border-[#00FF88] bg-[#050807]"
                      : "border-white/15 bg-[#050807]"
                }`}
              >
                {step.status === "feita" && <Check className="h-3.5 w-3.5" aria-label="concluída" />}
                {step.status === "atual" && <span className="h-2 w-2 rounded-full bg-[#00FF88]" aria-hidden />}
              </span>
              <div className="min-w-0">
                <p className={`text-sm ${step.status === "bloqueada" ? "text-slate-500" : ""} ${step.status === "atual" ? "font-semibold" : ""}`}>
                  {step.label}
                  {step.status === "atual" && <span className="ml-2 font-mono text-[11px] font-normal text-[#00FF88]">próximo passo</span>}
                </p>
                <p className="mt-0.5 truncate font-mono text-[12px] text-slate-500">{step.hint}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {current && (
        <Link
          href={current.href}
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/15 text-sm font-semibold transition-colors hover:border-[#00FF88]/50"
        >
          Continuar: Aula {current.number}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </section>
  );
}
