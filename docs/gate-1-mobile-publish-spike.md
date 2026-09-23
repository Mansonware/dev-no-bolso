# Gate #1 — Mobile Build-to-Publish Spike

- **Data:** 2026-09-23
- **Status formal do Gate:** PARCIAL (pendente validação em Android físico)
- **Decisão provisória:** **GitHub Pages é a rota principal de publicação do MVP.**
  A pendência de Android físico **não bloqueia** o desenvolvimento do produto.

## Objetivo

Comparar qual rota de publicação tem menor fricção para um iniciante usando apenas o celular:

- **Rota A:** GitHub → repositório → `index.html` → commit → GitHub Pages → publicação → edição → republicação.
- **Rota B:** Vercel Deploy Button → conta/login → criação do projeto → edição → deploy → edição → redeploy.

## Ambiente do teste

- Navegador embutido do app Claude (Chromium), viewport **375×812** com user-agent **Chrome Android (Pixel 8)** e touch emulado.
- **Não foi Android físico.** Login feito manualmente pelo Manson (Google SSO); o agente não digita credenciais.
- Conta GitHub e sessão Vercel já existentes — cadastro do zero **não** foi medido.
- Ressalvas do ambiente (não contadas como fricção das plataformas): screenshots do painel com atraso, alguns cliques não registrados na emulação, queda de conexão de ~11 min (tempo do 1º build da Rota A obtido pelos timestamps do GitHub Actions).

## Resultado

| | Rota A — GitHub Pages | Rota B — Vercel Deploy Button |
|---|---|---|
| Resultado | **PASS com fricções** | **FAIL no fluxo original** (PASS só via contorno) |
| Contas necessárias | 1 (GitHub) | 2 (GitHub + Vercel) + autorização OAuth |
| Account Setup Time | ~2 min (login SSO, conta existente) | 0 s medido (sessão existente) |
| Até a 1ª URL pública | ~6 min (~4–5 min sem retrabalho da ferramenta) | ~5 min 45 s **com contorno** |
| Build | 44 s | ~1 min (import + deploy) |
| Editar + commit | ~1 min 10 s | ~40 s |
| Alteração online | 45 s sem cache · **até 10 min com cache do navegador** | ~5–10 s, sem cache |
| Erros | 0 | 1 (`invalid_framework`) |
| Desktop mode / "Site para computador" | Não necessário | Não necessário |
| URL | https://mansonware.github.io/dnb-gate1-pages/ | https://dnb-gate1-vercel.vercel.app/ |
| 2º deploy | ✅ validado online | ✅ validado online |

### Rota A — GitHub Pages: fricções

| Severidade | Fricção |
|---|---|
| FRICÇÃO ALTA | Cache do GitHub Pages (`cache-control: max-age=600`): após o commit v2, um reload normal ainda mostrava v1. O aluno tende a achar que falhou. Contorno: abrir com `?v=2`. |
| FRICÇÃO ALTA | Dashboard mobile sem botão "New". Caminho: ☰ → All repositories → New repository. |
| FRICÇÃO ALTA | Em Settings, ao tocar "Pages" a página recarrega no topo mostrando o mesmo menu (~22 itens); o conteúdo fica abaixo e parece que nada aconteceu. |
| FRICÇÃO MÉDIA | Lápis de edição escondido no mobile: "…" → "Edit file… In place". |
| FRICÇÃO MÉDIA | A URL não aparece logo após salvar ("being built"); a home do repo no mobile não mostra a URL. |
| FRICÇÃO MÉDIA | Interface em inglês e jargão (branch, `/(root)`, "Quick setup — if you've done this kind of thing before", bloco de comandos git). |
| FRICÇÃO BAIXA | Mensagem de commit sugerida pelo Copilot em inglês; modal oferece branch/PR. |
| FRICÇÃO BAIXA | Posicionar cursor no editor de código por toque. |
| FRICÇÃO BAIXA | Banner de cookies cobre metade da tela no cadastro. |

Redirects: `github.com/login` → `accounts.google.com` → `github.com` (a aba original fechou no SSO) · `/new` → repositório · commit → `/tree/main` · Settings → `/settings/pages`.

### Rota B — Vercel: bloqueadores e fricções

| Severidade | Item |
|---|---|
| BLOQUEADOR | Deploy Button com template HTML estático falhou: `The provided framework must match one of the supported options.` (API 400 `invalid_framework`) e **deixou um repositório privado vazio** no GitHub do aluno. |
| FRICÇÃO ALTA | Sem cadastro por e-mail: só "Continuar com GitHub/GitLab/Bitbucket". A Rota B **soma** contas em cima da A. |
| FRICÇÃO ALTA | A edição continua acontecendo no editor do GitHub — herda as fricções da Rota A. |
| FRICÇÃO MÉDIA | Tela de import com jargão: Application Preset, Root Directory, Build and Output Settings, Environment Variables. |
| FRICÇÃO MÉDIA | Link "Import a different Git Repository" redirecionou para `/new/templates`. |
| FRICÇÃO MÉDIA | Tela de sucesso destaca `npx plugins add …` (terminal); URL pública pouco evidente no texto. |
| Positivo | UI mobile limpa; redeploy quase instantâneo; `cache-control: max-age=0`. |

Contorno usado na Rota B: criar `index.html` pelo editor do GitHub no repositório vazio e importar em `vercel.com/new`.

## Bloqueador comum às duas rotas

Login/cadastro exigem ação humana (senha, 2FA, CAPTCHA). Esperado — faz parte do onboarding do aluno.

## Pendências para Android físico

1. Cadastro GitHub do zero no Chrome Android (CAPTCHA, código por e-mail, ida e volta do Google SSO entre abas/apps).
2. Se o GitHub redireciona para o app GitHub Mobile / banner "Abrir no app" (o app não expõe Settings → Pages).
3. Cadastro Vercel via "Continue with GitHub": comportamento do OAuth no Android.
4. Teclado real (Gboard) no editor: autocorreção, maiúscula automática, aspas "inteligentes", digitar `<` e `/`, cursor por toque.
5. Pull-to-refresh vs cache de 10 min do GitHub Pages.
6. Alvos de toque de "Create repository", "Commit changes" e "Deploy"; tela de 360 px.
7. Se algum passo força "Site para computador" em Android real (na emulação, nenhum forçou).

## Implicações para o produto (sem alterar o PRD)

- Trilha principal de publicação: **GitHub Pages**.
- Conteúdo do curso deve usar links diretos (`github.com/new`, `…/new/main`, `…/settings/pages`).
- **Cache / `?v=2` — VALIDADO EM EMULAÇÃO (não em Android físico):** o GitHub Pages responde com `cache-control: max-age=600`; após o commit v2, o reload normal mostrou v1, e a URL com `?v=…` mostrou v2 ~45 s após o commit. Candidato a instrução da Aula 4, mas **não exibido ao aluno** até o Gate em Android físico confirmar (incluindo pull-to-refresh).
- Rota Vercel fica fora do MVP; reteste possível apenas com template que tenha preset de framework.

## Artefatos do teste

- `Mansonware/dnb-gate1-pages` (público) — Rota A
- `Mansonware/dnb-gate1-vercel` (privado) + projeto Vercel `dnb-gate1-vercel` — Rota B
