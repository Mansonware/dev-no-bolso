"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, AtSign, Check, FolderGit2, Info, KeyRound, Sparkles, UserPlus } from "lucide-react";
import { LessonShell, stageStates } from "./LessonShell";
import type { LessonStatus, StageId } from "@/lib/mock/aluno";

// ============================================================================
// VALIDAÇÃO: pendente-android — cadastro do zero ainda não foi testado em
// nenhum ambiente (nem emulado). Manter linguagem cautelosa nesta aula.
// Referência: lib/mock/aluno.ts
// ============================================================================

const missionSteps = [
  {
    title: "Abrir o navegador do celular e acessar github.com",
    description: "Pode ser o Chrome ou qualquer navegador do seu Android. Digite github.com na barra de endereço.",
  },
  {
    title: 'Tocar em "Sign up" e preencher os dados',
    description: "Informe seu e-mail, crie uma senha e escolha um nome de usuário — esse nome fica público.",
  },
  {
    title: "Confirmar a verificação pedida pelo GitHub",
    description: "Pode ser um código enviado por e-mail ou um teste de segurança (captcha). Siga o que aparecer na tela.",
  },
  {
    title: "Guardar o nome de usuário escolhido",
    description: "Esse @usuario vai aparecer na URL do seu site mais adiante no módulo. Anote em algum lugar seguro.",
  },
];

