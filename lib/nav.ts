import {
  User,
  Settings,
  Gift,
  HelpCircle,
  ShieldCheck,
  BadgeCheck,
  Star,
} from "lucide-react";
// The sidebar uses the Figma icon set; the profile menu keeps Lucide for now.
import {
  AccountIcon,
  AffiliateIcon,
  BillPaymentsIcon,
  CryptoIcon,
  DashboardIcon,
  GiftCardsIcon,
  HelpSupportIcon,
  MarketOverviewIcon,
  P2pMarketplaceIcon,
  ReferralsRewardsIcon,
  SettingsIcon,
  TransactionsIcon,
  WalletIcon,
} from "@/components/icons/nav-icons";

export const NAV: NavSection[] = [
  {
    title: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", icon: DashboardIcon }],
  },
  {
    title: "Wallet & Services",
    items: [
      { id: "wallet", label: "Wallet", icon: WalletIcon },
      { id: "account", label: "Account", icon: AccountIcon },
      { id: "bill-payment", label: "Bill Payments", icon: BillPaymentsIcon },
      {
        id: "gift-cards",
        label: "Gift Cards",
        icon: GiftCardsIcon,
        disabled: true,
        badge: "Soon",
        badgeColor:
          "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-sm border border-[#A27D00] px-2",
      },
    ],
  },
  {
    title: "Trading",
    items: [
      { id: "crypto", label: "Crypto", icon: CryptoIcon },
      {
        id: "p2p",
        label: "P2P Marketplace",
        icon: P2pMarketplaceIcon,
        badge: "Soon",
        badgeColor:
          "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-sm border border-[#A27D00] px-2",
        disabled: true,
      },
      {
        id: "market",
        label: "Market Overview",
        icon: MarketOverviewIcon,
      },
    ],
  },
  {
    title: "Insights",
    items: [
      {
        id: "transactions",
        label: "Transactions",
        icon: TransactionsIcon,
      },
      // { id: "analytics", label: "Analytics", icon: AnalyticsIcon, badge: "Beta", badgeColor: "bg-blue-500/20 text-blue-400" },
    ],
  },
  {
    title: "Settings & Support",
    items: [
      {
        id: "settings",
        label: "Settings",
        icon: SettingsIcon,
        disabled: true,
        badge: "Soon",
        badgeColor:
          "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-sm border border-[#A27D00] px-2",
      },
      {
        id: "affiliate",
        label: "Affiliate",
        icon: AffiliateIcon,
        disabled: true,
        badge: "Soon",
        badgeColor:
          "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-sm border border-[#A27D00] px-2",
      },
      {
        id: "referrals",
        label: "Referrals & Rewards",
        icon: ReferralsRewardsIcon,
        disabled: true,
        badge: "Soon",
        badgeColor:
          "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-sm border border-[#A27D00] px-2",
      },
      {
        id: "help",
        label: "Help & Support",
        icon: HelpSupportIcon,
        disabled: true,
        badge: "Soon",
        badgeColor:
          "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-sm border border-[#A27D00] px-2",
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
      "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-sm border border-[#A27D00] px-2",
  },
  {
    icon: Star,
    label: "Rewards",
    href: "#",
    disabled: true,
    badge: "Soon",
    badgeColor:
      "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-sm border border-[#A27D00] px-2",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "#",
    disabled: true,
    badge: "Soon",
    badgeColor:
      "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-sm border border-[#A27D00] px-2",
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
    href: "#",
    disabled: true,
    badge: "Soon",
    badgeColor:
      "bg-[#3E2E00] text-[#FEC84B] font-normal text-[12px] leading-4.5 rounded-sm border border-[#A27D00] px-2",
  },
];
