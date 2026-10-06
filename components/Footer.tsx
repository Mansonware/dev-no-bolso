import Link from "next/link";
import { Brand } from "@/components/dashboard/Brand";
import { FREE_MISSION_HREF } from "@/lib/offer";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-4 pt-10 pb-28 text-xs text-slate-400 sm:px-6 lg:pb-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Brand />
        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href={FREE_MISSION_HREF} className="hover:text-[#F5F7F6]">Missão grátis</Link>
          <Link href="/#oferta" className="hover:text-[#F5F7F6]">Preço</Link>
          <Link href="/login" className="hover:text-[#F5F7F6]">Entrar</Link>
        </nav>
      </div>

      <div className="mx-auto mt-8 max-w-5xl space-y-2 border-t border-white/[0.06] pt-6 leading-relaxed">
        <p>
          O Dev no Bolso ensina habilidades práticas de programação, uso de IA e publicação de projetos. Não prometemos
          renda, emprego ou ganho financeiro.
        </p>
        <p>© {new Date().getFullYear()} Dev no Bolso. Pagamentos processados pelo Mercado Pago.</p>
      </div>
    </footer>
  );
}
