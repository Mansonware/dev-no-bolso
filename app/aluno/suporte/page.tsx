import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export const metadata: Metadata = { title: "Suporte | DEV NO BOLSO" };

// Suporte da turma fundadora: grupo do WhatsApp (o acesso chega após o pagamento). Não inserir número/e-mail aqui.
export default function SuportePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader title="Suporte" subtitle="Travou em alguma missão? É aqui que você vai pedir ajuda." />

      <section className="mt-6 rounded-2xl border border-dashed border-white/10 px-5 py-6 lg:mt-8">
        <div className="flex items-start gap-3">
          <MessageCircle className="mt-0.5 w-5 h-5 shrink-0 text-slate-500" aria-hidden />
          <div>
            <p className="text-[15px] font-semibold">O suporte é pelo grupo da turma no WhatsApp</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">
              Mande um print da tela onde você travou e diga em qual aula e passo está. Se ainda não entrou no grupo,
              fale com a ADM pelo WhatsApp que você recebeu depois do pagamento.
            </p>
          </div>
        </div>
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
