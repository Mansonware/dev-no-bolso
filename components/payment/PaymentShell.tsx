import Link from "next/link";
import { Brand } from "@/components/dashboard/Brand";

export function PaymentShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050807] text-[#F5F7F6]">
      <header className="flex h-14 items-center border-b border-white/[0.06] px-4 sm:px-6">
        <Link href="/" aria-label="Dev no Bolso, voltar para a página inicial">
          <Brand />
        </Link>
      </header>
      <main className="mx-auto w-full max-w-lg px-4 pb-16 pt-8 sm:pt-12">{children}</main>
    </div>
  );
}
