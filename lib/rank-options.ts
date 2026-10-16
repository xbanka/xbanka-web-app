/** Ranking for the searchable pickers (bank lists, mostly).
 *
 *  Bank names are long and nobody types them out: people reach for the
 *  initials ("gtb", "uba", "fcmb") or the start of one word ("gua", "zen").
 *  A plain `label.includes(query)` misses both — "gt" appears nowhere in
 *  "Guaranty Trust Bank" — so matches are scored and the best one is listed
 *  first, with looser matches kept below it rather than thrown away.
 */

export type RankableOption = { label: string; value: string };

/** Words that carry no initial in a bank's common acronym — UBA is United
 *  Bank for Africa, not UBFA. "Bank" itself does count (UBA, GTB, FCMB). */
const SKIPPED = new Set(["of", "for", "and", "the", "&"]);

const normalise = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const wordsOf = (text: string) => normalise(text).split(" ").filter(Boolean);

const initialsOf = (label: string) =>
  wordsOf(label)
    .filter((word) => !SKIPPED.has(word))
    .map((word) => word[0])
    .join("");

/** True when every character of `query` appears in `text` in order — catches
 *  the near-misses ("gnty" → Guaranty) that exact matching drops. */
const isSubsequence = (query: string, text: string) => {
  let i = 0;
  for (const char of text) if (char === query[i] && ++i === query.length) return true;
  return false;
};

/** 0 means "no match"; higher is a better match. */
export const scoreOption = (label: string, rawQuery: string): number => {
  const query = normalise(rawQuery);
  if (!query) return 1;

  const haystack = normalise(label);
  const initials = initialsOf(label);
  const words = wordsOf(label);

  if (haystack === query) return 100;
  if (initials === query) return 95;
  if (haystack.startsWith(query)) return 90;
  if (initials.startsWith(query)) return 80;
  if (words.some((word) => word.startsWith(query))) return 70;
  if (haystack.replace(/ /g, "").startsWith(query)) return 65;
  if (haystack.includes(query)) return 60;
  if (initials.includes(query)) return 50;
  if (query.length >= 2 && isSubsequence(query, haystack.replace(/ /g, "")))
    return 30;
  return 0;
};

/** The options worth showing for `query`, best match first. An empty query
 *  keeps the list in its original order. */
export const rankOptions = <T extends RankableOption>(
  options: T[],
  query: string,
): T[] => {
  if (!normalise(query)) return options;
  return options
    .map((option) => ({ option, score: scoreOption(option.label, query) }))
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) => b.score - a.score || a.option.label.localeCompare(b.option.label),
    )
    .map((entry) => entry.option);
};
