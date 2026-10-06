"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, RefreshCw, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";

function PendenteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get("payment_id") || searchParams.get("collection_id");

  const [checking, setChecking] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleRecheck = async () => {
    if (!paymentId) {
      setFeedback("Nenhum ID de pagamento disponível para consulta automática.");
      return;
    }

    setChecking(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/payment/${encodeURIComponent(paymentId)}`);
      const data = await res.json();

      if (res.ok && data.valid === true && data.status === "approved") {
        // Redireciona para a tela de sucesso com o pagamento aprovado
        router.push(`/pagamento/sucesso?payment_id=${encodeURIComponent(paymentId)}`);
      } else {
        setFeedback(
          data.reason ||
            `O pagamento ainda está com status '${data.status || "em análise"}'. Aguarde mais alguns instantes.`
        );
      }
    } catch {
      setFeedback("Erro de conexão ao consultar status. Tente novamente em breve.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050807] text-[#F5F7F6] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-[#0A0F0D] border border-white/[0.08] rounded-2xl p-6 sm:p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
          <Clock className="w-7 h-7 text-amber-400" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-4">
          Pagamento em verificação
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F5F7F6] mb-3">
          Estamos aguardando a aprovação
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
          O Mercado Pago ainda não confirmou o pagamento. Pix costuma atualizar em poucos minutos; boleto e análise
          bancária podem levar mais tempo.
        </p>

        {paymentId && (
          <div className="bg-[#050807] border border-white/10 rounded-xl p-3 mb-6 text-xs text-slate-400 font-mono text-center">
            ID do pagamento: <span className="text-white font-semibold">{paymentId}</span>
          </div>
        )}

        {feedback && (
          <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="p-4 bg-[#050807] rounded-xl border border-white/[0.06] text-sm text-slate-400 mb-6 text-left">
          <p className="font-semibold text-slate-200">O que acontece depois</p>
          <p className="mt-1.5 leading-relaxed">
            Quando o pagamento for aprovado, você poderá criar sua conta, entrar e começar a primeira missão.
          </p>
        </div>

        <div className="space-y-3">
          <button
            id="recheck-payment-btn"
            onClick={handleRecheck}
            disabled={checking}
            className="w-full inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold py-3.5 px-6 rounded-xl transition-all duration-200 disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
            <span>{checking ? "Consultando..." : "Verificar pagamento novamente"}</span>
          </button>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a página principal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PagamentoPendentePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050807] flex items-center justify-center p-4">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      }
    >
      <PendenteContent />
    </Suspense>
  );
}
