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
import { CTA, OFFER } from "@/lib/offer";

const outcomes = [
  "Um site seu publicado e funcionando na internet.",
  "Um projeto organizado no GitHub para continuar evoluindo.",
  "Prompts prontos para pedir ajuda à IA quando travar — e conferir a resposta.",
  "Um link online para mostrar seu projeto a qualquer pessoa.",
];

// Espelha as aulas reais do Módulo 01 (lib/course.ts). Não prometer etapa que não existe.
const path = [
  {
    title: "Sua conta no GitHub",
    desc: "Você cria a conta gratuita onde o seu código e o seu site vão morar.",
  },
  {
    title: "Seu primeiro arquivo de código",
    desc: "Você cria o repositório e o index.html a partir de um modelo pronto, já com o seu nome.",
  },
  {
    title: "Seu site no ar",
    desc: "Você ativa o GitHub Pages e ganha um link público para mandar para quem quiser.",
  },
  {
    title: "Alterar e republicar",
    desc: "Você muda o site pelo celular e vê a alteração aparecer online. Esse ciclo é seu para sempre.",
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
    desc: "Cada aula tem uma teoria curta, uma missão prática e uma entrega para você saber que deu certo.",
  },
  {
    icon: Bot,
    title: "IA como apoio",
    desc: "Cada aula traz um prompt pronto para pedir ajuda à IA quando travar — e você aprende a conferir a resposta.",
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

            <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3">
              <CheckoutButton id="hero-checkout" placement="hero" label={CTA.buy} />
              <p className="text-xs text-slate-400">Pagamento único · sem mensalidade</p>
              <FreeMissionLink
                id="hero-free-mission"
                variant="secondary"
                size="default"
                label="Testar grátis antes"
              />
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
            <SectionHeading id="caminho-titulo" eyebrow="O caminho" title="As 4 aulas, do zero ao site publicado" />
            <ol className="mt-8 border-l border-white/[0.1] pl-6">
              {path.map((step, i) => (
                <li key={step.title} className="relative pb-8 last:pb-0">
                  <span
                    className={`absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full ${
                      i === 0 ? "bg-[#00FF88]" : "border border-white/30 bg-[#050807]"
                    }`}
                    aria-hidden
                  />
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">Aula {i + 1}</p>
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
              Seu primeiro site no ar, pelo celular.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              {OFFER.priceLabel}, {OFFER.billing}. Você paga, cria sua conta e já começa a Aula 1.
            </p>
            <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3">
              <CheckoutButton id="final-checkout" placement="final" label={CTA.buy} />
              <FreeMissionLink id="final-free-mission" variant="secondary" size="default" label="Testar grátis antes" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyMobileCta />
    </div>
  );
}
