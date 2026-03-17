import { AppleIcon } from "lucide-react";

export const MARKET = [
  { name: "Bitcoin", symbol: "BTC", price: "92,300", change: "3.21", up: true },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: "87,500",
    change: "4.15",
    up: true,
  },
  {
    name: "Tether",
    symbol: "USDT",
    price: "76,800",
    change: "2.78",
    up: false,
  },
  {
    name: "Tether",
    symbol: "USDT",
    price: "76,800",
    change: "2.78",
    up: false,
  },
  {
    name: "Tether",
    symbol: "USDT",
    price: "76,800",
    change: "2.78",
    up: false,
  },
  { name: "Ripple", symbol: "XRP", price: "85,400", change: "4.98", up: true },
];

export const GIFT_CARDS = [
  { name: "Apple", bg: "#6C47FF", rate: "₦100 per $1", icon: AppleIcon },
  { name: "Amazon", bg: "#FF9900", rate: "₦120 per $1", icon: AppleIcon },
  { name: "Google Play", bg: "#34A853", rate: "₦85 per $1", icon: AppleIcon },
  { name: "Netflix", bg: "#E50914", rate: "₦120 per $1", icon: AppleIcon },
  { name: "Spotify", bg: "#1DB954", rate: "₦120 per $1", icon: AppleIcon },
  { name: "Xbox", bg: "#107C10", rate: "₦120 per $1", icon: AppleIcon },
  { name: "Netflix", bg: "#E50914", rate: "₦120 per $1", icon: AppleIcon },
  { name: "Spotify", bg: "#1DB954", rate: "₦120 per $1", icon: AppleIcon },
  { name: "Xbox", bg: "#107C10", rate: "₦120 per $1", icon: AppleIcon },
];

export const ONBOARDING_STEPS = [
  {
    step: "STEP 1",
    title: "Email Verified",
    desc: "Account created",
    status: "done",
  },
  {
    step: "STEP 2",
    title: "Verify BVN",
    desc: "Unlocks gift card & bill payments",
    status: "active",
  },
  {
    step: "STEP 3",
    title: "ID & Selfie",
    desc: "Unlocks crypto & withdrawals",
    status: "locked",
  },
  {
    step: "STEP 4",
    title: "Proof of Address",
    desc: "Unlocks full platform access",
    status: "locked",
  },
];

export const TRANSACTIONS = [
  { date: "19 Nov, 2025", time: "2:45 PM", type: "Withdrawal", amount: "₦93,250", ref: "TD13245625VDR8", note: "Payment for Airtime", status: "Completed" },
  { date: "19 Nov, 2025", time: "2:45 PM", type: "Bill Payment", amount: "₦54,750", ref: "TD13245625VDR8", note: "Funds for Ikorodu trip", status: "In Progress" },
  { date: "19 Nov, 2025", time: "2:45 PM", type: "Withdrawal", amount: "₦12,800", ref: "TD13245625VDR8", note: "Airtime for Telco Mobile", status: "Pending" },
  { date: "19 Nov, 2025", time: "2:45 PM", type: "Withdrawal", amount: "₦76,250", ref: "TD13245625VDR8", note: "Data subscription", status: "Completed" },
];
 
export const HOLDINGS = [
  { name: "Bitcoin", symbol: "BTC", amount: "0.00234", value: "₦93,250", change: "3.21", up: true },
  { name: "Ethereum", symbol: "ETH", amount: "28.3245", value: "₦54,750", change: "4.15", up: true },
  { name: "Tether", symbol: "USDT", amount: "823.50", value: "₦12,800", change: "2.78", up: false },
  { name: "USDC", symbol: "USD", amount: "234.45", value: "₦76,250", change: "4.98", up: true },
];
 
export const CRYPTO_TRANSACTIONS = [
  { date: "19 Nov, 2025", time: "2:45 PM", type: "Deposit", asset: "BTC", amount: "+0.00234", ref: "3f8a...92c0a", status: "Completed" },
  { date: "19 Nov, 2025", time: "2:45 PM", type: "Send", asset: "ETH", amount: "-0.5", ref: "3f8a...92c0a", status: "Completed" },
  { date: "19 Nov, 2025", time: "2:45 PM", type: "Deposit", asset: "BTC", amount: "+0.00234", ref: "3f8a...92c0a", status: "Completed" },
  { date: "19 Nov, 2025", time: "2:45 PM", type: "Send", asset: "BTC", amount: "-0.000212", ref: "3f8a...92c0a", status: "Completed" },
];