import "server-only";

import { cache } from "react";
import { ALL_LESSONS, COURSE, LESSON_IDS, lessonHref, type CatalogLesson } from "@/lib/course";
import { EMPTY_PROGRESS, lessonStatuses, parseProgressHash, type LessonStatus, type ProgressRecord } from "@/lib/progressCore";
import { getProgressHash } from "@/lib/redis";

export type LessonSummary = Pick<CatalogLesson, "id" | "title" | "objective" | "moduleNumber" | "moduleTitle"> & {
  number: number;
  status: LessonStatus;
  href: string;
};

export type ModuleSummary = {
  id: string;
  number: string;
  title: string;
  summary: string;
  lessons: LessonSummary[];
};

export type StudentProgress = {
  record: ProgressRecord;
  lessons: LessonSummary[];
  modules: ModuleSummary[];
  done: number;
  total: number;
  percent: number;
  /** Próxima aula a fazer; null quando o aluno concluiu tudo. */
  current: LessonSummary | null;
  finished: boolean;
  /** true quando o Redis falhou e o progresso exibido pode estar incompleto. */
  unavailable: boolean;
};

export function buildProgress(record: ProgressRecord, unavailable = false): StudentProgress {
  const statuses = lessonStatuses(LESSON_IDS, record.done);
  const lessons: LessonSummary[] = ALL_LESSONS.map((l, i) => ({
    id: l.id,
    title: l.title,
    objective: l.objective,
    moduleNumber: l.moduleNumber,
    moduleTitle: l.moduleTitle,
    number: i + 1,
    status: statuses[i],
    href: lessonHref(i + 1),
  }));

  const modules: ModuleSummary[] = COURSE.map((m) => ({
    id: m.id,
    number: m.number,
    title: m.title,
    summary: m.summary,
    lessons: lessons.filter((l) => m.lessons.some((ml) => ml.id === l.id)),
  }));

  const done = lessons.filter((l) => l.status === "feita").length;
  const current = lessons.find((l) => l.status === "atual") ?? null;

  return {
    record,
    lessons,
    modules,
    done,
    total: lessons.length,
    percent: Math.round((done / lessons.length) * 100),
    current,
    finished: current === null,
    unavailable,
  };
}

/** Progresso do aluno logado, lido do Redis uma vez por requisição. */
export const getStudentProgress = cache(async (userId: string): Promise<StudentProgress> => {
  try {
    return buildProgress(parseProgressHash(await getProgressHash(userId)));
  } catch (error) {
    console.error("[Progress] Falha ao ler progresso:", error instanceof Error ? error.message : error);
    return buildProgress(EMPTY_PROGRESS, true);
  }
});
