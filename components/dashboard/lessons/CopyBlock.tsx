"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  label: string;
  text: string;
  /** Altura máxima do bloco antes de rolar (o texto inteiro é copiado). */
  maxHeightClass?: string;
  copyLabel?: string;
};

// Bloco de texto/código com botão de copiar. No celular, se a API de área de transferência
// falhar, o texto fica selecionado para a pessoa usar o "Copiar" do próprio sistema.
export function CopyBlock({ label, text, maxHeightClass = "max-h-56", copyLabel = "Copiar" }: Props) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = preRef.current;
      if (!el) return;
      const range = document.createRange();
      range.selectNodeContents(el);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#050807]">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-1.5 pl-3.5 pr-1.5">
        <span className="truncate font-mono text-xs text-slate-400">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-[#F5F7F6] hover:bg-white/[0.06]"
        >
          {copied ? <Check className="h-4 w-4 text-[#00FF88]" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? "Copiado" : copyLabel}
        </button>
      </div>
      <pre
        ref={preRef}
        tabIndex={0}
        aria-label={label}
        className={`${maxHeightClass} overflow-auto whitespace-pre-wrap break-words px-3.5 py-3 font-mono text-[12.5px] leading-relaxed text-slate-300`}
      >
        {text}
      </pre>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copiado para a área de transferência" : ""}
      </span>
    </div>
  );
}
