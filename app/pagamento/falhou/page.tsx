import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, XCircle } from "lucide-react";
import { PaymentShell } from "@/components/payment/PaymentShell";
import { SUPPORT_MESSAGES, supportWhatsAppUrl } from "@/lib/support";

export const metadata: Metadata = {
  title: "Pagamento não concluído | Dev no Bolso",
  robots: { index: false, follow: false },
};

export default function PagamentoFalhouPage() {
  const supportUrl = supportWhatsAppUrl(SUPPORT_MESSAGES.payment);

  return (
    <PaymentShell>
      <p className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-rose-300">
        <XCircle className="h-3.5 w-3.5" aria-hidden />
        Pagamento não concluído
      </p>
      <h1 className="mt-2 text-[28px] font-black leading-[1.1] tracking-tight sm:text-4xl">Não deu certo desta vez.</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
        O pagamento foi recusado, cancelado ou o tempo acabou. Nada foi cobrado. Os motivos mais comuns:
      </p>
      <ul className="mt-4 space-y-2 text-[15px] text-slate-300">
        <li className="flex gap-2">
          <span className="text-slate-500" aria-hidden>—</span> dados do cartão digitados errado;
        </li>
        <li className="flex gap-2">
          <span className="text-slate-500" aria-hidden>—</span> limite ou bloqueio preventivo do banco;
        </li>
        <li className="flex gap-2">
          <span className="text-slate-500" aria-hidden>—</span> o Pix expirou antes do pagamento.
        </li>
      </ul>
      <p className="mt-4 text-[15px] text-slate-300">Pix costuma ser o jeito mais rápido de aprovar.</p>

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/#oferta"
          className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-[#00FF88] px-6 text-base font-bold text-[#050807] hover:bg-[#33FFA0]"
        >
          Tentar de novo
        </Link>
        {supportUrl && (
          <a
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-[15px] font-semibold hover:border-white/30"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Falar com o suporte
          </a>
        )}
        <Link href="/" className="py-2 text-center text-sm font-semibold text-slate-400 hover:text-[#F5F7F6]">
          Voltar ao início
        </Link>
      </div>
    </PaymentShell>
  );
}
