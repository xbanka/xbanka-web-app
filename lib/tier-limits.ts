export const TIER_LIMITS: Record<number, number> = {
  0: 150_000,
  1: 500_000,
  2: 2_000_000,
};

export function getTierLimit(tier: number) {
  return TIER_LIMITS[tier] ?? Infinity;
}

export function getNextTier(tier: number) {
  if (tier >= 2) return null;
  return tier + 1;
}