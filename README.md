# Dev no Bolso

Curso prático para iniciantes aprenderem programação do zero e publicarem o primeiro projeto usando apenas o celular, com IA como ferramenta de apoio. Preço: **R$ 45,99, pagamento único**.

Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Mercado Pago Checkout Pro, Upstash Redis (contas, sessões e analytics) e deploy na Vercel.

## Rotas principais

| Rota | O que é |
|---|---|
| `/` | Landing de conversão |
| `/experimentar` | Missão grátis, sem login: edita HTML e vê o resultado no navegador |
| `/pagamento/sucesso` | Valida o pagamento no servidor e mostra o "Comece aqui" (conta → Aula 1) |
| `/pagamento/pendente`, `/pagamento/falhou` | Retornos do Mercado Pago |
| `/cadastro?payment_id=…` | Cria a conta — só com pagamento aprovado e o mesmo e-mail da compra |
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
```

## Pagamento

1. O preço é fixado no servidor a partir de `lib/offer.ts` (fonte única de preço e textos de CTA).
2. `POST /api/checkout` cria a preferência no Mercado Pago e o navegador é redirecionado ao Checkout Pro.
3. A página de sucesso não confia em query params: consulta `GET /api/payment/[paymentId]`, que valida status, valor (em centavos), moeda e referência direto na API do Mercado Pago.
4. Após a confirmação, o botão "Criar minha conta" leva a `/cadastro?payment_id=<id>`. O WhatsApp aparece só como suporte.
5. O webhook reconsulta o pagamento antes de registrar a venda e valida a assinatura quando `MERCADOPAGO_WEBHOOK_SECRET` estiver configurado.

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
| `first_lesson_start` | Primeira aula paga aberta no navegador |

Chaves no Upstash: `dev_no_bolso:funnel:total` e `dev_no_bolso:funnel:day:YYYY-MM-DD` (hashes `campo → contagem`). Sem Redis configurado, os eventos são ignorados em silêncio.

## Aviso

O Dev no Bolso ensina habilidades práticas de programação, uso de IA e publicação de projetos. Não promete renda, emprego ou ganho financeiro.
