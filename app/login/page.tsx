import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser, safeNextPath } from "@/lib/auth";
import { SUPPORT_MESSAGES, supportWhatsAppUrl } from "@/lib/support";

export const metadata: Metadata = {
  title: "Entrar | DEV NO BOLSO",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ next?: string | string[] }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next: rawNext } = await searchParams;
  const next = safeNextPath(Array.isArray(rawNext) ? rawNext[0] : rawNext);

  if (await getCurrentUser()) redirect(next);

  const supportUrl = supportWhatsAppUrl(SUPPORT_MESSAGES.account);

  return (
    <AuthLayout
      title="Entrar"
      subtitle="Acesse a área do aluno com o e-mail e a senha da sua conta."
      footer={
        <div className="flex flex-col gap-2">
          <p>
            Esqueceu a senha?{" "}
            {supportUrl ? (
              <a
                href={supportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#F5F7F6] underline underline-offset-4"
              >
                Fale com o suporte
              </a>
            ) : (
              <span className="text-slate-300">Fale com o suporte.</span>
            )}
          </p>
          <p>
            Ainda não comprou?{" "}
            <Link href="/#oferta" className="font-semibold text-[#00FF88] hover:underline">
              Ver a oferta
            </Link>
          </p>
        </div>
      }
    >
      <LoginForm next={next} />
    </AuthLayout>
  );
}
