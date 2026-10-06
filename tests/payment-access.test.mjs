// Pagamento, limite de consultas, acesso (reembolso/chargeback), webhook e cadastro.
// Usa as MESMAS funções que as rotas usam (lib/*Core.ts), com Redis e Mercado Pago em memória.
// O teste de "uma compra = uma conta" roda o script Lua real num redis-server, quando disponível.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:net";

import { classifyPayment, checkSignupEligibility } from "../lib/paymentCore.ts";
import { createGuardedLookup, LOOKUP_LIMITS } from "../lib/paymentGuardCore.ts";
import { activeEntitlement, hasAccess, needsRecheck, RECHECK_AFTER_MS } from "../lib/entitlementCore.ts";
import { handlePaymentNotification, syncPaymentAccess } from "../lib/webhookCore.ts";
import { verifyMercadoPagoWebhookSignature } from "../lib/mercadopago-webhook.ts";
import { CREATE_USER_SCRIPT } from "../lib/redisScripts.ts";

const PRODUCT = { priceCents: 4599, currencyId: "BRL", externalReference: "DEV_NO_BOLSO_V2" };
const mp = (overrides = {}) => ({
  id: 1001,
  status: "approved",
  transaction_amount: 45.99,
  currency_id: "BRL",
  external_reference: "DEV_NO_BOLSO_V2",
  payer: { email: "Comprador@Example.com" },
  ...overrides,
});

// ------------------------------------------------------------------ dublês em memória

function memoryLimiter() {
  const counts = new Map();
  const sets = new Map();
  return {
    async count(key) {
      const n = (counts.get(key) ?? 0) + 1;
      counts.set(key, n);
      return n;
    },
    async distinct(key, member) {
      const s = sets.get(key) ?? new Set();
      s.add(member);
      sets.set(key, s);
      return s.size;
    },
  };
}

/** Mercado Pago falso: o "estado atual" de cada pagamento pode mudar durante o teste. */
function fakeMercadoPago(payments) {
  const calls = [];
  return {
    calls,
    payments,
    lookup: async (id) => {
      calls.push(id);
      if (payments === "down") return { state: "unavailable", paymentId: id };
      const raw = payments[id];
      return raw ? classifyPayment(raw, PRODUCT) : { state: "not_found", paymentId: id };
    },
  };
}

/** Redis falso com o que o webhook e o acesso usam. Conta/progresso ficam em `accounts`. */
function fakeStore() {
  const sales = new Set();
  const entitlements = new Map();
  const processed = new Set();
  const events = [];
  return {
    sales,
    entitlements,
    processed,
    events,
    accounts: new Map([["user-maria", { paymentId: "1001", progress: { "m1-l1": "2026-10-06" } }]]),
    recordApprovedPayment: async (id) => (sales.has(id) ? false : (sales.add(id), true)),
    getEntitlement: async (id) => entitlements.get(id) ?? null,
    setEntitlement: async (id, e) => void entitlements.set(id, e),
    onEvent: (e) => void events.push(e),
    wasProcessed: async (k) => processed.has(k),
    markProcessed: async (k) => void processed.add(k),
    allowPaymentLookup: async () => true,
  };
}

function webhookDeps(mercadoPago, store) {
  return { ...store, lookup: mercadoPago.lookup };
}

// ------------------------------------------------------------------ 1–3: consulta protegida

test("1. payment ID válido é consultado no Mercado Pago", async () => {
  const mpFake = fakeMercadoPago({ 1001: mp() });
  const guarded = createGuardedLookup({ store: memoryLimiter(), lookup: mpFake.lookup });
  const result = await guarded("1001", "200.0.0.1");
  assert.equal(result.state, "approved");
  assert.equal(result.payerEmail, "comprador@example.com");
  assert.deepEqual(mpFake.calls, ["1001"]);
});

