"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "Preciso saber programar?",
    answer:
      "Não. A primeira turma foi pensada para permitir que iniciantes entendam o processo e acompanhem a prática.",
  },
  {
    question: "Preciso de computador?",
    answer:
      "Não obrigatoriamente. Parte importante do conteúdo envolve desenvolvimento pelo celular. Um computador amplia as possibilidades, mas não é requisito para começar.",
  },
  {
    question: "As aulas ficam gravadas?",
    answer: "Sim. Os participantes terão acesso às gravações da turma.",
  },
  {
    question: "Como recebo o grupo?",
    answer:
      "Depois que o pagamento for confirmado, você será direcionado ao WhatsApp da ADM para receber seu acesso.",
  },
  {
    question: "O pagamento é seguro?",
    answer: "O pagamento será processado no ambiente do Mercado Pago.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-24 border-t border-white/5 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0F0D] border border-white/10 text-[11px] font-mono uppercase tracking-widest text-[#00FF88] mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            TIRA-DÚVIDAS
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#F5F7F6]">
            Perguntas Frequentes
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Respostas diretas sobre como funciona a Turma Fundadora.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-[#0A0F0D] border-[#00FF88]/30 shadow-[0_0_20px_rgba(0,255,136,0.05)]"
                    : "bg-[#0A0F0D]/60 border-white/10 hover:border-white/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-base sm:text-lg text-[#F5F7F6]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#00FF88] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
