# Registro de decisões — Dev no Bolso

## D-001 · Rota de publicação do MVP: GitHub Pages (provisória)

- **Data:** 2026-09-23
- **Status:** Provisória — Gate #1 formalmente PARCIAL até validação em Android físico. Não bloqueia desenvolvimento.
- **Decisão:** O aluno publica o primeiro projeto via **GitHub Pages**.
- **Evidência:** [`gate-1-mobile-publish-spike.md`](./gate-1-mobile-publish-spike.md)
  - Rota A (GitHub Pages): PASS com fricções — 1 conta, ~6 min até a 1ª URL, 2º deploy online em 45 s (até 10 min com cache).
  - Rota B (Vercel Deploy Button): FAIL no fluxo original — erro `invalid_framework` com template estático, repositório vazio deixado para trás, exige 2 contas.
- **2026-10-01 — tentativa de validação em Android físico: BLOQUEADA** (nenhum aparelho conectado ao PC). Sem prova física, a D-001 **continua provisória**; não foi rebaixada, porque nada contradiz a evidência emulada. Diagnóstico e como destravar: ver o [spike](./gate-1-mobile-publish-spike.md#tentativa-de-validação-em-android-físico--2026-10-01).
- **2026-10-01 — revalidação em Android SIMULADO (emulação, não físico): PASS com fricções.** Rota A refeita no repo `dnb-gate1-pages`: 2 edições online em 41 s e 30 s após o commit, sem "Site para computador" e sem desvio para o app; cache do navegador ainda mostra versão antiga ao reabrir a URL (`?v=…` e reload resolvem). Rota A **APROVADA EM EMULAÇÃO**; o Gate #1 **continua PARCIAL** e a pendência de Android físico **segue aberta**. Ver a [revalidação](./gate-1-mobile-publish-spike.md#revalidação-em-android-simulado--2026-10-01).
- **2026-10-01 — conteúdo do aluno:** as fricções da emulação (cache/`?v=…`, auto-fechamento de tag, tradução automática, links diretos) entram no roteiro do Módulo 01, rotuladas como "testado em ambiente móvel emulado". Nenhuma copy afirma teste em Android físico.
- **Reavaliar quando:** teste em Android físico concluído, ou se surgir template Vercel com preset de framework que passe no Deploy Button.

## D-002 · Oferta da Turma Fundadora: R$97, 10 vagas

- **Data:** 2026-10-01
- **Decisão:** preço R$97 (fonte única `lib/offer.ts`, usado na landing e no checkout) e 10 vagas comunicadas com copy estática — sem contador "restam X" na landing.
- **Trava de segurança:** com Upstash Redis configurado, o checkout fecha após 10 pagamentos aprovados de R$97 (chave nova `dev_no_bolso:fundadora_97:approved_payments`; vendas antigas de R$20 não contam). O webhook do Mercado Pago também registra a vaga, reconsultando o pagamento na API. Sem Redis, não há trava automática: o dono controla as vendas manualmente.


## D-003 · Oferta contínua: R$45,99 pagamento único

- **Data:** 2026-10-02
- **Status:** Atual — substitui a D-002 para preço e disponibilidade.
- **Decisão:** acesso ilimitado ao DEV NO BOLSO por **R$45,99 em pagamento único**. Sem contagem de vagas, sem esgotamento e sem copy de escassez.
- **Implementação:** `lib/offer.ts` é a fonte única do preço usado na landing, checkout e validação server-side do Mercado Pago.
