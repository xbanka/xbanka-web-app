// Coin icons are served from the `cryptocurrency-icons` package on jsDelivr.
// The URL is derived from the ticker, so any coin in the set resolves without
// us maintaining a map. Coins the set doesn't cover return null and the caller
// renders an initials badge instead — see <CoinIcon />.
//
// Previously this pointed at assets.coincap.io with a 14-symbol hardcoded map,
// and everything outside that map fell through to `/images/fallback/<sym>.png`,
// a directory that does not exist in `public/` — so most wallets rendered a
// broken image. CoinCap has also since sunset its public API.
const CDN = "https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color";

// Wrapped and staked derivatives have no icon of their own but are universally
// shown with their underlying asset's logo.
const SYMBOL_ALIASES: Record<string, string> = {
  STETH: "ETH",
  WSTETH: "ETH",
  WETH: "ETH",
  WBTC: "BTC",
};

// Tickers the icon set does not ship. Listing them explicitly avoids a request
// we know will 404, so the initials badge renders immediately with no flicker.
// This is an optimisation, not a correctness requirement — anything missing
// here still falls back gracefully via <CoinIcon />'s onError handler.
const UNSUPPORTED = new Set([
  "RAMP",
  "HYPE",
  "RAIN",
  "LAB",
  "USDS",
  "CC",
  "GAME",
  "NGNX",
  "AXS",
  "BUSD",
  "WKD",
]);

/**
 * Resolves a coin's icon URL from its ticker.
 * Returns null when no icon exists — render an initials badge in that case.
 */
export const getCoinImage = (symbol?: string): string | null => {
  if (!symbol) return null;

  const upper = symbol.toUpperCase();
  if (UNSUPPORTED.has(upper)) return null;

  const resolved = SYMBOL_ALIASES[upper] ?? upper;

  return `${CDN}/${resolved.toLowerCase()}.png`;
};

/** Deterministic badge colour so a coin keeps the same colour across renders. */
const BADGE_COLORS = [
  "#0c9a8e",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#10b981",
  "#6366f1",
];

export const getCoinBadgeColor = (symbol?: string): string => {
  if (!symbol) return BADGE_COLORS[0];

  const hash = symbol
    .toUpperCase()
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return BADGE_COLORS[hash % BADGE_COLORS.length];
};
