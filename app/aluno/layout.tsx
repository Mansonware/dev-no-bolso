import type { Metadata } from "next";
import { headers } from "next/headers";
import { AppShell } from "@/components/dashboard/AppShell";
import { REQUEST_PATH_HEADER, requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Painel do aluno | DEV NO BOLSO",
  robots: { index: false, follow: false },
};

// Layouts não re-renderizam em navegação client-side, então cada página de /aluno
// também chama requireUser(). Aqui a sessão garante o nome real no menu.
export default async function AlunoLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser((await headers()).get(REQUEST_PATH_HEADER) ?? undefined);
  return <AppShell studentName={user.firstName}>{children}</AppShell>;
}
