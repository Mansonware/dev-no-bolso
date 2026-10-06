import Link from "next/link";
import { ArrowRight, ExternalLink, PartyPopper } from "lucide-react";
import type { LessonSummary } from "@/lib/progress";

type Props = {
  current: LessonSummary | null;
  total: number;
  isNewStudent: boolean;
  siteUrl?: string;
};

// Card principal do painel: uma única próxima ação, sempre.
export function ContinueLesson({ current, total, isNewStudent, siteUrl }: Props) {
  if (!current) {
    return (
      <section
        aria-labelledby="continuar-titulo"
        className="relative overflow-hidden rounded-2xl border border-[#00FF88]/25 bg-[#0A0F0D] p-5 sm:p-7"
      >
        <PartyPopper className="h-6 w-6 text-[#00FF88]" aria-hidden />
        <h2 id="continuar-titulo" className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
          Módulo concluído. Seu site está no ar.
        </h2>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-slate-300">
          Você criou, publicou e alterou um site pelo celular. Mande o link para alguém e continue mexendo nele: o ciclo
          editar → commit → publicar é seu agora.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {siteUrl && (
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-6 text-[15px] font-bold text-[#050807] hover:bg-[#33FFA0]"
            >
              Abrir meu site
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          )}
          <Link
            href="/aluno/projeto"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-6 text-[15px] font-semibold hover:border-white/30"
          >
            Ver meu projeto
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="continuar-titulo"
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0F0D]"
    >
      <span className="absolute inset-y-0 left-0 w-1 bg-[#00FF88]" aria-hidden />
      <div className="p-5 sm:p-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
          <span className="text-[#00FF88]">{isNewStudent ? "Comece aqui" : "Sua próxima aula"}</span> · Aula{" "}
          {current.number} de {total}
        </p>

        <h2 id="continuar-titulo" className="mt-3 text-2xl font-black leading-tight tracking-tight sm:text-3xl">
          {current.title}
        </h2>

        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-300">{current.objective}</p>

        <p className="mt-4 text-sm text-slate-500">Teoria curta → missão no celular → concluir</p>

        <Link
          href={current.href}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-6 text-[15px] font-bold text-[#050807] transition-colors hover:bg-[#33FFA0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FF88] sm:w-auto"
        >
          {isNewStudent ? "Começar a Aula 1" : `Continuar a Aula ${current.number}`}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
