"use client";

import { Check, ShieldCheck, Users, Sparkles } from "lucide-react";
import { CheckoutButton } from "./CheckoutButton";
import { useSpots } from "@/lib/useSpots";

const includesList = [
  "3 aulas práticas online",
  "Acesso completo às gravações",
  "Materiais de apoio",
  "Prompt Pack exclusivo para código",
  "Grupo fechado no WhatsApp",
  "7 dias de suporte dedicado",
];

export function OfferCard() {
  const { remaining, total, soldOut } = useSpots();

  return (
    <section id="oferta" className="py-20 sm:py-28 relative scroll-mt-10">
      {/* Luz central para destacar a oferta */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00FF88]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/30 text-xs font-mono font-bold uppercase tracking-wider text-[#00FF88] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            LOTE EXCLUSIVO DE LANÇAMENTO
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F7F6]">
            Garanta seu acesso agora
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {soldOut
              ? "Todas as vagas da Turma Fundadora foram preenchidas."
              : `Restam apenas ${remaining} de ${total} vagas abertas para a primeira turma com suporte direto.`}
          </p>
        </div>

        {/* Card Premium Central */}
        <div className="relative rounded-3xl bg-[#0A0F0D] border-2 border-[#00FF88]/40 p-6 sm:p-10 shadow-[0_0_60px_rgba(0,255,136,0.15)] backdrop-blur-xl">
          {/* Header do Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#00D9FF] uppercase tracking-wider">
                Turma Fundadora #01
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#F5F7F6] tracking-tight mt-0.5">
                DEV NO BOLSO
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1512] border border-white/10 text-xs text-slate-300 font-semibold self-start sm:self-auto">
              <Users className="w-3.5 h-3.5 text-[#00FF88]" />
              <span className={soldOut ? "text-rose-400 font-bold" : "text-slate-200"}>
                {soldOut ? "Esgotado" : `${remaining} de ${total} vagas`}
              </span>
            </div>
          </div>

          {/* O que inclui */}
          <div className="py-6 space-y-3.5">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              O pacote inclui:
            </p>
            <ul className="space-y-3">
              {includesList.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm sm:text-base text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-[#00FF88]/15 border border-[#00FF88]/40 flex items-center justify-center shrink-0 mt-0.5 text-[#00FF88]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Preço Fundador Honesto (Sem descontos fictícios) */}
          <div className="pt-6 pb-8 border-t border-white/10">
            <div className="flex items-baseline gap-2">
              <span className="text-xs uppercase font-mono text-slate-400 font-semibold">
                Preço fundador:
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-400">R$</span>
              <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                20
              </span>
              <span className="text-sm text-slate-400 font-mono">• pagamento único</span>
            </div>
            <p className="text-xs text-[#00FF88] font-semibold mt-1">
              Valor especial da primeira turma.
            </p>
          </div>

          {/* CTA Principal de Conversão */}
          <div className="space-y-3">
            <CheckoutButton
              id="offer-section-cta"
              label="GARANTIR MINHA VAGA — R$20"
              size="large"
              soldOut={soldOut}
            />
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#00FF88]" />
              <span>Pagamento seguro via Mercado Pago</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
