import { Wallet } from "./types/wallet-types";

export const sumFiatBalances = (wallets: Wallet[]) => {
  return wallets.reduce((total, wallet) => {
    return total + (wallet.balance);
  }, 0);
};

export const sumCryptoFiatEquivalent = (wallets: Wallet[]) => {
  return wallets.reduce((total, wallet) => {
    return total + (wallet?.fiatEquivalent?.amount || 0.00);
  }, 0);
};
export const sumCryptoBalance = (wallets: Wallet[]) => {
  return wallets.reduce((total, wallet) => {
    return total + (wallet.balance || 0.00);
  }, 0);
};

export const getWalletValueInNGN = (wallet: Wallet) => {
  if (wallet.type === "FIAT") return wallet.balance || 0.00;
  if (wallet.type === "CRYPTO") return wallet.fiatEquivalent?.amount || 0.00;
  return 0;
};
export const getWalletValueInUSD = (wallet: Wallet) => {
  if (wallet.type === "CRYPTO") return wallet?.balance || 0.00;
  if (wallet.type === "FIAT") return wallet?.usdEquivalent?.amount || 0.00;
  return 0;
};

export const sumWallets = (wallets: Wallet[]) => {
  return wallets.reduce((total, wallet) => {
    return total + getWalletValueInNGN(wallet);
  }, 0);
};

export const sumWalletsEquivalent = (wallets: Wallet[]) => {
  return wallets?.reduce((total, wallet) => {
    return total + getWalletValueInUSD(wallet);
  }, 0);
};