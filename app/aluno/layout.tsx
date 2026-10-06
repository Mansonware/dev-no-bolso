import type { Metadata } from "next";
import { headers } from "next/headers";
import { AppShell } from "@/components/dashboard/AppShell";
import { TrackStudentAreaView } from "@/components/TrackEvent";
import { REQUEST_PATH_HEADER, requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Área do aluno | Dev no Bolso",
  robots: { index: false, follow: false },
};

// Layouts não re-renderizam em navegação client-side, então cada página de /aluno
// também chama requireUser(). Aqui a sessão garante o nome real no menu.
export default async function AlunoLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser((await headers()).get(REQUEST_PATH_HEADER) ?? undefined);
  return (
    <AppShell studentName={user.firstName}>
      <TrackStudentAreaView />
      {children}
    </AppShell>
  );
}
