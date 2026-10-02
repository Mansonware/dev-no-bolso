"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Loader2,
  MessageCircle,
  RotateCcw,
} from "lucide-react";
import { OFFER } from "@/lib/offer";

interface AccessState {
  loading: boolean;
  verified: boolean;
  error?: string;
  amount?: number;
}

const ADMIN_PHONE = (process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "5512991070038").replace(/\D/g, "");

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryPaymentId = searchParams.get("payment_id") || searchParams.get("collection_id");

  const [retryKey, setRetryKey] = useState(0);
  const [countdown, setCountdown] = useState(2);
  const [state, setState] = useState<AccessState>({
    loading: true,
    verified: false,
  });

  useEffect(() => {
    let active = true;

    async function claimAccess() {
      if (!queryPaymentId) {
        if (active) {
          setState({
            loading: false,
            verified: false,
            error: "O Mercado Pago não enviou o identificador do pagamento.",
          });
        }
        return;
      }

      setState({ loading: true, verified: false });

      try {
        const response = await fetch("/api/access/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId: queryPaymentId }),
        });
        const data = await response.json();

        if (!active) return;

        if (response.ok && data.success === true) {
          setCountdown(2);
          setState({
            loading: false,
            verified: true,
            amount: data.amount,
          });
        } else {
          setState({
            loading: false,
            verified: false,
            error: data.error || "O pagamento ainda não pôde ser confirmado como aprovado.",
          });
        }
      } catch (error: unknown) {
        const err = error as Error;
        if (active) {
          setState({
            loading: false,
            verified: false,
            error: err.message || "Erro de conexão ao validar o pagamento.",
          });
        }
      }
    }

    claimAccess();
    return () => {
      active = false;
    };
  }, [queryPaymentId, retryKey]);

  useEffect(() => {
    if (!state.verified) return;

    const interval = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          router.replace("/aluno");
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [router, state.verified]);

  const supportUrl =
    "https://wa.me/" +
    ADMIN_PHONE +
    "?text=" +
    encodeURIComponent(
      "Olá! Meu pagamento do DEV NO BOLSO foi realizado, mas preciso de ajuda para acessar as aulas."
    );

  return (
    <div className="min-h-screen bg-[#050807] text-[#F5F7F6] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00FF88]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {state.loading && (
          <div className="bg-[#0A0F0D] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#0D1512] border border-[#00FF88]/30 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#00FF88] animate-spin" />
            </div>
            <h1 className="text-xl font-bold mb-2">Confirmando seu pagamento...</h1>
            <p className="text-sm text-slate-400">
              O servidor está consultando o Mercado Pago e preparando sua área do aluno.
            </p>
          </div>
        )}

        {!state.loading && state.verified && (
          <div className="bg-[#0A0F0D] border border-[#00FF88]/40 rounded-2xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(0,255,136,0.15)]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] text-xs font-semibold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4" />
              PAGAMENTO CONFIRMADO
            </div>

            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/50 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-[#00FF88]" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
              Suas aulas estão liberadas.
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Seu acesso foi ativado neste navegador. A partir de agora o curso funciona pela web; o WhatsApp fica só para suporte.
            </p>

            <div className="bg-[#050807] border border-white/10 rounded-xl p-4 mb-6 text-left">
              <div className="flex justify-between items-center py-1 border-b border-white/5 text-xs sm:text-sm">
                <span className="text-slate-400">Produto:</span>
                <span className="font-semibold text-slate-200">DEV NO BOLSO — Turma #01</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-xs sm:text-sm">
                <span className="text-slate-400">Valor validado:</span>
                <span className="font-mono font-bold text-[#00FF88]">
                  {state.amount ? `R$ ${state.amount.toFixed(2).replace(".", ",")}` : OFFER.priceFormatted}
                </span>
              </div>
            </div>

            <div className="mb-6 py-2 px-3 bg-[#0D1512] rounded-lg border border-white/5 text-xs text-slate-400">
              {countdown > 0 ? (
                <span>Entrando na área do aluno em <strong>{countdown} segundos</strong>...</span>
              ) : (
                <span>Abrindo sua área do aluno...</span>
              )}
            </div>

            <Link
              href="/aluno"
              className="w-full inline-flex items-center justify-center gap-3 bg-[#00FF88] hover:bg-[#00e57a] text-black font-extrabold text-base py-4 px-6 rounded-xl transition-all"
            >
              <span>ENTRAR NAS AULAS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {!state.loading && !state.verified && (
          <div className="bg-[#0A0F0D] border border-rose-500/30 rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-rose-500/10 border border-rose-500/40 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold mb-3">Ainda não consegui liberar o acesso</h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {state.error || "O pagamento ainda não pôde ser confirmado."}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setRetryKey((value) => value + 1)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-semibold text-slate-200 hover:border-[#00FF88]/40"
              >
                <RotateCcw className="w-4 h-4" />
                Tentar novamente
              </button>
              <a
                href={supportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-4 text-sm font-bold text-black hover:bg-[#00e57a]"
              >
                <MessageCircle className="w-4 h-4" />
                Suporte no WhatsApp
              </a>
            </div>

            <Link href="/" className="mt-5 inline-block text-xs text-slate-500 hover:text-slate-300">
              Voltar para o início
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PagamentoSucessoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050807] flex items-center justify-center p-4">
          <Loader2 className="w-8 h-8 text-[#00FF88] animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
