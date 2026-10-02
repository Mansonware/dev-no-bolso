import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/dashboard/AppShell";
import { COURSE_ACCESS_COOKIE, verifyCourseAccessToken } from "@/lib/course-access";

export const metadata: Metadata = {
  title: "Painel do aluno | DEV NO BOLSO",
  robots: { index: false, follow: false },
};

export default async function AlunoLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COURSE_ACCESS_COOKIE)?.value;

  if (!token || !verifyCourseAccessToken(token)) {
    redirect("/acesso");
  }

  return <AppShell studentName="Aluno">{children}</AppShell>;
}
