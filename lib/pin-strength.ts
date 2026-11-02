// Transaction PINs that are too easy to guess. Shared by every form where a
// customer sets a new PIN.

export const WEAK_PINS = ["0000", "1111", "1234", "4321"];

export const WEAK_PIN_MESSAGE =
  "PIN is too easy to guess. Please avoid 0000, 1111, 1234 or 4321";

export function isWeakPin(pin: string): boolean {
  return WEAK_PINS.includes(pin);
}
