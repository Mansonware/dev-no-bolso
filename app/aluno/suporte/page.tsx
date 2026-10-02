import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export const metadata: Metadata = { title: "Suporte | DEV NO BOLSO" };

const ADMIN_PHONE = (process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "5512991070038").replace(/\D/g, "");

export default function SuportePage() {
  const supportUrl =
    "https://wa.me/" +
    ADMIN_PHONE +
    "?text=" +
    encodeURIComponent("Olá! Sou aluno do DEV NO BOLSO e preciso de ajuda em uma aula.");

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader title="Suporte" subtitle="Travou em alguma missão? O WhatsApp é só para te ajudar." />

      <section className="mt-6 rounded-2xl border border-dashed border-white/10 px-5 py-6 lg:mt-8">
        <div className="flex items-start gap-3">
          <MessageCircle className="mt-0.5 w-5 h-5 shrink-0 text-[#00FF88]" aria-hidden />
          <div>
            <p className="text-[15px] font-semibold">Suporte pelo WhatsApp</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">
              O curso, o pagamento e as aulas funcionam pela web. Use o WhatsApp somente quando precisar de ajuda:
              mande um print e diga em qual aula e passo você travou.
            </p>
          </div>
        </div>

        <a
          href={supportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#00FF88] px-5 text-sm font-bold text-black transition hover:bg-[#00e57a] sm:w-auto"
        >
          <MessageCircle className="w-4 h-4" aria-hidden />
          Abrir suporte no WhatsApp
        </a>
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
