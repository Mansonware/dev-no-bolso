"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  ExternalLink,
  GitCommitHorizontal,
  Globe,
  Info,
  ListChecks,
  Pencil,
  RefreshCw,
  Rocket,
  Sparkles,
} from "lucide-react";
import { LessonShell, stageStates } from "./LessonShell";
import type { LessonStatus, StageId } from "@/lib/mock/aluno";
import { validateStudentUrl } from "@/lib/validateStudentUrl";

// ============================================================================
// VALIDAÇÃO: validado-emulacao, com ressalva — pull-to-refresh vs cache do
// GitHub Pages ainda está pendente de validação física. Não transformar
// nenhuma evidência de cache (ex.: parâmetro de versão na URL) em instrução
// oficial nesta fase; tratar apenas como resultado de Gate emulado.
// Referência: lib/mock/aluno.ts
// ============================================================================

const missionSteps = [
  {
    title: "Abrir o arquivo index.html do seu repositório",
    description: "No GitHub, entre no repositório meu-primeiro-site e toque no arquivo index.html.",
  },
  {
    title: "Tocar no ícone de lápis para editar",
    description: "No canto superior do arquivo, toque no ícone de edição e faça uma pequena alteração no texto.",
  },
  {
    title: "Confirmar o commit direto na branch main",
    description: 'Role até o final da tela, escreva uma mensagem curta e toque em "Commit changes".',
  },
  {
    title: "Aguardar o GitHub Pages processar a nova versão",
    description: "A publicação da alteração segue o mesmo processo automático da Aula 3.",
  },
];

export function Lesson4({ lessonStatus }: { lessonStatus: LessonStatus }) {
  const states = stageStates(lessonStatus);
  const [tab, setTab] = useState<StageId>(states.missao === "atual" ? "missao" : "teoria");

  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const toggleStep = (index: number) => setCheckedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  const completedStepsCount = Object.values(checkedSteps).filter(Boolean).length;

  const [siteUrl, setSiteUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  return (
    <LessonShell
      lessonNumber={4}
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
              O ciclo que você vai repetir sempre que quiser mudar o site
            </h2>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-300">
              Seu site já está no ar. Agora você vai fechar o ciclo completo: mudar algo no código e ver essa
              alteração aparecer na mesma URL pública, sem precisar publicar de novo do zero.
            </p>
          </div>

          {/* Ciclo editar → commit → deploy → nova versão online */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="rounded-xl border border-white/[0.06] bg-[#050807] p-3.5 text-left">
              <Pencil className="w-4 h-4 text-[#00D9FF]" aria-hidden />
              <p className="mt-2 text-sm font-semibold text-[#F5F7F6]">Editar</p>
              <p className="mt-1 text-xs text-slate-400">Mudar o index.html direto pelo navegador do celular.</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#050807] p-3.5 text-left">
              <GitCommitHorizontal className="w-4 h-4 text-[#00D9FF]" aria-hidden />
              <p className="mt-2 text-sm font-semibold text-[#F5F7F6]">Commit</p>
              <p className="mt-1 text-xs text-slate-400">Confirmar a alteração direto na branch main.</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#050807] p-3.5 text-left">
              <Rocket className="w-4 h-4 text-[#00D9FF]" aria-hidden />
              <p className="mt-2 text-sm font-semibold text-[#F5F7F6]">Deploy</p>
              <p className="mt-1 text-xs text-slate-400">O GitHub Pages publica a nova versão automaticamente.</p>
            </div>
            <div className="rounded-xl border border-[#00FF88]/20 bg-[#00FF88]/[0.02] p-3.5 text-left">
              <Globe className="w-4 h-4 text-[#00FF88]" aria-hidden />
              <p className="mt-2 text-sm font-semibold text-[#F5F7F6]">Nova versão online</p>
              <p className="mt-1 text-xs text-slate-400">A mesma URL, agora mostrando a alteração.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-[#0D1512] p-4">
            <RefreshCw className="mt-0.5 w-5 h-5 shrink-0 text-[#00D9FF]" aria-hidden />
            <div className="text-xs sm:text-sm leading-relaxed text-slate-300">
              <p className="font-semibold text-[#F5F7F6]">Etapa sendo validada no Android real.</p>
              <p className="mt-0.5 text-slate-400">
                Este ciclo foi testado em emulador Android (Pixel 8). Como o navegador do celular lida com o cache do
                GitHub Pages ao atualizar a página ainda está sendo validado em aparelho físico.
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
              <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[#F5F7F6]">Alterar e republicar seu site</h2>
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
            <RefreshCw className="mt-0.5 w-5 h-5 shrink-0 text-amber-400" aria-hidden />
            <div className="text-xs sm:text-sm leading-relaxed text-slate-300">
              <p className="font-semibold text-amber-300">Etapa sendo validada no Android real.</p>
              <p className="mt-0.5 text-slate-400">
                Se a alteração não aparecer de imediato ao abrir o site de novo, atualize a página. Em alguns
                aparelhos pode ser necessário fechar e abrir o navegador por causa do cache.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[#050807] p-4 text-xs text-slate-400">
            <Clock className="w-4 h-4 shrink-0 text-[#00D9FF] mt-0.5" />
            <p>
              <strong className="text-slate-300">Tempo de publicação:</strong> Assim como na Aula 3, nos testes
              emulados a nova versão apareceu em cerca de 1 minuto. No aparelho real isso ainda será validado.
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
              O objetivo desta aula é ver a sua alteração publicada na mesma URL pública de sempre.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#050807] p-5">
            <label htmlFor="update-url-input" className="block text-sm font-semibold text-[#F5F7F6]">
              URL do seu site depois da alteração:
            </label>
            <p className="mt-0.5 text-xs text-slate-400">Informe a mesma URL de sempre para registrar nesta sessão:</p>

            <div className="mt-3 flex flex-col sm:flex-row gap-2.5">
              <input
                id="update-url-input"
                type="url"
                value={siteUrl}
                onChange={(e) => {
                  setSiteUrl(e.target.value);
                  setSubmittedUrl(null);
                  setUrlError(null);
                }}
                aria-invalid={urlError ? true : undefined}
                aria-describedby={urlError ? "update-url-input-error" : undefined}
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
              <p id="update-url-input-error" role="alert" className="mt-2 text-xs text-red-400">
                {urlError}
              </p>
            )}

            {submittedUrl && (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 animate-in fade-in duration-300">
                <p className="text-xs text-slate-300">
                  URL informada registrada localmente nesta sessão. Abra o link para conferir se a alteração
                  aparece:
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
