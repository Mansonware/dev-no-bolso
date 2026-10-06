import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";
import { isValidPaymentId } from "@/lib/mercadopago";
import { CTA } from "@/lib/offer";

export const metadata: Metadata = {
  title: "Criar conta | DEV NO BOLSO",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ payment_id?: string | string[] }> };

const loginFooter = (
  <>
    Já tem conta?{" "}
    <Link href="/login" className="font-semibold text-[#00FF88] hover:underline">
      Entrar
    </Link>
  </>
);

// A conta só nasce de uma compra: o payment_id vem da página de confirmação do pagamento
// e é conferido de novo no servidor, direto no Mercado Pago, ao enviar o formulário.
export default async function CadastroPage({ searchParams }: Props) {
  const { payment_id: rawPaymentId } = await searchParams;
  const paymentId = (Array.isArray(rawPaymentId) ? rawPaymentId[0] : rawPaymentId)?.trim();

  if (!isValidPaymentId(paymentId)) {
    return (
      <AuthLayout
        title="Criar conta"
        subtitle="O cadastro é liberado depois do pagamento."
        footer={loginFooter}
      >
        <div className="flex flex-col gap-4">
          <Lock className="w-6 h-6 text-slate-500" aria-hidden />
          <p className="text-[15px] leading-relaxed text-slate-300">
            Depois que o Mercado Pago aprova a compra, a página de confirmação mostra o botão{" "}
            <span className="font-semibold text-[#F5F7F6]">Criar minha conta</span>. É por ele que a sua conta é
            criada.
          </p>
          <Link
            href="/#oferta"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#00FF88] px-5 text-sm font-bold text-[#050807] transition-colors hover:bg-[#33FFA0]"
          >
            {CTA.buyShort}
          </Link>
          <Link href="/" className="text-center text-sm font-semibold text-slate-400 hover:text-[#F5F7F6]">
            Voltar ao início
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Sua conta libera e protege seu acesso ao curso."
      footer={loginFooter}
    >
      <SignupForm paymentId={paymentId} />
    </AuthLayout>
  );
}
