// type PageId = "dashboard" | "wallet" | "giftcards" | "bills" | "crypto" | string;

export interface CryptoMarketOverview {
  changePercent24h: number;
  id: string;
  lastUpdated: string; // ISO 8601 Date string
  name: string;
  priceUsd: number;
  rank: number;
  symbol: string;
}

export const stepsConfig = [
  { key: "bvn", apiKey: "BVN", stepId: 2 },
  { key: "id-selfie", apiKey: "ID_SELFIE", stepId: 3 },
  { key: "address", apiKey: "ADDRESS", stepId: 4 },
];

export type ModalType = "bvn" | "id-selfie" | "address" | null;