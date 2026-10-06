import { after, NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isSameOrigin, readJsonObject } from "@/lib/authHttp";
import { recordFunnelEvent } from "@/lib/analytics";
import { ALL_LESSONS, LESSON_IDS, lessonHref, lessonNumberOf } from "@/lib/course";
import { canCompleteLesson, doneField, parseProgressHash } from "@/lib/progressCore";
import { getProgressHash, saveProgressFields } from "@/lib/redis";
import { validateGithubUser, validateRepoUrl, validateSiteUrl } from "@/lib/validateStudentUrl";

// Conclui uma aula do aluno logado e guarda o que ele entregou (usuário, repositório ou site).
//   POST { lessonId, value }  →  { ok: true, nextHref }  |  { ok: false, error }
// Regras no servidor: exige sessão, a aula precisa existir e estar liberada, e o valor é validado aqui.

function fail(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return fail(403, "Requisição recusada.");

  const user = await getCurrentUser();
  if (!user) return fail(401, "Sua sessão expirou. Entre de novo para salvar o progresso.");

  const body = await readJsonObject(req);
  const lessonId = typeof body?.lessonId === "string" ? body.lessonId : "";
  const rawValue = typeof body?.value === "string" ? body.value.slice(0, 2048) : "";

  const lesson = ALL_LESSONS.find((l) => l.id === lessonId);
  if (!lesson) return fail(400, "Aula não encontrada.");

  // Valida a entrega conforme o tipo da aula.
  const fields: Record<string, string> = {};
  switch (lesson.delivery.kind) {
    case "github": {
      const r = validateGithubUser(rawValue);
      if (!r.ok) return fail(400, r.error);
      fields.github = r.value;
      break;
    }
    case "repo": {
      const r = validateRepoUrl(rawValue);
      if (!r.ok) return fail(400, r.error);
      fields.repo = r.value;
      break;
    }
    case "site": {
      const r = validateSiteUrl(rawValue);
      if (!r.ok) return fail(400, r.error);
      fields.site = r.value;
      break;
    }
    case "confirm":
      if (rawValue !== "yes") return fail(400, "Confira a alteração no seu site e marque a confirmação.");
      break;
  }

  try {
    const record = parseProgressHash(await getProgressHash(user.id));
    if (!canCompleteLesson(LESSON_IDS, record.done, lesson.id)) {
      return fail(409, "Conclua a aula anterior antes desta.");
    }

    const isFirstCompletion = !record.done[lesson.id];
    // Reenviar uma aula já concluída só atualiza o valor entregue; a data de conclusão original fica.
    if (isFirstCompletion) fields[doneField(lesson.id)] = new Date().toISOString();
    await saveProgressFields(user.id, fields);

    if (isFirstCompletion && lessonNumberOf(lesson.id) === 1) {
      after(() => recordFunnelEvent("first_lesson_complete"));
    }
    if (isFirstCompletion && lessonNumberOf(lesson.id) === LESSON_IDS.length) {
      after(() => recordFunnelEvent("course_complete"));
    }

    const nextNumber = lessonNumberOf(lesson.id) + 1;
    const nextHref = nextNumber <= LESSON_IDS.length ? lessonHref(nextNumber) : "/aluno/projeto";
    return NextResponse.json({ ok: true, nextHref }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[API /api/progress] Falha ao salvar progresso:", error instanceof Error ? error.message : error);
    return fail(503, "Não conseguimos salvar agora. Confira sua internet e tente de novo.");
  }
}
