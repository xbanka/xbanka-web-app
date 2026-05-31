import { AppleIcon, ArrowDownCircle, ArrowLeftRight, ArrowUpCircle, BadgeCheck, BarChart2, Bell, Bitcoin, Clock, IdCard, Laptop, Repeat, ShieldCheck } from "lucide-react";
import { NotifGroup, Tab } from "./types/notification-types";

// export const MARKET = [
//   { name: "Bitcoin", symbol: "BTC", price: "92,300", change: "3.21", up: true },
//   {
//     name: "Ethereum",
//     symbol: "ETH",
//     price: "87,500",
//     change: "4.15",
//     up: true,
//   },
//   {
//     name: "Tether",
//     symbol: "USDT",
//     price: "76,800",
//     change: "2.78",
//     up: false,
//   },
//   {
//     name: "Tether",
//     symbol: "USDT",
//     price: "76,800",
//     change: "2.78",
//     up: false,
//   },
//   {
//     name: "Tether",
//     symbol: "USDT",
//     price: "76,800",
//     change: "2.78",
//     up: false,
//   },
//   { name: "Ripple", symbol: "XRP", price: "85,400", change: "4.98", up: true },
// ];

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

export const HOLDINGS = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    amount: "0.00234",
    value: "₦93,250",
    change: "3.21",
    up: true,
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    amount: "28.3245",
    value: "₦54,750",
    change: "4.15",
    up: true,
  },
  {
    name: "Tether",
    symbol: "USDT",
    amount: "823.50",
    value: "₦12,800",
    change: "2.78",
    up: false,
  },
  {
    name: "USDC",
    symbol: "USD",
    amount: "234.45",
    value: "₦76,250",
    change: "4.98",
    up: true,
  },
];


export const HOW_TO_STEPS = [
  { n: 1, title: "Select Amount", desc: "Enter the amount you want to trade" },
  { n: 2, title: "Get Quote", desc: "Lock in best rate" },
  {
    n: 3,
    title: "Confirm Order",
    desc: "Review your transaction details and confirm your order",
  },
  {
    n: 4,
    title: "Receive Crypto",
    desc: "Your crypto will be credited to your wallet instantly",
  },
];

export const UNLOCKED_FEATURES = [
  { label: "Add Funds" },
  { label: "Send Money" },
  { label: "Gift Cards" },
  { label: "Bills Payment" },
];

export type GiftTab = "overview" | "sell" | "history";
 
// ─── Mock data ───────────────────────────────────────────────────────────────
export const CARD_RATES = [
  { name: "Apple", bg: "#6C47FF", rate: "₦100 per $1", change: "+1.8%", up: true },
  { name: "Amazon", bg: "#FF9900", rate: "₦120 per $1", change: "+1.8%", up: true },
  { name: "Google Play", bg: "#34A853", rate: "₦85 per $1", change: "+1.8%", up: true },
  { name: "Netflix", bg: "#E50914", rate: "₦120 per $1", change: "+1.8%", up: true },
  { name: "Spotify", bg: "#1DB954", rate: "₦120 per $1", change: "+1.8%", up: true },
  { name: "Xbox", bg: "#107C10", rate: "₦120 per $1", change: "+1.8%", up: true },
];
 
export const GIFT_TRANSACTIONS = [
  { date: "19 Nov, 2025", time: "2:45 PM", ref: "TD13245625VDR8", cardType: "Amazon", amount: "$100.00", payout: "₦85,000", region: "US", status: "Completed" },
  { date: "19 Nov, 2025", time: "2:45 PM", ref: "TD13245625VDR8", cardType: "Amazon", amount: "$100.00", payout: "₦85,000", region: "UK", status: "In Progress" },
  { date: "19 Nov, 2025", time: "2:45 PM", ref: "TD13245625VDR8", cardType: "Amazon", amount: "$100.00", payout: "₦85,000", region: "UK", status: "Pending" },
  { date: "19 Nov, 2025", time: "2:45 PM", ref: "TD13245625VDR8", cardType: "Amazon", amount: "$100.00", payout: "₦85,000", region: "UK", status: "Completed" },
];

// ─── Mock data ───────────────────────────────────────────────────────────────
export const CATEGORIES = [
  {
    id: "airtime",
    name: "Airtime & Data",
    desc: "Top up your mobile phone & others",
    icon: "📱",
    color: "bg-blue-500",
  },
  {
    id: "electricity",
    name: "Electricity",
    desc: "Pay your power bills",
    icon: "⚡",
    color: "bg-green-500",
  },
  {
    id: "internet",
    name: "Internet",
    desc: "Renew your broadband",
    icon: "🌐",
    color: "bg-yellow-500",
  },
  {
    id: "cable",
    name: "Cable TV",
    desc: "Subscribe to your favorite channels",
    icon: "📺",
    color: "bg-red-500",
  },
  {
    id: "betting",
    name: "Betting",
    desc: "Top up your betting account",
    icon: "🎰",
    color: "bg-purple-500",
  },
  {
    id: "government",
    name: "Government",
    desc: "Taxes, licenses & permits",
    icon: "🏛️",
    color: "bg-pink-500",
  },
  {
    id: "education",
    name: "Education",
    desc: "Pay for school fees & courses",
    icon: "🎓",
    color: "bg-teal-500",
  },
  {
    id: "others",
    name: "Others",
    desc: "More services and billers",
    icon: "⚙️",
    color: "bg-Green",
  },
];
 
