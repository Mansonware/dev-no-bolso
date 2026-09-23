import type { Metadata } from "next";
import { AppShell } from "@/components/dashboard/AppShell";
import { aluno } from "@/lib/mock/aluno";

export const metadata: Metadata = {
  title: "Painel do aluno | DEV NO BOLSO",
  robots: { index: false, follow: false },
};

export default function AlunoLayout({ children }: { children: React.ReactNode }) {
  return <AppShell studentName={aluno.firstName}>{children}</AppShell>;
}
