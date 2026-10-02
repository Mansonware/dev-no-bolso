# DEV NO BOLSO — Turma Fundadora #01

Landing page de alta conversão para o treinamento **DEV NO BOLSO**, desenvolvida com Next.js (App Router), TypeScript, Tailwind CSS, integração com Checkout Pro do Mercado Pago e deploy na Vercel.

## 🚀 Tecnologias

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4 (Design Dark Tecnológico)
- **Ícones**: Lucide React
- **Processamento de Pagamentos**: Mercado Pago Checkout Pro
- **Hospedagem & CI/CD**: Vercel

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz baseado no `.env.example`:

```env
# Access Token oficial do Mercado Pago (produção ou teste)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...

# WhatsApp da Administração (formato internacional somente com dígitos)
NEXT_PUBLIC_ADMIN_WHATSAPP=5512991070038

# URL Base do site (usada para back_urls e webhooks)
NEXT_PUBLIC_SITE_URL=https://dev-no-bolso.vercel.app

# Recomendado: segredo exclusivo para cookies/códigos de acesso.
# Se não existir, o MVP mantém compatibilidade derivando a chave do token server-side do Mercado Pago.
COURSE_ACCESS_SECRET=gere-um-segredo-longo-e-aleatorio

# Recomendado: segredo configurado em Mercado Pago > Webhooks.
MERCADOPAGO_WEBHOOK_SECRET=segredo-do-webhook
```

> **Aviso de Segurança:** Nunca versione arquivos `.env.local` ou credenciais privadas no repositório.

## 📦 Como Rodar Localmente

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🛡️ Fluxo de Pagamento e Segurança

1. **Backend**: O preço de R$ 97,00 (10 vagas da Turma Fundadora) é definido em `lib/offer.ts` e enviado ao Mercado Pago só pelo servidor (`lib/mercadopago.ts`), tornando impossível qualquer manipulação de preço pelo cliente.
2. **Checkout Pro**: Ao clicar em "Garantir Minha Vaga", o backend gera uma preferência oficial na API do Mercado Pago e redireciona o usuário.
3. **Validação Server-Side**: A página de retorno não confia em query params (`?status=approved`). Ela envia o ID para `POST /api/access/claim`, que consulta diretamente a API do Mercado Pago e valida valor, moeda, status e referência.\n4. **Acesso Web**: Somente após a validação aprovada o servidor cria uma sessão criptografada em cookie `HttpOnly`, válida por 180 dias, e libera `/aluno/*`. O WhatsApp é usado apenas para suporte.\n5. **Chave da sessão**: O MVP deriva uma chave separada para a sessão a partir do token server-side do Mercado Pago usando HMAC com contexto próprio. O ID do pagamento não fica em texto puro no cookie. Rotacionar o token do Mercado Pago invalida sessões existentes.

## 🔐 Acesso web V2

- O Mercado Pago é a fonte de verdade para pagamentos aprovados da oferta de R$97.
- A contagem das 10 vagas consulta `/v1/payments/search` por `external_reference` e valida novamente preço, moeda, status e produto. Redis é apenas contingência.
- Ao confirmar o pagamento, o site cria uma sessão `HttpOnly` e gera um código portátil no formato `DNB-...`.
- O código permite entrar em outro navegador/aparelho sem grupo ou liberação pelo WhatsApp.
- Ao abrir a área do aluno, o servidor reconsulta o pagamento. Se ele não estiver mais aprovado, a sessão deixa de liberar o curso.
- Quando `MERCADOPAGO_WEBHOOK_SECRET` estiver configurado, notificações com assinatura inválida são rejeitadas.
- O WhatsApp permanece somente como suporte excepcional.

> Rotacionar `COURSE_ACCESS_SECRET` invalida cookies e códigos de acesso emitidos com a chave anterior.

## 📄 Licença

Uso exclusivo do projeto DEV NO BOLSO.
