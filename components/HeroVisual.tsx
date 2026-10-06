// Ilustração do que a pessoa faz no curso: escreve código no celular e vê o site no ar.
// É um exemplo estático — não representa resultado de aluno.
export function HeroVisual() {
  return (
    <figure
      className="mx-auto w-full max-w-[320px] rounded-[28px] border border-white/10 bg-[#0A0F0D] p-2.5"
      aria-label="Exemplo: um código HTML escrito no celular e o site publicado com esse código"
    >
      <div className="overflow-hidden rounded-[20px] border border-white/[0.06] bg-[#050807]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5 font-mono text-[11px] text-slate-400">
          <span>index.html</span>
          <span className="text-[#00FF88]">editando</span>
        </div>
        <pre className="px-4 py-3.5 font-mono text-[12px] leading-relaxed text-slate-300 whitespace-pre-wrap" aria-hidden>
          <span className="text-[#00D9FF]">&lt;h1&gt;</span>Olá, mundo!<span className="text-[#00D9FF]">&lt;/h1&gt;</span>
          {"\n"}
          <span className="text-[#00D9FF]">&lt;p&gt;</span>Feito no meu celular.<span className="text-[#00D9FF]">&lt;/p&gt;</span>
        </pre>

        <div className="border-t border-white/[0.06] bg-[#F5F7F6] text-[#050807]" aria-hidden>
          <div className="flex items-center gap-2 border-b border-black/10 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#00B865]" />
            <span className="truncate rounded-md bg-black/[0.06] px-2 py-0.5 font-mono text-[10px] text-black/70">
              seu-usuario.github.io
            </span>
          </div>
          <div className="px-4 py-5">
            <p className="text-xl font-black tracking-tight">Olá, mundo!</p>
            <p className="mt-1 text-sm text-black/70">Feito no meu celular.</p>
          </div>
        </div>
      </div>
      <figcaption className="px-2 pt-2.5 pb-1 text-center text-[11px] text-slate-400">
        Exemplo ilustrativo do código e do site publicado
      </figcaption>
    </figure>
  );
}
