import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Lock, MessageCircle } from "lucide-react";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { PaymentShell } from "@/components/payment/PaymentShell";
import { getCurrentUser } from "@/lib/auth";
import { SUPPORT_MESSAGES, supportWhatsAppUrl } from "@/lib/support";

export const metadata: Metadata = {
  title: "Acesso suspenso | Dev no Bolso",
  robots: { index: false, follow: false },
};

// Para onde requireStudent() manda quem tem conta, mas o pagamento foi devolvido ou contestado.
// Conta e progresso continuam guardados: se o pagamento voltar a valer, o acesso volta sozinho.
export default async function AcessoSuspensoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/aluno");
  if (user.hasAccess) redirect("/aluno");

  const supportUrl = supportWhatsAppUrl(`${SUPPORT_MESSAGES.suspended} Número do pagamento: ${user.paymentId}.`);

  return (
    <PaymentShell>
      <Lock className="h-7 w-7 text-amber-300" aria-hidden />
      <h1 className="mt-3 text-[28px] font-black leading-[1.1] tracking-tight sm:text-4xl">Seu acesso está suspenso</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
        Olá, {user.firstName}. O pagamento ligado a esta conta não está mais ativo no Mercado Pago — isso acontece
        quando a compra é devolvida ou contestada. Por isso o conteúdo do curso ficou bloqueado.
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
        Sua conta e seu progresso continuam guardados. Se isso foi um engano, fale com o suporte: assim que o pagamento
        voltar a valer, o acesso é liberado de novo.
      </p>
      <p className="mt-5 rounded-xl border border-white/[0.08] px-4 py-3 text-sm text-slate-400">
        Número do pagamento: <span className="font-mono font-semibold text-[#F5F7F6]">{user.paymentId}</span>
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {supportUrl && (
          <a
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-6 text-base font-bold text-[#050807] hover:bg-[#33FFA0]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Falar com o suporte
          </a>
        )}
        <div className="rounded-xl border border-white/10">
          <LogoutButton />
        </div>
      </div>
    </PaymentShell>
  );
}
