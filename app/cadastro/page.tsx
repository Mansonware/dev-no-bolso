import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, Clock } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PaymentIdForm } from "@/components/auth/PaymentIdForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { getCurrentUser } from "@/lib/auth";
import { isValidPaymentId, lookupPayment } from "@/lib/mercadopago";
import { maskEmail } from "@/lib/paymentCore";
import { isPaymentClaimed } from "@/lib/redis";
import { SUPPORT_MESSAGES, supportWhatsAppUrl } from "@/lib/support";

export const metadata: Metadata = {
  title: "Criar conta | Dev no Bolso",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ payment_id?: string | string[] }> };

const footer = (
  <div className="flex flex-col gap-2">
    <p>
      Já tem conta?{" "}
      <Link href="/login" className="font-semibold text-[#00FF88] hover:underline">
        Entrar
      </Link>
    </p>
    <p>
      Ainda não comprou?{" "}
      <Link href="/#oferta" className="font-semibold text-[#F5F7F6] underline underline-offset-4">
        Ver a oferta
      </Link>
    </p>
  </div>
);

function SupportLink() {
  const url = supportWhatsAppUrl(SUPPORT_MESSAGES.account);
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 px-5 text-sm font-semibold hover:border-white/30"
    >
      Falar com o suporte
    </a>
  );
}

function Notice({ tone, title, children }: { tone: "wait" | "error"; title: string; children: React.ReactNode }) {
  const Icon = tone === "wait" ? Clock : AlertTriangle;
  return (
    <div className="flex items-start gap-3">
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone === "wait" ? "text-amber-300" : "text-red-400"}`} aria-hidden />
      <div>
        <p className="font-semibold">{title}</p>
        <div className="mt-1 text-sm leading-relaxed text-slate-300">{children}</div>
      </div>
    </div>
  );
}

// A conta só nasce de uma compra aprovada. O servidor confere o pagamento no Mercado Pago aqui
// (para mostrar a tela certa) e de novo em POST /api/auth/register (para criar a conta).
export default async function CadastroPage({ searchParams }: Props) {
  if (await getCurrentUser()) redirect("/aluno");

  const { payment_id: raw } = await searchParams;
  const paymentId = (Array.isArray(raw) ? raw[0] : raw)?.trim().replace(/\D/g, "");

  if (!paymentId) {
    return (
      <AuthLayout title="Criar conta" subtitle="Já pagou? Use o número do pagamento para liberar seu acesso." footer={footer}>
        <PaymentIdForm />
      </AuthLayout>
    );
  }

  if (!isValidPaymentId(paymentId)) {
    return (
      <AuthLayout title="Criar conta" subtitle="Já pagou? Use o número do pagamento para liberar seu acesso." footer={footer}>
        <PaymentIdForm error="O número do pagamento tem só dígitos. Confira no comprovante." />
      </AuthLayout>
    );
  }

  let claimed = false;
  try {
    claimed = await isPaymentClaimed(paymentId);
  } catch {
    claimed = false; // Sem Redis: o envio do formulário mostra a mensagem de indisponível.
  }

  if (claimed) {
    return (
      <AuthLayout title="Sua conta já existe" subtitle="Esta compra já foi usada para criar uma conta." footer={footer}>
        <div className="flex flex-col gap-4">
          <p className="text-[15px] leading-relaxed text-slate-300">
            Entre com o e-mail e a senha que você cadastrou. Esqueceu a senha? O suporte libera um novo acesso.
          </p>
          <Link
            href="/login?next=/aluno"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#00FF88] px-5 text-[15px] font-bold text-[#050807] hover:bg-[#33FFA0]"
          >
            Entrar
          </Link>
          <SupportLink />
        </div>
      </AuthLayout>
    );
  }

  const lookup = await lookupPayment(paymentId);

  if (lookup.state === "approved") {
    if (!lookup.payerEmail) {
      return (
        <AuthLayout title="Criar conta" subtitle="Seu pagamento foi aprovado." footer={footer}>
          <div className="flex flex-col gap-4">
            <Notice tone="error" title="Precisamos confirmar seu e-mail com você">
              O Mercado Pago não informou o e-mail desta compra. Chame o suporte com o número{" "}
              <span className="font-mono">{paymentId}</span> que liberamos sua conta.
            </Notice>
            <SupportLink />
          </div>
        </AuthLayout>
      );
    }

    return (
      <AuthLayout title="Criar conta" subtitle="Pagamento confirmado. Falta só isso para entrar na Aula 1." footer={footer}>
        <SignupForm paymentId={paymentId} emailHint={maskEmail(lookup.payerEmail)} />
      </AuthLayout>
    );
  }

  const states: Record<Exclude<typeof lookup.state, "approved">, { tone: "wait" | "error"; title: string; text: string }> = {
    pending: {
      tone: "wait",
      title: "Pagamento ainda não aprovado",
      text: "Pix costuma aprovar em poucos minutos; boleto, em até 3 dias úteis. Volte a esta página depois — o link continua valendo.",
    },
    rejected: {
      tone: "error",
      title: "Este pagamento não foi aprovado",
      text: "Nada foi cobrado. Você pode tentar pagar de novo pela página inicial.",
    },
    refunded: {
      tone: "error",
      title: "Este pagamento foi devolvido",
      text: "O valor voltou para você, então esta compra não libera acesso.",
    },
    invalid: {
      tone: "error",
      title: "Este pagamento não é do Dev no Bolso",
      text: "Confira se o número é do comprovante certo. Se tiver dúvida, fale com o suporte.",
    },
    not_found: {
      tone: "error",
      title: "Não encontramos este pagamento",
      text: "Confira o número no comprovante do Mercado Pago e tente de novo.",
    },
    unavailable: {
      tone: "wait",
      title: "Não conseguimos confirmar agora",
      text: "A conexão com o Mercado Pago falhou por um instante. Recarregue a página em alguns minutos.",
    },
  };
  const info = states[lookup.state];

  return (
    <AuthLayout title="Criar conta" subtitle={`Pagamento ${paymentId}`} footer={footer}>
      <div className="flex flex-col gap-5">
        <Notice tone={info.tone} title={info.title}>
          {info.text}
        </Notice>
        {lookup.state === "not_found" ? (
          <PaymentIdForm defaultValue={paymentId} />
        ) : lookup.state === "pending" || lookup.state === "unavailable" ? (
          <Link
            href={`/cadastro?payment_id=${paymentId}`}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#00FF88] px-5 text-[15px] font-bold text-[#050807] hover:bg-[#33FFA0]"
          >
            Verificar de novo
          </Link>
        ) : (
          <Link
            href="/#oferta"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#00FF88] px-5 text-[15px] font-bold text-[#050807] hover:bg-[#33FFA0]"
          >
            Ver a oferta
          </Link>
        )}
        <SupportLink />
      </div>
    </AuthLayout>
  );
}
