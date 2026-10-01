# Gate #1 — Mobile Build-to-Publish Spike

- **Data:** 2026-09-23
- **Status formal do Gate:** PARCIAL (pendente validação em Android físico — tentativa de 2026-10-01 bloqueada por falta de acesso ao aparelho; ver [Tentativa de validação em Android físico](#tentativa-de-validação-em-android-físico--2026-10-01))
- **Rota A em emulação:** **APROVADA EM EMULAÇÃO** (2026-09-23 + revalidação de 2026-10-01; ver [Revalidação em Android simulado](#revalidação-em-android-simulado--2026-10-01)). Isso **não** substitui o Android físico.
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

## Tentativa de validação em Android físico — 2026-10-01

- **Resultado:** **BLOQUEADO — sem acesso real a Android físico.** Nenhum passo da Rota A foi executado em aparelho;
  nenhum tempo físico foi medido. Não houve substituição por emulação.
- **Veredito do Gate:** continua **PARCIAL**.

### Diagnóstico (feito no PC do dono, Windows 11)

| Verificação | Resultado |
|---|---|
| Android SDK Platform-Tools | **Instalado em 2026-10-01** a partir de `dl.google.com/android/repository/platform-tools-latest-windows.zip` (fonte oficial Google), sem admin, em `%LOCALAPPDATA%\Android\Sdk\platform-tools` e adicionado ao PATH do usuário. `adb.exe` com assinatura Authenticode válida da Google LLC. `adb --version`: 1.0.41 / 37.0.1-15733141. `scrcpy` não instalado (não é necessário). |
| `adb devices` | Lista vazia (nem `device`, nem `unauthorized`). |
| Android plugado via USB | Nenhum. Nenhum dispositivo Xiaomi/POCO/Motorola/ADB/MTP presente no Windows. |
| Histórico de dispositivos no Windows | `POCO M7 Pro 5G` (último USB: 30/09/2026 22:11–22:18), `POCO M7 Pro 5G` + `ADB Interface` (05/09/2026), `moto g04s` (05/09/2026). Todos **desconectados** agora. |
| ADB por Wi-Fi | Porta 5555 fechada nos 2 hosts da LAN (192.168.1.3, 192.168.1.5). Depuração sem fio (porta aleatória) exige pareamento por código mostrado no celular, ou seja, ação humana. |
| Chrome remote debugging (`chrome://inspect`) | Depende do aparelho em USB com Depuração USB ativa; não há aparelho conectado. |
| Extensão Claude in Chrome | Só 1 navegador conectado: Chrome **Windows** (desktop). Nenhum Chrome Android. |
| Tailscale | Serviço `tailscaled` parado no PC; nenhum peer acessível. |
| Artefatos do teste anterior | `Mansonware/dnb-gate1-pages` público, Pages `built` (branch `main`, `/`), URL no ar servindo v2, `Cache-Control: max-age=600` (confirmado agora). Último commit: 23/09/2026 16:04 UTC, então **nenhum teste físico foi feito no repo depois do teste emulado**. |

Todos os itens de [Pendências para Android físico](#pendências-para-android-físico) seguem abertos.

### Como destravar (escolha uma opção)

1. **Agente conduz o teste — única ação do dono (~2 min):** plugar o POCO M7 Pro 5G no PC via USB com
   *Opções do desenvolvedor → Depuração USB* ativa e tocar **Permitir** no prompt de chave RSA do celular.
   O PC já está pronto (`adb` instalado). Com isso, o agente acessa o Chrome Android via `adb` / DevTools remoto
   e registra tempos e screenshots. Login no GitHub continua sendo feito pelo dono no aparelho; o agente não digita credenciais.
   Se `adb devices` mostrar `unauthorized`, falta apenas aceitar o prompt RSA.
2. **Dono executa sozinho no celular (~15 min):** usar o roteiro abaixo e mandar screenshots com horário visível.
   O agente cruza com os timestamps de commit do GitHub e com `curl -I` da URL.

**Roteiro mínimo (Chrome Android, sessão GitHub já logada, sem "Site para computador"):**

1. Abrir `github.com/new` → criar `dnb-gate1-android` (público) marcando "Add a README". Anotar a hora (T0).
2. *Add file → Create new file* → `index.html` com `<h1>v1 Android</h1>` → Commit. Observar o Gboard (autocorreção, maiúscula, aspas, `<` e `/`).
3. `…/settings/pages` → Source: *Deploy from a branch* → `main` / `/(root)` → Save.
4. Recarregar até aparecer a URL; abrir no Chrome. Anotar a hora em que v1 aparece (T1). **1ª publicação = T1 − T0.**
5. Editar `index.html` para `v2 Android` → Commit (T2).
6. Na aba da URL: reload normal, depois pull-to-refresh, depois `?v=2`. Anotar a hora em que cada um mostra v2. **Edição→online = T3 − T2.**
7. Anotar se em algum passo apareceu banner/redirecionamento para o app GitHub Mobile ou se foi preciso ativar "Site para computador".

## Revalidação em Android simulado — 2026-10-01

> **EMULAÇÃO / SIMULAÇÃO. Não é Android físico.** Sem ADB, sem aparelho. Vercel não foi retestada.
> Nenhuma conclusão desta seção fecha as [Pendências para Android físico](#pendências-para-android-físico).

- **Resultado:** **PASS com fricções (EMULAÇÃO)** — Rota A refeita ponta a ponta no repo existente
  `Mansonware/dnb-gate1-pages` (sem criar repo novo), com 2 edições + republicações validadas online.
- **URL testada:** https://mansonware.github.io/dnb-gate1-pages/

### Ambiente simulado (duas camadas, ambas emulação)

| Camada | O que foi | Limitação |
|---|---|---|
| **S1 — fluxo logado** (edição + commit + Pages) | Chrome **Windows** do dono via extensão Claude in Chrome, sessão GitHub já existente (Mansonware; nenhuma senha/token/2FA digitado). Janela estreitada até o mínimo do Chrome: **viewport 500×749 CSS px** — abaixo do breakpoint de 544 px do GitHub, então o GitHub serviu o **layout mobile** (coluna única, abas Code/Issues/PRs + "More", sem lápis visível). | **Mais fraca que 2026-09-23:** a extensão não permite 375 px, nem trocar o user-agent, nem emular touch → UA era Chrome Windows desktop, cliques de mouse (não toque). Tradução automática do Chrome para pt-BR estava ativa. |
| **S2 — emulação completa Pixel 8** (páginas públicas, sem login) | Chromium do Playwright 1.63 com viewport **412×915**, UA `Android 14; Pixel 8 … Chrome/141 Mobile`, `hasTouch`/`pointer:coarse`, locale pt-BR. | Sem sessão GitHub (o agente não faz login) → não edita; serve para verificar redirecionamentos por UA, banner de app e cache do Pages com UA Android. |

O teste de 2026-09-23 (navegador embutido do app Claude, 375×812, UA Pixel 8, touch) não estava disponível nesta sessão.

### Linha do tempo (UTC, verificável)

| Evento | Horário | Fonte |
|---|---|---|
| Baseline: Pages `built` (branch `main`, `/`), servindo v2 de 23/09, `Cache-Control: max-age=600` | 22:02:59 | `gh api …/pages`, `curl -I` |
| v2 aberta numa 2ª aba (fica no cache do navegador) | 22:03:13 | `performance` da página |
| **Commit 1** `ffb1a0b` "Update heading in index.html to version 3" (v3) | 22:04:23 | `gh api …/commits` |
| Pages build v3 | 22:04:24 → 22:05:06 (42 s) | `gh api …/pages/builds/latest` |
| v3 online (requisição sem cache) | 22:05:04 | polling `curl` a cada 3 s |
| **Commit 2** `d03a51c` "Update header for site version to v4" (v4) | 22:06:00 | `gh api …/commits` |
| Pages build v4 | 22:06:01 → 22:06:33 (32 s) | `gh api …/pages/builds/latest` |
| v4 online (requisição sem cache) | 22:06:30 | polling `curl` |
| Settings → Pages: "Seu site está online em …/dnb-gate1-pages/ · Última implementação há 1 minuto" | ~22:07 | UI do GitHub (S1) |

### Resultado comparado com 2026-09-23

| | 2026-09-23 (emulação) | 2026-10-01 (emulação) |
|---|---|---|
| Ambiente | Navegador do app Claude, 375×812, UA Pixel 8, touch | S1: Chrome Windows 500 px, UA desktop, sem touch · S2: Playwright Pixel 8 completo, deslogado |
| Repo | Criado do zero | Reaproveitado (`dnb-gate1-pages`); criação de repo e ativação do Pages **não** foram refeitas — só confirmadas |
| Edição 1: commit → online | 45 s | **41 s** (build 42 s) |
| Edição 2: commit → online | — | **30 s** (build 32 s) |
| Abrir a URL de novo (link/favorito/digitar) | — | **Versão antiga** vinda do cache do navegador (`transferSize` 0) — ver abaixo |
| Reload normal | Ainda mostrava v1 | **Mostrou a versão nova** (revalidou: v3 com 525 B, v4 com 524 B) |
| `?v=2` | Mostrava v2 (~45 s após commit) | **Mostrou a versão nova** (v4 às 22:06:45, 15 s após online) |
| Pull-to-refresh | Não testado | **Não testável** (nem S1 nem S2 têm o gesto). No Chrome Android ele dispara um reload; o equivalente seria o "reload normal" acima — **inferência, não medição** |
| Desktop mode / "Site para computador" | Não necessário | **Não necessário** |
| Banner/redirecionamento para app GitHub Mobile | Não visto | **Não visto** (S2 com UA Android: nenhum banner "abrir no app", nenhum link `intent:` / Play Store) |
| Erros de plataforma | 0 | 0 |

### Cache: o que a revalidação mostrou (EMULAÇÃO)

- O CDN do Pages atualizou na hora (`Last-Modified` = horário do build, `Age: 0`); o atraso está no **cache do navegador** (`max-age=600`).
- Às 22:06:43, com v4 já no ar, **abrir a URL limpa mostrou a v2** — a versão que aquela aba guardou em cache às 22:03, **duas versões atrás**, mesmo depois de o reload ter exibido v3. Em seguida `?v=2` mostrou v4 e, logo depois, a URL limpa **voltou a mostrar v2**. Só o reload normal trouxe v4 na URL limpa.
- Diferença com 23/09: lá o reload normal ainda mostrava v1; hoje o reload revalidou. Ambiente diferente (S1 é Chrome desktop) — não dá para atribuir a diferença ao GitHub.
- Leitura prática: **"abri o link e não mudou"** continua sendo o cenário mais provável de o aluno achar que falhou. `?v=…` e reload resolveram na emulação; validar pull-to-refresh no Android físico continua pendente.

### Fricções observadas (EMULAÇÃO)

| Severidade | Fricção | Já vista em 23/09? |
|---|---|---|
| FRICÇÃO ALTA | Cache do navegador: abrir a URL de novo mostra versão antiga (até 2 versões atrás), detalhado acima. | Sim (variação) |
| FRICÇÃO ALTA | `/settings/pages` abre com o menu de Settings ocupando a primeira tela inteira; o conteúdo do Pages começa ~734 px abaixo (página com 2.297 px). | Sim |
| FRICÇÃO MÉDIA | **Auto-fechamento de tag no editor:** digitar a linha `<h1>…</h1>` inteira gerou `</h1></h1>` (o editor insere `</h1>` ao digitar `<h1>`). Ao digitar só `<h1>texto`, a linha saiu correta. A Aula precisa avisar: "não digite o fechamento". | **Nova** |
| FRICÇÃO MÉDIA | Seleção por toque duplo imprecisa: o duplo clique sobre "v2" selecionou o espaço vizinho e virou `sitev3- v2`. Corrigido com Home + Shift+End (teclas que o teclado do celular não tem fáceis). Em S1 foi mouse; com dedo tende a ser pior. | Sim (cursor por toque) |
| FRICÇÃO MÉDIA | Lápis de edição escondido: "…" → "Edit file… / In place". O link direto `…/edit/main/index.html` pula esse passo. | Sim |
| FRICÇÃO MÉDIA | **Tradução automática do Chrome** (pt-BR) traduz a UI do GitHub *e o código na visualização do arquivo* (`<head>` → `<cabeça>`, `<body>` → `<corpo>`, `name="viewport"` → `nome="janela…"`), além de rótulos como "Comprometa-se diretamente com oprincipalfilial" e "Culpa" (Blame). O editor de código **não** foi traduzido e o arquivo commitado saiu correto (conferido via API). Risco: aluno copiar o código traduzido da visualização. | **Nova** (ambiente com tradução ativa) |
| FRICÇÃO BAIXA | Alvos de toque pequenos: "Commit changes…" 165×32 px; "Visit site" 131×34 px e o vermelho **"Unpublish site" 126×32 px a 8 px dele**. Abaixo dos 48 dp recomendados pelo Android; o vizinho é destrutivo. | Parcial (Unpublish é novo) |
| FRICÇÃO BAIXA | Mensagem de commit gerada pelo Copilot em inglês, com ~3 s de "O copiloto está pensando…"; modal oferece branch/PR. | Sim |

Redirects observados: commit → `/blob/main/index.html` (em 23/09 foi `/tree/main`) · `/edit/…` deslogado (S2) → `/login?return_to=…` · nenhum redirect por UA Android para app ou loja.

### Veredito da revalidação

- **Rota A (GitHub Pages): APROVADA EM EMULAÇÃO.** Duas republicações online em 41 s e 30 s, sem erros, sem "Site para computador", sem desvio para o app.
- **Gate formal: continua PARCIAL.** O critério deste documento exige Android físico; a revalidação foi emulada e, em S1, mais fraca que a de 23/09 (UA desktop, sem touch). Nada aqui conta como fechamento físico.
- Pendências para Android físico ainda abertas: todas (1–7). A revalidação acrescenta dois pontos a observar no aparelho: auto-fechamento de tag com Gboard e tradução automática do Chrome Android.

## Implicações para o produto (sem alterar o PRD)

- Trilha principal de publicação: **GitHub Pages**.
- Conteúdo do curso deve usar links diretos (`github.com/new`, `…/new/main`, `…/settings/pages`).
- **Cache / `?v=2` — VALIDADO EM EMULAÇÃO (não em Android físico):** o GitHub Pages responde com `cache-control: max-age=600`; após o commit v2, o reload normal mostrou v1, e a URL com `?v=…` mostrou v2 ~45 s após o commit. Candidato a instrução da Aula 4, mas **não exibido ao aluno** até o Gate em Android físico confirmar (incluindo pull-to-refresh). Revalidação emulada de 2026-10-01: `?v=…` e reload mostraram a versão nova; reabrir a URL limpa mostrou versão antiga.
- **Editor (EMULAÇÃO, 2026-10-01):** o editor do GitHub fecha tags automaticamente — candidato a aviso na aula ("digite só `<h1>texto`"), pendente de confirmação com Gboard no Android físico.
- Rota Vercel fica fora do MVP; reteste possível apenas com template que tenha preset de framework.
- **2026-10-01 — aplicado ao conteúdo do aluno (decisão do dono, para a venda da turma fundadora):** o roteiro do Módulo 01 (`lib/aulas/modulo-01.ts`) passou a exibir cache/`?v=…` + reload, auto-fechamento de tag, tradução automática do Chrome e links diretos do GitHub. Cada aula informa que o fluxo foi testado em **ambiente móvel emulado**, não em Android físico. Revisar o roteiro quando o Gate em Android físico rodar (pull-to-refresh, Gboard).

## Artefatos do teste

- `Mansonware/dnb-gate1-pages` (público) — Rota A
- `Mansonware/dnb-gate1-vercel` (privado) + projeto Vercel `dnb-gate1-vercel` — Rota B
