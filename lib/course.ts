// Catálogo do curso: estrutura e conteúdo das aulas.
// Dado puro (sem imports, sem JSX): roda no servidor, no navegador e nos testes com `node --test`.
// O progresso de cada aluno NÃO mora aqui — fica no Redis (lib/progress.ts).
//
// Texto com `crase` vira <code> na tela (ver components/dashboard/lessons/RichText.tsx).

export type DeliveryKind = "github" | "repo" | "site" | "confirm";

export type LessonContent = {
  id: string;
  title: string;
  objective: string;
  theory: {
    heading: string;
    paragraphs: string[];
    cards: { label: string; title: string; text: string }[];
  };
  mission: {
    heading: string;
    steps: { title: string; description: string }[];
    tips: string[];
    /** Mostra o modelo de index.html com botão de copiar. */
    showTemplate?: boolean;
    /** Prompt pronto para pedir ajuda a uma IA (ChatGPT, Gemini, Claude...). */
    aiPrompt: string;
  };
  delivery: {
    heading: string;
    kind: DeliveryKind;
    label: string;
    help: string;
    expectedFormat: string;
  };
};

export type ModuleContent = {
  id: string;
  number: string;
  title: string;
  summary: string;
  lessons: LessonContent[];
};

export const PROJECT_NAME = "meu-primeiro-site";

