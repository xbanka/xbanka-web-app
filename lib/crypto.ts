import { Currency, CurrencyType } from "./types/currency-type";

export interface CurrencyOption {
  label: string;
  value: string;
  image?: string;
  type: CurrencyType;
  minimumDeposit: number;
  minimumWithdrawal: number;
  maximumDecimalPlaces: number;
}

export const mapCurrenciesToOptions = (
  currencies: Currency[]
): CurrencyOption[] => {
  return currencies
    .filter((c) => c.active) // only active currencies
    .map((c) => ({
      label: c.code,
      value: c.code,
      type: c.type,
      minimumDeposit: c.minimumDeposit,
      minimumWithdrawal: c.minimumWithdrawal,
      maximumDecimalPlaces: c.maximumDecimalPlaces,
    //   image: `/${c.code.toLowerCase()}.svg`, // optional
    }));
};

export const splitCurrencies = (currencies: Currency[]) => {
  return {
    fiat: currencies.filter((c) => c.type === "FIAT"),
    crypto: currencies.filter((c) => c.type === "CRYPTO"),
  };
};