test("2. payment ID inexistente → not_found; formato inválido nem chega ao Mercado Pago", async () => {
  const mpFake = fakeMercadoPago({});
  const guarded = createGuardedLookup({ store: memoryLimiter(), lookup: mpFake.lookup });
  assert.equal((await guarded("9999", "200.0.0.1")).state, "not_found");
  for (const bad of ["abc", "", "12a", "1".repeat(21), "../1001"]) {
    assert.equal((await guarded(bad, "200.0.0.1")).state, "not_found");
  }
  assert.deepEqual(mpFake.calls, ["9999"], "IDs malformados não consultam a API");
});

test("3a. varredura: muitos números diferentes do mesmo IP são bloqueados", async () => {
  const mpFake = fakeMercadoPago({});
  const guarded = createGuardedLookup({ store: memoryLimiter(), lookup: mpFake.lookup });
  const max = LOOKUP_LIMITS.distinctPaymentsPerIp.max;
  for (let i = 0; i < max; i++) assert.equal((await guarded(String(5000 + i), "6.6.6.6")).state, "not_found");
  assert.equal((await guarded("9998", "6.6.6.6")).state, "rate_limited");
  assert.equal(mpFake.calls.length, max, "a consulta bloqueada não chama o Mercado Pago");
  assert.equal((await guarded("9998", "7.7.7.7")).state, "not_found", "outro IP não é afetado");
});

test("3b. excesso de consultas por IP e por pagamento é bloqueado", async () => {
  const limits = { perIp: { max: 5, windowSeconds: 60 }, distinctPaymentsPerIp: { max: 99, windowSeconds: 60 }, perPayment: { max: 8, windowSeconds: 60 } };
  const mpFake = fakeMercadoPago({ 1001: mp() });
  const guarded = createGuardedLookup({ store: memoryLimiter(), lookup: mpFake.lookup, limits });
  for (let i = 0; i < 5; i++) assert.equal((await guarded("1001", "1.1.1.1")).state, "approved");
  assert.equal((await guarded("1001", "1.1.1.1")).state, "rate_limited", "limite por IP");
  for (let i = 0; i < 2; i++) await guarded("1001", `2.2.2.${i}`);
  assert.equal((await guarded("1001", "3.3.3.3")).state, "rate_limited", "limite por pagamento, de qualquer IP");
});

test("3c. comprador real fazendo polling do Pix não é bloqueado", async () => {
  const mpFake = fakeMercadoPago({ 1002: mp({ id: 1002, status: "pending" }) });
  const guarded = createGuardedLookup({ store: memoryLimiter(), lookup: mpFake.lookup });
  // ~15 min de polling (24 rápidas + 52 lentas) cai em duas janelas de 10 min; 60 numa janela é o pior caso.
  for (let i = 0; i < 60; i++) assert.equal((await guarded("1002", "177.1.2.3")).state, "pending");
});

test("3d. Redis fora do ar não impede o comprador de ver o pagamento", async () => {
  const broken = { count: async () => { throw new Error("down"); }, distinct: async () => { throw new Error("down"); } };
  const guarded = createGuardedLookup({ store: broken, lookup: fakeMercadoPago({ 1001: mp() }).lookup, onStoreError: () => {} });
  assert.equal((await guarded("1001", "1.1.1.1")).state, "approved");
});

// ------------------------------------------------------------------ 4–7: classificação do pagamento

test("4. pagamento aprovado e do produto → approved; valor, moeda ou referência errados → invalid", () => {
  assert.equal(classifyPayment(mp(), PRODUCT).state, "approved");
  assert.equal(classifyPayment(mp({ transaction_amount: 1 }), PRODUCT).state, "invalid");
  assert.equal(classifyPayment(mp({ transaction_amount: 45.98 }), PRODUCT).state, "invalid");
  assert.equal(classifyPayment(mp({ currency_id: "USD" }), PRODUCT).state, "invalid");
  assert.equal(classifyPayment(mp({ external_reference: "OUTRO_PRODUTO" }), PRODUCT).state, "invalid");
});

test("5. pagamento pendente → pending e não libera cadastro", () => {
  for (const status of ["pending", "in_process", "authorized", "in_mediation"]) {
    const lookup = classifyPayment(mp({ status }), PRODUCT);
    assert.equal(lookup.state, "pending", status);
    assert.deepEqual(checkSignupEligibility(lookup, "comprador@example.com"), { ok: false, code: "pending" });
  }
});

