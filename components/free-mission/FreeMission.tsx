"use client";

import { useDeferredValue, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Circle, RotateCcw, Sparkles } from "lucide-react";
import { CheckoutButton } from "@/components/CheckoutButton";
import { OFFER } from "@/lib/offer";
import { track } from "@/lib/track";
import type { FunnelEvent } from "@/lib/analytics";
import { CodePreview } from "./CodePreview";
import { STARTER_CODE, TASKS, checkMission } from "./mission";

type Stage = "intro" | "editar" | "concluida";

// Conta início/conclusão no máximo uma vez por sessão, para a taxa do funil não inflar
// com refresh ou "refazer missão".
function trackOncePerSession(event: FunnelEvent) {
  try {
    const key = `dnb:tracked:${event}`;
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
  } catch {
    // sessionStorage indisponível (ex.: modo privado restrito): segue e envia mesmo assim.
  }
  track(event, "mission");
}

const PATH = ["Primeiro código", "Pequenos projetos", "Projeto web", "Publicação"];

export function FreeMission() {
  const [stage, setStage] = useState<Stage>("intro");
  const [code, setCode] = useState(STARTER_CODE);
  const previewCode = useDeferredValue(code);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const check = checkMission(code);
  const doneCount = TASKS.filter((t) => check[t.id]).length;
  const allDone = doneCount === TASKS.length;

  // Ao trocar de etapa, leva o foco (e a rolagem) para o título da nova etapa.
  useEffect(() => {
    if (stage !== "intro") headingRef.current?.focus();
  }, [stage]);

  const start = () => {
    trackOncePerSession("free_mission_start");
    setStage("editar");
  };

  const finish = () => {
    if (!allDone) return;
    trackOncePerSession("free_mission_complete");
    setStage("concluida");
  };

  const restart = () => {
    setCode(STARTER_CODE);
    setStage("editar");
  };

  if (stage === "intro") {
    return (
      <section aria-labelledby="missao-titulo">
        <p className="font-mono text-[11px] uppercase tracking-widest text-[#00FF88]">Missão grátis · sem cadastro</p>
        <h1 id="missao-titulo" className="mt-2 text-[28px] sm:text-4xl font-black tracking-tight leading-[1.1]">
          Escreva seu primeiro código agora.
        </h1>
        <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-slate-300">
          Você vai editar duas linhas de HTML e ver virar uma página na hora, aqui no celular. Leva uns 3 minutos e
          não precisa saber nada antes.
        </p>

        <ol className="mt-6 space-y-2.5">
          {TASKS.map((task, i) => (
            <li
              key={task.id}
              className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0A0F0D] px-4 py-3 text-[15px]"
            >
              <span className="font-mono text-xs text-slate-500">{String(i + 1).padStart(2, "0")}</span>
              {task.label}
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={start}
          className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-6 text-base font-bold text-[#050807] transition-colors hover:bg-[#33FFA0] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FF88]"
        >
          Começar a missão
          <ArrowRight className="w-4 h-4" aria-hidden />
        </button>
        <p className="mt-3 text-center text-xs text-slate-400">
          O código que você escrever fica só no seu navegador.
        </p>
      </section>
    );
  }

  if (stage === "concluida") {
    return (
      <section aria-labelledby="concluida-titulo">
        <p className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-[#00FF88]">
          <Check className="w-3.5 h-3.5" aria-hidden /> Missão concluída
        </p>
        <h1
          id="concluida-titulo"
          ref={headingRef}
          tabIndex={-1}
          className="mt-2 text-[28px] sm:text-4xl font-black tracking-tight leading-[1.1] focus:outline-none"
        >
          Você escreveu seu primeiro código.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
          O <code className="font-mono text-[#F5F7F6]">&lt;h1&gt;</code> e o{" "}
          <code className="font-mono text-[#F5F7F6]">&lt;p&gt;</code> são HTML: dizem <em>o que</em> aparece. O{" "}
          <code className="font-mono text-[#F5F7F6]">color</code> é CSS: diz <em>como</em> aparece. Todo site da
          internet é feito dessa mesma base.
        </p>

        <div className="mt-5">
          <CodePreview code={code} caption="sua primeira página · por enquanto só no seu celular" />
        </div>

        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0A0F0D] p-5">
          <h2 className="text-[17px] font-bold">Próximo passo: colocar uma página sua no ar</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
            No curso você segue esse caminho, uma missão curta de cada vez, e termina com um link público para mandar
            para quem quiser. Tudo pelo celular, com a IA como apoio para tirar dúvidas.
          </p>
          <ol className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {PATH.map((step, i) => (
              <li
                key={step}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                  i === 0 ? "border-[#00FF88]/30 text-[#F5F7F6]" : "border-white/[0.06] text-slate-400"
                }`}
              >
                {i === 0 ? (
                  <Check className="w-3.5 h-3.5 shrink-0 text-[#00FF88]" aria-label="feito" />
                ) : (
                  <span className="font-mono text-[11px] text-slate-500">{String(i + 1).padStart(2, "0")}</span>
                )}
                {step}
              </li>
            ))}
          </ol>

          <div className="mt-5">
            <CheckoutButton
              id="mission-checkout-cta"
              placement="mission"
              label={`Continuar no curso — ${OFFER.priceLabel}`}
            />
            <p className="mt-2 text-center text-xs text-slate-400">
              {OFFER.billing.charAt(0).toUpperCase() + OFFER.billing.slice(1)} · pagamento pelo Mercado Pago
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <Link href="/#oferta" className="text-sm font-semibold text-slate-300 underline-offset-4 hover:text-[#F5F7F6] hover:underline">
            Ver o que está incluído
          </Link>
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-[#F5F7F6]"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden />
            Refazer a missão
          </button>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="editar-titulo">
      <p className="font-mono text-[11px] uppercase tracking-widest text-[#00FF88]">Missão 0 · seu primeiro código</p>
      <h1
        id="editar-titulo"
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 text-2xl sm:text-3xl font-black tracking-tight focus:outline-none"
      >
        Edite o código e veja o resultado
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-slate-300">
        Isso é HTML. O que está entre <code className="font-mono text-[#F5F7F6]">&lt;h1&gt;</code> e{" "}
        <code className="font-mono text-[#F5F7F6]">&lt;/h1&gt;</code> vira o título; entre{" "}
        <code className="font-mono text-[#F5F7F6]">&lt;p&gt;</code> e <code className="font-mono text-[#F5F7F6]">&lt;/p&gt;</code>,
        um parágrafo. Toque no código e mude só o texto.
      </p>

      <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#0A0F0D] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Tarefas</h2>
          <span className="font-mono text-xs text-slate-400" aria-live="polite">
            {doneCount}/{TASKS.length} feitas
          </span>
        </div>
        <ul className="mt-3 space-y-3">
          {TASKS.map((task) => {
            const done = check[task.id];
            return (
              <li key={task.id} className="flex items-start gap-3">
                {done ? (
                  <Check className="mt-0.5 w-5 h-5 shrink-0 text-[#00FF88]" aria-hidden />
                ) : (
                  <Circle className="mt-0.5 w-5 h-5 shrink-0 text-slate-600" aria-hidden />
                )}
                <div>
                  <p className={`text-[15px] font-semibold ${done ? "text-[#00FF88]" : "text-[#F5F7F6]"}`}>
                    {task.label}
                    <span className="sr-only">{done ? " (feita)" : " (pendente)"}</span>
                  </p>
                  {!done && <p className="mt-0.5 text-sm leading-relaxed text-slate-400">{task.hint}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="mission-code" className="text-sm font-semibold">
            Seu código
          </label>
          <button
            type="button"
            onClick={() => setCode(STARTER_CODE)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#F5F7F6]"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden />
            Voltar ao original
          </button>
        </div>
        <textarea
          id="mission-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={5}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          aria-describedby={check.missingTags ? "mission-code-erro" : undefined}
          className="mt-2 block w-full resize-y rounded-xl border border-white/15 bg-[#050807] p-3.5 font-mono text-base leading-relaxed text-[#F5F7F6] focus:border-[#00FF88] focus:outline-none focus:ring-1 focus:ring-[#00FF88]"
        />
        {check.missingTags && (
          <p id="mission-code-erro" className="mt-2 text-sm text-amber-300">
            Parece que uma tag foi apagada. Toque em “Voltar ao original” e mude só o texto.
          </p>
        )}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold">Resultado</p>
        <CodePreview code={previewCode} caption="prévia · atualiza enquanto você digita" />
      </div>

      <details className="mt-5 rounded-xl border border-white/[0.08] bg-[#0A0F0D] px-4 py-3 text-sm">
        <summary className="cursor-pointer font-semibold text-slate-300">
          <Sparkles className="mr-1.5 inline w-3.5 h-3.5 text-[#00D9FF]" aria-hidden />
          Travou? Veja como pedir ajuda para a IA
        </summary>
        <p className="mt-2 leading-relaxed text-slate-400">
          No curso você usa a IA para entender o código, não para copiar sem saber o que faz. Uma boa pergunta seria:
        </p>
        <p className="mt-2 rounded-lg bg-[#050807] p-3 font-mono text-[13px] leading-relaxed text-slate-300">
          “O que faz a tag &lt;h1&gt; no HTML? Explique para quem nunca programou.”
        </p>
      </details>

      <button
        type="button"
        onClick={finish}
        disabled={!allDone}
        className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-6 text-base font-bold text-[#050807] transition-colors hover:bg-[#33FFA0] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/[0.06] disabled:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FF88]"
      >
        {allDone ? "Concluir missão" : `Faltam ${TASKS.length - doneCount} tarefa${TASKS.length - doneCount > 1 ? "s" : ""}`}
        {allDone && <ArrowRight className="w-4 h-4" aria-hidden />}
      </button>
    </section>
  );
}
