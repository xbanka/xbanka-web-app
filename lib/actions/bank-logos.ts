// Nigerian bank logos. Paystack's /bank endpoint (which the backend proxies as
// /accounts/banks) returns codes and names but no artwork, so logos come from
// this community-maintained list and are matched on CBN bank code.
//
// This is a third-party host with no uptime guarantee — every consumer must
// degrade to the initials badge rather than depend on it. Deliberately uses
// fetch, not AxiosInstance, so no auth headers or API baseURL are applied.
const BANK_LOGO_SOURCE = "https://nigerianbanks.xyz/";

// The source returns this placeholder for banks it has no artwork for. Initials
// are more useful to the user than a generic grey square.
const PLACEHOLDER_LOGO = "default-image.png";

export interface BankLogoEntry {
  name: string;
  slug: string;
  code: string;
  logo: string;
}

/** Normalises a bank name so lookups survive casing and punctuation drift. */
export const normaliseBankName = (name?: string) =>
  (name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

/**
 * Fetches the bank logo list and indexes it by both CBN code and normalised
 * name, since linked accounts don't consistently carry a bank code.
 */
export const getBankLogos = async (): Promise<Map<string, string>> => {
  const response = await fetch(BANK_LOGO_SOURCE);

  if (!response.ok) {
    throw new Error(`Bank logo lookup failed: ${response.status}`);
  }

  const banks: BankLogoEntry[] = await response.json();
  const index = new Map<string, string>();

  banks.forEach((bank) => {
    if (!bank.logo || bank.logo.includes(PLACEHOLDER_LOGO)) return;

    if (bank.code) index.set(bank.code, bank.logo);
    if (bank.name) index.set(normaliseBankName(bank.name), bank.logo);
  });

  return index;
};
