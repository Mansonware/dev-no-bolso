import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, MessageCircle, ShieldCheck } from "lucide-react";
import {
  COURSE_ACCESS_COOKIE,
  verifyLiveCourseAccessToken,
} from "@/lib/course-access";
import { AccessRecoveryForm } from "@/components/AccessRecoveryForm";

const ADMIN_PHONE = (
  process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "5512991070038"
).replace(/\D/g, "");

export default async function AcessoPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COURSE_ACCESS_COOKIE)?.value;

  if (await verifyLiveCourseAccessToken(token)) {
    redirect("/aluno");
  }

  const supportUrl =
    "https://wa.me/" +
    ADMIN_PHONE +
    "?text=" +
    encodeURIComponent(
      "Olá! Sou aluno do DEV NO BOLSO e preciso de suporte com meu acesso."
    );

  return (
    <main className="min-h-screen bg-[#050807] text-[#F5F7F6] flex items-center justify-center p-4">
      <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0A0F0D] p-6 sm:p-8 shadow-2xl">
        <div className="w-12 h-12 rounded-xl border border-[#00FF88]/30 bg-[#00FF88]/10 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-[#00FF88]" aria-hidden />
        </div>

        <h1 className="mt-5 text-2xl sm:text-3xl font-black tracking-tight">
          Área do aluno
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
          No aparelho em que você pagou, o acesso é liberado automaticamente. Em outro aparelho, use seu código de acesso.
        </p>

        <AccessRecoveryForm />

        <div className="mt-5 rounded-xl border border-white/10 bg-[#050807] p-4 text-sm text-slate-400">
          <div className="flex gap-2">
            <ShieldCheck
              className="mt-0.5 w-4 h-4 shrink-0 text-[#00FF88]"
              aria-hidden
            />
            <p>
              O código só funciona para um pagamento válido do DEV NO BOLSO. O servidor confirma o pagamento novamente no Mercado Pago antes de liberar as aulas.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            href="/#oferta"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 px-4 text-sm font-semibold text-slate-300 transition hover:border-white/20"
          >
            Ainda não comprei
          </Link>
          <a
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-slate-300 transition hover:border-[#00FF88]/40"
          >
            <MessageCircle className="w-4 h-4 text-[#00FF88]" aria-hidden />
            Preciso de suporte
          </a>
        </div>
      </section>
    </main>
  );
}
