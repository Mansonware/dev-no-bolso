import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PaymentShell } from "@/components/payment/PaymentShell";
import { PaymentStatus } from "@/components/payment/PaymentStatus";

export const metadata: Metadata = {
  title: "Pagamento em análise | Dev no Bolso",
  robots: { index: false, follow: false },
};

// Mesmo componente da página de sucesso: ele verifica sozinho e troca de tela quando o Pix aprova.
export default function PagamentoPendentePage() {
  return (
    <PaymentShell>
      <Suspense
        fallback={
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-amber-300" aria-hidden />
          </div>
        }
      >
        <PaymentStatus />
      </Suspense>
    </PaymentShell>
  );
}
