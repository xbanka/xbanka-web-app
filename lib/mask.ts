// Display-only masking. The copy buttons always copy the full value.

/** `0123456789` -> `******6789`. Short values are returned as they are. */
export const maskAccountNumber = (accountNumber: string | null | undefined) => {
  if (!accountNumber) return "";
  return accountNumber.length > 4
    ? `${"*".repeat(accountNumber.length - 4)}${accountNumber.slice(-4)}`
    : accountNumber;
};

/** `TXk3abcdefghijklmn9fQz` -> `TXk3ab****9fQz`. Short values are returned as they are. */
export const maskAddress = (address: string | null | undefined) => {
  if (!address) return "";
  return address.length > 10
    ? `${address.slice(0, 6)}****${address.slice(-4)}`
    : address;
};
