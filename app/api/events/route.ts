import { after, type NextRequest } from "next/server";
import { isClientEvent, isPlacement, recordFunnelEvent } from "@/lib/analytics";

const MAX_BODY_LENGTH = 200;

// Recebe eventos do funil enviados pelo navegador (lib/track.ts).
// Responde 204 na hora; a gravação no Redis acontece depois da resposta via after().
export async function POST(req: NextRequest) {
  // Só aceita chamadas do próprio site quando o navegador informa a origem.
  const fetchSite = req.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") {
    return new Response(null, { status: 204 });
  }

  let payload: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_LENGTH) return new Response(null, { status: 400 });
    payload = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }

  const { event, placement } = (payload ?? {}) as { event?: unknown; placement?: unknown };
  if (!isClientEvent(event)) {
    return new Response(null, { status: 400 });
  }

  after(() => recordFunnelEvent(event, isPlacement(placement) ? placement : undefined));

  return new Response(null, { status: 204 });
}
