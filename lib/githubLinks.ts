// Atalhos das missões: abrem a tela certa do GitHub numa nova aba, para o aluno não se perder
// navegando pelo site do GitHub no celular. Quando ainda não sabemos o usuário, cai no github.com.

import { PROJECT_NAME } from "@/lib/course";
import { repoBaseUrl, type ProgressRecord } from "@/lib/progressCore";
import { SITE_TEMPLATE } from "@/lib/siteTemplate";

export type Shortcut = { label: string; href: string };

export function missionShortcuts(lessonId: string, record: ProgressRecord): Shortcut[] {
  const repo = repoBaseUrl(record, PROJECT_NAME);

  switch (lessonId) {
    case "m1-l1":
      return [{ label: "Abrir cadastro do GitHub", href: "https://github.com/signup" }];
    case "m1-l2": {
      const shortcuts: Shortcut[] = [
        {
          label: "Criar repositório",
          href: `https://github.com/new?name=${PROJECT_NAME}&visibility=public`,
        },
      ];
      if (repo) {
        const params = new URLSearchParams({ filename: "index.html", value: SITE_TEMPLATE });
        shortcuts.push({ label: "Criar index.html com o modelo", href: `${repo}/new/main?${params.toString()}` });
      }
      return shortcuts;
    }
    case "m1-l3":
      return [{ label: "Abrir configurações do Pages", href: repo ? `${repo}/settings/pages` : "https://github.com" }];
    case "m1-l4": {
      const shortcuts: Shortcut[] = [
        { label: "Editar o index.html", href: repo ? `${repo}/edit/main/index.html` : "https://github.com" },
      ];
      if (record.site) shortcuts.push({ label: "Abrir meu site", href: record.site });
      return shortcuts;
    }
    default:
      return [];
  }
}
