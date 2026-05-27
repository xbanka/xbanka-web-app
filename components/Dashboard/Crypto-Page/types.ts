export type CryptoStep = "confirm" | "pin" | "processing" | "success" | "failed";

export interface ConversionResult {
  debitAmount: number;
  debitCurrency: string;

  creditAmount: number;
  creditCurrency: string;

  rate?: string;
  fee?: string;

  dateTime?: string;
  transactionId?: string;
}

export interface ConversionTransaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  metadata: string;
  note: string;
  reference: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  type: "DEPOSIT" | "WITHDRAWAL";
  createdAt: string;
  updatedAt: string;
}

export interface ExecuteConversionResponse {
  message: string;
  details: string;
  errorGroup: string;
  data: {
    message: string;
    credit: ConversionTransaction;
    debit: ConversionTransaction;
  };
}