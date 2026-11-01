import type { DriveStep } from "driver.js";
import type { TourIconName } from "./tour-icons";

/**
 * One short tour per main section of the app. Each runs once per user (see
 * `lib/productTour.ts`) the first time that section is opened, and can be
 * replayed from "Take a tour" in the profile menu.
 *
 * Targets are `data-tour` attributes on the page. A stop whose target is not
 * on the page when the tour starts (e.g. the cards of a wallet tab that is
 * not open) is left out, so each list can describe the whole section.
 */
export type TourId =
  | "dashboard"
  | "wallet"
  | "crypto"
  | "bills"
  | "account"
  | "market"
  | "transactions";

export type TourContext = {
  /** Tailwind's `md` and up: the sidebar shows instead of the bottom tab bar. */
  desktop: boolean;
};

export type Tour = {
  id: TourId;
  /** Shown above every stop's title, e.g. "Wallet tour". */
  label: string;
  steps: (ctx: TourContext) => DriveStep[];
};

type Stop = {
  element: string;
  icon: TourIconName;
  title: string;
  description: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
};

/** The icon rides along in `data`, which driver.js hands back to the popover renderer. */
const stop = ({ element, icon, title, description, side, align }: Stop): DriveStep => ({
  element,
  popover: { title, description, side, align },
  data: { icon },
});

