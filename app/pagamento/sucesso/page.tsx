"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Check, Loader2, MessageCircle } from "lucide-react";
import { Brand } from "@/components/dashboard/Brand";
import { OFFER } from "@/lib/offer";
import { SUPPORT_MESSAGES, supportWhatsAppUrl } from "@/lib/support";

interface PaymentStatusState {
  loading: boolean;
  verified: boolean;
  paymentId: string | null;
  error?: string;
}

// Pós-compra = "Comece aqui". O acesso é pela plataforma (conta → Aula 1).
// O WhatsApp aparece só como canal de suporte, nunca como entrega do curso.
const START_STEPS = [
  {
    title: "Crie sua conta",
    desc: "Ela guarda o seu progresso na trilha e no seu projeto.",
    href: "/cadastro",
    cta: "Criar minha conta",
  },
  {
    title: "Abra a Aula 1",
    desc: "Primeira missão: criar sua conta no GitHub, onde o seu site vai morar.",
    href: "/aluno/aulas/1",
    cta: "Ir para a Aula 1",
  },
];

const supportUrl = supportWhatsAppUrl(SUPPORT_MESSAGES.payment);

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050807] text-[#F5F7F6]">
      <header className="flex h-14 items-center border-b border-white/[0.06] px-4 sm:px-6">
        <Link href="/" aria-label="Dev no Bolso, voltar para a página inicial">
          <Brand />
        </Link>
      </header>
      <main className="mx-auto w-full max-w-lg px-4 pt-8 pb-16 sm:pt-12">{children}</main>
    </div>
  );
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

  useEffect(() => {
    let isMounted = true;

    // A confirmação vem do servidor (consulta direta ao Mercado Pago), nunca dos query params.
    async function checkPaymentServerSide() {
      if (!queryPaymentId) {
        if (isMounted) {
          setState({
            loading: false,
            verified: false,
            paymentId: null,
            error: "Não recebemos o identificador do pagamento no retorno do Mercado Pago.",
          });
        }
        return;
      }

      try {
        const res = await fetch(`/api/payment/${encodeURIComponent(queryPaymentId)}`);
        const data = await res.json();

        if (isMounted) {
          if (res.ok && data.valid === true && data.status === "approved") {
            setState({ loading: false, verified: true, paymentId: String(data.paymentId) });
          } else {
            setState({
              loading: false,
              verified: false,
              paymentId: queryPaymentId,
              error: data.reason || data.error || "O pagamento ainda não aparece como aprovado.",
            });
          }
        }
      } catch {
        if (isMounted) {
          setState({
            loading: false,
            verified: false,
            paymentId: queryPaymentId,
            error: "Não conseguimos falar com o Mercado Pago agora. Recarregue a página em instantes.",
          });
        }
      }
    }

    checkPaymentServerSide();

    return () => {
      isMounted = false;
    };
  }, [queryPaymentId]);

  if (state.loading) {
    return (
      <div role="status" className="flex flex-col items-center py-16 text-center">
        <Loader2 className="w-7 h-7 animate-spin text-[#00FF88]" aria-hidden />
        <p className="mt-4 text-[15px] text-slate-300">Confirmando seu pagamento com o Mercado Pago…</p>
      </div>
    );
  }

  if (state.verified && state.paymentId) {
    return (
      <section aria-labelledby="comece-titulo">
        <p className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-[#00FF88]">
          <Check className="w-3.5 h-3.5" aria-hidden /> Pagamento confirmado
        </p>
        <h1 id="comece-titulo" className="mt-2 text-[28px] sm:text-4xl font-black tracking-tight leading-[1.1]">
          Comece aqui.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
          Seu acesso ao {OFFER.productName} está liberado. São dois passos para começar a primeira missão:
        </p>

        <ol className="mt-6 space-y-3">
          {START_STEPS.map((step, i) => (
            <li key={step.href} className="rounded-2xl border border-white/[0.08] bg-[#0A0F0D] p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400">Passo {i + 1}</p>
              <h2 className="mt-1 text-lg font-bold">{step.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{step.desc}</p>
              <Link
                href={step.href}
                className={`mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FF88] ${
                  i === 0
                    ? "bg-[#00FF88] text-[#050807] hover:bg-[#33FFA0]"
                    : "border border-white/15 text-[#F5F7F6] hover:border-white/30"
                }`}
              >
                {step.cta}
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-6 rounded-xl border border-white/[0.08] px-4 py-3 text-sm text-slate-400">
          <p>
            Guarde o número do pagamento:{" "}
            <span className="font-mono font-semibold text-[#F5F7F6]">{state.paymentId}</span>
          </p>
          <p className="mt-1">
            Travou em alguma missão? Use o{" "}
            <Link href="/aluno/suporte" className="font-semibold text-[#F5F7F6] underline underline-offset-4">
              suporte
            </Link>
            .
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="erro-titulo">
      <AlertTriangle className="w-7 h-7 text-amber-400" aria-hidden />
      <h1 id="erro-titulo" className="mt-3 text-2xl font-black tracking-tight">
        Ainda não conseguimos confirmar este pagamento
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
        {state.error ||
          "O status não pôde ser confirmado com o Mercado Pago. Se você pagou por Pix ou boleto, pode levar alguns minutos."}
      </p>
      {state.paymentId && (
        <p className="mt-4 rounded-xl border border-white/[0.08] px-4 py-3 font-mono text-xs text-slate-400">
          Pagamento consultado: {state.paymentId}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-[#00FF88] px-5 text-[15px] font-bold text-[#050807] hover:bg-[#33FFA0]"
        >
          Verificar novamente
        </button>
        {supportUrl && (
          <a
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-[15px] font-semibold hover:border-white/30"
          >
            <MessageCircle className="w-4 h-4" aria-hidden />
            Falar com o suporte
          </a>
        )}
        <Link href="/" className="py-2 text-center text-sm font-semibold text-slate-400 hover:text-[#F5F7F6]">
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}

export default function PagamentoSucessoPage() {
  return (
    <Shell>
      <Suspense
        fallback={
          <div className="flex justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin text-[#00FF88]" aria-hidden />
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </Shell>
  );
}
