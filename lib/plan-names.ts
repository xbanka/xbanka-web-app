// lib/plan-names.ts
//
// Bill providers send plan names as codes: "COMPACT_PLUS_EXTRA_VIEW",
// "GOTV_JOLLI", "NOVA_WEEKLY". These read them back as names a person would
// write: "Compact Plus + Extra View", "GOtv Jolli", "Nova Weekly".

/** Words whose casing is a brand or a unit, not a sentence. */
const FIXED_CASE: Record<string, string> = {
  dstv: "DStv",
  gotv: "GOtv",
  startimes: "StarTimes",
  showmax: "Showmax",
  mtn: "MTN",
  glo: "Glo",
  airtel: "Airtel",
  "9mobile": "9mobile",
  hd: "HD",
  tv: "TV",
  sme: "SME",
  xl: "XL",
  xxl: "XXL",
  gb: "GB",
  mb: "MB",
  tb: "TB",
};

const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

const humanizeWord = (word: string) => {
  const lower = word.toLowerCase();
  if (FIXED_CASE[lower]) return FIXED_CASE[lower];

  // "1.5GB" / "500MB": keep the unit shouting.
  const sized = lower.match(/^(\d+(?:[.,]\d+)?)(gb|mb|tb)$/);
  if (sized) return `${sized[1]}${sized[2].toUpperCase()}`;

  // "30DAYS" / "7days" → "30 Days".
  const spanned = lower.match(/^(\d+)(days?|hrs?|hours?|weeks?|months?)$/);
  if (spanned) return `${spanned[1]} ${capitalize(spanned[2])}`;

  return capitalize(lower);
};

/**
 * Turns a provider's plan code into a readable name. Names that already use
 * mixed case ("MTN 1.5GB - 30 Days") only have their underscores removed.
 */
export const humanizePlanName = (name: string): string => {
  const spaced = name.replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();
  if (!spaced) return name;

  const shouting = spaced === spaced.toUpperCase();
  const words = shouting
    ? spaced.split(" ").map(humanizeWord).join(" ")
    : spaced;

  // DStv's add-on reads as part of the bouquet otherwise.
  return words.replace(/\s+(?:extra\s*view|xtra\s*view)\b/i, " + Extra View");
};
