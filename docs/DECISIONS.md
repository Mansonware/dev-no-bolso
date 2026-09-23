# Registro de decisões — Dev no Bolso

## D-001 · Rota de publicação do MVP: GitHub Pages (provisória)

- **Data:** 2026-09-23
- **Status:** Provisória — Gate #1 formalmente PARCIAL até validação em Android físico. Não bloqueia desenvolvimento.
- **Decisão:** O aluno publica o primeiro projeto via **GitHub Pages**.
- **Evidência:** [`gate-1-mobile-publish-spike.md`](./gate-1-mobile-publish-spike.md)
  - Rota A (GitHub Pages): PASS com fricções — 1 conta, ~6 min até a 1ª URL, 2º deploy online em 45 s (até 10 min com cache).
  - Rota B (Vercel Deploy Button): FAIL no fluxo original — erro `invalid_framework` com template estático, repositório vazio deixado para trás, exige 2 contas.
- **Reavaliar quando:** teste em Android físico concluído, ou se surgir template Vercel com preset de framework que passe no Deploy Button.
