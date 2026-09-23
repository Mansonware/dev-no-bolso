import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Entrar | DEV NO BOLSO",
  robots: { index: false, follow: false },
};

// MOCK: tela visual de login. Ainda não existe autenticação real.
export default function LoginPage() {
  return (
    <AuthLayout
      title="Entrar"
      subtitle="Continue de onde parou na sua trilha."
      footer={
        <>
          Não tem conta?{" "}
          <Link href="/cadastro" className="font-semibold text-[#00FF88] hover:underline">
            Criar conta
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
