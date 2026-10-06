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
