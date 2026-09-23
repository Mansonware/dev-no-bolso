"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Globe, ListChecks, ExternalLink, Clock, ArrowRight, Sparkles, Info, Smartphone } from "lucide-react";
import { LessonShell, stageStates } from "./LessonShell";
import type { LessonStatus, StageId } from "@/lib/mock/aluno";
import { validateStudentUrl } from "@/lib/validateStudentUrl";

// ============================================================================
// CONTEÚDO BASEADO EM GATE EMULADO · ANDROID FÍSICO PENDENTE
// Referência técnica: docs/gate-1-mobile-publish-spike.md
// Testado preliminarmente em viewport Chrome Android (Pixel 8) emulado.
// A validação definitiva em aparelho Android físico (touch real, teclado Gboard,
// pull-to-refresh e cache do Pages) ainda será executada.
// ============================================================================

const missionSteps = [
  {
    title: "Abrir o repositório no navegador do celular",
    description: "No Chrome do celular, acesse o repositório meu-primeiro-site que você criou na aula anterior.",
  },
  {
    title: "Localizar e tocar na aba Settings",
    description: "Na barra superior do repositório, localize a opção Settings (engrenagem de configurações).",
  },
  {
    title: "Navegar até a seção Pages",
    description: "No menu lateral de configurações, selecione a opção Pages (GitHub Pages).",
  },
  {
    title: "Definir a branch de publicação",
    description: "Em Build and deployment, mantenha Deploy from a branch e selecione a branch main e a pasta /(root).",
  },
  {
    title: "Salvar e aguardar a URL ser gerada",
    description: "Toque no botão Save. O GitHub iniciará o processo automático de publicação.",
  },
];

