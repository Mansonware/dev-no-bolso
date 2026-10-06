// Conteúdo e checagem da missão grátis (/experimentar).
// Tudo roda no navegador: o código do visitante nunca sai do aparelho.

export const ORIGINAL_TITLE = "Seu nome aqui";
export const ORIGINAL_TEXT = "Escreva aqui o que você quer criar.";
export const ORIGINAL_COLOR = "tomato";

export const STARTER_CODE = `<h1 style="color: ${ORIGINAL_COLOR}">${ORIGINAL_TITLE}</h1>
<p>${ORIGINAL_TEXT}</p>`;

// Cores com bom contraste no fundo claro da prévia.
export const COLOR_SUGGESTIONS = ["royalblue", "purple", "crimson", "teal"];

export type TaskId = "titulo" | "frase" | "cor";

export const TASKS: { id: TaskId; label: string; hint: string }[] = [
  {
    id: "titulo",
    label: "Troque “Seu nome aqui” pelo seu nome",
    hint: "Apague só o texto entre <h1 ...> e </h1>. As tags ficam.",
  },
  {
    id: "frase",
    label: "Escreva o que você quer criar",
    hint: "Troque o texto entre <p> e </p>. Ex.: um site para o meu trabalho.",
  },
  {
    id: "cor",
    label: "Mude a cor do título",
    hint: `Troque a palavra ${ORIGINAL_COLOR} por outra cor em inglês, como ${COLOR_SUGGESTIONS.join(", ")}.`,
  },
];

export type MissionCheck = Record<TaskId, boolean> & { missingTags: boolean };

const normalize = (value: string | null | undefined) => (value ?? "").replace(/\s+/g, " ").trim();

// Lê o HTML com DOMParser (não executa nada) e confere cada tarefa.
export function checkMission(code: string): MissionCheck {
  if (typeof DOMParser === "undefined") {
    return { titulo: false, frase: false, cor: false, missingTags: false };
  }

  const doc = new DOMParser().parseFromString(code, "text/html");
  const h1 = doc.querySelector("h1");
  const p = doc.querySelector("p");

  const title = normalize(h1?.textContent);
  const text = normalize(p?.textContent);
  // Valor inválido de cor é descartado pelo parser de CSS e vira "".
  const color = normalize(h1?.style.color).toLowerCase();

  return {
    titulo: title.length > 0 && title !== ORIGINAL_TITLE,
    frase: text.length > 0 && text !== ORIGINAL_TEXT,
    cor: color.length > 0 && color !== ORIGINAL_COLOR,
    missingTags: !h1 || !p,
  };
}

// Documento da prévia. Vai num <iframe sandbox=""> (sem scripts, origem isolada) e
// a CSP bloqueia qualquer carregamento externo — só estilos inline são permitidos.
export function buildPreviewDocument(code: string): string {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  html { color-scheme: light; }
  body { margin: 0; padding: 28px 22px; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: #f7f7f5; color: #1c1c1c; line-height: 1.5; overflow-wrap: anywhere; }
  h1 { margin: 0 0 8px; font-size: 28px; line-height: 1.15; letter-spacing: -0.02em; }
  p { margin: 0; font-size: 16px; color: #4a4a4a; }
</style>
</head>
<body>
${code}
</body>
</html>`;
}
