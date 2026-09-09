"use client";

import { useSpots } from "@/lib/useSpots";

export function HeroSpotsBadge() {
  const { remaining, soldOut } = useSpots();

  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A0F0D] border border-[#00FF88]/30 shadow-[0_0_15px_rgba(0,255,136,0.1)]">
      <span className={`w-2 h-2 rounded-full ${soldOut ? "bg-rose-500" : "bg-[#00FF88] animate-pulse"}`} />
      <span className="text-xs font-mono font-bold tracking-wider text-[#00FF88]">
        {soldOut ? (
          <span className="text-rose-400">TURMA FUNDADORA • ESGOTADA</span>
        ) : (
          <>
            TURMA FUNDADORA •{" "}
            <span className="text-white bg-[#00FF88]/20 px-1.5 py-0.5 rounded">
              {remaining} {remaining === 1 ? "VAGA RESTANTE" : "VAGAS RESTANTES"}
            </span>
          </>
        )}
      </span>
    </div>
  );
}
