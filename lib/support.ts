// Link de suporte pelo WhatsApp. O WhatsApp serve SÓ para suporte — nunca para entregar acesso ou conteúdo.
// Número vem só de NEXT_PUBLIC_ADMIN_WHATSAPP (somente dígitos, com DDI e DDD).
// Sem valor válido, retorna null e a tela mostra o canal como "em configuração".
// A mensagem é sempre fixa no código: não aceitar texto vindo de query string ou do usuário.

export const SUPPORT_MESSAGES = {
  student: "Olá, Manson! Sou aluno do Dev no Bolso e preciso de ajuda.",
  payment: "Olá! Fiz um pagamento do Dev no Bolso e preciso de ajuda com a confirmação.",
  account: "Olá! Comprei o Dev no Bolso e preciso de ajuda para acessar minha conta.",
} as const;

export function supportWhatsAppUrl(message: string): string | null {
  const phone = (process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "").replace(/\D/g, "");
  if (phone.length < 10 || phone.length > 15) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
