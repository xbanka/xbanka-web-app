import {
  LayoutDashboard,
  Wallet,
  User,
  CreditCard,
  Receipt,
  Bitcoin,
  ArrowLeftRight,
  TrendingUp,
  ClipboardList,
  BarChart2,
  Settings,
  Users,
  Gift,
  HelpCircle,
  ShieldCheck,
  BadgeCheck,
  Star,
} from "lucide-react";

export const NAV: NavSection[] = [
  {
    title: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Wallet & Services",
    items: [
      { id: "wallet", label: "Wallet", icon: Wallet },
      { id: "account", label: "Account", icon: User },
      {
        id: "gift-cards",
        label: "Gift Cards",
        icon: CreditCard,
        disabled: true,
        badge: "Soon",
        badgeColor:
          "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-[4px] border border-[#A27D00] px-2",
      },
      {
        id: "bill-payment",
        label: "Bill Payments",
        icon: Receipt,
        disabled: true,
        badge: "Soon",
        badgeColor:
          "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-[4px] border border-[#A27D00] px-2",
      },
    ],
  },
  {
    title: "Trading",
    items: [
      { id: "crypto", label: "Crypto", icon: Bitcoin },
      {
        id: "p2p",
        label: "P2P Marketplace",
        icon: ArrowLeftRight,
        badge: "Soon",
        badgeColor:
          "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-[4px] border border-[#A27D00] px-2",
        disabled: true,
      },
      {
        id: "market",
        label: "Market Overview",
        icon: TrendingUp,
        disabled: true,
      },
    ],
  },
  {
    title: "Insights",
    items: [
      {
        id: "transactions",
        label: "Transactions",
        icon: ClipboardList,
        disabled: true,
      },
      // { id: "analytics", label: "Analytics", icon: BarChart2, badge: "Beta", badgeColor: "bg-blue-500/20 text-blue-400" },
    ],
  },
  {
    title: "Settings & Support",
    items: [
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        disabled: true,
        badge: "Soon",
        badgeColor:
          "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-[4px] border border-[#A27D00] px-2",
      },
      {
        id: "affiliate",
        label: "Affiliate",
        icon: Users,
        disabled: true,
        badge: "Soon",
        badgeColor:
          "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-[4px] border border-[#A27D00] px-2",
      },
      {
        id: "referrals",
        label: "Referrals & Rewards",
        icon: Gift,
        disabled: true,
        badge: "Soon",
        badgeColor:
          "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-[4px] border border-[#A27D00] px-2",
      },
      {
        id: "help",
        label: "Help & Support",
        icon: HelpCircle,
        disabled: true,
        badge: "Soon",
        badgeColor:
          "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-[4px] border border-[#A27D00] px-2",
      },
    ],
  },
];

export const MENU_ITEMS = [
  { icon: User, label: "My Profile", href: "/account" },
  { icon: ShieldCheck, label: "Security", href: "/account?tab=security" },
  {
    icon: BadgeCheck,
    label: "Verification Status",
    href: "/account?tab=identity",
  },
  {
    icon: Gift,
    label: "Refer & Earn",
    href: "#",
    disabled: true,
    badge: "Soon",
    badgeColor:
      "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-[4px] border border-[#A27D00] px-2",
  },
  {
    icon: Star,
    label: "Rewards",
    href: "#",
    disabled: true,
    badge: "Soon",
    badgeColor:
      "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-[4px] border border-[#A27D00] px-2",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "#",
    disabled: true,
    badge: "Soon",
    badgeColor:
      "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-[4px] border border-[#A27D00] px-2",
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
    href: "#",
    disabled: true,
    badge: "Soon",
    badgeColor:
      "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-[4px] border border-[#A27D00] px-2",
  },
];
