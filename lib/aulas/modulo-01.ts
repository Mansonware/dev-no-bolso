// Roteiro do Módulo 01 — "Do zero ao seu site no ar".
// Baseado no Gate #1 (docs/gate-1-mobile-publish-spike.md): fluxo validado só em ambiente móvel EMULADO.
// Não escrever aqui nada que afirme teste em Android físico.
//
// Convenções do texto:
//   `trecho`   → renderizado como código (sem tradução automática).
//   {usuario}  → trocado pelo usuário do GitHub que o aluno digita na aula (links diretos).

export type Passo = {
  texto: string;
  /** Link direto do GitHub. Pode conter {usuario}. */
  link?: string;
  /** Bloco de código para copiar. */
  codigo?: string;
};

export type Aviso = { titulo: string; texto: string };

export type ConteudoAula = {
  teoria: string[];
  passos: Passo[];
  avisos: Aviso[];
  validacao: string[];
};

export const REPO = "meu-primeiro-site";

const MODELO_INDEX = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Meu primeiro site</title>
</head>
<body>
  <h1>Meu primeiro site - v1</h1>
  <p>Feito pelo celular.</p>
</body>
</html>`;

const AVISO_TRADUCAO: Aviso = {
  titulo: "Desligue a tradução automática do Chrome no GitHub",
  texto:
    "A tradução troca palavras dentro do código: `<body>` vira `<corpo>`, `<head>` vira `<cabeça>`, e o site quebra. Se o Chrome perguntar se quer traduzir o GitHub, recuse e escolha \"Nunca traduzir este site\". Sinal de que ela está ligada: botões estranhos como \"Comprometa-se\" ou \"Culpa\". Copie o código sempre daqui da aula, nunca da tela do GitHub traduzida.",
};

const AVISO_AUTO_TAG: Aviso = {
  titulo: "O editor do GitHub fecha as tags sozinho",
  texto:
    "Quando você digita `<h1>`, o editor já coloca o `</h1>` no final. Se você digitar o fechamento também, fica `</h1></h1>` repetido. Ao digitar, escreva só a abertura e o texto (ex.: `<h1>Meu texto`). Colar o código pronto não tem esse problema.",
};

const AVISO_CACHE: Aviso = {
  titulo: "Mudou e o site ainda mostra a versão antiga? Não é erro",
  texto:
    "O navegador guarda uma cópia do seu site por até 10 minutos. Por isso, ao abrir o link de novo, ele pode mostrar a versão antiga mesmo com a nova já publicada. Solução: coloque `?v=2` no fim do endereço (na próxima mudança `?v=3`, depois `?v=4`…) ou recarregue a página.",
};

export const conteudoModulo01: Record<string, ConteudoAula> = {
  "m1-l1": {
    teoria: [
      "O GitHub é onde o código do seu site vai morar. Ele também publica o site de graça, com o GitHub Pages.",
      "O seu nome de usuário vira parte do endereço do site: `seu-usuario.github.io`. Por isso escolha um nome curto, em minúsculas e sem espaços.",
    ],
    passos: [
      {
        texto: "Abra a página de cadastro do GitHub pelo Chrome do celular. Se você já tem conta, só entre nela e pule para o passo 4.",
        link: "https://github.com/signup",
      },
      { texto: "Cadastre o seu e-mail, uma senha e o nome de usuário (curto, minúsculo, sem espaços)." },
      { texto: "Confirme o código que o GitHub manda para o seu e-mail." },
      { texto: "Anote o seu nome de usuário. Você vai usar ele em todas as aulas." },
    ],
    avisos: [AVISO_TRADUCAO],
    validacao: [
      "Ao abrir `github.com/seu-usuario`, aparece o seu perfil.",
      "Você sabe o seu nome de usuário de cor (ou anotado).",
    ],
  },
  "m1-l2": {
    teoria: [
      "Um repositório é a pasta do seu projeto dentro do GitHub.",
      "O `index.html` é a página inicial do site: é o primeiro arquivo que o navegador abre.",
    ],
    passos: [
      {
        texto:
          "Abra o link direto para criar um repositório (no celular o botão \"New\" fica escondido no menu ☰).",
        link: "https://github.com/new",
      },
      {
        texto: `Em "Repository name", escreva \`${REPO}\`. Deixe marcado "Public", marque "Add a README" e toque em "Create repository".`,
      },
      {
        texto: "Abra o link direto para criar um arquivo novo no seu repositório.",
        link: `https://github.com/{usuario}/${REPO}/new/main`,
      },
      { texto: "No campo do nome do arquivo, escreva `index.html` (tudo minúsculo)." },
      {
        texto: "Copie o código abaixo pelo botão \"Copiar\" e cole inteiro no editor, de uma vez:",
        codigo: MODELO_INDEX,
      },
      {
        texto:
          "Toque em \"Commit changes…\". Na janela que abrir, deixe \"Commit directly to the main branch\" e toque em \"Commit changes\" de novo. Se a mensagem sugerida estiver em inglês, pode deixar.",
      },
    ],
    avisos: [AVISO_TRADUCAO, AVISO_AUTO_TAG],
    validacao: [
      "O arquivo `index.html` aparece na lista do repositório.",
      "Ao abrir o arquivo, aparece `<body>` (e não `<corpo>`) e só um `</h1>` na linha do título.",
    ],
  },
  "m1-l3": {
    teoria: [
      "O GitHub Pages pega o seu `index.html` e coloca na internet, com HTTPS, de graça.",
      `O endereço do seu site vai ser \`https://seu-usuario.github.io/${REPO}/\`.`,
    ],
    passos: [
      {
        texto: "Abra o link direto das configurações do GitHub Pages do seu repositório.",
        link: `https://github.com/{usuario}/${REPO}/settings/pages`,
      },
      {
        texto:
          "A página abre mostrando um menu comprido no topo e parece que nada aconteceu. Role para baixo até \"Build and deployment\".",
      },
      {
        texto:
          "Em \"Source\", escolha \"Deploy from a branch\". Em \"Branch\", escolha `main` e a pasta `/(root)`. Toque em \"Save\".",
      },
      {
        texto:
          "Espere mais ou menos 1 minuto e recarregue a página. Quando aparecer \"Your site is live at…\", toque em \"Visit site\". Cuidado: o botão vermelho \"Unpublish site\" fica colado nele — não toque nesse.",
      },
      {
        texto: "Apareceu erro 404? O GitHub ainda está publicando. Espere mais 1 minuto e recarregue.",
      },
    ],
    avisos: [AVISO_TRADUCAO],
    validacao: [
      `O endereço \`https://seu-usuario.github.io/${REPO}/\` abre o seu site.`,
      "Aparece o título \"Meu primeiro site - v1\".",
      "Você salvou esse link nos favoritos.",
    ],
  },
  "m1-l4": {
    teoria: [
      "Cada vez que você salva uma mudança no GitHub (o \"commit\"), o GitHub Pages publica o site de novo. Leva mais ou menos 1 minuto.",
      "O navegador guarda uma cópia do site por alguns minutos. Então, depois de mudar, use `?v=2` no fim do endereço para ver a versão nova na hora.",
    ],
    passos: [
      {
        texto: "Abra o link direto do editor do seu `index.html` (ele pula o menu \"…\" → \"Edit file\").",
        link: `https://github.com/{usuario}/${REPO}/edit/main/index.html`,
      },
      {
        texto:
          "Na linha do título, toque logo depois do `v1`, apague só o `1` e digite `2`. Evite o toque duplo para selecionar: ele costuma pegar o espaço do lado.",
      },
      { texto: "Toque em \"Commit changes…\" e confirme em \"Commit changes\"." },
      {
        texto: "Espere mais ou menos 1 minuto e abra o seu site com `?v=2` no fim do endereço:",
        link: `https://{usuario}.github.io/${REPO}/?v=2`,
      },
      {
        texto:
          "Ainda aparece v1? Recarregue a página (↻ no menu do Chrome). Se não mudar, espere mais 1 minuto e tente de novo. Nas próximas mudanças use `?v=3`, `?v=4`… — cada número novo força a versão mais recente.",
      },
    ],
    avisos: [AVISO_CACHE, AVISO_AUTO_TAG, AVISO_TRADUCAO],
    validacao: [
      "O seu site mostra \"Meu primeiro site - v2\".",
      "Você entendeu por que abrir o link sem `?v=…` pode mostrar a versão antiga por alguns minutos.",
    ],
  },
};
