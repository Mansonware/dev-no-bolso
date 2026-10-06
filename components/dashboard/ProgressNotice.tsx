import { AlertTriangle } from "lucide-react";

// Mostrado quando o Redis falhou ao ler o progresso: o aluno não acha que perdeu tudo.
export function ProgressNotice() {
  return (
    <p
      role="status"
      className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] px-4 py-3 text-sm text-amber-100"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden />
      Não conseguimos carregar seu progresso agora. Ele não foi perdido — recarregue a página em instantes.
    </p>
  );
}
