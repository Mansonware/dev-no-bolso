import type { Module } from "@/lib/mock/aluno";

type Props = { modules: Module[]; done: number; total: number; percent: number };

export function ProgressTrack({ modules, done, total, percent }: Props) {
  return (
    <section aria-labelledby="progresso-titulo" className="rounded-2xl border border-white/[0.08] bg-[#0A0F0D] p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="progresso-titulo" className="text-sm font-semibold text-slate-300">
          Progresso geral
        </h2>
        <p className="font-mono text-sm text-slate-400">
          <span className="text-[#F5F7F6] font-bold">{done}</span>/{total} aulas
        </p>
      </div>

      <p className="mt-2 text-4xl font-black tracking-tight">
        {percent}
        <span className="text-xl text-slate-500">%</span>
      </p>

      {/* Uma marca por aula, agrupadas por módulo */}
      <div className="mt-5 flex gap-2" role="img" aria-label={`${done} de ${total} aulas concluídas`}>
        {modules.map((m) => (
          <div key={m.id} className="flex flex-1 gap-[3px]" style={{ flexGrow: m.lessons.length }}>
            {m.lessons.map((l) => (
              <span
                key={l.id}
                className={`h-2 flex-1 rounded-full ${
                  l.status === "feita" ? "bg-[#00FF88]" : l.status === "atual" ? "bg-[#00FF88]/35" : "bg-white/[0.08]"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {modules.map((m) => {
          const d = m.lessons.filter((l) => l.status === "feita").length;
          return (
            <span
              key={m.id}
              className="flex-1 whitespace-nowrap font-mono text-[10.5px] text-slate-500"
              style={{ flexGrow: m.lessons.length }}
            >
              M{m.number} <span className={d === m.lessons.length ? "text-[#00FF88]" : ""}>{d}/{m.lessons.length}</span>
            </span>
          );
        })}
      </div>
    </section>
  );
}
