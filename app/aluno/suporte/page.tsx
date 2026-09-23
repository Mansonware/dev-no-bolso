import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export const metadata: Metadata = { title: "Suporte | DEV NO BOLSO" };

// Mensagem fixa: não aceitar texto vindo de query string ou do aluno.
const SUPPORT_MESSAGE = "Olá, Manson! Sou aluno do Dev no Bolso e preciso de ajuda.";

// Número vem só de NEXT_PUBLIC_ADMIN_WHATSAPP (somente dígitos, com DDI e DDD).
// Sem valor válido, a página mostra o canal como "em configuração".
function supportWhatsAppUrl(): string | null {
  const phone = (process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "").replace(/\D/g, "");
  if (phone.length < 10 || phone.length > 15) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(SUPPORT_MESSAGE)}`;
}

export default function SuportePage() {
  const whatsappUrl = supportWhatsAppUrl();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader title="Suporte" subtitle="Travou em alguma missão? É aqui que você vai pedir ajuda." />

      <section className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0A0F0D] px-5 py-6 lg:mt-8">
        <div className="flex items-start gap-3">
          <MessageCircle
            className={`mt-0.5 w-5 h-5 shrink-0 ${whatsappUrl ? "text-[#00FF88]" : "text-slate-500"}`}
            aria-hidden
          />
          <div>
            <p className="text-[15px] font-semibold">Suporte pelo WhatsApp</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">
              Use este canal para dúvidas sobre a plataforma e sobre as aulas. Conte em qual aula ou missão você
              travou e o que já tentou — assim fica mais fácil te ajudar.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              O atendimento é feito por uma pessoa, não é 24h. Sua mensagem é respondida assim que possível.
            </p>
          </div>
        </div>

        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#00FF88] text-sm font-bold text-[#050807] transition-all hover:bg-[#33FFA0] active:scale-[0.98] sm:w-auto sm:px-5"
          >
            Falar comigo no WhatsApp
            <ExternalLink className="w-4 h-4" aria-hidden />
          </a>
        ) : (
          <>
            <button
              type="button"
              disabled
              className="mt-5 inline-flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/10 text-sm font-semibold text-slate-500 sm:w-auto sm:px-5"
            >
              Falar comigo no WhatsApp
            </button>
            <p className="mt-2 font-mono text-[11px] text-slate-500">Canal de suporte em configuração</p>
          </>
        )}
      </section>

      <Link
        href="/aluno/trilha"
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-[#F5F7F6]"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Voltar para a trilha
      </Link>
    </div>
  );
}
