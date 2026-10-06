import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProgressNotice } from "@/components/dashboard/ProgressNotice";
import { ProjectStatus } from "@/components/dashboard/ProjectStatus";
import { requireStudent } from "@/lib/auth";
import { PROJECT_NAME } from "@/lib/course";
import { getStudentProgress } from "@/lib/progress";

export const metadata: Metadata = { title: "Meu projeto | Dev no Bolso" };

export default async function ProjetoPage() {
  const user = await requireStudent("/aluno/projeto");
  const progress = await getStudentProgress(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader eyebrow="Meu projeto" title={PROJECT_NAME} subtitle="O site que você coloca no ar neste módulo." />
      {progress.unavailable && <ProgressNotice />}
      <div className="mt-6 lg:mt-8">
        <ProjectStatus progress={progress} />
      </div>
    </div>
  );
}
