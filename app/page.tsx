import { Navbar } from "@/components/Navbar";
import { HeroVisual } from "@/components/HeroVisual";
import { ProcessFlow } from "@/components/ProcessFlow";
import { CurriculumGrid } from "@/components/CurriculumGrid";
import { BreakSection } from "@/components/BreakSection";
import { OfferCard } from "@/components/OfferCard";
import { FaqAccordion } from "@/components/FaqAccordion";
import { StickyMobileCta } from "@/components/StickyMobileCta";
import { Footer } from "@/components/Footer";
import { CheckoutButton } from "@/components/CheckoutButton";
import { HeroSpotsBadge } from "@/components/HeroSpotsBadge";
import { ShieldCheck, Sparkles, Terminal, Smartphone, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050807] text-[#F5F7F6] relative overflow-x-hidden">
      {/* Background Grids e Gradientes */}
      <div className="fixed inset-0 tech-grid pointer-events-none opacity-40 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00FF88]/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Barra de Navegação */}
      <Navbar />

      <main className="relative z-10">
        {/* ================================================== */}
        {/* HERO SECTION                                      */}
        {/* ================================================== */}
        <section className="pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Coluna de Texto & CTA */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* Badge Dinâmico de Vagas */}
              <HeroSpotsBadge />

              {/* Título do Produto */}
              <div className="space-y-2">
                <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[#00D9FF] font-semibold flex items-center justify-center lg:justify-start gap-2">
                  <Terminal className="w-4 h-4 text-[#00FF88]" />
                  DEV NO BOLSO
                </p>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#F5F7F6] leading-[1.1]">
                  Transforme uma ideia em um projeto publicado usando{" "}
                  <span className="text-gradient-neon">IA + celular + PC.</span>
                </h1>
              </div>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Aprenda o workflow prático de desenvolvimento que vai da ideia até o deploy, mesmo começando pelo celular.
              </p>

              {/* Bloco de CTA */}
              <div className="pt-2 max-w-md mx-auto lg:mx-0 space-y-3">
                <CheckoutButton
                  id="hero-cta-button"
                  label="GARANTIR MINHA VAGA — R$20"
                  size="large"
                />

                <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-[#00FF88]" />
                  <span>Pagamento seguro via Mercado Pago</span>
                </div>
              </div>

              {/* Micro badges de garantia */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400 font-mono">
                <span className="inline-flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#00D9FF]" />
                  Desenvolvimento mobile + PC
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#00FF88]" />
                  3 aulas práticas online
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00FF88]" />
                  Grupo fechado WhatsApp
                </span>
              </div>
            </div>

            {/* Coluna da Composição Visual Tech */}
            <div className="lg:col-span-5 w-full">
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* PROCESSO                                           */}
        {/* ================================================== */}
        <ProcessFlow />

        {/* ================================================== */}
        {/* O QUE VOCÊ VAI APRENDER                           */}
        {/* ================================================== */}
        <CurriculumGrid />

        {/* ================================================== */}
        {/* QUEBRA (NÃO É TEORIA)                             */}
        {/* ================================================== */}
        <BreakSection />

        {/* ================================================== */}
        {/* OFERTA COM CARD CENTRAL                           */}
        {/* ================================================== */}
        <OfferCard />

        {/* ================================================== */}
        {/* FAQ                                               */}
        {/* ================================================== */}
        <FaqAccordion />
      </main>

      {/* Footer */}
      <Footer />

      {/* CTA Mobile Sticky */}
      <StickyMobileCta />
    </div>
  );
}