test("6. pagamento reembolsado → refunded, revoga acesso e não libera cadastro", async () => {
  const lookup = classifyPayment(mp({ status: "refunded" }), PRODUCT);
  assert.equal(lookup.state, "refunded");
  assert.deepEqual(checkSignupEligibility(lookup, "comprador@example.com"), { ok: false, code: "not_eligible" });

  const store = fakeStore();
  await syncPaymentAccess(webhookDeps(fakeMercadoPago({ 1001: mp({ status: "refunded" }) }), store), "1001");
  assert.equal(store.entitlements.get("1001").status, "revoked");
  assert.equal(store.entitlements.get("1001").reason, "refunded");
});

test("7. chargeback → refunded com motivo charged_back e acesso revogado", async () => {
  const lookup = classifyPayment(mp({ status: "charged_back" }), PRODUCT);
  assert.equal(lookup.state, "refunded");
  const store = fakeStore();
  await syncPaymentAccess(webhookDeps(fakeMercadoPago({ 1001: mp({ status: "charged_back" }) }), store), "1001");
  assert.equal(store.entitlements.get("1001").reason, "charged_back");
  assert.equal(hasAccess(store.entitlements.get("1001")), false);
});

test("reembolso de OUTRO produto não mexe em acesso", async () => {
  const store = fakeStore();
  store.entitlements.set("1001", activeEntitlement(new Date()));
  await syncPaymentAccess(webhookDeps(fakeMercadoPago({ 1001: mp({ status: "refunded", transaction_amount: 10 }) }), store), "1001");
  assert.equal(store.entitlements.get("1001").status, "active");
});

// ------------------------------------------------------------------ 8–9: conta criada + estado do pagamento

test("8. conta criada + refund → acesso bloqueado, conta e progresso preservados", async () => {
  const store = fakeStore();
  const mpFake = fakeMercadoPago({ 1001: mp() });
  store.entitlements.set("1001", activeEntitlement(new Date())); // gravado no cadastro
  assert.equal(hasAccess(store.entitlements.get("1001")), true);

  mpFake.payments[1001] = mp({ status: "refunded" });
  const out = await handlePaymentNotification(webhookDeps(mpFake, store), { eventType: "payment.updated", resourceId: "1001", replayKey: null });
  assert.equal(out.status, 200);
  assert.equal(hasAccess(store.entitlements.get("1001")), false);
  assert.deepEqual(store.accounts.get("user-maria").progress, { "m1-l1": "2026-10-06" }, "progresso intacto");
  assert.ok(store.events.includes("access_revoked"));

  // Se o pagamento voltar a valer, o acesso volta (reativação).
  mpFake.payments[1001] = mp();
  const back = await syncPaymentAccess(webhookDeps(mpFake, store), "1001");
  assert.equal(back.transition, "restored");
  assert.equal(hasAccess(store.entitlements.get("1001")), true);
});

test("9. conta criada + pagamento continua aprovado → acesso mantido", async () => {
  const store = fakeStore();
  const mpFake = fakeMercadoPago({ 1001: mp() });
  const created = new Date("2026-10-06T12:00:00Z");
  store.entitlements.set("1001", activeEntitlement(created));

  const later = new Date(created.getTime() + RECHECK_AFTER_MS + 1);
  assert.equal(needsRecheck(store.entitlements.get("1001"), later), true, "revisão diária dispara");
  const result = await syncPaymentAccess({ ...webhookDeps(mpFake, store), now: () => later }, "1001");
  assert.equal(result.transition, "unchanged");
  assert.equal(hasAccess(store.entitlements.get("1001")), true);
  assert.equal(store.entitlements.get("1001").updatedAt, created.toISOString(), "status não mudou");
  assert.equal(store.entitlements.get("1001").checkedAt, later.toISOString(), "só marcou a conferência");
  assert.equal(needsRecheck(store.entitlements.get("1001"), later), false);
});

