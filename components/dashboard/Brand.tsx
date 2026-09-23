import { Terminal } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-[#0A0F0D] border border-[#00FF88]/30 flex items-center justify-center text-[#00FF88] shrink-0">
        <Terminal className="w-4 h-4" aria-hidden />
      </div>
      {!compact && (
        <span className="font-mono font-black text-[15px] tracking-wider text-[#F5F7F6]">
          DEV<span className="text-[#00FF88]">_</span>NO<span className="text-[#00D9FF]">_</span>BOLSO
        </span>
      )}
    </div>
  );
}
