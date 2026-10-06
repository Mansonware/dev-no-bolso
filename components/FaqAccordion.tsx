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
      "Sim. O curso foi feito para quem está começando do zero: cada aula explica o que fazer e por quê, em passos curtos, com atalhos que abrem a tela certa do GitHub. Se quiser tirar a dúvida antes de comprar, faça a missão grátis.",
  },
  {
    question: "Dá mesmo para fazer tudo só pelo celular?",
    answer:
      "Sim. As missões são feitas no navegador do celular, com ferramentas gratuitas. Se você tiver computador, pode usar também, mas ele não é obrigatório.",
  },
  {
    question: "A IA vai fazer o projeto por mim?",
    answer:
      "Não. A IA entra como apoio: cada aula traz um prompt pronto para pedir uma explicação ou ajuda com um erro. Você faz o projeto e aprende a conferir a resposta em vez de copiar sem entender.",
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
      "Assim que o Mercado Pago confirma o pagamento, você volta para o site, cria sua conta com o e-mail da compra e entra direto na primeira aula. Tudo pela web — não depende de ninguém te mandar nada.",
  },
  {
    question: "Paguei e fechei a página sem criar a conta. E agora?",
    answer:
      "Sem problema. Toque em Entrar → “Criar conta” e digite o número do pagamento que está no comprovante do Mercado Pago. Se pagou por Pix, ele costuma aprovar em poucos minutos.",
  },
  {
    question: "E se eu não gostar?",
    answer:
      "Pelo Código de Defesa do Consumidor, compras pela internet podem ser canceladas em até 7 dias. É só chamar o suporte no WhatsApp com o número do pagamento.",
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
