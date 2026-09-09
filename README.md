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

1. **Backend**: O preço de R$ 20,00 é fixado estritamente no servidor (`lib/mercadopago.ts`), tornando impossível qualquer manipulação de preço pelo cliente.
2. **Checkout Pro**: Ao clicar em "Garantir Minha Vaga", o backend gera uma preferência oficial na API do Mercado Pago e redireciona o usuário.
3. **Validação Server-Side**: A página de retorno não confia em query params (`?status=approved`). Ela consulta diretamente a API do Mercado Pago via `GET /api/payment/[paymentId]` e valida valor, moeda, status e referência antes de exibir a confirmação e abrir o WhatsApp da administração.

## 📄 Licença

Uso exclusivo do projeto DEV NO BOLSO.
