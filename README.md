# Dev no Bolso

Curso prático para iniciantes aprenderem programação do zero e publicarem o primeiro projeto usando apenas o celular, com IA como ferramenta de apoio. Preço: **R$ 45,99, pagamento único**.

Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Mercado Pago Checkout Pro, Upstash Redis (opcional) e deploy na Vercel.

## Rotas principais

| Rota | O que é |
|---|---|
| `/` | Landing de conversão |
| `/experimentar` | Missão grátis, sem login: edita HTML e vê o resultado no navegador |
| `/pagamento/sucesso` | Valida o pagamento no servidor e mostra o "Comece aqui" (conta → Aula 1) |
| `/pagamento/pendente`, `/pagamento/falhou` | Retornos do Mercado Pago |
| `/login`, `/cadastro`, `/aluno/**` | Plataforma do aluno (**autenticação ainda é mock**) |

## Variáveis de ambiente

Crie `.env.local` a partir do `.env.example`:

```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...      # sem ele, /api/checkout responde 503 e o botão mostra aviso
NEXT_PUBLIC_ADMIN_WHATSAPP=5512991070038  # WhatsApp só para suporte
NEXT_PUBLIC_SITE_URL=https://dev-no-bolso.vercel.app
UPSTASH_REDIS_REST_URL=                   # opcional (analytics + registro de vendas)
UPSTASH_REDIS_REST_TOKEN=
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
4. Após a confirmação, o aluno segue para criar a conta e abrir a Aula 1. O WhatsApp aparece só como suporte.

## Analytics do funil

First-party, mínimo e sem PII (sem IP, user agent, cookie ou e-mail). O navegador envia só o nome do evento (e, no clique de compra, a posição do botão) para `POST /api/events`, que grava contadores agregados no Redis.

| Evento | Quando |
|---|---|
| `landing_view` | Landing exibida (1x por sessão) |
| `free_mission_start` | Clique em "Começar a missão" (1x por sessão) |
| `free_mission_complete` | Missão concluída (1x por sessão) |
| `checkout_click` | Clique em qualquer botão de compra; também conta por posição: `checkout_click:hero`, `:offer`, `:final`, `:mission` |
| `purchase_approved` | Pagamento validado no servidor (1x por pagamento) |

Chaves no Upstash: `dev_no_bolso:funnel:total` e `dev_no_bolso:funnel:day:YYYY-MM-DD` (hashes `campo → contagem`). Sem Redis configurado, os eventos são ignorados em silêncio.

## Aviso

O Dev no Bolso ensina habilidades práticas de programação, uso de IA e publicação de projetos. Não promete renda, emprego ou ganho financeiro.
