export interface CryptoQuoteTypes {
  adminFee: number;
  expiresAt: string;
  grossPayout: number;
  netPayout: number;
  quoteId: string;
  rate: number;
  sourceAmount: number;
  sourceCurrency: string;
  targetCurrency: string;
}

export interface CryptoGetConversionTypes {
  adminFee: number;
  grossPayout: number;
  netPayout: number;
  rate: number;
  sourceAmount: number;
  sourceCurrency: string;
  targetCurrency: string;
  estimatedPrice: "1 NGNX ≈ 0.001 USDT";
}
