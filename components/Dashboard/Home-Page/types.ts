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