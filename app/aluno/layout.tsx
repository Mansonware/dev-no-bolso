import type { Metadata } from "next";
import { headers } from "next/headers";
import { AppShell } from "@/components/dashboard/AppShell";
import { TrackStudentAreaView } from "@/components/TrackEvent";
import { after } from "next/server";
import { REQUEST_PATH_HEADER, requireStudent } from "@/lib/auth";
import { needsRecheck } from "@/lib/entitlementCore";
import { syncAccessForPayment } from "@/lib/paymentAccess";

export const metadata: Metadata = {
  title: "Área do aluno | Dev no Bolso",
  robots: { index: false, follow: false },
};

// Layouts não re-renderizam em navegação client-side, então cada página de /aluno
// também chama requireStudent(). Aqui a sessão garante o nome real no menu.
export default async function AlunoLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStudent((await headers()).get(REQUEST_PATH_HEADER) ?? undefined);

  // Rede de segurança se o webhook falhar: reconfere o pagamento no Mercado Pago no máximo 1x por dia,
  // depois da resposta (não atrasa a página). Um reembolso perdido bloqueia na próxima visita.
  if (needsRecheck(user.entitlement, new Date())) {
    after(() =>
      syncAccessForPayment(user.paymentId).catch((error) =>
        console.error("[Access] Falha na revisão do acesso:", error instanceof Error ? error.message : error)
      )
    );
  }
  return (
    <AppShell studentName={user.firstName}>
      <TrackStudentAreaView />
      {children}
    </AppShell>
  );
}
