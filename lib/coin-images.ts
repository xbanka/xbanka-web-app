const BASE =
  "https://assets.coincap.io/assets/icons";

export const COIN_IMAGES: Record<string, string> = {
  BTC: `${BASE}/btc@2x.png`,
  ETH: `${BASE}/eth@2x.png`,
  USDT: `${BASE}/usdt@2x.png`,
  XRP: `${BASE}/xrp@2x.png`,
  BNB: `${BASE}/bnb@2x.png`,
  USDC: `${BASE}/usdc@2x.png`,
  SOL: `${BASE}/sol@2x.png`,
  DOGE: `${BASE}/doge@2x.png`,
  TRX: `${BASE}/trx@2x.png`,
  STETH: `${BASE}/steth@2x.png`,
  AXS: `${BASE}/axs@2x.png`,
  AVAX: `${BASE}/avax@2x.png`,
  BUSD: `${BASE}/busd@2x.png`,
  MATIC: `${BASE}/matic@2x.png`,
};

export const getCoinImage = (symbol?: string) => {
  if (!symbol) return "/images/default-coin.png";

  const upper = symbol.toUpperCase();

  if (COIN_IMAGES[upper]) {
    return COIN_IMAGES[upper];
  }

  return `/images/fallback/${upper.toLowerCase()}.png`;
};