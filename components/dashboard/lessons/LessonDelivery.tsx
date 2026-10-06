"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, Check, ExternalLink, Loader2 } from "lucide-react";
import { PROJECT_NAME, type LessonContent } from "@/lib/course";
import { deliverySuggestions, type ProgressRecord } from "@/lib/progressCore";
import { validateGithubUser, validateRepoUrl, validateSiteUrl, type FieldResult } from "@/lib/validateStudentUrl";

type Props = {
  lessonId: string;
  delivery: LessonContent["delivery"];
  isDone: boolean;
  record: ProgressRecord;
  nextHref: string;
  isLast: boolean;
};

function validate(kind: LessonContent["delivery"]["kind"], value: string, confirmed: boolean): FieldResult {
  switch (kind) {
    case "github":
      return validateGithubUser(value);
    case "repo":
      return validateRepoUrl(value);
    case "site":
      return validateSiteUrl(value);
    case "confirm":
      return confirmed ? { ok: true, value: "yes" } : { ok: false, error: "Marque a confirmação depois de conferir o seu site." };
  }
}

function savedValue(kind: LessonContent["delivery"]["kind"], record: ProgressRecord): string {
  const suggestions = deliverySuggestions(record, PROJECT_NAME);
  if (kind === "github") return suggestions.github;
  if (kind === "repo") return suggestions.repo;
  if (kind === "site") return suggestions.site;
  return "";
}

export function LessonDelivery({ lessonId, delivery, isDone, record, nextHref, isLast }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(() => savedValue(delivery.kind, record));
  const [confirmed, setConfirmed] = useState(isDone);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [editing, setEditing] = useState(!isDone);

  const nextLabel = isLast ? "Ver meu projeto" : "Ir para a próxima aula";
  const inputId = `entrega-${lessonId}`;
  const errorId = `${inputId}-erro`;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;

    const result = validate(delivery.kind, value, confirmed);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, value: result.value }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Não conseguimos salvar agora. Tente de novo.");
        setPending(false);
        return;
      }

      if (delivery.kind !== "confirm") setValue(result.value);
      setJustCompleted(true);
      setEditing(false);
      setPending(false);
      router.refresh();
    } catch {
      setError("Sem conexão. Confira sua internet e tente de novo.");
      setPending(false);
    }
  }

  const completed = isDone || justCompleted;
  const link = delivery.kind === "repo" || delivery.kind === "site" ? value : delivery.kind === "confirm" ? record.site : null;

  if (completed && !editing) {
    return (
      <div className="space-y-4" aria-live="polite">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00FF88]/15">
            <Check className="h-5 w-5 text-[#00FF88]" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight">{justCompleted ? "Aula concluída!" : "Você já concluiu esta aula"}</h2>
            {delivery.kind !== "confirm" && value && (
              <p className="mt-1 break-all font-mono text-sm text-slate-300">{delivery.kind === "github" ? `@${value}` : value}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link
            href={nextHref}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-5 text-[15px] font-bold text-[#050807] hover:bg-[#33FFA0]"
          >
            {nextLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-semibold hover:border-white/30"
            >
              {delivery.kind === "repo" ? "Abrir repositório" : "Abrir meu site"}
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          )}
        </div>

        {delivery.kind !== "confirm" && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="py-2 text-sm font-semibold text-slate-400 underline underline-offset-4 hover:text-[#F5F7F6]"
          >
            Corrigir o que eu informei
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4" aria-busy={pending}>
      <h2 className="text-xl font-bold leading-snug tracking-tight sm:text-2xl">{delivery.heading}</h2>

      {delivery.kind === "confirm" ? (
        <>
          {record.site && (
            <a
              href={record.site}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-semibold hover:border-white/30 sm:w-auto"
            >
              Abrir meu site para conferir
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          )}
          <label
            htmlFor={inputId}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-[#050807] p-4"
          >
            <input
              id={inputId}
              type="checkbox"
              checked={confirmed}
              onChange={(e) => {
                setConfirmed(e.target.checked);
                setError(null);
              }}
              aria-describedby={error ? errorId : undefined}
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#00FF88]"
            />
            <span className="text-[15px] font-semibold">{delivery.label}</span>
          </label>
          <p className="text-sm text-slate-400">{delivery.help}</p>
        </>
      ) : (
        <div>
          <label htmlFor={inputId} className="block text-sm font-semibold">
            {delivery.label}
          </label>
          <input
            id={inputId}
            type={delivery.kind === "github" ? "text" : "url"}
            inputMode={delivery.kind === "github" ? "text" : "url"}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            placeholder={delivery.expectedFormat}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${errorId} ${inputId}-ajuda` : `${inputId}-ajuda`}
            className={`mt-1.5 h-12 w-full rounded-xl border bg-[#050807] px-3.5 font-mono text-base text-[#F5F7F6] placeholder-slate-600 focus:outline-none focus:ring-1 ${
              error ? "border-red-400/60 focus:ring-red-400" : "border-white/15 focus:border-[#00FF88] focus:ring-[#00FF88]"
            }`}
          />
          <p id={`${inputId}-ajuda`} className="mt-1.5 text-sm text-slate-400">
            {delivery.help}
          </p>
        </div>
      )}

      {error && (
        <p id={errorId} role="alert" className="flex items-start gap-2 text-sm text-red-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-5 text-[15px] font-bold text-[#050807] transition-colors hover:bg-[#33FFA0] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Check className="h-4 w-4" aria-hidden />}
        {pending ? "Salvando…" : completed ? "Salvar correção" : "Concluir aula"}
      </button>
    </form>
  );
}
