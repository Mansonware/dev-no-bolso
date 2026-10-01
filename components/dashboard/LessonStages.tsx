"use client";

import { useState, useSyncExternalStore } from "react";
import { AlertTriangle, Check, CheckCircle2, Copy, ExternalLink, Lock } from "lucide-react";
import { lessonStages, type LessonStatus, type StageId, type Validacao } from "@/lib/mock/aluno";
import type { ConteudoAula } from "@/lib/aulas/modulo-01";

type StageState = "feito" | "atual" | "pendente";

// MOCK — estado das etapas derivado do status da aula (sem persistência).
function stageStates(lessonStatus: LessonStatus): Record<StageId, StageState> {
  if (lessonStatus === "feita") return { teoria: "feito", missao: "feito", validacao: "feito" };
  return { teoria: "feito", missao: "atual", validacao: "pendente" };
}

const placeholder: Record<StageId, string> = {
  teoria: "A explicação curta desta aula ainda está sendo produzida.",
  missao: "Os passos desta missão ainda estão sendo produzidos.",
  validacao: "Aqui você vai conferir se a missão foi concluída.",
};

// Honestidade sobre a evidência do Gate #1: nada aqui foi testado em Android físico.
const notaValidacao: Record<Validacao, string> = {
  "validado-emulacao":
    "Roteiro testado em um navegador simulando um celular Android (ambiente emulado), não em um aparelho físico. Se a sua tela estiver diferente, mande print no grupo da turma.",
  "pendente-android":
    "Este passo ainda não foi testado por nós no celular. Se algo estiver diferente, mande print no grupo da turma.",
};

// Usuário do GitHub guardado no aparelho, para montar os links diretos.
const USUARIO_KEY = "dnb:github-usuario";
const USUARIO_EVENT = "dnb:github-usuario";

function subscribeUsuario(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(USUARIO_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(USUARIO_EVENT, callback);
  };
}

function useUsuario() {
  const usuario = useSyncExternalStore(
    subscribeUsuario,
    () => localStorage.getItem(USUARIO_KEY) ?? "",
    () => ""
  );
  const setUsuario = (value: string) => {
    // Usuário do GitHub: letras, números e hífen.
    localStorage.setItem(USUARIO_KEY, value.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase());
    window.dispatchEvent(new Event(USUARIO_EVENT));
  };
  return [usuario, setUsuario] as const;
}

