import Link from "next/link";
import { Brand } from "@/components/dashboard/Brand";
import { FREE_MISSION_HREF } from "@/lib/offer";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#050807]/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <Link href="/" aria-label="Dev no Bolso — página inicial" className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00FF88]">
          <Brand />
        </Link>

        <nav aria-label="Principal" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/login"
            className="inline-flex h-10 items-center rounded-lg px-3 text-sm font-semibold text-slate-300 hover:text-[#F5F7F6] transition-colors"
          >
            Entrar
          </Link>
          <Link
            href={FREE_MISSION_HREF}
            className="hidden sm:inline-flex h-10 items-center rounded-lg border border-white/15 px-3.5 text-sm font-semibold text-[#F5F7F6] hover:border-white/30 transition-colors"
          >
            Missão grátis
          </Link>
        </nav>
      </div>
    </header>
  );
}
