"use client";

import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { CTA } from "@/lib/offer";
import { track } from "@/lib/track";
import type { Placement } from "@/lib/analytics";

interface CheckoutButtonProps {
  label?: string;
  className?: string;
  size?: "default" | "large" | "compact";
  variant?: "primary" | "secondary";
  // Onde o botão está na página — vira o campo checkout_click:<placement> no analytics.
  placement?: Placement;
  id?: string;
}

export function CheckoutButton({
  label = CTA.buy,
  className = "",
  size = "large",
  variant = "primary",
  placement,
  id = "cta-checkout-button",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckout = async () => {
    track("checkout_click", placement);

    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.init_point) {
        throw new Error(
          data.error || "Não foi possível abrir o pagamento agora. Tente novamente em alguns minutos."
        );
      }

      // Redireciona o usuário de forma limpa para o Checkout Pro do Mercado Pago
      track("checkout_created", placement);
      window.location.href = data.init_point;
    } catch (err: unknown) {
      const error = err as Error;
      console.error("[Checkout Error]", error);
      setErrorMessage(error.message || "Erro inesperado ao abrir o pagamento.");
      setLoading(false);
    }
  };

  const sizeClasses = {
    compact: "h-11 px-4 text-sm font-bold",
    default: "h-12 px-5 text-[15px] font-bold",
    large: "h-14 px-6 text-base font-bold",
  }[size];

  const variantClasses =
    variant === "primary"
      ? "bg-[#00FF88] text-[#050807] hover:bg-[#33FFA0]"
      : "border border-white/15 text-[#F5F7F6] hover:border-white/30 hover:bg-white/[0.03]";

  return (
    <div className="w-full">
      <button
        id={id}
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        aria-busy={loading}
        className={`group w-full inline-flex items-center justify-center gap-2 rounded-xl transition-colors active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FF88] ${variantClasses} ${sizeClasses} ${className}`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
            <span>Abrindo pagamento…</span>
          </>
        ) : (
          <>
            <span>{label}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </>
        )}
      </button>

      <p role="status" aria-live="polite" className={errorMessage ? "mt-2 text-sm text-rose-300 text-center" : "sr-only"}>
        {errorMessage ?? ""}
      </p>
    </div>
  );
}
