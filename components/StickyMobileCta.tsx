"use client";

import { useEffect, useState } from "react";
import { CheckoutButton } from "./CheckoutButton";

export function StickyMobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Exibe o sticky CTA após 450px de scroll (quando o usuário passou pelo hero)
      if (window.scrollY > 450) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <aside
      aria-label="Acesso rápido à inscrição"
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden p-3 bg-[#050807]/92 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] transition-all duration-300 transform translate-y-0"
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        <div className="flex flex-col pl-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            <span className="text-[10px] font-mono text-slate-300 uppercase font-semibold">
              Turma 01
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-white">R$ 20</span>
            <span className="text-[10px] text-slate-400 font-mono">único</span>
          </div>
        </div>

        <div className="flex-1 max-w-[210px]">
          <CheckoutButton
            id="mobile-sticky-cta"
            label="GARANTIR VAGA"
            size="compact"
          />
        </div>
      </div>
    </aside>
  );
}
