"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

// Dispara landing_view uma vez por sessão do navegador (sessionStorage evita contar
// recarregamentos e o duplo efeito do StrictMode em dev). Não guarda nada pessoal.
export function TrackLandingView() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("dnb_landing_view")) return;
      sessionStorage.setItem("dnb_landing_view", "1");
    } catch {
      // sessionStorage bloqueado: conta mesmo assim.
    }
    track("landing_view");
  }, []);

  return null;
}

// Marco de ativaÃ§Ã£o: conta apenas a primeira aula paga aberta neste navegador.
// localStorage evita recontar o mesmo aluno em novas sessÃµes sem guardar qualquer PII.
export function TrackFirstLessonStart() {
  useEffect(() => {
    try {
      if (localStorage.getItem("dnb_first_lesson_start")) return;
      localStorage.setItem("dnb_first_lesson_start", "1");
    } catch {
      // Armazenamento bloqueado: envia o evento sem impedir o acesso Ã  aula.
    }
    track("first_lesson_start");
  }, []);

  return null;
}
