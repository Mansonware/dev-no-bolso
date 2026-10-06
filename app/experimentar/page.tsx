import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/dashboard/Brand";
import { FreeMission } from "@/components/free-mission/FreeMission";

const title = "Missão grátis: seu primeiro código | Dev no Bolso";
const description =
  "Escreva seu primeiro código pelo celular e veja o resultado na hora. Sem cadastro, leva uns 3 minutos.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/experimentar" },
  // openGraph do layout é substituído (não mesclado), então repete os campos fixos — inclusive a imagem.
  openGraph: {
    title,
    description,
    url: "/experimentar",
    siteName: "Dev no Bolso",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Dev no Bolso" }],
  },
};

// Página pública: não exige login. O exercício roda inteiro no navegador.
export default function ExperimentarPage() {
  return (
    <div className="min-h-screen bg-[#050807] text-[#F5F7F6]">
      <header className="flex h-14 items-center justify-between border-b border-white/[0.06] px-4 sm:px-6">
        <Link href="/" aria-label="Dev no Bolso, voltar para a página inicial">
          <Brand />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-[#F5F7F6]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden />
          Início
        </Link>
      </header>

      <main className="mx-auto w-full max-w-xl px-4 pt-8 pb-16 sm:pt-12">
        <FreeMission />
      </main>
    </div>
  );
}
