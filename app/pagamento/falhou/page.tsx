"use client";

import { Suspense } from "react";
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw, ShieldAlert, Loader2 } from "lucide-react";

function FalhouContent() {
  return (
    <div className="min-h-screen bg-[#050807] text-[#F5F7F6] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 bg-[#0A0F0D] border border-rose-500/30 rounded-2xl p-6 sm:p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.2)]">
          <XCircle className="w-10 h-10 text-rose-500" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <ShieldAlert className="w-4 h-4" />
          Transação Não Concluída
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F5F7F6] mb-3">
          Não foi possível confirmar seu pagamento.
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
          A transação foi recusada ou cancelada no processador. Nenhuma cobrança indevida foi realizada no seu método de pagamento.
        </p>

        <div className="p-4 bg-[#0D1512] rounded-xl border border-white/5 text-xs text-slate-400 mb-6 text-left space-y-1.5">
          <p className="font-semibold text-slate-300">Possíveis motivos:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Dados do cartão digitados incorretamente</li>
            <li>Limite insuficiente ou bloqueio preventivo do banco</li>
            <li>Tempo limite da sessão de pagamento expirado</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            id="retry-payment-btn"
            href="/#oferta"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#00FF88] hover:bg-[#00e57a] text-black font-extrabold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-[0_0_30px_rgba(0,255,136,0.2)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>TENTAR NOVAMENTE</span>
          </Link>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à Landing Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PagamentoFalhouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050807] flex items-center justify-center p-4">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        </div>
      }
    >
      <FalhouContent />
    </Suspense>
  );
}
