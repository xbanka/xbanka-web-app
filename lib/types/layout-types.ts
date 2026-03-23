type PageId = "dashboard" | "wallet" | "account" | "gift-cards" | "bills" |
  "crypto" | "p2p" | "market" | "transactions" | "analytics" |
  "settings" | "affiliate" | "referrals" | "help";
 
interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}
 
interface NavSection {
  title: string;
  items: NavItem[];
}