"use client";

import { useEffect } from "react";
import type { FunnelEvent } from "@/lib/analytics";
import { track } from "@/lib/track";

// Dispara o evento uma vez por chave de armazenamento (evita contar recarregamentos e o
// duplo efeito do StrictMode em dev). Não guarda nada pessoal.
function useTrackOnce(event: FunnelEvent, storage: "session" | "local", key: string) {
  useEffect(() => {
    try {
      const store = storage === "session" ? sessionStorage : localStorage;
      if (store.getItem(key)) return;
      store.setItem(key, "1");
    } catch {
      // Armazenamento bloqueado (ex.: modo privado restrito): conta mesmo assim.
    }
    track(event);
  }, [event, storage, key]);
}

/** Landing exibida — 1x por sessão do navegador. */
export function TrackLandingView() {
  useTrackOnce("landing_view", "session", "dnb_landing_view");
  return null;
}

/** Acesso à área do aluno — 1x por sessão do navegador. */
export function TrackStudentAreaView() {
  useTrackOnce("student_area_view", "session", "dnb_student_area_view");
  return null;
}

/** Marco de ativação: primeira aula paga aberta neste navegador. */
export function TrackFirstLessonStart() {
  useTrackOnce("first_lesson_start", "local", "dnb_first_lesson_start");
  return null;
}
