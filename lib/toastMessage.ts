/**
 * Extracts a displayable message from an API response.
 *
 * The API envelope is `{ message, details, errorGroup, data }`, but `message`
 * is not always a string: validation responses return an array, and some
 * endpoints omit it entirely. Passing those straight to `toast.success()`
 * renders an empty toast — a bare icon with no text.
 *
 * Always pass a fallback describing what succeeded.
 */
export const apiMessage = (result: unknown, fallback: string): string => {
  const message = (result as { data?: { message?: unknown } })?.data?.message;

  if (Array.isArray(message)) {
    const joined = message.filter(Boolean).join(", ").trim();
    return joined || fallback;
  }

  if (typeof message === "string" && message.trim()) {
    return message.trim();
  }

  return fallback;
};
