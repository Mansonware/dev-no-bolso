// Envio dos formulários de auth para /api/auth/*. Só o navegador usa este arquivo.

export type AuthResponse =
  | { ok: true; redirectTo: string }
  | { ok: false; code?: string; error: string; fieldErrors?: Record<string, string | undefined> };

const NETWORK_ERROR = "Não conseguimos conectar agora. Confira sua internet e tente de novo.";

export async function submitAuth(url: string, payload: Record<string, string>): Promise<AuthResponse> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => null)) as AuthResponse | null;
    if (res.ok && data?.ok) return data;
    if (data && !data.ok && typeof data.error === "string") return data;
    return { ok: false, error: NETWORK_ERROR };
  } catch {
    return { ok: false, error: NETWORK_ERROR };
  }
}
