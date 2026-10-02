import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, MessageCircle, ShieldCheck } from "lucide-react";
import { COURSE_ACCESS_COOKIE, verifyCourseAccessToken } from "@/lib/course-access";

const ADMIN_PHONE = (process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "5512991070038").replace(/\D/g, "");

export default async function AcessoPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COURSE_ACCESS_COOKIE)?.value;

  if (token && verifyCourseAccessToken(token)) {
    redirect("/aluno");
  }

  const supportUrl =
    "https://wa.me/" +
    ADMIN_PHONE +
    "?text=" +
    encodeURIComponent("Olá! Preciso de ajuda para acessar minhas aulas do DEV NO BOLSO.");

  return (
    <main className="min-h-screen bg-[#050807] text-[#F5F7F6] flex items-center justify-center p-4">
      <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0A0F0D] p-6 sm:p-8 shadow-2xl">
        <div className="w-12 h-12 rounded-xl border border-[#00FF88]/30 bg-[#00FF88]/10 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-[#00FF88]" aria-hidden />
        </div>

        <h1 className="mt-5 text-2xl sm:text-3xl font-black tracking-tight">Área do aluno</h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
          O acesso às aulas é liberado automaticamente neste navegador depois que o Mercado Pago confirma o pagamento.
        </p>

        <div className="mt-5 rounded-xl border border-white/10 bg-[#050807] p-4 text-sm text-slate-400">
          <div className="flex gap-2">
            <ShieldCheck className="mt-0.5 w-4 h-4 shrink-0 text-[#00FF88]" aria-hidden />
            <p>
              Se você ainda não comprou, volte para a oferta. Se já pagou e este navegador não reconheceu o acesso,
              use o suporte para recuperar.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/#oferta"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#00FF88] px-5 text-sm font-extrabold text-black transition hover:bg-[#00e57a]"
          >
            Ver oferta
          </Link>
          <a
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-semibold text-slate-200 transition hover:border-[#00FF88]/40"
          >
            <MessageCircle className="w-4 h-4 text-[#00FF88]" aria-hidden />
            Suporte no WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
