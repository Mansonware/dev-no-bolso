import { buildPreviewDocument } from "./mission";

// Moldura de navegador com o resultado do código.
// sandbox="" sem permissões: nada de scripts, formulários, popups ou navegação.
export function CodePreview({ code, caption }: { code: string; caption: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#050807]">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
        <span className="flex gap-1" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </span>
        <figcaption className="min-w-0 flex-1 truncate rounded-md bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-slate-400">
          {caption}
        </figcaption>
      </div>
      <iframe
        title="Resultado do seu código"
        sandbox=""
        srcDoc={buildPreviewDocument(code)}
        className="block h-48 w-full bg-[#f7f7f5]"
      />
    </figure>
  );
}