export const COURSE: ModuleContent[] = [
  {
    id: "m1",
    number: "01",
    title: "Do zero ao seu site no ar",
    summary: "Do zero até uma URL pública, e depois uma alteração online. Pelo celular.",
    lessons: [
      {
        id: "m1-l1",
        title: "Sua conta no GitHub",
        objective: "Ter uma conta no GitHub e saber o seu nome de usuário.",
        theory: {
          heading: "Onde o seu código — e depois o seu site — vai morar",
          paragraphs: [
            "O GitHub é uma plataforma gratuita para guardar código. Neste módulo, sua conta é a chave de acesso para todo o resto: criar um repositório, publicar um site e, mais tarde, alterá-lo pelo celular.",
            "O nome de usuário que você escolher vai aparecer no endereço do seu site. Prefira algo curto, sem espaços, que você goste de mostrar.",
          ],
          cards: [
            { label: "Agora", title: "Sua conta", text: "A chave de acesso a tudo que vem depois no módulo." },
            { label: "Aula 2", title: "Seu repositório", text: "A pasta pública onde o código do seu site vai ficar." },
            { label: "Aula 3", title: "Site no ar", text: "O momento em que tudo isso vira uma URL pública." },
          ],
        },
        mission: {
          heading: "Criar sua conta no GitHub",
          steps: [
            {
              title: "Abrir a página de cadastro do GitHub",
              description: "Use o botão acima. Ele abre o cadastro numa nova aba — esta aula continua aberta aqui.",
            },
            {
              title: "Preencher e-mail, senha e nome de usuário",
              description: "O nome de usuário fica público. Use letras, números e hífen, sem espaços.",
            },
            {
              title: "Confirmar a verificação pedida pelo GitHub",
              description: "Pode ser um código enviado por e-mail ou um teste de segurança. Siga o que aparecer na tela.",
            },
            {
              title: "Anotar o seu nome de usuário",
              description: "Ele vai aparecer na URL do seu site. Você vai digitá-lo aqui na entrega da aula.",
            },
          ],
          tips: [
            "O código de verificação chega no e-mail. Se não aparecer, olhe a pasta de spam ou promoções.",
            "Se o GitHub perguntar sobre planos pagos, escolha o gratuito (Free). Ele é suficiente para o curso inteiro.",
          ],
          aiPrompt:
            "Estou criando minha primeira conta no GitHub pelo celular. Me sugira 5 nomes de usuário curtos, profissionais e fáceis de lembrar baseados no meu nome: [SEU NOME]. Explique em uma frase por que o nome de usuário importa.",
        },
        delivery: {
          heading: "Qual é o seu usuário no GitHub?",
          kind: "github",
          label: "Seu nome de usuário no GitHub",
          help: "Só o nome, sem o endereço completo. Ex.: maria-dev",
          expectedFormat: "seu-usuario",
        },
      },
      {
        id: "m1-l2",
        title: "Seu primeiro repositório e o index.html",
        objective: "Criar um repositório público com o index.html do modelo do curso.",
        theory: {
          heading: "A pasta do seu projeto e a porta de entrada do site",
          paragraphs: [
            "Um repositório é a pasta pública onde os arquivos do seu projeto ficam guardados no GitHub.",
            "O arquivo `index.html` é o que o navegador abre primeiro quando alguém visita o seu site. Nesta aula você cria esse arquivo a partir de um modelo pronto e já coloca o seu nome nele.",
          ],
          cards: [
            { label: "Aula 1", title: "Sua conta", text: "Já criada — é o que te dá acesso aqui." },
            { label: "Agora", title: "Repositório + index.html", text: "A pasta pública do projeto e o arquivo que vira o site." },
            { label: "Aula 3", title: "Site no ar", text: "Onde esse repositório vira uma URL pública." },
          ],
        },
        mission: {
          heading: "Criar o repositório e o index.html",
          showTemplate: true,
          steps: [
            {
              title: "Criar um repositório novo",
              description: "Use o botão “Criar repositório” acima. Ele abre a tela certa do GitHub numa nova aba.",
            },
            {
              title: "Dar o nome meu-primeiro-site e deixar como Public",
              description: "Use exatamente `meu-primeiro-site` e mantenha a visibilidade Public. Depois toque em “Create repository”.",
            },
            {
              title: "Criar o index.html com o modelo",
              description: "Volte aqui e toque em “Criar index.html com o modelo”, acima. O GitHub abre o editor já com o modelo do curso dentro. Se abrir vazio, copie o modelo abaixo e cole.",
            },
            {
              title: "Trocar pelo seu nome",
              description: "No editor, troque “Seu Nome”, a frase de apresentação e a lista pelo que você quiser.",
            },
            {
              title: "Salvar com “Commit changes”",
              description: "Toque em “Commit changes” e confirme. Pronto: o arquivo está salvo no seu repositório.",
            },
          ],
          tips: [
            "Para colar no celular, segure o dedo dentro do editor do GitHub até aparecer a opção “Colar”.",
            "Se o editor ficar pequeno, gire o celular na horizontal ou use o zoom do navegador.",
          ],
          aiPrompt:
            "Sou iniciante em HTML. Vou te mandar o código do meu index.html. Explique linha por linha, em português simples, o que cada parte faz, e me diga quais textos posso trocar sem quebrar nada:\n\n[COLE AQUI O SEU CÓDIGO]",
        },
        delivery: {
          heading: "Mande o link do seu repositório",
          kind: "repo",
          label: "Link do repositório",
          help: "Copie da barra de endereço do navegador quando estiver dentro do repositório.",
          expectedFormat: "https://github.com/seu-usuario/meu-primeiro-site",
        },
      },
      {
        id: "m1-l3",
        title: "Seu site no ar com GitHub Pages",
        objective: "Ativar o GitHub Pages e abrir o seu site pela primeira vez.",
        theory: {
          heading: "Como seu site vai do repositório para a internet",
          paragraphs: [
            "Na aula anterior você colocou o `index.html` dentro do GitHub. Só que um repositório é apenas um lugar para guardar código — ele ainda não funciona como uma página que qualquer pessoa pode abrir.",
            "O GitHub Pages é um serviço gratuito do próprio GitHub que pega os arquivos do seu repositório e publica como um site, com um endereço público.",
          ],
          cards: [
            { label: "Feito", title: "Código salvo", text: "Seu repositório guarda o index.html do projeto." },
            { label: "Agora", title: "GitHub Pages", text: "O GitHub liga um servidor público e gratuito para o seu site." },
            { label: "Resultado", title: "URL pública", text: "Um link que abre em qualquer celular ou computador." },
          ],
        },
        mission: {
          heading: "Ativar o GitHub Pages pelo celular",
          steps: [
            {
              title: "Abrir as configurações de Pages do repositório",
              description: "Use o botão acima. Se ele não abrir a tela certa, entre no repositório → Settings → Pages.",
            },
            {
              title: "Escolher “Deploy from a branch”",
              description: "Em Build and deployment → Source, deixe selecionado “Deploy from a branch”.",
            },
            {
              title: "Selecionar a branch main e a pasta / (root)",
              description: "Em Branch, escolha `main` e a pasta `/ (root)`. Depois toque em Save.",
            },
            {
              title: "Esperar e abrir o seu site",
              description: "Em 1 ou 2 minutos aparece no topo da página “Your site is live at…”. Toque no link para abrir.",
            },
          ],
          tips: [
            "No celular, a aba Settings às vezes fica escondida: role a barra de abas do repositório para o lado.",
            "Se o link der erro 404 logo no começo, espere mais um ou dois minutos e atualize. A primeira publicação pode levar até 10 minutos.",
          ],
          aiPrompt:
            "Ativei o GitHub Pages no meu repositório, mas o meu site não abre. Ele aparece assim: [DESCREVA O QUE APARECE OU A MENSAGEM DE ERRO]. Meu repositório se chama meu-primeiro-site e o arquivo principal é index.html. O que pode estar errado? Me dê os passos para resolver pelo celular.",
        },
        delivery: {
          heading: "Mande o link do seu site no ar",
          kind: "site",
          label: "Endereço do seu site",
          help: "É o link que aparece em “Your site is live at…”.",
          expectedFormat: "https://seu-usuario.github.io/meu-primeiro-site/",
        },
      },
      {
        id: "m1-l4",
        title: "Alterar e republicar",
        objective: "Mudar o site e ver a alteração aparecer online.",
        theory: {
          heading: "O ciclo que você vai repetir sempre que quiser mudar o site",
          paragraphs: [
            "Seu site já está no ar. Agora você fecha o ciclo completo: muda algo no código e vê essa alteração aparecer na mesma URL pública, sem publicar nada do zero.",
            "Esse ciclo — editar, salvar (commit) e esperar a publicação automática — é o mesmo que desenvolvedores usam todo dia em projetos grandes.",
          ],
          cards: [
            { label: "1", title: "Editar", text: "Mudar o index.html direto pelo navegador do celular." },
            { label: "2", title: "Commit", text: "Salvar a alteração na branch main." },
            { label: "3", title: "Nova versão online", text: "O GitHub Pages publica sozinho, na mesma URL." },
          ],
        },
        mission: {
          heading: "Alterar e republicar seu site",
          steps: [
            {
              title: "Abrir o index.html para editar",
              description: "Use o botão acima. Ele abre o editor do arquivo no GitHub numa nova aba.",
            },
            {
              title: "Mudar um texto do site",
              description: "Troque a frase de apresentação, adicione um item na lista ou mude a cor. Pequeno já vale.",
            },
            {
              title: "Salvar com “Commit changes”",
              description: "Toque em “Commit changes” e confirme direto na branch main.",
            },
            {
              title: "Abrir o seu site e conferir",
              description: "Espere 1 ou 2 minutos e abra o seu site. A alteração deve aparecer no mesmo endereço.",
            },
          ],
          tips: [
            "Se a alteração não aparecer, espere mais um pouco e atualize a página. O navegador do celular às vezes mostra a versão guardada (cache).",
            "Ainda não apareceu? Abra o site numa aba anônima — ela não usa a versão guardada.",
          ],
          aiPrompt:
            "Quero melhorar a página pessoal que publiquei no GitHub Pages. Este é o meu index.html:\n\n[COLE AQUI O SEU CÓDIGO]\n\nMe sugira 3 mudanças simples que eu consigo fazer pelo celular (texto, cor ou uma seção nova) e me mostre exatamente qual trecho trocar em cada uma.",
        },
        delivery: {
          heading: "Conferiu a alteração no ar?",
          kind: "confirm",
          label: "Vi a minha alteração publicada no meu site",
          help: "Abra o seu site e confira antes de concluir.",
          expectedFormat: "",
        },
      },
    ],
  },
];

export const ALL_LESSONS = COURSE.flatMap((m) =>
  m.lessons.map((lesson) => ({ ...lesson, moduleId: m.id, moduleNumber: m.number, moduleTitle: m.title }))
);

export type CatalogLesson = (typeof ALL_LESSONS)[number];

export const LESSON_IDS = ALL_LESSONS.map((l) => l.id);

/** Aulas são numeradas globalmente: /aluno/aulas/1..N */
export function getLessonByNumber(n: number): CatalogLesson | null {
  if (!Number.isInteger(n) || n < 1) return null;
  return ALL_LESSONS[n - 1] ?? null;
}

export function lessonNumberOf(lessonId: string): number {
  return LESSON_IDS.indexOf(lessonId) + 1;
}

export function lessonHref(n: number): string {
  return `/aluno/aulas/${n}`;
}
