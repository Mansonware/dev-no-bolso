// Regras puras de progresso do aluno (sem imports): quais aulas estão feitas, qual é a atual,
// quais estão bloqueadas e o que sugerir nos campos de entrega. Testável com `node --test`.

export type LessonStatus = "feita" | "atual" | "bloqueada";

/** O que fica salvo por aluno (hash no Redis). */
export type ProgressRecord = {
  /** lessonId → data ISO da conclusão */
  done: Record<string, string>;
  github?: string;
  repo?: string;
  site?: string;
};

export const EMPTY_PROGRESS: ProgressRecord = { done: {} };

const DONE_PREFIX = "done:";
const PROFILE_FIELDS = ["github", "repo", "site"] as const;
export type ProfileField = (typeof PROFILE_FIELDS)[number];

/** Converte o hash do Redis ({ "done:m1-l1": "...", github: "..." }) no formato usado pelas telas. */
export function parseProgressHash(hash: Record<string, unknown> | null | undefined): ProgressRecord {
  const record: ProgressRecord = { done: {} };
  if (!hash || typeof hash !== "object") return record;

  for (const [key, value] of Object.entries(hash)) {
    if (typeof value !== "string" || !value) continue;
    if (key.startsWith(DONE_PREFIX)) record.done[key.slice(DONE_PREFIX.length)] = value;
    else if ((PROFILE_FIELDS as readonly string[]).includes(key)) record[key as ProfileField] = value;
  }
  return record;
}

export function doneField(lessonId: string): string {
  return `${DONE_PREFIX}${lessonId}`;
}

/**
 * Trilha sequencial: aulas concluídas ficam "feita"; a primeira não concluída é a "atual";
 * as seguintes ficam "bloqueada" até a anterior ser concluída.
 */
export function lessonStatuses(lessonIds: readonly string[], done: Record<string, string>): LessonStatus[] {
  let currentAssigned = false;
  return lessonIds.map((id) => {
    if (done[id]) return "feita";
    if (!currentAssigned) {
      currentAssigned = true;
      return "atual";
    }
    return "bloqueada";
  });
}

export function canCompleteLesson(lessonIds: readonly string[], done: Record<string, string>, lessonId: string): boolean {
  const index = lessonIds.indexOf(lessonId);
  if (index < 0) return false;
  return lessonStatuses(lessonIds, done)[index] !== "bloqueada";
}

/** Sugestões para pré-preencher os campos com base no que o aluno já informou. */
export function deliverySuggestions(record: ProgressRecord, projectName: string) {
  const user = record.github;
  return {
    github: record.github ?? "",
    repo: record.repo ?? (user ? `https://github.com/${user}/${projectName}` : ""),
    site: record.site ?? (user ? `https://${user.toLowerCase()}.github.io/${projectName}/` : ""),
  };
}

/** Endereço do repositório para os atalhos "abrir no GitHub" das missões. */
export function repoBaseUrl(record: ProgressRecord, projectName: string): string | null {
  if (record.repo) return record.repo;
  if (record.github) return `https://github.com/${record.github}/${projectName}`;
  return null;
}
