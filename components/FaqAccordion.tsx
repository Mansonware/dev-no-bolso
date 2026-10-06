import { ChevronDown } from "lucide-react";
import { OFFER } from "@/lib/offer";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "Nunca programei. Vou conseguir acompanhar?",
    answer:
      "Sim. O curso foi feito para quem está começando do zero: cada missão explica o que fazer e por quê, em passos curtos. Se quiser tirar a dúvida antes de comprar, faça a missão grátis.",
  },
  {
    question: "Dá mesmo para fazer tudo só pelo celular?",
    answer:
      "Sim. As missões são feitas no navegador do celular, com ferramentas gratuitas. Se você tiver computador, pode usar também, mas ele não é obrigatório.",
  },
  {
    question: "A IA vai fazer o projeto por mim?",
    answer:
      "Não. A IA entra como ferramenta de apoio: para explicar um trecho de código, ajudar a achar um erro ou sugerir um caminho. Você aprende a conferir a resposta em vez de copiar sem entender.",
  },
  {
    question: "Vou precisar pagar alguma ferramenta?",
    answer:
      "Não para seguir o curso. GitHub e GitHub Pages têm plano gratuito, suficiente para publicar o seu primeiro site, e você pode usar ferramentas de IA na versão gratuita.",
  },
  {
    question: "Quanto custa? Tem mensalidade?",
    answer: `${OFFER.priceLabel}, ${OFFER.billing}, pelo Mercado Pago. Não tem mensalidade nem cobrança recorrente.`,
  },
  {
    question: "Como recebo o acesso depois de pagar?",
    answer:
      "Assim que o Mercado Pago confirma o pagamento, você volta para o site e vê o passo a passo para criar sua conta e começar pela primeira missão.",
  },
  {
    question: "E se eu travar em alguma missão?",
    answer:
      "Você chama o suporte pelo WhatsApp contando em qual missão travou. O atendimento é feito por uma pessoa — não é 24h, mas toda mensagem é respondida.",
  },
];

export function FaqAccordion() {
  return (
    <section aria-labelledby="faq-titulo" className="border-t border-white/[0.06] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">Dúvidas</p>
        <h2 id="faq-titulo" className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
          Perguntas frequentes
        </h2>

        <div className="mt-8 divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {faqs.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-[15px] sm:text-base font-semibold text-[#F5F7F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FF88] [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown
                  className="w-5 h-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="pb-5 pr-8 text-[15px] leading-relaxed text-slate-300">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
