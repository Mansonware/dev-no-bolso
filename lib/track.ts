"use client";

import type { FunnelEvent, Placement } from "@/lib/analytics";

// Envia um evento do funil para /api/events sem bloquear a interface.
// Nenhum dado pessoal é enviado: só o nome do evento e, opcionalmente, a posição do CTA.
export function track(event: FunnelEvent, placement?: Placement): void {
  try {
    // text/plain evita preflight e é aceito pelo sendBeacon em todos os navegadores.
    const body = JSON.stringify(placement ? { event, placement } : { event });

    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const sent = navigator.sendBeacon("/api/events", new Blob([body], { type: "text/plain" }));
      if (sent) return;
    }

    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Silencioso de propósito: analytics não pode atrapalhar o usuário.
  }
}
