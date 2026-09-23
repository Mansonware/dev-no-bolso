import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Criar conta | DEV NO BOLSO",
  robots: { index: false, follow: false },
};

// MOCK: tela visual de cadastro. Ainda não existe autenticação real.
export default function CadastroPage() {
  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Sua conta guarda o progresso da trilha e do seu projeto."
      footer={
        <>
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-[#00FF88] hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthLayout>
  );
}