export function Lesson3({ lessonStatus }: { lessonStatus: LessonStatus }) {
  const states = stageStates(lessonStatus);
  const [tab, setTab] = useState<StageId>(states.missao === "atual" ? "missao" : "teoria");

  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: false,
    3: false,
    4: false,
  });

  const [siteUrl, setSiteUrl] = useState("https://anadev.github.io/meu-primeiro-site");
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  const toggleStep = (index: number) => {
    setCheckedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const completedStepsCount = Object.values(checkedSteps).filter(Boolean).length;

  return (
    <LessonShell
      lessonNumber={3}
      activeTab={tab}
      onTabChange={setTab}
      states={states}
      missionBadge={
        completedStepsCount === 5 && (
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
              Como seu site vai do repositório para a internet
            </h2>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-300">
              Na aula anterior você colocou o arquivo{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-[#00FF88]">index.html</code>{" "}
              dentro do GitHub. Só que um repositório é apenas um armazenamento de código — ele ainda não funciona
              como uma página web que qualquer pessoa pode abrir.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="rounded-xl border border-white/[0.06] bg-[#050807] p-4 text-left">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Passo 1</span>
              <p className="mt-1 text-sm font-semibold text-[#F5F7F6]">Código Salvo</p>
              <p className="mt-1 text-xs text-slate-400">Seu repositório guarda os arquivos HTML e assets do projeto.</p>
            </div>

            <div className="rounded-xl border border-[#00FF88]/20 bg-[#00FF88]/[0.02] p-4 text-left">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#00FF88]">Passo 2 · Agora</span>
              <p className="mt-1 text-sm font-semibold text-[#F5F7F6]">GitHub Pages</p>
              <p className="mt-1 text-xs text-slate-400">O GitHub compila o código e liga um servidor público gratuito.</p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#050807] p-4 text-left">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#00D9FF]">Passo 3 · Resultado</span>
              <p className="mt-1 text-sm font-semibold text-[#F5F7F6]">URL Pública</p>
              <p className="mt-1 text-xs text-slate-400">Um link mundial que você pode abrir em qualquer celular ou PC.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-[#0D1512] p-4">
            <Smartphone className="mt-0.5 w-5 h-5 shrink-0 text-[#00D9FF]" aria-hidden />
            <div className="text-xs sm:text-sm leading-relaxed text-slate-300">
              <p className="font-semibold text-[#F5F7F6]">Etapa sendo validada no Android real.</p>
              <p className="mt-0.5 text-slate-400">
                Este fluxo foi testado e validado em emulador Android (Pixel 8). O teste em aparelho físico está em
                andamento para afinar a experiência de toque no teclado mobile.
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
                <ListChecks className="w-3.5 h-3.5" /> Desafio Prático
              </span>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[#F5F7F6]">
                Ativar o GitHub Pages pelo celular
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-[#050807] px-3 py-1 font-mono text-xs">
              <span className="text-slate-400">Progresso:</span>
              <span className="font-bold text-[#00FF88]">{completedStepsCount}/5</span>
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
            <Info className="mt-0.5 w-5 h-5 shrink-0 text-amber-400" aria-hidden />
            <div className="text-xs sm:text-sm leading-relaxed text-slate-300">
              <p className="font-semibold text-amber-300">Etapa sendo validada no Android real.</p>
              <p className="mt-0.5 text-slate-400">
                A disposição visual dos menus do GitHub no navegador mobile pode variar dependendo do tamanho da tela.
                Se a opção Pages não aparecer de imediato, role a página até a seção de publicação.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[#050807] p-4 text-xs text-slate-400">
            <Clock className="w-4 h-4 shrink-0 text-[#00D9FF] mt-0.5" />
            <p>
              <strong className="text-slate-300">Tempo de publicação:</strong> Nos nossos testes emulados, a
              publicação apareceu em cerca de 1 minuto. No aparelho real isso ainda será validado e a atualização
              pode levar mais tempo para aparecer.
            </p>
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
              <Globe className="w-3.5 h-3.5" /> Entrega da Missão
            </span>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[#F5F7F6]">Resultado esperado da missão</h2>
            <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">
              O objetivo desta aula é ter uma URL pública funcional gerada pelo GitHub Pages.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#050807] p-4 sm:p-5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Formato esperado da URL:</span>
            <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#0A0F0D] px-3.5 py-2.5 font-mono text-xs sm:text-sm text-[#00FF88]">
              <span className="truncate">https://&lt;seu-usuario&gt;.github.io/&lt;repositorio&gt;</span>
              <Globe className="w-4 h-4 shrink-0 text-slate-500" />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Exemplo para o perfil demo: <code className="font-mono text-slate-300">https://anadev.github.io/meu-primeiro-site</code>
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#050807] p-5">
            <label htmlFor="url-input" className="block text-sm font-semibold text-[#F5F7F6]">
              URL pública do seu site no ar:
            </label>
            <p className="mt-0.5 text-xs text-slate-400">Informe a URL gerada pelo GitHub Pages para registrar nesta sessão:</p>

            <div className="mt-3 flex flex-col sm:flex-row gap-2.5">
              <input
                id="url-input"
                type="url"
                value={siteUrl}
                onChange={(e) => {
                  setSiteUrl(e.target.value);
                  setSubmittedUrl(null);
                  setUrlError(null);
                }}
                aria-invalid={urlError ? true : undefined}
                aria-describedby={urlError ? "url-input-error" : undefined}
                placeholder="https://anadev.github.io/meu-primeiro-site"
                className="h-11 flex-1 rounded-xl border border-white/15 bg-[#0A0F0D] px-3.5 text-sm font-mono text-[#F5F7F6] placeholder-slate-600 focus:border-[#00FF88] focus:outline-none focus:ring-1 focus:ring-[#00FF88]"
              />

              <button
                type="button"
                onClick={() => {
                  const result = validateStudentUrl(siteUrl);
                  setSubmittedUrl(result.ok ? result.url : null);
                  setUrlError(result.ok ? null : result.error);
                }}
                className="h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-5 text-sm font-bold text-[#050807] transition-all hover:bg-[#33FFA0] active:scale-[0.98]"
              >
                <span>{submittedUrl ? "URL Registrada nesta sessão" : "Registrar URL nesta sessão"}</span>
              </button>
            </div>

            {urlError && (
              <p id="url-input-error" role="alert" className="mt-2 text-xs text-red-400">
                {urlError}
              </p>
            )}

            {submittedUrl && (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 animate-in fade-in duration-300">
                <p className="text-xs text-slate-300">
                  URL informada registrada localmente nesta sessão. Você pode abrir o link no seu navegador para
                  testar a exibição da sua página:
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <a
                    href={submittedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#00FF88] px-3.5 py-2 text-xs font-bold text-[#050807] hover:bg-[#33FFA0] transition-colors"
                  >
                    <span>Abrir meu site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
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
