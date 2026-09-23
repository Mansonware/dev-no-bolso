// DADOS MOCKADOS — estrutura do Módulo 01 aprovada; conteúdo didático ainda NÃO escrito.
// Substituir por dados reais (Supabase) quando o backend existir.
//
// Campo interno `validacao` (não exibido ao aluno):
//   "validado-emulacao"  → passos testados só em viewport Android emulado (Gate #1).
//                          NUNCA tratar como validado em Android físico.
//   "pendente-android"   → ainda não testado; depende do próximo Gate em Android físico (scrcpy).
// Fonte: docs/gate-1-mobile-publish-spike.md

export type LessonStatus = "feita" | "atual" | "bloqueada";
export type Validacao = "validado-emulacao" | "pendente-android";

export type Lesson = {
  id: string;
  title: string;
  objective: string;
  status: LessonStatus;
  validacao: Validacao;
};

export type Module = {
  id: string;
  number: string;
  title: string;
  summary: string;
  lessons: Lesson[];
};

export type ProjectStepStatus = "feito" | "atual" | "pendente";

export type ProjectStep = {
  id: string;
  label: string;
  hint: string;
  status: ProjectStepStatus;
};

export const aluno = {
  firstName: "Ana",
  handle: "anadev",
};

export const modules: Module[] = [
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
        status: "feita",
        validacao: "pendente-android", // cadastro do zero não foi testado
      },
      {
        id: "m1-l2",
        title: "Seu primeiro repositório e o index.html",
        objective: "Criar um repositório público com o index.html do modelo do curso.",
        status: "feita",
        validacao: "validado-emulacao", // colar/editar com teclado real: pendente
      },
      {
        id: "m1-l3",
        title: "Seu site no ar com GitHub Pages",
        objective: "Ativar o GitHub Pages e abrir o seu site pela primeira vez.",
        status: "atual",
        validacao: "validado-emulacao",
      },
      {
        id: "m1-l4",
        title: "Alterar e republicar",
        objective: "Mudar o site e ver a alteração aparecer online.",
        status: "bloqueada",
        validacao: "validado-emulacao", // pull-to-refresh vs cache: pendente
      },
    ],
  },
];

export const currentLesson = {
  moduleNumber: "01",
  moduleTitle: "Do zero ao seu site no ar",
  title: "Seu site no ar com GitHub Pages",
  mission: "Ative o GitHub Pages no seu repositório e abra o seu site pela primeira vez.",
  steps: [
    { label: "Teoria", status: "feito" as const },
    { label: "Missão", status: "atual" as const },
    { label: "Validação", status: "pendente" as const },
  ],
};

export const project = {
  name: "meu-primeiro-site",
  repoUrl: "github.com/anadev/meu-primeiro-site",
  publicUrl: "anadev.github.io/meu-primeiro-site",
  published: false,
  // Uma etapa por aula do Módulo 01.
  steps: [
    { id: "conta", label: "Conta no GitHub", hint: "@anadev", status: "feito" },
    { id: "repo", label: "Repositório com index.html", hint: "meu-primeiro-site", status: "feito" },
    { id: "pages", label: "Site publicado no GitHub Pages", hint: "Aula 3", status: "atual" },
    { id: "update", label: "Alteração publicada", hint: "Aula 4", status: "pendente" },
  ] satisfies ProjectStep[],
};

export function progressStats() {
  const all = modules.flatMap((m) => m.lessons);
  const done = all.filter((l) => l.status === "feita").length;
  return { done, total: all.length, percent: Math.round((done / all.length) * 100) };
}

// ---------------------------------------------------------------------------
// Navegação entre aulas (mock). Aulas são numeradas globalmente: /aluno/aulas/1..N

export const allLessons = modules.flatMap((m) =>
  m.lessons.map((l) => ({ ...l, moduleNumber: m.number, moduleTitle: m.title }))
);

export function lessonNumber(lessonId: string) {
  return allLessons.findIndex((l) => l.id === lessonId) + 1;
}

export function getLesson(n: number) {
  return allLessons[n - 1] ?? null;
}

export function currentLessonNumber() {
  return allLessons.findIndex((l) => l.status === "atual") + 1;
}

export function lessonHref(n: number) {
  return `/aluno/aulas/${n}`;
}

// MOCK — etapas da aula. Conteúdo definitivo será escrito após o Gate em Android físico.
export type StageId = "teoria" | "missao" | "validacao";
export const lessonStages: { id: StageId; label: string }[] = [
  { id: "teoria", label: "Teoria" },
  { id: "missao", label: "Missão" },
  { id: "validacao", label: "Validação" },
];
