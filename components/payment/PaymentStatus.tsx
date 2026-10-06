"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowRight, Check, Clock, Loader2, MessageCircle, RefreshCw, XCircle } from "lucide-react";
import type { PaymentState } from "@/lib/paymentCore";
import { SUPPORT_MESSAGES, supportWhatsAppUrl } from "@/lib/support";

type Result = {
  state: PaymentState | "missing_id";
  paymentId: string | null;
  accountCreated?: boolean;
  payerEmailHint?: string | null;
};

// Pix pendente costuma aprovar em segundos ou poucos minutos: a página verifica sozinha.
const POLL_FAST_MS = 5_000;
const POLL_SLOW_MS = 15_000;
const FAST_PHASE_MS = 2 * 60_000;
const GIVE_UP_MS = 15 * 60_000;

const supportUrl = supportWhatsAppUrl(SUPPORT_MESSAGES.payment);

const primary =
  "inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-6 text-base font-bold text-[#050807] transition-colors hover:bg-[#33FFA0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FF88]";
const secondary =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-[15px] font-semibold hover:border-white/30";

async function fetchState(paymentId: string): Promise<Result> {
  try {
    const res = await fetch(`/api/payment/${encodeURIComponent(paymentId)}`, { cache: "no-store" });
    const data = (await res.json().catch(() => null)) as Partial<Result> | null;
    if (data?.state) return { ...data, state: data.state, paymentId: data.paymentId ?? paymentId };
  } catch {
    // sem conexão
  }
  return { state: "unavailable", paymentId };
}

