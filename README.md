# Dev no Bolso

Curso prático para iniciantes aprenderem programação do zero e publicarem o primeiro projeto usando apenas o celular, com IA como ferramenta de apoio. Preço: **R$ 45,99, pagamento único**.

Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Mercado Pago Checkout Pro, Upstash Redis (contas, sessões e analytics) e deploy na Vercel.

## Rotas principais

| Rota | O que é |
|---|---|
| `/` | Landing de conversão |
| `/experimentar` | Missão grátis, sem login: edita HTML e vê o resultado no navegador |
| `/pagamento/sucesso`, `/pagamento/pendente` | Valida o pagamento no servidor e mostra o próximo passo (criar conta, aguardar Pix, tentar de novo). Verifica sozinho enquanto estiver pendente |
| `/pagamento/falhou` | Pagamento recusado/cancelado |
| `/cadastro` | Recuperação de acesso: quem pagou e fechou a página digita o número do pagamento do comprovante |
| `/cadastro?payment_id=…` | Confere a compra no servidor e cria a conta — só com pagamento aprovado e o mesmo e-mail da compra |
| `/login` | Entrar com e-mail e senha |
| `/aluno/**` | Área do aluno (exige sessão; sem ela → `/login?next=…`) |

## Variáveis de ambiente

Crie `.env.local` a partir do `.env.example`:

```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...      # sem ele, /api/checkout responde 503 e o botão mostra aviso
MERCADOPAGO_WEBHOOK_SECRET=               # opcional e recomendado: valida assinatura do webhook
NEXT_PUBLIC_ADMIN_WHATSAPP=5512991070038  # WhatsApp só para suporte
NEXT_PUBLIC_SITE_URL=https://dev-no-bolso.vercel.app
UPSTASH_REDIS_REST_URL=                   # obrigatório para login/cadastro (sem ele, auth responde 503)
UPSTASH_REDIS_REST_TOKEN=
# Alternativa da integração Vercel: KV_REST_API_URL + KV_REST_API_TOKEN
```

> Nunca versione `.env.local` ou credenciais.

## Rodando localmente

```bash
npm install
npm run dev
npm test        # regras críticas: pagamento, webhook, sessão, progresso, validação
npm run lint
npm run build
```

## Curso e progresso

- Conteúdo das aulas: `lib/course.ts` (dado puro). Uma aula nova é só texto nesse arquivo — a tela é uma só (`components/dashboard/lessons/LessonView.tsx`).
- Modelo de `index.html` da Aula 2: `lib/siteTemplate.ts`. Atalhos para o GitHub em cada missão: `lib/githubLinks.ts`.
- Progresso por aluno no Redis: `dev_no_bolso:progress:<sha256(email)>` (hash `done:<aula>`, `github`, `repo`, `site`).
- `POST /api/progress` conclui uma aula: exige sessão, recusa aula bloqueada e valida a entrega no servidor.
- Trilha sequencial: cada aula libera a próxima quando é concluída.

## Pagamento

1. O preço é fixado no servidor a partir de `lib/offer.ts` (fonte única de preço e textos de CTA).
2. `POST /api/checkout` cria a preferência no Mercado Pago e o navegador é redirecionado ao Checkout Pro.
3. A página de sucesso não confia em query params: consulta `GET /api/payment/[paymentId]`, que valida status, valor (em centavos), moeda e referência direto na API do Mercado Pago.
4. Após a confirmação, o botão "Criar minha conta" leva a `/cadastro?payment_id=<id>`. O WhatsApp aparece só como suporte.
5. O webhook reconsulta o pagamento antes de registrar a venda e valida a assinatura quando `MERCADOPAGO_WEBHOOK_SECRET` estiver configurado. Pagamento inexistente responde 200 (sem loop de reenvio); só falha temporária do Mercado Pago responde 500.
6. Estados exibidos ao comprador (`lib/paymentCore.ts`): aprovado, pendente, recusado, devolvido, inválido (outro produto/valor), não encontrado, indisponível.

## Acesso, reembolso e limites (regras únicas, testadas)

