import { Check } from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "./CheckoutButton";
import { CTA, FREE_MISSION_HREF, OFFER } from "@/lib/offer";

const includesList = [
  "4 aulas práticas: do zero ao seu site no ar, pelo celular",
  "Modelo de site pronto para você editar",
  "Atalhos que abrem a tela certa do GitHub em cada missão",
  "Prompt pronto de IA em cada aula para quando travar",
  "Suporte por WhatsApp com uma pessoa de verdade",
];

const afterPurchase = [
  { title: "Você paga no Mercado Pago", text: "Pagamento único, num ambiente seguro." },
  { title: "Volta para o site e cria sua conta", text: "Leva 1 minuto, com o e-mail da compra." },
  { title: "Entra direto na Aula 1", text: "Acesso pela web, no celular ou no computador." },
];

export function OfferCard() {
  return (
    <section id="oferta" aria-labelledby="oferta-titulo" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-lg">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">Preço</p>
        <h2 id="oferta-titulo" className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
          Tudo para sair do zero e publicar
        </h2>

        <div className="mt-6 rounded-2xl border border-white/[0.1] bg-[#0A0F0D] p-5 sm:p-7">
          <p className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tight sm:text-5xl">{OFFER.priceLabel}</span>
            <span className="text-sm text-slate-400">uma vez</span>
          </p>
          <p className="mt-1 text-sm text-slate-400">Sem mensalidade. O acesso é seu, sem prazo para acabar.</p>

          <ul className="mt-6 space-y-3 border-t border-white/[0.08] pt-6">
            {includesList.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-slate-200">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00FF88]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <CheckoutButton id="offer-checkout" placement="offer" label={CTA.buy} />
            <p className="mt-2 text-center text-xs text-slate-400">Pagamento processado pelo Mercado Pago</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-300">O que acontece depois do pagamento</h3>
          <ol className="mt-4 space-y-4">
            {afterPurchase.map((step, i) => (
              <li key={step.title} className="flex gap-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 font-mono text-xs text-slate-300">
                  {i + 1}
                </span>
                <span>
                  <span className="block text-[15px] font-semibold">{step.title}</span>
                  <span className="block text-sm text-slate-400">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          Prefere testar antes?{" "}
          <Link href={FREE_MISSION_HREF} className="font-semibold text-[#F5F7F6] underline underline-offset-4 hover:text-[#00FF88]">
            Faça a missão grátis
          </Link>
        </p>
      </div>
    </section>
  );
}
