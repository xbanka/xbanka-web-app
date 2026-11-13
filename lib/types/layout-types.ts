type PageId = "dashboard" | "wallet" | "account" | "gift-cards" | "bill-payment" |
  "crypto" | "p2p" | "market" | "transactions" | "analytics" |
  "settings" | "affiliate" | "referrals" | "help";
 
interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  /** Not built yet: links to its coming-soon page and is marked in the nav. */
  soon?: boolean;
  disabled?: boolean,
}
 
interface NavSection {
  title: string;
  items: NavItem[];
}

type AccountTab = "info" | "security" | "identity";