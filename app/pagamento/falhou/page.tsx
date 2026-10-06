"use client";

import { Suspense } from "react";
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw, ShieldAlert, Loader2 } from "lucide-react";

function FalhouContent() {
  return (
    <div className="min-h-screen bg-[#050807] text-[#F5F7F6] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-[#0A0F0D] border border-white/[0.08] rounded-2xl p-6 sm:p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center">
          <XCircle className="w-7 h-7 text-rose-400" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <ShieldAlert className="w-4 h-4" />
          Pagamento não concluído
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F5F7F6] mb-3">
          Tente o pagamento novamente
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
          A tentativa foi recusada, cancelada ou expirou no Mercado Pago. Revise os dados e tente outra vez.
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
            <span>Tentar pagamento novamente</span>
          </Link>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao início</span>
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