export const RECENT_TRANSACTIONS = [
  { name: "MTN Airtime", number: "080 123 45678", time: "Today, 2:30 PM", amount: "₦1,000.00", status: "Completed" },
  { name: "MTN Airtime", number: "080 123 45678", time: "Today, 2:30 PM", amount: "₦1,000.00", status: "Completed" },
  { name: "MTN Airtime", number: "080 123 45678", time: "Today, 2:30 PM", amount: "₦1,000.00", status: "Completed" },
  { name: "MTN Airtime", number: "080 123 45678", time: "Today, 2:30 PM", amount: "₦1,000.00", status: "Completed" },
];
 
export const QUICK_ACTIONS = [
  {
    label: "Repeat Last Payment",
    sub: "MTN Airtime - ₦1,500",
    icon: Repeat,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    label: "Schedule Payment",
    sub: "Set up recurring bills",
    icon: Clock,
    color: "bg-green-500/10 text-green-500",
  },
  {
    label: "Set Reminders",
    sub: "Set reminders before due dates",
    icon: Bell,
    color: "bg-Green/10 text-Green",
  },
  {
    label: "View Analytics",
    sub: "View spending patterns",
    icon: BarChart2,
    color: "bg-pink-500/10 text-pink-500",
  },
];

export const P2P_LISTINGS = Array(7).fill(null).map((_, i) => ({
  name: "John Doe",
  stats: "1,500 successful trades • 99% Completion rate",
  meta: `${5 + i} mins • Joined ${1 + i} years ago`,
  price: "1,490",
  amount: "8,200.45 USDT",
  limit: "₦40,000 - ₦600,000",
  method: "Bank Transfer",
}));

export const ALL_GROUPS: NotifGroup[] = [
  {
    label: "Today",
    items: [
      {
        id: "a1",
        icon: ArrowDownCircle,
        type: "green",
        title: "Deposit Successful",
        desc: "You have successfully deposited ₦500.00 into your main account.",
        time: "2 mins ago",
        unread: true,
      },
      {
        id: "a2",
        icon: ArrowUpCircle,
        type: "red",
        title: "Payment Sent",
        desc: "Your transfer of ₦120.00 to Netflix Inc. was successful.",
        time: "1h ago",
        unread: true,
      },
      {
        id: "a3",
        icon: ShieldCheck,
        type: "gray",
        title: "Security Update",
        desc: "New login detected on Chrome on Mac OS. If this wasn't you, please secure your account.",
        time: "3h ago",
      },
    ],
  },
  {
    label: "Yesterday",
    items: [
      {
        id: "a4",
        icon: ArrowDownCircle,
        type: "green",
        title: "Deposit Successful",
        desc: "You have successfully deposited ₦500.00 into your main account.",
        time: "Yesterday",
      },
      {
        id: "a5",
        icon: ArrowUpCircle,
        type: "red",
        title: "Payment Sent",
        desc: "Your transfer of ₦120.00 to Netflix Inc. was successful.",
        time: "Yesterday",
      },
      {
        id: "a6",
        icon: ShieldCheck,
        type: "gray",
        title: "Security Update",
        desc: "New login detected on Chrome on Mac OS. If this wasn't you, please secure your account.",
        time: "Yesterday",
      },
    ],
  },
];
 
export const TXN_GROUPS: NotifGroup[] = [
  {
    label: "Today",
    items: [
      {
        id: "t1",
        icon: ArrowDownCircle,
        type: "amber",
        title: "Crypto Sold",
        desc: "You sold 0.023 ETH for ₦54,750.",
        time: "2 mins ago",
        unread: true,
      },
      {
        id: "t2",
        icon: ArrowDownCircle,
        type: "green",
        title: "Funds Received",
        desc: "You have successfully deposited ₦50,000.00 into your wallet.",
        time: "2 mins ago",
        unread: true,
      },
      {
        id: "t3",
        icon: ArrowDownCircle,
        type: "green",
        title: "Funds Received",
        desc: "You received ₦45,000.00 from Adewale Okonkwo.",
        time: "3h ago",
      },
      {
        id: "t4",
        icon: ArrowUpCircle,
        type: "red",
        title: "Funds Sent",
        desc: "You sent ₦10,000 to GTBank — 0123456789.",
        time: "3h ago",
      },
    ],
  },
  {
    label: "Yesterday",
    items: [
      {
        id: "t5",
        icon: Bitcoin,
        type: "amber",
        title: "Crypto Sold",
        desc: "You bought 0.05 BTC via Card ending in 4452.",
        time: "Yesterday",
      },
      {
        id: "t6",
        icon: ArrowLeftRight,
        type: "blue",
        title: "Crypto Converted",
        desc: "You converted 100 USDT to ₦15,000.",
        time: "Yesterday",
      },
    ],
  },
];
 
export const ACT_GROUPS: NotifGroup[] = [
  {
    label: "Today",
    items: [
      {
        id: "ac1",
        icon: IdCard,
        type: "red",
        title: "ID Verification Rejected",
        desc: "Your ID document was rejected. Please re-upload a clear, valid document.",
        time: "2 mins ago",
        unread: true,
        actionLabel: "Re-upload",
      },
      {
        id: "ac2",
        icon: BadgeCheck,
        type: "green",
        title: "BVN Verified Successfully",
        desc: "Your BVN has been verified. You can now send money and add funds above ₦150,000.",
        time: "1h ago",
      },
      {
        id: "ac3",
        icon: Laptop,
        type: "amber",
        title: "New Device Login Detected",
        desc: "A new login was detected on Chrome, Windows. If this wasn't you, secure your account immediately.",
        time: "3h ago",
        unread: true,
        actionLabel: "Review",
      },
    ],
  },
];
 
export const TABS: { key: Tab; label: string; groups: NotifGroup[] }[] = [
  { key: "all",          label: "All",          groups: ALL_GROUPS },
  { key: "transactions", label: "Transactions", groups: TXN_GROUPS },
  { key: "activities",   label: "Activities",   groups: ACT_GROUPS },
];