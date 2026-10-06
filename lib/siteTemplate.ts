// Modelo de index.html entregue na Aula 2. O aluno copia, cola no GitHub e troca os textos.
// Arquivo único (HTML + CSS), sem JavaScript e sem dependências externas: funciona no GitHub Pages
// e é fácil de editar pelo celular. Os textos entre os comentários são os que ele deve trocar.

export const SITE_TEMPLATE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seu Nome</title>
  <style>
    body {
      margin: 0;
      font-family: system-ui, sans-serif;
      background: #0b0f0d;
      color: #f2f5f3;
      line-height: 1.6;
    }
    main {
      max-width: 560px;
      margin: 0 auto;
      padding: 48px 20px;
    }
    h1 { font-size: 2.2rem; margin: 0 0 8px; }
    .destaque { color: #00e07a; }
    ul { padding-left: 20px; }
    a.botao {
      display: inline-block;
      margin-top: 16px;
      padding: 14px 22px;
      background: #00e07a;
      color: #0b0f0d;
      border-radius: 12px;
      font-weight: bold;
      text-decoration: none;
    }
    footer { margin-top: 48px; font-size: 0.85rem; color: #8a9690; }
  </style>
</head>
<body>
  <main>
    <!-- Troque pelo seu nome -->
    <h1>Olá, eu sou <span class="destaque">Seu Nome</span></h1>

    <!-- Troque pela sua apresentação -->
    <p>Estou aprendendo programação e este é o primeiro site que eu publiquei, feito pelo celular.</p>

    <h2>O que eu gosto</h2>
    <ul>
      <li>Coisa que você gosta 1</li>
      <li>Coisa que você gosta 2</li>
      <li>Coisa que você gosta 3</li>
    </ul>

    <!-- Troque o link pelo seu Instagram, WhatsApp ou e-mail -->
    <a class="botao" href="https://github.com">Fale comigo</a>

    <footer>Feito no Dev no Bolso</footer>
  </main>
</body>
</html>
`;
