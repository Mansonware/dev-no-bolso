// Testes das regras críticas. Rodam com `npm test` (node --test, sem dependências extras).
// Só módulos puros (sem aliases do Next) — o Node 22+ remove os tipos dos .ts sozinho.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

import { hashPassword, verifyPassword, safeNextPath, isWellFormedSessionToken, generateSessionToken } from "../lib/authCore.ts";
import { lessonStatuses, canCompleteLesson, parseProgressHash, deliverySuggestions } from "../lib/progressCore.ts";
import { stateFromMercadoPagoStatus, maskEmail } from "../lib/paymentCore.ts";
import { validateGithubUser, validateRepoUrl, validateSiteUrl, validateStudentUrl } from "../lib/validateStudentUrl.ts";
import { verifyMercadoPagoWebhookSignature } from "../lib/mercadopago-webhook.ts";
import { LESSON_IDS, getLessonByNumber } from "../lib/course.ts";

// ---------------------------------------------------------------- pagamento

test("status do Mercado Pago vira estado de tela", () => {
  assert.equal(stateFromMercadoPagoStatus("approved"), "approved");
  for (const s of ["pending", "in_process", "authorized", "in_mediation", undefined, "status_novo"]) {
    assert.equal(stateFromMercadoPagoStatus(s), "pending", `status ${s}`);
  }
  assert.equal(stateFromMercadoPagoStatus("rejected"), "rejected");
  assert.equal(stateFromMercadoPagoStatus("cancelled"), "rejected");
  assert.equal(stateFromMercadoPagoStatus("refunded"), "refunded");
  assert.equal(stateFromMercadoPagoStatus("charged_back"), "refunded");
});

test("e-mail mascarado não revela o endereço", () => {
  assert.equal(maskEmail("manson.dev@gmail.com"), "ma••••••••@gmail.com");
  assert.equal(maskEmail("ab@x.com"), "a•••@x.com");
  assert.equal(maskEmail(" Ana@Mail.com "), "an•••@mail.com");
  assert.equal(maskEmail("sem-arroba"), null);
  assert.equal(maskEmail(null), null);
});

test("webhook: assinatura válida passa, adulterada falha", () => {
  process.env.MERCADOPAGO_WEBHOOK_SECRET = "segredo-teste";
  const ts = "1700000000";
  const manifest = `id:123456;request-id:req-1;ts:${ts};`;
  const v1 = createHmac("sha256", "segredo-teste").update(manifest).digest("hex");

  const ok = verifyMercadoPagoWebhookSignature({ xSignature: `ts=${ts},v1=${v1}`, xRequestId: "req-1", dataId: "123456" });
  assert.deepEqual(ok, { configured: true, valid: true });

  const wrongId = verifyMercadoPagoWebhookSignature({ xSignature: `ts=${ts},v1=${v1}`, xRequestId: "req-1", dataId: "999" });
  assert.equal(wrongId.valid, false);

  const missing = verifyMercadoPagoWebhookSignature({ xSignature: null, xRequestId: "req-1", dataId: "123456" });
  assert.equal(missing.valid, false);
  delete process.env.MERCADOPAGO_WEBHOOK_SECRET;
});

// ---------------------------------------------------------------- auth

test("senha: hash confere só com a senha certa", async () => {
  const record = await hashPassword("senha-forte-123");
  assert.equal(await verifyPassword("senha-forte-123", record), true);
  assert.equal(await verifyPassword("senha-errada", record), false);
});

test("redirect pós-login só aceita caminho interno", () => {
  assert.equal(safeNextPath("/aluno/aulas/2"), "/aluno/aulas/2");
  for (const bad of ["https://evil.com", "//evil.com", "/\\evil.com", "aluno", "", 42, "/a\u0000b"]) {
    assert.equal(safeNextPath(bad), "/aluno", `deveria bloquear ${String(bad)}`);
  }
});

test("token de sessão tem formato fixo", () => {
  assert.equal(isWellFormedSessionToken(generateSessionToken()), true);
  assert.equal(isWellFormedSessionToken("curto"), false);
  assert.equal(isWellFormedSessionToken(undefined), false);
});

