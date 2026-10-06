// Acesso ao conteúdo pago (entitlement), ligado ao pagamento que criou a conta.
//   aprovado            → active
//   refunded            → revoked (reason: refunded)
//   charged_back        → revoked (reason: charged_back)
// Revogar nunca apaga conta nem progresso: só bloqueia o conteúdo. Voltar a "approved" reativa.
// Puro e testável; o armazenamento (Redis) é injetado.

import type { PaymentLookup } from "./paymentCore.ts";

export type EntitlementStatus = "active" | "revoked";
export type RevokeReason = "refunded" | "charged_back";

export type Entitlement = {
  status: EntitlementStatus;
  reason?: RevokeReason;
  /** Última mudança de status. */
  updatedAt: string;
  /** Última vez que o status foi conferido no Mercado Pago. */
  checkedAt: string;
};

/** Revisão de segurança: se o webhook falhar, o acesso é reconferido no máximo 1x por dia. */
export const RECHECK_AFTER_MS = 24 * 60 * 60 * 1000;

export function parseEntitlement(raw: unknown): Entitlement | null {
  const value = typeof raw === "string" ? safeJson(raw) : raw;
  if (!value || typeof value !== "object") return null;
  const v = value as Partial<Entitlement>;
  if (v.status !== "active" && v.status !== "revoked") return null;
  if (typeof v.updatedAt !== "string" || typeof v.checkedAt !== "string") return null;
  const reason = v.reason === "refunded" || v.reason === "charged_back" ? v.reason : undefined;
  return { status: v.status, ...(reason ? { reason } : {}), updatedAt: v.updatedAt, checkedAt: v.checkedAt };
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Sem registro = acesso liberado: toda conta nasce de uma compra aprovada e conferida no servidor,
 * e o cadastro grava "active". O registro ausente só existe em contas anteriores a esta regra.
 */
export function hasAccess(entitlement: Entitlement | null): boolean {
  return entitlement === null || entitlement.status === "active";
}

export function activeEntitlement(now: Date): Entitlement {
  const iso = now.toISOString();
  return { status: "active", updatedAt: iso, checkedAt: iso };
}

export function needsRecheck(entitlement: Entitlement | null, now: Date): boolean {
  if (!entitlement) return true;
  const checked = Date.parse(entitlement.checkedAt);
  return !Number.isFinite(checked) || now.getTime() - checked > RECHECK_AFTER_MS;
}

/** O que o estado do pagamento significa para o acesso. null = não muda nada. */
export function targetFromLookup(lookup: PaymentLookup): { status: EntitlementStatus; reason?: RevokeReason } | null {
  if (lookup.state === "approved") return { status: "active" };
  if (lookup.state === "refunded") {
    return { status: "revoked", reason: lookup.mpStatus === "charged_back" ? "charged_back" : "refunded" };
  }
  return null;
}

export type EntitlementTransition = "activated" | "revoked" | "restored" | "unchanged";

/**
 * Próximo registro a gravar. Devolve null quando não há o que gravar
 * (Mercado Pago indisponível, pagamento inexistente etc.).
 */
export function nextEntitlement(
  current: Entitlement | null,
  lookup: PaymentLookup,
  now: Date
): { next: Entitlement; transition: EntitlementTransition } | null {
  if (lookup.state === "unavailable" || lookup.state === "not_found") return null;

  const iso = now.toISOString();
  const target = targetFromLookup(lookup);

  // Pendente, recusado ou de outro produto: só marca que foi conferido.
  if (!target) {
    if (!current) return null;
    return { next: { ...current, checkedAt: iso }, transition: "unchanged" };
  }

  const sameStatus = current?.status === target.status && current?.reason === target.reason;
  if (current && sameStatus) {
    return { next: { ...current, checkedAt: iso }, transition: "unchanged" };
  }

  const next: Entitlement = {
    status: target.status,
    ...(target.reason ? { reason: target.reason } : {}),
    updatedAt: iso,
    checkedAt: iso,
  };
  const transition: EntitlementTransition =
    target.status === "revoked" ? "revoked" : current?.status === "revoked" ? "restored" : "activated";
  return { next, transition };
}
