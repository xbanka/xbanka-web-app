/**
 * Sections that are announced in the navigation but not built yet. Each one
 * opens the animated "coming soon" page instead of being a dead link.
 * Remove a section from here (and its route) once it ships.
 */

export type ComingSoonId = "gift-cards" | "p2p" | "affiliate" | "referrals";

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
  p2p: {
    id: "p2p",
    title: "P2P Marketplace",
    group: "Trading",
    accent: "#4F46E5",
    description:
      "Buy and sell crypto directly with other Xbanka users, at prices you agree on.",
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

/** The message emailed to support when someone asks to be told at launch. */
export const launchNotifyMessage = (title: string) =>
  `Please let me know when ${title} is live on Xbanka.`;

const NOTIFY_KEY = "xbanka-launch-notify";

/** Things this browser has already asked to hear about, by key
 *  ("gift-cards", "bills:data", …). */
export const readNotified = (): string[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(NOTIFY_KEY) ?? "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

export const rememberNotified = (id: string) => {
  try {
    const next = Array.from(new Set([...readNotified(), id]));
    localStorage.setItem(NOTIFY_KEY, JSON.stringify(next));
  } catch {
    // Private mode or blocked storage: the request was still sent.
  }
};
