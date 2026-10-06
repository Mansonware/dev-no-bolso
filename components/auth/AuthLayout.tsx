import Link from "next/link";
import { Brand } from "@/components/dashboard/Brand";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthLayout({ title, subtitle, children, footer }: Props) {
  return (
    <div className="min-h-screen bg-[#050807] text-[#F5F7F6]">
      <header className="flex h-14 items-center border-b border-white/[0.06] px-4 sm:px-6">
        <Link href="/" aria-label="Voltar para a página inicial">
          <Brand />
        </Link>
      </header>

      <main className="mx-auto w-full max-w-md px-4 pt-8 pb-12 sm:pt-14">
        <header>
          <h1 className="text-[26px] sm:text-3xl font-black tracking-tight">{title}</h1>
          <p className="mt-1.5 text-[15px] text-slate-400">{subtitle}</p>
        </header>

        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0A0F0D] p-5 sm:p-6">{children}</div>

        <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>
      </main>
    </div>
  );
}
