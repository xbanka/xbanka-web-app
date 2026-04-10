import { UseGetCryptoWallet, UseGetFiatWallet } from "@/lib/services/wallet.service";
import { sumCryptoFiatEquivalent, sumFiatBalances } from "@/lib/sumBalances";

export const usePortfolioBalance = () => {
  const { data: fiatData } = UseGetFiatWallet();
  const { data: cryptoData } = UseGetCryptoWallet();

  const fiatWallets = fiatData?.data?.data || [];
  const cryptoWallets = cryptoData?.data?.data || [];

  const fiatBalance = sumFiatBalances(fiatWallets);
  const cryptoBalance = sumCryptoFiatEquivalent(cryptoWallets);

  return {
    fiatBalance,
    cryptoBalance,
    totalBalance: fiatBalance + cryptoBalance,
  };
};