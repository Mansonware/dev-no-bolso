"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Loader2, MessageCircle } from "lucide-react";

interface PaymentStatusState {
  loading: boolean;
  verified: boolean;
  paymentId: string | null;
  error?: string;
  amount?: number;
}

const ADMIN_PHONE = (process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "5512991070038").replace(/\D/g, "");

function buildWhatsAppUrl(pId: string) {
  const message = `Olá! Acabei de garantir minha vaga no DEV NO BOLSO — Turma #01 ✅\n\nMeu pagamento foi aprovado.\n\nID do pagamento: ${pId}\n\nQuero receber meu acesso ao grupo.`;
  return `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  // Mercado Pago pode enviar payment_id ou collection_id dependendo da versão do Checkout Pro
  const queryPaymentId = searchParams.get("payment_id") || searchParams.get("collection_id");

  const [state, setState] = useState<PaymentStatusState>({
    loading: true,
    verified: false,
    paymentId: queryPaymentId,
  });

  const [countdown, setCountdown] = useState<number>(2);
  const [redirected, setRedirected] = useState<boolean>(false);
  const redirectTriggered = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function checkPaymentServerSide() {
      if (!queryPaymentId) {
        if (isMounted) {
          setState({
            loading: false,
            verified: false,
            paymentId: null,
            error: "Identificador de pagamento não fornecido nos parâmetros de retorno.",
          });
        }
        return;
      }

      try {
        const res = await fetch(`/api/payment/${encodeURIComponent(queryPaymentId)}`);
        const data = await res.json();

        if (isMounted) {
          if (res.ok && data.valid === true && data.status === "approved") {
            setState({
              loading: false,
              verified: true,
              paymentId: String(data.paymentId),
              amount: data.amount,
            });
          } else {
            setState({
              loading: false,
              verified: false,
              paymentId: queryPaymentId,
              error: data.reason || data.error || "O status do pagamento não pôde ser confirmado como aprovado.",
            });
          }
        }
      } catch (err: unknown) {
        const error = err as Error;
        if (isMounted) {
          setState({
            loading: false,
            verified: false,
            paymentId: queryPaymentId,
            error: error.message || "Erro de conexão ao validar pagamento.",
          });
        }
      }
    }

    checkPaymentServerSide();

    return () => {
      isMounted = false;
    };
  }, [queryPaymentId]);

  // Contagem regressiva e abertura automática do WhatsApp após ~2 segundos
  useEffect(() => {
    if (!state.verified || !state.paymentId || redirectTriggered.current) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!redirectTriggered.current) {
            redirectTriggered.current = true;
            setRedirected(true);
            const targetUrl = buildWhatsAppUrl(state.paymentId!);
            window.open(targetUrl, "_blank", "noopener,noreferrer");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.verified, state.paymentId]);

  return (
    <div className="min-h-screen bg-[#050807] text-[#F5F7F6] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Luzes de fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00FF88]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#00D9FF]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid sutil */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Estado de Carregamento */}
        {state.loading && (
          <div className="bg-[#0A0F0D] border border-white/10 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#0D1512] border border-[#00FF88]/30 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#00FF88] animate-spin" />
            </div>
            <h1 className="text-xl font-bold tracking-wide mb-2 text-[#F5F7F6]">
              Consultando Mercado Pago...
            </h1>
            <p className="text-sm text-slate-400">
              Validando a autenticidade e status do pagamento server-side.
            </p>
          </div>
        )}

        {/* Estado Validado com Sucesso */}
        {!state.loading && state.verified && state.paymentId && (
          <div className="bg-[#0A0F0D] border border-[#00FF88]/40 rounded-2xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(0,255,136,0.15)] backdrop-blur-xl">
            {/* Badge Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] text-xs font-semibold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4" />
              PAGAMENTO CONFIRMADO ✅
            </div>

            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/50 flex items-center justify-center shadow-[0_0_25px_rgba(0,255,136,0.3)]">
              <CheckCircle2 className="w-10 h-10 text-[#00FF88]" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F5F7F6] mb-3">
              Sua vaga está garantida.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Agora falta apenas entrar em contato com a ADM da turma para receber seu acesso ao grupo.
            </p>

            {/* Card com Detalhes do Pagamento */}
            <div className="bg-[#050807] border border-white/10 rounded-xl p-4 mb-6 text-left">
              <div className="flex justify-between items-center py-1 border-b border-white/5 text-xs sm:text-sm">
                <span className="text-slate-400">Produto:</span>
                <span className="font-semibold text-slate-200">DEV NO BOLSO — Turma #01</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5 text-xs sm:text-sm">
                <span className="text-slate-400">Valor Validado:</span>
                <span className="font-mono font-bold text-[#00FF88]">R$ 20,00</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-xs sm:text-sm">
                <span className="text-slate-400">ID do pagamento:</span>
                <span className="font-mono font-bold text-white bg-white/5 px-2 py-0.5 rounded">
                  {state.paymentId}
                </span>
              </div>
            </div>

            {/* Aviso de Redirecionamento Automático */}
            <div className="mb-6 py-2 px-3 bg-[#0D1512] rounded-lg border border-white/5 text-xs text-slate-400 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
              {countdown > 0 ? (
                <span>Abrindo WhatsApp da ADM em <strong>{countdown} segundos</strong>...</span>
              ) : (
                <span>{redirected ? "Redirecionamento acionado!" : "Pronto para abrir o WhatsApp!"}</span>
              )}
            </div>

            {/* Botão de WhatsApp Principal & Fallback Obrigatório */}
            <a
              id="whatsapp-access-btn"
              href={buildWhatsAppUrl(state.paymentId)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 bg-[#00FF88] hover:bg-[#00e57a] text-black font-extrabold text-base py-4 px-6 rounded-xl transition-all duration-200 shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>RECEBER ACESSO NO WHATSAPP</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <p className="text-[11px] text-slate-500 mt-4">
              Caso seu navegador bloqueie a abertura automática, clique no botão acima para liberar seu acesso imediatamente.
            </p>
          </div>
        )}

        {/* Estado de Erro ou Não Confirmado */}
        {!state.loading && (!state.verified || state.error) && (
          <div className="bg-[#0A0F0D] border border-rose-500/30 rounded-2xl p-6 sm:p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-rose-500/10 border border-rose-500/40 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F7F6] mb-3">
              Não foi possível validar este pagamento
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {state.error || "O status não pôde ser confirmado diretamente com a API do Mercado Pago."}
            </p>

            {state.paymentId && (
              <div className="bg-[#050807] border border-white/10 rounded-xl p-3 mb-6 text-xs text-slate-400 font-mono">
                ID consultado: {state.paymentId}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/15 text-[#F5F7F6] text-sm font-semibold rounded-xl transition-all text-center"
              >
                Voltar ao Início
              </Link>
              <a
                href={`https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(
                  `Olá, tentei realizar o pagamento do DEV NO BOLSO (ID: ${state.paymentId || "desconhecido"}), mas a validação retornou pendente/não aprovada. Poderia me ajudar?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-[#00FF88] hover:bg-[#00e57a] text-black text-sm font-bold rounded-xl transition-all text-center inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Falar com a ADM
              </a>
            </div>
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
