"use client";

import { useEffect, useState } from "react";
import { CheckoutButton } from "./CheckoutButton";
import { CTA, OFFER } from "@/lib/offer";

// Barra fixa no celular depois do hero: preço + compra sempre ao alcance do polegar.
export function StickyMobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 560);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <aside
      aria-label="Comprar o Dev no Bolso"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-[#050807]/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="shrink-0">
          <p className="text-base font-black leading-tight">{OFFER.priceLabel}</p>
          <p className="text-[11px] text-slate-400">{OFFER.billing}</p>
        </div>
        <div className="min-w-0 flex-1">
          <CheckoutButton id="sticky-checkout" placement="sticky" size="compact" label={CTA.buyShort} />
        </div>
      </div>
    </aside>
  );
}
