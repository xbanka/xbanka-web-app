import { SendStep } from "./types";

export const CRYPTO_NETWORKS = {
  USDT: ["TRX", "ETH", "BSC", "SOL", "MATIC"],
  BTC: ["BTC"],
  ETH: ["ETH", "BSC"],
};

export const ASSETS = [
  { id: "btc",  symbol: "BTC",  name: "Bitcoin",   wallet: "Primary wallet",  balance: "0.00234", naira: "93,250.00", color: "#F7931A" },
  { id: "eth",  symbol: "ETH",  name: "Ethereum",  wallet: "Trading wallet",  balance: "0.00234", naira: "93,250.00", color: "#627EEA" },
  { id: "usdt", symbol: "USDT", name: "Tether",    wallet: "Savings wallet",  balance: "823.20",  naira: "93,250.00", color: "#26A17B" },
  { id: "usdc", symbol: "USDC", name: "USD Coin",  wallet: "Primary wallet",  balance: "234.45",  naira: "93,250.00", color: "#2775CA" },
];
 
export const NETWORKS: Record<string, { id: string; name: string; shortName: string; fee: string }[]> = {
  usdt: [
    { id: "trc20", name: "Tron (TRC-20)",           shortName: "TRC-20",  fee: "1.50" },
    { id: "erc20", name: "Ethereum (ERC-20)",        shortName: "ERC-20",  fee: "8.40" },
    { id: "bep20", name: "BNB Smart Chain (BEP-20)", shortName: "BEP-20",  fee: "0.30" },
  ],
  btc:  [{ id: "btc_main", name: "Bitcoin Network",    shortName: "BTC",    fee: "0.00015" }],
  eth:  [{ id: "eth_main", name: "Ethereum (ERC-20)",  shortName: "ERC-20", fee: "0.003"   }],
  usdc: [
    { id: "erc20_usdc", name: "Ethereum (ERC-20)", shortName: "ERC-20", fee: "8.40" },
    { id: "sol_usdc",   name: "Solana",            shortName: "SOL",    fee: "0.01"  },
  ],
};
 
export const RECENT_CONTACTS = [
  { name: "David Ojo", uid: "UID:0125637...", full: "UID01256372" },
  { name: "David Ojo", uid: "UID:0125637...", full: "UID01256381" },
  { name: "David Ojo", uid: "UID:0125637...", full: "UID01256395" },
];
 
export const TOTAL_STEPS = 5;
export const STEP_MAP: Partial<Record<SendStep, number>> = {
  select_asset: 1, recipient: 2, select_network: 3, enter_amount: 4, confirm: 5,
};
export const STEP_LABELS: Partial<Record<SendStep, string>> = {
  select_asset: "Asset selection", recipient: "Select recipient",
  select_network: "Select network", enter_amount: "Enter amount", confirm: "Confirm",
};