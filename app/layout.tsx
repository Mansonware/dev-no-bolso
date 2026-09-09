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
  title: "DEV NO BOLSO | Desenvolva projetos com IA pelo celular",
  description:
    "Aprenda na prática a transformar uma ideia em um projeto publicado usando IA, Termux, GitHub e deploy.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://devnobolso.vercel.app"),
  openGraph: {
    title: "DEV NO BOLSO | Desenvolva projetos com IA pelo celular",
    description:
      "Aprenda na prática a transformar uma ideia em um projeto publicado usando IA, Termux, GitHub e deploy.",
    url: "/",
    siteName: "DEV NO BOLSO",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DEV NO BOLSO | Desenvolva projetos com IA pelo celular",
    description:
      "Aprenda na prática a transformar uma ideia em um projeto publicado usando IA, Termux, GitHub e deploy.",
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
