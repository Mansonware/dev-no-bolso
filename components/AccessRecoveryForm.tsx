"use client";

import { FormEvent, useState } from "react";
import { KeyRound, Loader2, LogIn } from "lucide-react";

export function AccessRecoveryForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setError("Digite o código de acesso.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/access/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cleanCode }),
      });
      const data = await response.json();

      if (!response.ok || data.success !== true) {
        setError(data.error || "Não foi possível validar o código.");
        return;
      }

      window.location.assign("/aluno");
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-3">
      <label className="block text-sm font-semibold text-slate-200" htmlFor="access-code">
        Código de acesso
      </label>

      <div className="relative">
        <KeyRound
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          aria-hidden
        />
        <input
          id="access-code"
          name="access-code"
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="DNB-123456789-ABCDEF..."
          autoComplete="off"
          spellCheck={false}
          className="h-12 w-full rounded-xl border border-white/10 bg-[#050807] pl-10 pr-4 font-mono text-sm uppercase text-white outline-none transition focus:border-[#00FF88]/60"
        />
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        Você recebe este código depois que o pagamento é confirmado. Ele serve para entrar em outro celular ou navegador.
      </p>

      {error && (
        <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-5 text-sm font-extrabold text-black transition hover:bg-[#00e57a] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <LogIn className="h-4 w-4" aria-hidden />
        )}
        Entrar nas aulas
      </button>
    </form>
  );
}