test("conta sem registro de acesso (anterior à regra) continua com acesso", () => {
  assert.equal(hasAccess(null), true);
});

// ------------------------------------------------------------------ 10: webhook

test("10a. webhook duplicado (mesma notificação assinada) só é processado uma vez", async () => {
  const store = fakeStore();
  const mpFake = fakeMercadoPago({ 1001: mp() });
  const input = { eventType: "payment.created", resourceId: "1001", replayKey: "req-1|sig" };
  const first = await handlePaymentNotification(webhookDeps(mpFake, store), input);
  const second = await handlePaymentNotification(webhookDeps(mpFake, store), input);
  assert.equal(first.status, 200);
  assert.deepEqual(second.body, { received: true, duplicate: true });
  assert.equal(mpFake.calls.length, 1, "replay não consulta de novo");
  assert.deepEqual(store.events, ["payment_success"]);
});

test("10b. notificações diferentes para o mesmo pagamento são idempotentes", async () => {
  const store = fakeStore();
  const mpFake = fakeMercadoPago({ 1001: mp() });
  for (let i = 0; i < 5; i++) {
    await handlePaymentNotification(webhookDeps(mpFake, store), { eventType: "payment", resourceId: "1001", replayKey: `r${i}` });
  }
  assert.equal(store.sales.size, 1, "venda contada uma vez");
  assert.deepEqual(store.events, ["payment_success"], "evento de venda uma vez, sem eventos de acesso extras");
  assert.equal(store.entitlements.get("1001").status, "active");
});

test("10c. webhook: Mercado Pago fora do ar → 500 e reenvio posterior é processado", async () => {
  const store = fakeStore();
  const down = fakeMercadoPago("down");
  const input = { eventType: "payment", resourceId: "1001", replayKey: "r-1" };
  assert.equal((await handlePaymentNotification(webhookDeps(down, store), input)).status, 500);
  assert.equal(store.processed.size, 0, "falha não marca como processado");
  const up = fakeMercadoPago({ 1001: mp() });
  assert.equal((await handlePaymentNotification(webhookDeps(up, store), input)).status, 200);
  assert.equal(store.entitlements.get("1001").status, "active");
});

test("10d. webhook: pagamento inexistente → 200 sem loop; outros tópicos ignorados; excesso → 429", async () => {
  const store = fakeStore();
  const mpFake = fakeMercadoPago({});
  const notFound = await handlePaymentNotification(webhookDeps(mpFake, store), { eventType: "payment", resourceId: "9999", replayKey: null });
  assert.equal(notFound.status, 200);
  assert.equal(store.entitlements.size, 0);
  const other = await handlePaymentNotification(webhookDeps(mpFake, store), { eventType: "merchant_order", resourceId: "5", replayKey: null });
  assert.deepEqual(other.body, { received: true, ignored: true });
  const limited = await handlePaymentNotification(
    { ...webhookDeps(mpFake, store), allowPaymentLookup: async () => false },
    { eventType: "payment", resourceId: "1001", replayKey: null }
  );
  assert.equal(limited.status, 429);
});

test("10e. webhook fora de ordem: vale sempre o estado atual no Mercado Pago", async () => {
  const store = fakeStore();
  const mpFake = fakeMercadoPago({ 1001: mp({ status: "refunded" }) });
  // Chega primeiro a notificação "created" atrasada, mas o pagamento JÁ está reembolsado.
  await handlePaymentNotification(webhookDeps(mpFake, store), { eventType: "payment.created", resourceId: "1001", replayKey: "old" });
  assert.equal(store.entitlements.get("1001").status, "revoked");
  assert.equal(store.sales.size, 0, "reembolsado não conta como venda");
});

