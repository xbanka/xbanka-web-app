export interface QuoteExecutePayload {
  sourceCurrency: string;
  targetCurrency: string;
  amount: number;
  action: "BUY" | "SELL";
}

export interface ConvertExecutePayload {
  quoteId: string;
  sourceCurrency: string;
  targetCurrency: string;
  amount: number;
}

export interface ConvertExecuteResponse {
  id: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  reference: string;
  note: string;
  createdAt: string;
  category: string;
}