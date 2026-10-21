import type { UserWallet } from "@/components/Dashboard/Wallet-Page/types";

export interface CryptoAddressRow {
  id: string;
  currency: string;
  network: string;
  address: string;
}

/**
 * One row per deposit address of every crypto wallet that holds a balance.
 * A coin with addresses on several networks gives one row per network.
 * The balance is only used to filter; it is not part of the row.
 */
export const listFundedCryptoAddresses = (
  wallets: UserWallet[] | null | undefined,
): CryptoAddressRow[] => {
  if (!Array.isArray(wallets)) return [];
  return wallets
    .filter((wallet) => wallet.type === "CRYPTO" && wallet.balance > 0)
    .flatMap((wallet) =>
      (wallet.addresses ?? [])
        .filter((entry) => !!entry.address)
        .map((entry) => ({
          id: entry.id,
          currency: wallet.currency,
          network: entry.network,
          address: entry.address as string,
        })),
    );
};
