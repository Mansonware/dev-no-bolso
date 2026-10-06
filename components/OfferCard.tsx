import { Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "./CheckoutButton";
import { FREE_MISSION_HREF, OFFER } from "@/lib/offer";

const includesList = [
  "Acesso à plataforma com a trilha de missões",
  "Módulo 01: do zero ao seu site no ar, pelo celular",
  "Modelo de projeto inicial para você editar",
  "Em cada aula: teoria curta, missão prática e validação",
  "Suporte por WhatsApp para dúvidas nas missões",
];

export function OfferCard() {
  return (
    <section id="oferta" aria-labelledby="oferta-titulo" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-lg">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">O que está incluído</p>
        <h2 id="oferta-titulo" className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
          Tudo para sair do zero e publicar
        </h2>

        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0A0F0D] p-5 sm:p-7">
          <ul className="space-y-3">
            {includesList.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-slate-200">
                <Check className="mt-0.5 w-4 h-4 shrink-0 text-[#00FF88]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-white/[0.08] pt-6">
            <p className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight">{OFFER.priceLabel}</span>
              <span className="text-sm text-slate-400">{OFFER.billing}</span>
            </p>
            <p className="mt-1 text-sm text-slate-400">Sem mensalidade e sem cobrança recorrente.</p>
          </div>

          <div className="mt-6 space-y-3">
            <CheckoutButton id="offer-checkout" placement="offer" />
            <p className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#00FF88]" aria-hidden />
              Pagamento processado pelo Mercado Pago
            </p>
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-slate-400">
          Prefere testar antes?{" "}
          <Link href={FREE_MISSION_HREF} className="font-semibold text-[#F5F7F6] underline underline-offset-4 hover:text-[#00FF88]">
            Faça a missão grátis
          </Link>
        </p>
      </div>
    </section>
  );
}
