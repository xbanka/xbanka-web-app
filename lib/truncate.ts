/**
 * Shortens a long identifier from the middle, keeping both ends so it stays
 * recognisable — `a1b2c3…9f8e` rather than `a1b2c3…`.
 *
 * Used for values like an Xbanka user id, which are too long to sit on one line
 * of a receipt but still need to be matched against by eye.
 */
export const truncateMiddle = (value: string, head = 6, tail = 4): string => {
  const trimmed = value?.trim() ?? "";

  // Nothing to gain when the ellipsis would not actually save characters.
  if (trimmed.length <= head + tail + 1) return trimmed;

  return `${trimmed.slice(0, head)}…${trimmed.slice(-tail)}`;
};
