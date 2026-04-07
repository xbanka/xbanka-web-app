export type CurrencyType = "CRYPTO" | "FIAT" | "STABLE" | "LEVERAGE";

export type FeeType = "PERCENTAGE" | "FIXED" | string;

export interface Currency {
  id: string;
  code: string; // e.g. "USDT", "NGN"
  name: string; // e.g. "Tether", "Naira"
  type: CurrencyType;

  active: boolean;

  receivable: boolean;
  transferrable: boolean;
  withdrawable: boolean;

  allowUnconfirmedTrading: boolean;
  allowUtilityPayments: boolean;
  allowVirtualCardTransactions: boolean;

  minimumDeposit: number;
  minimumWithdrawal: number;

  maximumDecimalPlaces: number;

  withdrawalFee: number;
  withdrawalFeeType: FeeType;
  maximumWithdrawalFee: number;

  receiveFee: number;
  receiveFeeType: FeeType;

  enableWithdrawalApproval: boolean;

  exchangeCode: string | null;

  leverageBaseCurrencyCode: string | null;
  leverageMultipler: number;
  leverageType: string | null;

  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}