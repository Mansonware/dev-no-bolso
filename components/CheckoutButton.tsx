"use client";

import { useState } from "react";
import { Loader2, ArrowRight, Lock } from "lucide-react";

interface CheckoutButtonProps {
  label?: string;
  className?: string;
  size?: "default" | "large" | "compact";
  id?: string;
  soldOut?: boolean;
}

export function CheckoutButton({
  label = "GARANTIR MINHA VAGA — R$20",
  className = "",
  size = "large",
  id = "cta-checkout-button",
  soldOut = false,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckout = async () => {
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
          data.error || "Não foi possível gerar a preferência de pagamento no momento."
        );
      }

      // Redireciona o usuário de forma limpa para o Checkout Pro do Mercado Pago
      window.location.href = data.init_point;
    } catch (err: unknown) {
      const error = err as Error;
      console.error("[Checkout Error]", error);
      setErrorMessage(error.message || "Erro inesperado ao iniciar o checkout.");
      setLoading(false);
    }
  };

  const sizeClasses = {
    compact: "py-2.5 px-4 text-xs sm:text-sm font-bold",
    default: "py-3.5 px-6 text-sm sm:text-base font-extrabold",
    large: "py-4 sm:py-5 px-6 sm:px-8 text-base sm:text-lg font-black tracking-tight",
  }[size];

  if (soldOut) {
    return (
      <div className="w-full">
        <button
          id={id}
          disabled
          className={`w-full inline-flex items-center justify-center gap-2 bg-white/5 border border-rose-500/30 text-rose-400 font-bold rounded-xl cursor-not-allowed opacity-80 ${sizeClasses} ${className}`}
        >
          <Lock className="w-4 h-4" />
          <span>TURMA ESGOTADA (15/15 VAGAS)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        id={id}
        onClick={handleCheckout}
        disabled={loading}
        className={`group relative w-full inline-flex items-center justify-center gap-3 bg-[#00FF88] hover:bg-[#00e57a] text-[#050807] rounded-xl transition-all duration-200 shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:shadow-[0_0_45px_rgba(0,255,136,0.45)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer ${sizeClasses} ${className}`}
      >
        {/* Efeito de brilho interno sutil */}
        <span className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 to-white/20 pointer-events-none" />

        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-[#050807]" />
            <span>CONECTANDO AO MERCADO PAGO...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 text-[#050807]/70 group-hover:text-[#050807]" />
            <span className="relative z-10">{label}</span>
            <ArrowRight className="w-5 h-5 text-[#050807] transition-transform duration-200 group-hover:translate-x-1" />
          </>
        )}
      </button>

      {errorMessage && (
        <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center flex items-center justify-center gap-2">
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
