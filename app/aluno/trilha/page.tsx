import type { Metadata } from "next";
import { ModuleList } from "@/components/dashboard/ModuleList";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProgressTrack } from "@/components/dashboard/ProgressTrack";
import { modules, progressStats } from "@/lib/mock/aluno";

export const metadata: Metadata = { title: "Trilha | DEV NO BOLSO" };

export default function TrilhaPage() {
  const stats = progressStats();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader title="Sua trilha" subtitle="Uma aula de cada vez, sempre terminando com algo publicado." />
      <div className="mt-6 flex flex-col gap-5 lg:mt-8 lg:gap-6">
        <ProgressTrack modules={modules} {...stats} />
        <ModuleList modules={modules} />
      </div>
    </div>
  );
}
