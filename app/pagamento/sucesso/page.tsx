import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PaymentShell } from "@/components/payment/PaymentShell";
import { PaymentStatus } from "@/components/payment/PaymentStatus";

export const metadata: Metadata = {
  title: "Pagamento | Dev no Bolso",
  robots: { index: false, follow: false },
};

// Retorno do Mercado Pago. O status exibido vem do servidor (consulta direta ao MP), nunca da URL.
export default function PagamentoSucessoPage() {
  return (
    <PaymentShell>
      <Suspense
        fallback={
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-[#00FF88]" aria-hidden />
          </div>
        }
      >
        <PaymentStatus />
      </Suspense>
    </PaymentShell>
  );
}
