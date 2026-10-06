"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Check, Circle, Loader2, MessageCircle } from "lucide-react";
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
// O cadastro leva o payment_id: o servidor confere a compra de novo no Mercado Pago antes de criar a conta.
const startSteps = [
  { title: "Pagamento aprovado", desc: "Seu pagamento foi confirmado com segurança.", status: "done" },
  { title: "Criar sua conta", desc: "Use o mesmo e-mail informado no Mercado Pago.", status: "current" },
  { title: "Entrar na plataforma", desc: "Depois do cadastro, sua sessão já começa automaticamente.", status: "next" },
  { title: "Começar a primeira missão", desc: "A próxima ação aparece em destaque na área do aluno.", status: "next" },
] as const;

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
          Compra aprovada. Falta só criar sua conta.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
          O pagamento do {OFFER.productName} foi confirmado. Agora siga este caminho para começar:
        </p>

        <ol className="mt-6 space-y-3">
          {startSteps.map((step, i) => (
            <li
              key={step.title}
              className={`flex gap-3 rounded-xl border px-4 py-3.5 ${
                step.status === "current"
                  ? "border-[#00FF88]/30 bg-[#00FF88]/[0.05]"
                  : "border-white/[0.06] bg-[#0A0F0D]"
              }`}
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10">
                {step.status === "done" ? (
                  <Check className="h-3.5 w-3.5 text-[#00FF88]" aria-hidden />
                ) : step.status === "current" ? (
                  <span className="h-2 w-2 rounded-full bg-[#00FF88]" aria-hidden />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-slate-600" aria-hidden />
                )}
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Etapa {i + 1}</p>
                <h2 className="mt-0.5 text-[15px] font-bold">{step.title}</h2>
                <p className="mt-0.5 text-sm leading-relaxed text-slate-400">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <Link
          href={`/cadastro?payment_id=${encodeURIComponent(state.paymentId)}`}
          className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-6 text-base font-bold text-[#050807] transition-colors hover:bg-[#33FFA0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FF88]"
        >
          Criar minha conta
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
        <p className="mt-3 text-center text-sm text-slate-400">
          Já criou sua conta?{" "}
          <Link href="/login" className="font-semibold text-[#F5F7F6] underline underline-offset-4 hover:text-[#00FF88]">
            Entrar
          </Link>
        </p>

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