// ---------------------------------------------------------------- progresso

test("aluno novo: Aula 1 atual, resto bloqueado", () => {
  assert.deepEqual(lessonStatuses(LESSON_IDS, {}), ["atual", "bloqueada", "bloqueada", "bloqueada"]);
});

test("progresso sequencial e conclusão da trilha", () => {
  const done = { "m1-l1": "2026-10-06", "m1-l2": "2026-10-06" };
  assert.deepEqual(lessonStatuses(LESSON_IDS, done), ["feita", "feita", "atual", "bloqueada"]);
  const all = Object.fromEntries(LESSON_IDS.map((id) => [id, "x"]));
  assert.deepEqual(lessonStatuses(LESSON_IDS, all), ["feita", "feita", "feita", "feita"]);
});

test("não dá para concluir aula bloqueada nem aula inexistente", () => {
  assert.equal(canCompleteLesson(LESSON_IDS, {}, "m1-l1"), true);
  assert.equal(canCompleteLesson(LESSON_IDS, {}, "m1-l3"), false);
  assert.equal(canCompleteLesson(LESSON_IDS, { "m1-l1": "x" }, "m1-l2"), true);
  assert.equal(canCompleteLesson(LESSON_IDS, { "m1-l1": "x" }, "m1-l1"), true, "reenvio de aula feita é permitido");
  assert.equal(canCompleteLesson(LESSON_IDS, {}, "m9-l9"), false);
});

test("hash do Redis vira registro e ignora campos estranhos", () => {
  const record = parseProgressHash({ "done:m1-l1": "2026-10-06", github: "maria", admin: "true", repo: 42 });
  assert.deepEqual(record, { done: { "m1-l1": "2026-10-06" }, github: "maria" });
  assert.deepEqual(parseProgressHash(null), { done: {} });
});

test("sugestões de repositório e site a partir do usuário", () => {
  const s = deliverySuggestions({ done: {}, github: "Maria-Dev" }, "meu-primeiro-site");
  assert.equal(s.repo, "https://github.com/Maria-Dev/meu-primeiro-site");
  assert.equal(s.site, "https://maria-dev.github.io/meu-primeiro-site/");
});

test("catálogo: 4 aulas numeradas de 1 a 4", () => {
  assert.equal(LESSON_IDS.length, 4);
  assert.equal(getLessonByNumber(1)?.id, "m1-l1");
  assert.equal(getLessonByNumber(0), null);
  assert.equal(getLessonByNumber(5), null);
  assert.equal(getLessonByNumber(1.5), null);
});

// ---------------------------------------------------------------- entregas das aulas

test("usuário do GitHub aceita variações e recusa lixo", () => {
  assert.deepEqual(validateGithubUser("@maria-dev"), { ok: true, value: "maria-dev" });
  assert.deepEqual(validateGithubUser("https://github.com/maria-dev/"), { ok: true, value: "maria-dev" });
  for (const bad of ["", "maria dev", "-maria", "maria-", "a".repeat(40), "<script>"]) {
    assert.equal(validateGithubUser(bad).ok, false, `deveria recusar "${bad}"`);
  }
});

test("repositório precisa ser do GitHub", () => {
  assert.deepEqual(validateRepoUrl("github.com/maria-dev/meu-primeiro-site"), {
    ok: true,
    value: "https://github.com/maria-dev/meu-primeiro-site",
  });
  assert.deepEqual(validateRepoUrl("https://github.com/maria-dev/meu-primeiro-site.git"), {
    ok: true,
    value: "https://github.com/maria-dev/meu-primeiro-site",
  });
  assert.equal(validateRepoUrl("https://gitlab.com/maria/site").ok, false);
  assert.equal(validateRepoUrl("https://github.com/maria-dev").ok, false);
});

test("site aceita só http/https (sem javascript:)", () => {
  assert.equal(validateSiteUrl("maria-dev.github.io/meu-primeiro-site").ok, true);
  assert.equal(validateSiteUrl("javascript:alert(1)").ok, false);
  assert.equal(validateStudentUrl("javascript:alert(1)").ok, false);
  assert.equal(validateSiteUrl("localhost").ok, false);
});
