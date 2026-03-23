import {
  LayoutDashboard, Wallet, User, CreditCard, Receipt,
  Bitcoin, ArrowLeftRight, TrendingUp, ClipboardList, BarChart2,
  Settings, Users, Gift, HelpCircle
} from "lucide-react";

export const NAV: NavSection[] = [
  {
    title: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Wallet & Services",
    items: [
      { id: "wallet", label: "Wallet", icon: Wallet },
      { id: "account", label: "Account", icon: User },
      { id: "gift-cards", label: "Gift Cards", icon: CreditCard },
      { id: "bills", label: "Bill Payments", icon: Receipt },
    ],
  },
  {
    title: "Trading",
    items: [
      { id: "crypto", label: "Crypto", icon: Bitcoin },
      { id: "p2p", label: "P2P Marketplace", icon: ArrowLeftRight, badge: "Soon", badgeColor: "bg-orange-500/20 text-orange-400" },
      { id: "market", label: "Market Overview", icon: TrendingUp },
    ],
  },
  {
    title: "Insights",
    items: [
      { id: "transactions", label: "Transactions", icon: ClipboardList },
      { id: "analytics", label: "Analytics", icon: BarChart2, badge: "Beta", badgeColor: "bg-blue-500/20 text-blue-400" },
    ],
  },
  {
    title: "Settings & Support",
    items: [
      { id: "settings", label: "Settings", icon: Settings },
      { id: "affiliate", label: "Affiliate", icon: Users },
      { id: "referrals", label: "Referrals & Rewards", icon: Gift },
      { id: "help", label: "Help & Support", icon: HelpCircle },
    ],
  },
];