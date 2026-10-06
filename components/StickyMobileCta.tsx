"use client";

import { useEffect, useState } from "react";
import { FreeMissionLink } from "./FreeMissionLink";
import { OFFER } from "@/lib/offer";

export function StickyMobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Aparece depois que a pessoa passou pelo hero.
    const handleScroll = () => setVisible(window.scrollY > 560);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <aside
      aria-label="Atalho para a missão grátis"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-[#050807]/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="shrink-0">
          <p className="text-base font-black leading-tight">{OFFER.priceLabel}</p>
          <p className="text-[11px] text-slate-400">{OFFER.billing}</p>
        </div>
        <FreeMissionLink size="compact" label="Testar grátis" className="flex-1" />
      </div>
    </aside>
  );
}
