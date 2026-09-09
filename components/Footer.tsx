"use client";

import { Terminal, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-[#050807] text-slate-500 text-xs font-sans pb-24 sm:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Marca & Descrição */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="w-8 h-8 rounded-lg bg-[#0A0F0D] border border-white/10 flex items-center justify-center text-[#00FF88]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <p className="font-mono font-bold text-sm text-slate-200">
              DEV NO BOLSO • Turma Fundadora #01
            </p>
            <p className="text-[11px] text-slate-500">
              Workflow prático de desenvolvimento com IA, celular e deploy real.
            </p>
          </div>
        </div>

        {/* Segurança e Avisos Legais */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
          <div className="flex items-center gap-2 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-[#00FF88]" />
            <span className="text-[11px]">Pagamento processado com segurança no Mercado Pago</span>
          </div>

          <div className="text-[11px] text-slate-600">
            © {new Date().getFullYear()} DEV NO BOLSO. Todos os direitos reservados.
          </div>
        </div>
      </div>

      {/* Aviso legal obrigatório */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 pt-6 border-t border-white/5 text-center text-[11px] text-slate-600 leading-relaxed">
        Este treinamento ensina exclusivamente habilidades práticas de programação, uso de inteligência artificial e publicação de software. Não oferecemos nem prometemos garantias de renda, ganho financeiro, oportunidades de emprego ou enriquecimento.
      </div>
    </footer>
  );
}
