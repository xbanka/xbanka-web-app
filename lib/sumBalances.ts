export const sumFiatBalances = (wallets: any[]) => {
  return wallets.reduce((total, wallet) => {
    return total + (wallet.balance || 0.00);
  }, 0);
};

export const sumCryptoFiatEquivalent = (wallets: any[]) => {
  return wallets.reduce((total, wallet) => {
    return total + (wallet.fiatEquivalent?.amount || 0.00);
  }, 0);
};

export const getWalletValueInNGN = (wallet: any) => {
  if (wallet.type === "FIAT") return wallet.balance || 0.00;
  if (wallet.type === "CRYPTO") return wallet.fiatEquivalent?.amount || 0.00;
  return 0;
};

export const sumWallets = (wallets: any[]) => {
  return wallets.reduce((total, wallet) => {
    return total + getWalletValueInNGN(wallet);
  }, 0);
};