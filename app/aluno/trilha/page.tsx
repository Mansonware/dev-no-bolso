import type { Metadata } from "next";
import { ModuleList } from "@/components/dashboard/ModuleList";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProgressNotice } from "@/components/dashboard/ProgressNotice";
import { ProgressTrack } from "@/components/dashboard/ProgressTrack";
import { requireUser } from "@/lib/auth";
import { getStudentProgress } from "@/lib/progress";

export const metadata: Metadata = { title: "Trilha | Dev no Bolso" };

export default async function TrilhaPage() {
  const user = await requireUser("/aluno/trilha");
  const progress = await getStudentProgress(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader title="Sua trilha" subtitle="Uma aula de cada vez, sempre terminando com algo publicado." />
      {progress.unavailable && <ProgressNotice />}
      <div className="mt-6 flex flex-col gap-5 lg:mt-8 lg:gap-6">
        <ProgressTrack lessons={progress.lessons} done={progress.done} total={progress.total} percent={progress.percent} />
        <ModuleList modules={progress.modules} />
      </div>
    </div>
  );
}
