export type CryptoStep = "confirm" | "pin" | "processing" | "success" | "failed";

export interface ConversionResult {
  youPaid?: string | number;
  youReceived?: string | number;
  rate?: string;
  fee?: string | number;
  dateTime?: string;
  transactionId?: string;
}