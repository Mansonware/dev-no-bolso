import type { LessonSummary } from "@/lib/progress";

type Props = { lessons: LessonSummary[]; done: number; total: number; percent: number };

export function ProgressTrack({ lessons, done, total, percent }: Props) {
  return (
    <section aria-labelledby="progresso-titulo" className="rounded-2xl border border-white/[0.08] bg-[#0A0F0D] p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="progresso-titulo" className="text-sm font-semibold text-slate-300">
          Seu progresso
        </h2>
        <p className="font-mono text-sm text-slate-400">
          <span className="font-bold text-[#F5F7F6]">{done}</span> de {total} aulas
        </p>
      </div>

      <p className="mt-2 text-4xl font-black tracking-tight">
        {percent}
        <span className="text-xl text-slate-500">%</span>
      </p>

      <div className="mt-5 flex gap-[3px]" role="img" aria-label={`${done} de ${total} aulas concluídas`}>
        {lessons.map((l) => (
          <span
            key={l.id}
            className={`h-2 flex-1 rounded-full ${
              l.status === "feita" ? "bg-[#00FF88]" : l.status === "atual" ? "bg-[#00FF88]/35" : "bg-white/[0.08]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