/** Renderiza `trechos` entre crases como código, sem tradução automática. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/`([^`]+)`/).map((part, i) =>
        i % 2 === 1 ? (
          <code
            key={i}
            translate="no"
            className="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[0.9em] text-[#F5F7F6]"
          >
            {part}
          </code>
        ) : (
          part
        )
      )}
    </>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#050807]">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-3 py-1.5">
        <span className="font-mono text-[11px] text-slate-500">index.html</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold text-[#00FF88] hover:bg-white/[0.06]"
        >
          {copied ? <Check className="w-4 h-4" aria-hidden /> : <Copy className="w-4 h-4" aria-hidden />}
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>
      <pre translate="no" className="overflow-x-auto p-3 font-mono text-[12px] leading-relaxed text-slate-300">
        {code}
      </pre>
    </div>
  );
}

function DirectLink({ template, usuario }: { template: string; usuario: string }) {
  const needsUser = template.includes("{usuario}");
  const href = template.replaceAll("{usuario}", usuario || "SEU-USUARIO");
  const label = href.replace(/^https:\/\//, "");

  if (needsUser && !usuario) {
    return (
      <p className="mt-2 break-all font-mono text-[12px] text-slate-500">
        {label}
        <span className="mt-1 block font-sans text-amber-300">Preencha o seu usuário do GitHub acima para o link funcionar.</span>
      </p>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      translate="no"
      className="mt-2 inline-flex max-w-full items-center gap-2 rounded-lg border border-[#00FF88]/30 px-3 py-2 font-mono text-[12px] text-[#00FF88] hover:bg-[#00FF88]/10"
    >
      <span className="break-all">{label}</span>
      <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden />
    </a>
  );
}

type Props = {
  lessonStatus: LessonStatus;
  validacao: Validacao;
  conteudo?: ConteudoAula;
};

export function LessonStages({ lessonStatus, validacao, conteudo }: Props) {
  const states = stageStates(lessonStatus);
  const initial = lessonStages.find((s) => states[s.id] === "atual")?.id ?? "teoria";
  const [tab, setTab] = useState<StageId>(initial);
  const [usuario, setUsuario] = useUsuario();
  const needsUser = conteudo?.passos.some((p) => p.link?.includes("{usuario}")) ?? false;

  return (
    <section className="mt-8">
      <div role="tablist" aria-label="Etapas da aula" className="grid grid-cols-3 gap-1 rounded-xl border border-white/[0.08] bg-[#0A0F0D] p-1">
        {lessonStages.map((s) => {
          const state = states[s.id];
          const selected = tab === s.id;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={selected}
              aria-controls={`painel-${s.id}`}
              onClick={() => setTab(s.id)}
              className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-lg text-[13px] font-semibold transition-colors ${
                selected ? "bg-white/[0.08] text-[#F5F7F6]" : "text-slate-400 hover:text-[#F5F7F6]"
              }`}
            >
              {state === "feito" && <Check className="w-3.5 h-3.5 text-[#00FF88]" aria-hidden />}
              {state === "atual" && <span className="h-1.5 w-1.5 rounded-full bg-[#00FF88]" aria-hidden />}
              {state === "pendente" && <Lock className="w-3 h-3" aria-hidden />}
              {s.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`painel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="mt-4 rounded-2xl border border-white/[0.08] bg-[#0A0F0D] p-5 sm:p-6"
      >
        {!conteudo ? (
          <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">Em produção</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{placeholder[tab]}</p>
          </div>
        ) : tab === "teoria" ? (
          <div className="space-y-3 text-[15px] leading-relaxed text-slate-300">
            {conteudo.teoria.map((p) => (
              <p key={p}>
                <Rich text={p} />
              </p>
            ))}
          </div>
        ) : tab === "missao" ? (
          <div>
            {needsUser && (
              <label className="block rounded-xl border border-white/10 bg-[#050807] p-4">
                <span className="text-sm font-semibold">Seu usuário do GitHub</span>
                <span className="mt-0.5 block text-[13px] text-slate-400">Serve para montar os links diretos desta missão.</span>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="ex.: anadev"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="mt-3 h-11 w-full rounded-lg border border-white/15 bg-[#0A0F0D] px-3 font-mono text-[15px] text-[#F5F7F6] placeholder:text-slate-600 focus:border-[#00FF88]/60 focus:outline-none"
                />
              </label>
            )}

            <ol className="mt-5 space-y-5">
              {conteudo.passos.map((passo, i) => (
                <li key={passo.texto} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#00FF88]/40 font-mono text-[12px] font-bold text-[#00FF88]">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1 text-[15px] leading-relaxed text-slate-200">
                    <Rich text={passo.texto} />
                    {passo.link && <DirectLink template={passo.link} usuario={usuario} />}
                    {passo.codigo && <CodeBlock code={passo.codigo} />}
                  </div>
                </li>
              ))}
            </ol>

            {conteudo.avisos.length > 0 && (
              <div className="mt-6 space-y-3">
                {conteudo.avisos.map((aviso) => (
                  <div key={aviso.titulo} className="rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-4">
                    <p className="flex items-start gap-2 text-sm font-semibold text-amber-200">
                      <AlertTriangle className="mt-0.5 w-4 h-4 shrink-0" aria-hidden />
                      {aviso.titulo}
                    </p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-slate-300">
                      <Rich text={aviso.texto} />
                    </p>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-6 font-mono text-[11px] leading-relaxed text-slate-500">{notaValidacao[validacao]}</p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold text-slate-300">Confira antes de seguir:</p>
            <ul className="mt-3 space-y-3">
              {conteudo.validacao.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-slate-200">
                  <CheckCircle2 className="mt-1 w-4 h-4 shrink-0 text-[#00FF88]" aria-hidden />
                  <span>
                    <Rich text={item} />
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl border border-white/10 px-4 py-3 text-sm leading-relaxed text-slate-400">
              Deu certo? Mande o link do seu site (ou um print) no grupo da turma no WhatsApp. Travou? Mande print
              da tela que a gente te ajuda.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
