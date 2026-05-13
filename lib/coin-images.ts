export const COIN_IMAGES: Record<string, string> = {
  BTC: "https://assets.coincap.io/assets/icons/btc@2x.png",
  ETH: "https://assets.coincap.io/assets/icons/eth@2x.png",
  USDT: "https://assets.coincap.io/assets/icons/usdt@2x.png",
  XRP: "https://assets.coincap.io/assets/icons/xrp@2x.png",
  BNB: "https://assets.coincap.io/assets/icons/bnb@2x.png",
  USDC: "https://assets.coincap.io/assets/icons/usdc@2x.png",
  SOL: "https://assets.coincap.io/assets/icons/sol@2x.png",
  DOGE: "https://assets.coincap.io/assets/icons/doge@2x.png",
  TRX: "https://assets.coincap.io/assets/icons/trx@2x.png",
  STETH: "https://assets.coincap.io/assets/icons/steth@2x.png",
  AXS: "https://assets.coincap.io/assets/icons/axs@2x.png",
};

export const getCoinImage = (symbol: string) => {
  return (
    COIN_IMAGES[symbol.toUpperCase()] ||
    "/images/default-coin.png"
  );
};