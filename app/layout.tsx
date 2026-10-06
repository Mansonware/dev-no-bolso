import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dev no Bolso | Aprenda programação do zero pelo celular",
  description:
    "Aprenda programação do zero e publique seu primeiro projeto usando apenas o celular. Para iniciantes, com IA como ferramenta de apoio. Teste grátis a primeira missão.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://devnobolso.vercel.app"),
  openGraph: {
    title: "Dev no Bolso | Aprenda programação do zero pelo celular",
    description:
      "Aprenda programação do zero e publique seu primeiro projeto usando apenas o celular. Para iniciantes, com IA como ferramenta de apoio. Teste grátis a primeira missão.",
    url: "/",
    siteName: "Dev no Bolso",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev no Bolso | Aprenda programação do zero pelo celular",
    description:
      "Aprenda programação do zero e publique seu primeiro projeto usando apenas o celular. Para iniciantes, com IA como ferramenta de apoio. Teste grátis a primeira missão.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050807",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased scroll-smooth`}
    >
      <body className="min-h-screen bg-[#050807] text-[#F5F7F6] font-sans selection:bg-[#00FF88] selection:text-[#050807]">
        {children}
      </body>
    </html>
  );
}