export function PaymentStatus() {
  const searchParams = useSearchParams();
  // O Mercado Pago pode mandar payment_id ou collection_id, conforme a versão do Checkout Pro.
  const paymentId = searchParams.get("payment_id") || searchParams.get("collection_id");

  const [result, setResult] = useState<Result | null>(paymentId ? null : { state: "missing_id", paymentId: null });
  const [gaveUp, setGaveUp] = useState(false);
  const [manualCheck, setManualCheck] = useState(0);

  useEffect(() => {
    if (!paymentId) return;
    let cancelled = false;
    let timer: number | undefined;
    const startedAt = Date.now();

    async function check() {
      const next = await fetchState(paymentId!);
      if (cancelled) return;
      setResult(next);

      const keepWaiting = next.state === "pending" || next.state === "unavailable";
      if (!keepWaiting) return;

      const elapsed = Date.now() - startedAt;
      if (elapsed > GIVE_UP_MS) {
        setGaveUp(true);
        return;
      }
      timer = window.setTimeout(check, elapsed < FAST_PHASE_MS ? POLL_FAST_MS : POLL_SLOW_MS);
    }

    check();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [paymentId, manualCheck]);

  function retry() {
    setGaveUp(false);
    setResult(null);
    setManualCheck((n) => n + 1);
  }

  if (!result) {
    return (
      <div role="status" className="flex flex-col items-center py-16 text-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#00FF88]" aria-hidden />
        <p className="mt-4 text-[15px] text-slate-300">Confirmando seu pagamento com o Mercado Pago…</p>
      </div>
    );
  }

  const idBox = result.paymentId && (
    <p className="mt-5 rounded-xl border border-white/[0.08] px-4 py-3 text-sm text-slate-400">
      Número do pagamento: <span className="font-mono font-semibold text-[#F5F7F6]">{result.paymentId}</span>
      <span className="mt-0.5 block text-xs">Guarde este número. Com ele você cria sua conta depois, se precisar.</span>
    </p>
  );

  const supportLink = supportUrl && (
    <a href={supportUrl} target="_blank" rel="noopener noreferrer" className={secondary}>
      <MessageCircle className="h-4 w-4" aria-hidden />
      Falar com o suporte
    </a>
  );

  switch (result.state) {
    case "approved": {
      const signupHref = `/cadastro?payment_id=${encodeURIComponent(result.paymentId ?? "")}`;

      if (result.accountCreated) {
        return (
          <section aria-labelledby="status-titulo">
            <StatusTag tone="ok" icon={<Check className="h-3.5 w-3.5" aria-hidden />}>Pagamento confirmado</StatusTag>
            <h1 id="status-titulo" className="mt-2 text-[28px] font-black leading-[1.1] tracking-tight sm:text-4xl">
              Sua conta já está pronta.
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
              Esta compra já foi usada para criar uma conta. Entre com o e-mail e a senha que você cadastrou.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/login?next=/aluno" className={primary}>
                Entrar na área do aluno
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </section>
        );
      }

      return (
        <section aria-labelledby="status-titulo">
          <StatusTag tone="ok" icon={<Check className="h-3.5 w-3.5" aria-hidden />}>Pagamento confirmado</StatusTag>
          <h1 id="status-titulo" className="mt-2 text-[28px] font-black leading-[1.1] tracking-tight sm:text-4xl">
            Compra aprovada. Falta 1 passo.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
            Crie sua conta agora. Leva 1 minuto e você já cai direto na primeira aula.
          </p>

          <ol className="mt-6 space-y-2 text-[15px]">
            <Step done>Pagamento aprovado</Step>
            <Step current>
              Criar sua conta
              {result.payerEmailHint && (
                <span className="mt-0.5 block text-sm font-normal text-slate-400">
                  Use o e-mail da compra: <span className="font-mono text-slate-200">{result.payerEmailHint}</span>
                </span>
              )}
            </Step>
            <Step>Começar a Aula 1</Step>
          </ol>

          <Link href={signupHref} className={`${primary} mt-6`}>
            Criar minha conta
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <p className="mt-3 text-center text-sm text-slate-400">
            Já criou?{" "}
            <Link href="/login?next=/aluno" className="font-semibold text-[#F5F7F6] underline underline-offset-4">
              Entrar
            </Link>
          </p>
          {idBox}
        </section>
      );
    }

    case "pending":
      return (
        <section aria-labelledby="status-titulo">
          <StatusTag tone="wait" icon={<Clock className="h-3.5 w-3.5" aria-hidden />}>Aguardando aprovação</StatusTag>
          <h1 id="status-titulo" className="mt-2 text-[28px] font-black leading-[1.1] tracking-tight sm:text-4xl">
            Estamos esperando o Mercado Pago confirmar.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
            Pix costuma confirmar em poucos minutos. Boleto pode levar até 3 dias úteis. Esta página verifica sozinha —
            assim que aprovar, aparece o botão para criar sua conta.
          </p>
          {!gaveUp ? (
            <p role="status" className="mt-5 flex items-center gap-2 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-amber-300" aria-hidden />
              Verificando automaticamente…
            </p>
          ) : (
            <p role="status" className="mt-5 text-sm text-slate-400">
              Ainda não aprovou. Pode fechar esta página: quando o pagamento for aprovado, entre em{" "}
              <Link href="/cadastro" className="font-semibold text-[#F5F7F6] underline underline-offset-4">
                Criar conta
              </Link>{" "}
              com o número abaixo.
            </p>
          )}
          {idBox}
          <div className="mt-6 flex flex-col gap-3">
            <button type="button" onClick={retry} className={secondary}>
              <RefreshCw className="h-4 w-4" aria-hidden />
              Verificar agora
            </button>
            {supportLink}
          </div>
        </section>
      );

    case "rejected":
    case "refunded":
      return (
        <section aria-labelledby="status-titulo">
          <StatusTag tone="error" icon={<XCircle className="h-3.5 w-3.5" aria-hidden />}>
            {result.state === "refunded" ? "Pagamento devolvido" : "Pagamento não aprovado"}
          </StatusTag>
          <h1 id="status-titulo" className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            {result.state === "refunded" ? "Este pagamento foi devolvido." : "O pagamento não foi aprovado."}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
            {result.state === "refunded"
              ? "O valor voltou para você, então esta compra não libera acesso. Se achar que é um engano, fale com o suporte."
              : "Nada foi cobrado. Você pode tentar de novo — Pix costuma ser o jeito mais rápido."}
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/#oferta" className={primary}>
              Tentar pagar de novo
            </Link>
            {supportLink}
          </div>
        </section>
      );

    case "missing_id":
    case "not_found":
    case "invalid":
      return (
        <section aria-labelledby="status-titulo">
          <AlertTriangle className="h-7 w-7 text-amber-400" aria-hidden />
          <h1 id="status-titulo" className="mt-3 text-2xl font-black tracking-tight">
            Não encontramos esta compra
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
            {result.state === "missing_id"
              ? "O Mercado Pago não mandou o número do pagamento de volta para o site. Se você pagou, use o número que está no comprovante do Mercado Pago para criar sua conta."
              : result.state === "invalid"
                ? "Este pagamento não corresponde a uma compra do Dev no Bolso. Se você pagou, fale com o suporte com o comprovante em mãos."
                : "Esse número de pagamento não existe no Mercado Pago. Confira o número no comprovante."}
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/cadastro" className={primary}>
              Já paguei: criar minha conta
            </Link>
            {supportLink}
            <Link href="/" className="py-2 text-center text-sm font-semibold text-slate-400 hover:text-[#F5F7F6]">
              Voltar ao início
            </Link>
          </div>
        </section>
      );

    case "unavailable":
      return (
        <section aria-labelledby="status-titulo">
          <AlertTriangle className="h-7 w-7 text-amber-400" aria-hidden />
          <h1 id="status-titulo" className="mt-3 text-2xl font-black tracking-tight">
            Não conseguimos confirmar agora
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
            A conexão com o Mercado Pago falhou por um instante. Seu pagamento não foi perdido.{" "}
            {gaveUp ? "Tente de novo em alguns minutos." : "Estamos tentando de novo automaticamente."}
          </p>
          {idBox}
          <div className="mt-6 flex flex-col gap-3">
            <button type="button" onClick={retry} className={primary}>
              <RefreshCw className="h-4 w-4" aria-hidden />
              Tentar de novo
            </button>
            {supportLink}
          </div>
        </section>
      );
  }
}

function StatusTag({ tone, icon, children }: { tone: "ok" | "wait" | "error"; icon: React.ReactNode; children: React.ReactNode }) {
  const color = tone === "ok" ? "text-[#00FF88]" : tone === "wait" ? "text-amber-300" : "text-rose-300";
  return (
    <p className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest ${color}`}>
      {icon}
      {children}
    </p>
  );
}

function Step({ children, done, current }: { children: React.ReactNode; done?: boolean; current?: boolean }) {
  return (
    <li
      className={`flex gap-3 rounded-xl border px-4 py-3 ${
        current ? "border-[#00FF88]/30 bg-[#00FF88]/[0.05] font-semibold" : "border-white/[0.06] bg-[#0A0F0D]"
      } ${!done && !current ? "text-slate-400" : ""}`}
    >
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10">
        {done ? (
          <Check className="h-3.5 w-3.5 text-[#00FF88]" aria-label="feito" />
        ) : current ? (
          <span className="h-2 w-2 rounded-full bg-[#00FF88]" aria-hidden />
        ) : null}
      </span>
      <span className="min-w-0">{children}</span>
    </li>
  );
}
