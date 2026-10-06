import { Navbar } from "@/components/Navbar";
import { HeroVisual } from "@/components/HeroVisual";
import { OfferCard } from "@/components/OfferCard";
import { FaqAccordion } from "@/components/FaqAccordion";
import { StickyMobileCta } from "@/components/StickyMobileCta";
import { Footer } from "@/components/Footer";
import { CheckoutButton } from "@/components/CheckoutButton";
import { FreeMissionLink } from "@/components/FreeMissionLink";
import { TrackLandingView } from "@/components/TrackEvent";
import { Bot, Globe, ListChecks, MessageCircle } from "lucide-react";
import { OFFER } from "@/lib/offer";

const outcomes = [
  "Um site seu publicado e funcionando na internet.",
  "Um projeto organizado no GitHub para continuar evoluindo.",
  "Um jeito prático de usar IA para entender, escrever e revisar código.",
  "Um link online para mostrar seu projeto a qualquer pessoa.",
];

const path = [
  {
    title: "Primeiro código",
    desc: "Você escreve, muda e vê o resultado na hora. É exatamente isso que a missão grátis mostra.",
  },
  {
    title: "Pequenos projetos",
    desc: "Exercícios curtos que juntam o que você aprendeu, um passo de cada vez.",
  },
  {
    title: "Projeto web",
    desc: "Uma página sua, com o seu conteúdo, organizada num repositório no GitHub.",
  },
  {
    title: "Publicação",
    desc: "Seu site no ar pelo GitHub Pages, com um link para compartilhar.",
  },
];

const howItWorks = [
  {
    icon: Globe,
    title: "Tudo no navegador",
    desc: "As missões usam ferramentas gratuitas abertas no navegador do celular. Não precisa instalar programa nem ter computador.",
  },
  {
    icon: ListChecks,
    title: "Missões de poucos minutos",
    desc: "Cada aula tem uma teoria curta, uma missão prática e uma validação para você saber que deu certo.",
  },
  {
    icon: Bot,
    title: "IA como apoio",
    desc: "Você aprende a pedir explicações e revisões para a IA — e a conferir o que ela responde.",
  },
  {
    icon: MessageCircle,
    title: "Suporte quando travar",
    desc: "Dúvida em alguma missão? Mande no WhatsApp de suporte e uma pessoa responde.",
  },
];

function SectionHeading({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
        {title}
      </h2>
    </>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050807] text-[#F5F7F6]">
      <TrackLandingView />
      <Navbar />

      <main>
        {/* Hero */}
        <section aria-labelledby="hero-titulo" className="px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#00FF88]">
              Para quem nunca programou
            </p>
            <h1
              id="hero-titulo"
              className="mt-4 text-[32px] leading-[1.1] sm:text-5xl font-black tracking-tight text-balance"
            >
              Crie e publique seu primeiro projeto usando só o celular.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-slate-300">
              Aprenda programação do zero em missões curtas, direto no navegador. Você usa IA como apoio e termina
              com um site no ar para mostrar.
            </p>

            <div className="mx-auto mt-7 max-w-sm rounded-2xl border border-white/[0.08] bg-[#0A0F0D] p-4">
              <p className="text-sm text-slate-300">
                Acesso completo por <strong className="font-bold text-[#F5F7F6]">{OFFER.priceLabel} uma vez</strong>
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <FreeMissionLink id="hero-free-mission" label="Começar missão grátis" />
                <p className="text-xs text-slate-400">Leva poucos minutos · sem cadastro</p>
                <CheckoutButton
                  id="hero-checkout"
                  placement="hero"
                  variant="secondary"
                  size="default"
                  label="Quero acesso completo"
                />
                <p className="text-xs text-slate-400">Pagamento único · sem mensalidade · Mercado Pago</p>
              </div>
            </div>
          </div>

          <div className="mt-12 sm:mt-16">
            <HeroVisual />
          </div>
        </section>

        {/* 1. Resultados concretos */}
        <section aria-labelledby="resultado-titulo" className="border-t border-white/[0.06] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl">
            <SectionHeading id="resultado-titulo" eyebrow="Resultado" title="Você vai sair com isso" />
            <ul className="mt-8 space-y-4">
              {outcomes.map((item, i) => (
                <li key={item} className="flex gap-4 text-base sm:text-lg leading-snug text-slate-200">
                  <span className="mt-0.5 font-mono text-sm text-[#00FF88]" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 2. Caminho de evolução */}
        <section aria-labelledby="caminho-titulo" className="border-t border-white/[0.06] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl">
            <SectionHeading id="caminho-titulo" eyebrow="O caminho" title="Do primeiro código ao site publicado" />
            <ol className="mt-8 border-l border-white/[0.1] pl-6">
              {path.map((step, i) => (
                <li key={step.title} className="relative pb-8 last:pb-0">
                  <span
                    className={`absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full ${
                      i === 0 ? "bg-[#00FF88]" : "border border-white/30 bg-[#050807]"
                    }`}
                    aria-hidden
                  />
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">Etapa {i + 1}</p>
                  <h3 className="mt-1 text-lg font-bold">{step.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-slate-400">{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 3. Como funciona pelo celular */}
        <section aria-labelledby="como-titulo" className="border-t border-white/[0.06] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <SectionHeading id="como-titulo" eyebrow="Pelo celular" title="Como funciona" />
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {howItWorks.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl border border-white/[0.08] bg-[#0A0F0D] p-5">
                  <Icon className="w-5 h-5 text-[#00FF88]" aria-hidden />
                  <h3 className="mt-3 text-base font-bold">{title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. O que está incluído + preço */}
        <div className="border-t border-white/[0.06]">
          <OfferCard />
        </div>

        {/* 5. FAQ */}
        <FaqAccordion />

        {/* 6. CTA final */}
        <section aria-labelledby="final-titulo" className="border-t border-white/[0.06] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-xl text-center">
            <h2 id="final-titulo" className="text-2xl sm:text-3xl font-black tracking-tight text-balance">
              Comece pela missão grátis.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              Em poucos minutos você escreve seu primeiro código e vê o resultado na tela. Se gostar, o acesso completo
              custa {OFFER.priceLabel}, {OFFER.billing}.
            </p>
            <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3">
              <FreeMissionLink id="final-free-mission" label="Começar missão grátis" />
              <CheckoutButton
                id="final-checkout"
                placement="final"
                variant="secondary"
                size="default"
                label="Quero acesso completo"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyMobileCta />
    </div>
  );
}