export function Lesson1({ lessonStatus }: { lessonStatus: LessonStatus }) {
  const states = stageStates(lessonStatus);
  const [tab, setTab] = useState<StageId>(states.missao === "atual" ? "missao" : "teoria");

  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const toggleStep = (index: number) => setCheckedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  const completedStepsCount = Object.values(checkedSteps).filter(Boolean).length;

  const [handle, setHandle] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <LessonShell
      lessonNumber={1}
      activeTab={tab}
      onTabChange={setTab}
      states={states}
      missionBadge={
        completedStepsCount === missionSteps.length && (
          <span className="w-2 h-2 rounded-full bg-[#00FF88] absolute top-2 right-2 animate-pulse" />
        )
      }
      teoria={
        <>
          <div>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#00D9FF]">
              <Sparkles className="w-3.5 h-3.5" /> Conceito Essencial
            </span>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[#F5F7F6]">
              Onde o seu código — e depois o seu site — vai morar
            </h2>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-300">
              O GitHub é uma plataforma gratuita para guardar código. Neste módulo, sua conta é a chave de acesso
              para todo o resto: criar um repositório, publicar um site e, mais tarde, alterá-lo pelo celular.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="rounded-xl border border-[#00FF88]/20 bg-[#00FF88]/[0.02] p-4 text-left">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#00FF88]">Passo 1 · Agora</span>
              <p className="mt-1 text-sm font-semibold text-[#F5F7F6]">Sua conta</p>
              <p className="mt-1 text-xs text-slate-400">A chave de acesso a tudo que vem depois no módulo.</p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#050807] p-4 text-left">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Passo 2 · Aula 2</span>
              <p className="mt-1 text-sm font-semibold text-[#F5F7F6]">Seu repositório</p>
              <p className="mt-1 text-xs text-slate-400">A pasta pública onde o código do seu site vai ficar.</p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#050807] p-4 text-left">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#00D9FF]">Passo 3 · Aula 3</span>
              <p className="mt-1 text-sm font-semibold text-[#F5F7F6]">Site no ar</p>
              <p className="mt-1 text-xs text-slate-400">O momento em que tudo isso vira uma URL pública.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/[0.04] p-4">
            <AlertTriangle className="mt-0.5 w-5 h-5 shrink-0 text-amber-400" aria-hidden />
            <div className="text-xs sm:text-sm leading-relaxed text-slate-300">
              <p className="font-semibold text-amber-300">Etapa ainda não validada em Android físico.</p>
              <p className="mt-0.5 text-slate-400">
                O cadastro envolve confirmação por e-mail e pode pedir verificações extras de segurança. Ainda vamos
                testar esse fluxo completo em um aparelho Android real antes de fechar os detalhes finos.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setTab("missao")}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-5 text-sm font-bold text-[#050807] transition-all hover:bg-[#33FFA0] active:scale-[0.98]"
            >
              <span>Ir para a Missão</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      }
      missao={
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#00FF88]">
                <UserPlus className="w-3.5 h-3.5" /> Desafio Prático
              </span>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[#F5F7F6]">Criar sua conta no GitHub</h2>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-[#050807] px-3 py-1 font-mono text-xs">
              <span className="text-slate-400">Progresso:</span>
              <span className="font-bold text-[#00FF88]">
                {completedStepsCount}/{missionSteps.length}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            Execute os passos no seu smartphone e vá marcando cada etapa concluída:
          </p>

          <div className="space-y-2.5">
            {missionSteps.map((step, idx) => {
              const isChecked = Boolean(checkedSteps[idx]);
              return (
                <div
                  key={step.title}
                  onClick={() => toggleStep(idx)}
                  className={`flex items-start gap-3.5 rounded-xl border p-4 cursor-pointer transition-all ${
                    isChecked
                      ? "border-[#00FF88]/40 bg-[#00FF88]/[0.04]"
                      : "border-white/[0.06] bg-[#050807] hover:border-white/15"
                  }`}
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isChecked}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                      isChecked ? "border-[#00FF88] bg-[#00FF88] text-[#050807]" : "border-white/30 bg-transparent"
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold transition-colors ${isChecked ? "text-[#00FF88]" : "text-[#F5F7F6]"}`}>
                      {idx + 1}. {step.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/[0.04] p-4">
            <KeyRound className="mt-0.5 w-5 h-5 shrink-0 text-amber-400" aria-hidden />
            <div className="text-xs sm:text-sm leading-relaxed text-slate-300">
              <p className="font-semibold text-amber-300">Etapa ainda não validada em Android físico.</p>
              <p className="mt-0.5 text-slate-400">
                Preencher e-mail, senha e código de verificação pelo teclado do celular ainda não foi testado em
                aparelho real. Se algo se comportar diferente do esperado, isso vai ser ajustado depois desse teste.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setTab("teoria")}
              className="text-xs font-semibold text-slate-400 hover:text-[#F5F7F6] order-2 sm:order-1"
            >
              ← Rever a Teoria
            </button>
            <button
              type="button"
              onClick={() => setTab("validacao")}
              className="w-full sm:w-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-5 text-sm font-bold text-[#050807] transition-all hover:bg-[#33FFA0] active:scale-[0.98] order-1 sm:order-2"
            >
              <span>Ir para a Validação</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      }
      validacao={
        <>
          <div>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#00FF88]">
              <FolderGit2 className="w-3.5 h-3.5" /> Entrega da Missão
            </span>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[#F5F7F6]">Resultado esperado da missão</h2>
            <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">
              O objetivo desta aula é ter uma conta ativa no GitHub e saber o seu nome de usuário.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#050807] p-4 sm:p-5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Formato esperado do usuário:</span>
            <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#0A0F0D] px-3.5 py-2.5 font-mono text-xs sm:text-sm text-[#00FF88]">
              <span className="truncate">@seu-usuario-github</span>
              <AtSign className="w-4 h-4 shrink-0 text-slate-500" />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Exemplo para o perfil demo: <code className="font-mono text-slate-300">@anadev</code>
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#050807] p-5">
            <label htmlFor="handle-input" className="block text-sm font-semibold text-[#F5F7F6]">
              Seu nome de usuário no GitHub:
            </label>
            <p className="mt-0.5 text-xs text-slate-400">Informe o usuário que você escolheu no cadastro para registrar nesta sessão:</p>

            <div className="mt-3 flex flex-col sm:flex-row gap-2.5">
              <input
                id="handle-input"
                type="text"
                value={handle}
                onChange={(e) => {
                  setHandle(e.target.value);
                  setIsSubmitted(false);
                }}
                placeholder="anadev"
                className="h-11 flex-1 rounded-xl border border-white/15 bg-[#0A0F0D] px-3.5 text-sm font-mono text-[#F5F7F6] placeholder-slate-600 focus:border-[#00FF88] focus:outline-none focus:ring-1 focus:ring-[#00FF88]"
              />

              <button
                type="button"
                onClick={() => {
                  if (handle.trim()) setIsSubmitted(true);
                }}
                className="h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-5 text-sm font-bold text-[#050807] transition-all hover:bg-[#33FFA0] active:scale-[0.98]"
              >
                <span>{isSubmitted ? "Usuário registrado nesta sessão" : "Registrar usuário nesta sessão"}</span>
              </button>
            </div>

            {isSubmitted && handle.trim() && (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 animate-in fade-in duration-300">
                <p className="text-xs text-slate-300">
                  Usuário <span className="font-mono text-[#00FF88]">@{handle.trim()}</span> registrado localmente
                  nesta sessão. Você já pode seguir para a próxima aula.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Link
                    href="/aluno/trilha"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-[#F5F7F6] hover:bg-white/10 transition-colors"
                  >
                    <span>Voltar para a Trilha</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[#050807] p-4 text-xs text-slate-400">
            <Info className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
            <p>A validação automática será adicionada em uma próxima etapa.</p>
          </div>
        </>
      }
    />
  );
}
