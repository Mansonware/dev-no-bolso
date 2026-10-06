// Fonte única da oferta comercial. Preço, nome e textos de CTA saem daqui —
// tanto para a UI quanto para a preferência/validação do Mercado Pago.

export const OFFER = {
  productName: "Dev no Bolso",
  priceCents: 4599,
  priceLabel: "R$ 45,99",
  currencyId: "BRL",
  billing: "pagamento único",
} as const;

export const OFFER_PRICE = OFFER.priceCents / 100;

export const CTA = {
  buy: `Comprar acesso — ${OFFER.priceLabel}`,
  buyShort: "Comprar acesso",
  freeMission: "Fazer a missão grátis",
} as const;

export const FREE_MISSION_HREF = "/experimentar";