| Regra | Onde |
|---|---|
| Classificar o pagamento (produto, valor em centavos, moeda, referência, status) | `lib/paymentCore.ts` → `classifyPayment` |
| Pode virar conta? (aprovado, do produto, e-mail da compra) | `lib/paymentCore.ts` → `checkSignupEligibility` |
| Limite de consultas de pagamento (por IP, números distintos por IP, por pagamento) | `lib/paymentGuardCore.ts`; usado pela API de status, pelo `/cadastro` e pelo cadastro |
| Acesso ao conteúdo (`active` / `revoked`) | `lib/entitlementCore.ts` |
| Webhook: reconsulta, venda idempotente, acesso, replay | `lib/webhookCore.ts` |

- **Reembolso ou chargeback** revoga o acesso (`dev_no_bolso:entitlement:<paymentId>`). Conta e progresso ficam guardados; `/aluno` leva para `/acesso-suspenso`. Se o pagamento voltar a `approved`, o acesso volta.
- **Revisão diária:** se o webhook falhar, a área do aluno reconfere o pagamento no Mercado Pago no máximo 1x por dia, depois da resposta.
- **Webhook:** assinatura obrigatória quando `MERCADOPAGO_WEBHOOK_SECRET` existe; `ts` no futuro é recusado; a mesma notificação assinada já processada é só confirmada (TTL 7 dias). `ts` antigo NÃO é recusado, porque o Mercado Pago reenvia a cada 15 min por bastante tempo.
- **Uma compra = uma conta:** script Lua atômico em `lib/redisScripts.ts`, testado num `redis-server` real.

## Contas e sessões

Sem serviço externo de auth: o Mercado Pago é a prova de compra e o Upstash Redis guarda usuários e sessões.

- `POST /api/auth/register` consulta o pagamento de novo no Mercado Pago (status, valor, moeda, referência) e exige que o e-mail digitado seja o `payer.email` da compra. Sem `payer.email`, o cadastro é recusado e o aluno é orientado a chamar o suporte.
- Cada pagamento cria no máximo uma conta: a reivindicação do pagamento e a criação do usuário acontecem num único script Lua (atômico) no Redis.
- Senha com `scrypt` + salt aleatório por usuário; comparação com `timingSafeEqual`.
- Sessão: token aleatório de 32 bytes em cookie `HttpOnly`, `SameSite=Lax`, `Secure` em produção, 30 dias. No Redis fica só o SHA-256 do token.
- `POST /api/auth/login` e `POST /api/auth/logout`. Login e cadastro têm limite de tentativas (10 a cada 15 min por e-mail / por pagamento).
- Sem Redis configurado, login e cadastro respondem 503 e `/aluno` continua fechado.
- Não há recuperação de senha automática: o link "Esqueceu a senha?" leva ao suporte.

Chaves: `dev_no_bolso:auth:user:<sha256(email)>`, `dev_no_bolso:auth:payment:<paymentId>`, `dev_no_bolso:auth:session:<sha256(token)>`, `dev_no_bolso:auth:rl:*`.

## Analytics do funil

First-party, mínimo e sem PII (sem IP, user agent, cookie ou e-mail). O navegador envia só o nome do evento (e, no clique de compra, a posição do botão) para `POST /api/events`, que grava contadores agregados no Redis.

| Evento | Quando |
|---|---|
| `landing_view` | Landing exibida (1x por sessão) |
| `experimentar_start` | Início da missão grátis (1x por sessão) |
| `experimentar_complete` | Missão grátis concluída (1x por sessão) |
| `checkout_click` | Clique em botão de compra; também conta por posição |
| `checkout_created` | Preferência de checkout criada antes do redirecionamento |
| `payment_success` | Pagamento aprovado validado no servidor (1x por pagamento) |
| `signup_complete` | Cadastro pago concluído |
| `student_area_view` | Área do aluno aberta (1x por sessão) |
| `first_lesson_start` | Primeira aula paga aberta no navegador |
| `first_lesson_complete` | Aula 1 concluída (servidor) |
| `course_complete` | Última aula concluída (servidor) |

Chaves no Upstash: `dev_no_bolso:funnel:total` e `dev_no_bolso:funnel:day:YYYY-MM-DD` (hashes `campo → contagem`). Sem Redis configurado, os eventos são ignorados em silêncio.

## Aviso

O Dev no Bolso ensina habilidades práticas de programação, uso de IA e publicação de projetos. Não promete renda, emprego ou ganho financeiro.