test("assinatura: ts em milissegundos vale; ts no futuro e assinatura adulterada não", () => {
  process.env.MERCADOPAGO_WEBHOOK_SECRET = "segredo-teste";
  const now = Date.parse("2026-10-06T21:00:00Z");
  const sign = (ts) => createHmac("sha256", "segredo-teste").update(`id:1001;request-id:req-9;ts:${ts};`).digest("hex");

  const tsOk = String(now - 60 * 60 * 1000); // 1h atrás (reenvio do MP)
  assert.equal(verifyMercadoPagoWebhookSignature({ xSignature: `ts=${tsOk},v1=${sign(tsOk)}`, xRequestId: "req-9", dataId: "1001" }, now).valid, true);

  const tsFuture = String(now + 60 * 60 * 1000);
  assert.equal(verifyMercadoPagoWebhookSignature({ xSignature: `ts=${tsFuture},v1=${sign(tsFuture)}`, xRequestId: "req-9", dataId: "1001" }, now).valid, false);

  assert.equal(verifyMercadoPagoWebhookSignature({ xSignature: `ts=${tsOk},v1=${sign(tsOk)}`, xRequestId: "req-9", dataId: "1002" }, now).valid, false);
  delete process.env.MERCADOPAGO_WEBHOOK_SECRET;
});

// ------------------------------------------------------------------ 11 + regras de cadastro

test("cadastro: e-mail precisa ser o da compra; sem e-mail do pagador vai para o suporte", () => {
  const approved = classifyPayment(mp(), PRODUCT);
  assert.deepEqual(checkSignupEligibility(approved, "  COMPRADOR@example.com "), { ok: true, paymentId: "1001", email: "comprador@example.com" });
  assert.deepEqual(checkSignupEligibility(approved, "outro@example.com"), { ok: false, code: "email_mismatch" });
  assert.deepEqual(checkSignupEligibility(classifyPayment(mp({ payer: {} }), PRODUCT), "x@y.com"), { ok: false, code: "payer_email_missing" });
  assert.deepEqual(checkSignupEligibility(classifyPayment(mp({ transaction_amount: 1 }), PRODUCT), "comprador@example.com"), { ok: false, code: "not_eligible" });
  assert.deepEqual(checkSignupEligibility({ state: "rate_limited", paymentId: "1001" }, "comprador@example.com"), { ok: false, code: "rate_limited" });
});

const hasRedis = spawnSync("redis-server", ["--version"]).status === 0;

async function freePort() {
  return new Promise((resolve) => {
    const srv = createServer().listen(0, () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

test("11. duas contas com o mesmo pagamento: o script Lua real só deixa a primeira", { skip: !hasRedis && "redis-server não instalado" }, async () => {
  const port = await freePort();
  const server = spawn("redis-server", ["--port", String(port), "--save", "", "--appendonly", "no"], { stdio: "ignore" });
  const cli = (...args) => spawnSync("redis-cli", ["-p", String(port), ...args], { encoding: "utf8" }).stdout.trim();
  try {
    for (let i = 0; i < 50 && cli("PING") !== "PONG"; i++) await new Promise((r) => setTimeout(r, 50));
    const active = JSON.stringify({ status: "active" });
    const run = (user) =>
      cli("EVAL", CREATE_USER_SCRIPT, "3", "claim:1001", `user:${user}`, "ent:1001", `user:${user}`, `{"name":"${user}"}`, active);

    assert.equal(run("maria"), "ok");
    assert.equal(run("intruso"), "payment_claimed", "segunda conta com o mesmo pagamento é recusada");
    assert.equal(cli("GET", "claim:1001"), "user:maria");
    assert.equal(cli("EXISTS", "user:intruso"), "0");

    // Mesmo e-mail com outro pagamento também não cria conta duplicada.
    assert.equal(cli("EVAL", CREATE_USER_SCRIPT, "3", "claim:2002", "user:maria", "ent:2002", "user:maria", "{}", active), "user_exists");

    // Reembolso que chegou antes da conta: a revogação vence (SET NX).
    cli("SET", "ent:3003", JSON.stringify({ status: "revoked" }));
    assert.equal(cli("EVAL", CREATE_USER_SCRIPT, "3", "claim:3003", "user:ana", "ent:3003", "user:ana", "{}", active), "ok");
    assert.match(cli("GET", "ent:3003"), /revoked/);
  } finally {
    server.kill();
  }
});