export const TOURS: Record<TourId, Tour> = {
  dashboard: {
    id: "dashboard",
    label: "Dashboard tour",
    // Navigation has two targets per page because the desktop sidebar and the
    // mobile tab bar are both in the DOM, one hidden by CSS, so a shared
    // selector would match the invisible one.
    steps: ({ desktop }) => [
      stop({
        element: "[data-tour=balance]",
        icon: "nav-wallet",
        title: "Your total asset value",
        description:
          "Naira and crypto balances in one figure. Switch between NGN and USDT, or tap the eye to hide it.",
      }),
      stop({
        element: "[data-tour=add-funds]",
        icon: "banknote",
        title: "Add funds",
        description:
          "Top up your naira wallet by bank transfer. Deposits land here within minutes.",
        side: desktop ? "left" : "bottom",
      }),
      stop({
        element: "[data-tour=verification]",
        icon: "shield-check",
        title: "Complete verification",
        description:
          "Finish these steps to unlock higher limits and transfers to other banks and wallets.",
      }),
      stop({
        element: "[data-tour=quick-actions]",
        icon: "zap",
        title: "Quick actions",
        description:
          "Buy or sell crypto, and pay for airtime, data and electricity from here.",
        side: "top",
      }),
      stop({
        element: desktop ? "[data-tour=nav-wallet]" : "[data-tour=tab-wallet]",
        icon: "nav-wallet",
        title: "Your wallet",
        description:
          "Every balance, deposit and withdrawal lives here. It has its own short tour.",
        side: desktop ? "right" : "top",
      }),
      stop({
        element: desktop ? "[data-tour=nav-crypto]" : "[data-tour=tab-crypto]",
        icon: "nav-crypto",
        title: "Trade crypto",
        description: "Buy and sell BTC, ETH, USDT and USDC at live rates.",
        side: desktop ? "right" : "top",
      }),
      stop({
        element: "[data-tour=notifications]",
        icon: "bell",
        title: "Notifications",
        description: "Deposit confirmations and security alerts land here.",
        side: "bottom",
        align: "end",
      }),
      stop({
        element: "[data-tour=profile-menu]",
        icon: "nav-account",
        title: "Your profile",
        description:
          "Manage your details, security settings and verification status. You can replay any tour from here.",
        side: "bottom",
        align: "end",
      }),
    ],
  },

  wallet: {
    id: "wallet",
    label: "Wallet tour",
    steps: () => [
      stop({
        element: "[data-tour=wallet-tabs]",
        icon: "nav-wallet",
        title: "Three views of your money",
        description:
          "Fiat is your naira wallet, Crypto is your coin holdings, and History lists every transaction across both.",
      }),
      stop({
        element: "[data-tour=wallet-fiat-balance]",
        icon: "banknote",
        title: "Available naira balance",
        description:
          "What you can spend or send right now. Tap the eye to hide it.",
      }),
      stop({
        element: "[data-tour=wallet-add-fund]",
        icon: "plus",
        title: "Add funds",
        description: "Top up by bank transfer to your Xbanka funding account.",
      }),
      stop({
        element: "[data-tour=wallet-send]",
        icon: "send",
        title: "Send money",
        description:
          "Transfer naira to any bank account or Xbanka user. You will set a transaction PIN the first time.",
      }),
      stop({
        element: "[data-tour=wallet-crypto-balance]",
        icon: "nav-crypto",
        title: "Crypto balance",
        description:
          "Deposit coins to your Xbanka address, send them out, or convert between assets.",
      }),
      stop({
        element: "[data-tour=wallet-holdings]",
        icon: "coins",
        title: "Your holdings",
        description: "Every coin you hold, with its balance and quick actions.",
      }),
      stop({
        element: "[data-tour=wallet-history]",
        icon: "nav-transactions",
        title: "Transaction history",
        description:
          "Search, filter by status or type, and tap any row for a receipt.",
        side: "top",
      }),
    ],
  },

  crypto: {
    id: "crypto",
    label: "Crypto tour",
    steps: () => [
      stop({
        element: "[data-tour=crypto-tabs]",
        icon: "nav-crypto",
        title: "Buy & Sell, or Convert",
        description:
          "Trade crypto with naira here, or swap one coin for another under Convert.",
      }),
      stop({
        element: "[data-tour=crypto-mode]",
        icon: "arrow-up-down",
        title: "Buying or selling?",
        description:
          "Buy spends naira from your wallet. Sell turns crypto back into naira.",
      }),
      stop({
        element: "[data-tour=crypto-form]",
        icon: "sliders-horizontal",
        title: "Set your amount",
        description:
          "Enter what you pay and pick the coin. What you receive updates with the live rate.",
      }),
      stop({
        element: "[data-tour=crypto-quote]",
        icon: "lock",
        title: "Lock in a quote",
        description:
          "Get Quote freezes the rate for a short window while you confirm with your transaction PIN.",
        side: "top",
      }),
      stop({
        element: "[data-tour=crypto-convert-form]",
        icon: "refresh-cw",
        title: "Convert between coins",
        description:
          "Pick what you have and what you want. Conversions carry no fee.",
      }),
      stop({
        element: "[data-tour=crypto-how-to]",
        icon: "list-checks",
        title: "How a trade works",
        description:
          "A quick refresher on each step, from quote to confirmation.",
        side: "top",
      }),
    ],
  },

  bills: {
    id: "bills",
    label: "Bill payments tour",
    steps: () => [
      stop({
        element: "[data-tour=bills-search]",
        icon: "search",
        title: "Find a biller fast",
        description:
          "Search by name, like MTN, IKEDC or DSTV, across every category.",
      }),
      stop({
        element: "[data-tour=bills-categories]",
        icon: "nav-bill-payments",
        title: "Browse by category",
        description:
          "Airtime, data, electricity, cable TV and betting. Pick one to see its providers.",
      }),
      stop({
        element: "[data-tour=bills-favourites]",
        icon: "star",
        title: "Your favourites",
        description:
          "Bills you save come back here with the details prefilled.",
      }),
      stop({
        element: "[data-tour=bills-recent]",
        icon: "nav-transactions",
        title: "Recent payments",
        description:
          "Your latest bills with their status. Tap one for the receipt or to pay it again.",
        side: "top",
      }),
    ],
  },

  account: {
    id: "account",
    label: "Account tour",
    steps: () => [
      stop({
        element: "[data-tour=account-tabs]",
        icon: "nav-account",
        title: "Your account, in three tabs",
        description:
          "Account Info holds your details, Security your password, PIN and devices, and Identity Verification your KYC.",
      }),
      stop({
        element: "[data-tour=account-profile]",
        icon: "nav-account",
        title: "Profile",
        description:
          "Update your photo and personal details. Your UID is what other Xbanka users send money to.",
      }),
      stop({
        element: "[data-tour=account-funding]",
        icon: "landmark",
        title: "Deposit and withdrawal accounts",
        description:
          "Your Xbanka funding account for top-ups, and the bank accounts you withdraw to.",
        side: "top",
      }),
      stop({
        element: "[data-tour=account-security]",
        icon: "shield",
        title: "Security controls",
        description:
          "Change your password, set a transaction PIN and turn on two-factor authentication.",
      }),
      stop({
        element: "[data-tour=account-identity]",
        icon: "badge-check",
        title: "Verification progress",
        description: "Each completed step raises your tier and your limits.",
      }),
    ],
  },

  market: {
    id: "market",
    label: "Market tour",
    steps: () => [
      stop({
        element: "[data-tour=market-controls]",
        icon: "nav-market-overview",
        title: "Browse the market",
        description:
          "Switch between Spot and Futures, filter new listings, or search for a coin.",
      }),
      stop({
        element: "[data-tour=market-table]",
        icon: "nav-market-overview",
        title: "Live prices",
        description:
          "Prices update in real time. Star a coin to pin it under Favorites, or tap Buy to trade it straight away.",
      }),
    ],
  },

  transactions: {
    id: "transactions",
    label: "Transactions tour",
    steps: ({ desktop }) => [
      stop({
        element: "[data-tour=transactions-summary]",
        icon: "nav-transactions",
        title: "Your month at a glance",
        description:
          "Naira in, out and still pending over the last 30 days.",
      }),
      stop({
        element: "[data-tour=transactions-filters]",
        icon: "search",
        title: "Find any transaction",
        description:
          "Switch between fiat, crypto, bills and gift cards, search by reference or amount, or filter by status.",
      }),
      stop({
        element: desktop
          ? "[data-tour=transactions-list]"
          : "[data-tour=transactions-list-mobile]",
        icon: "receipt",
        title: "Tap for the receipt",
        description:
          "Every transaction opens its receipt, which you can download or share.",
        side: "top",
      }),
    ],
  },
};

/** Route → tour. Query strings are not part of `pathname`; a trailing slash is ignored. */
const TOUR_BY_PATH: Record<string, TourId> = {
  "/": "dashboard",
  "/wallet": "wallet",
  "/crypto": "crypto",
  "/bill-payment": "bills",
  "/account": "account",
  "/market": "market",
  "/transactions": "transactions",
};

export const tourForPath = (pathname: string): Tour | undefined => {
  const path = pathname.replace(/\/+$/, "") || "/";
  const id = TOUR_BY_PATH[path];
  return id ? TOURS[id] : undefined;
};
