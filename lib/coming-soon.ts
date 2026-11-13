/**
 * Sections that are announced in the navigation but not built yet. Each one
 * opens the animated "coming soon" page instead of being a dead link.
 * Remove a section from here (and its route) once it ships.
 */

export type ComingSoonId = "gift-cards" | "affiliate" | "referrals";

export type ComingSoonSection = {
  id: ComingSoonId;
  title: string;
  group: string;
  /** Paint colour of the card in the animation. */
  accent: string;
  description: string;
};

export const COMING_SOON: Record<ComingSoonId, ComingSoonSection> = {
  "gift-cards": {
    id: "gift-cards",
    title: "Gift Cards",
    group: "Wallet & Services",
    accent: "#C003A2",
    description:
      "Buy and sell gift cards like Amazon, Visa and Starbucks, paid straight from your Xbanka wallet.",
  },
  affiliate: {
    id: "affiliate",
    title: "Affiliate",
    group: "Settings & Support",
    accent: "#0066CC",
    description:
      "Share Xbanka with your audience and earn from the users you bring in.",
  },
  referrals: {
    id: "referrals",
    title: "Referrals & Rewards",
    group: "Settings & Support",
    accent: "#A27D00",
    description:
      "Invite friends to Xbanka and earn rewards when they start trading.",
  },
};
