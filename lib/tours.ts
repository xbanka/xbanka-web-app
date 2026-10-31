import type { DriveStep } from "driver.js";

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
  | "market";

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

const stop = (
  element: string,
  title: string,
  description: string,
  popover: Omit<NonNullable<DriveStep["popover"]>, "title" | "description"> = {},
): DriveStep => ({ element, popover: { title, description, ...popover } });

export const TOURS: Record<TourId, Tour> = {
  dashboard: {
    id: "dashboard",
    label: "Dashboard tour",
    // Navigation has two targets per page because the desktop sidebar and the
    // mobile tab bar are both in the DOM, one hidden by CSS, so a shared
    // selector would match the invisible one.
    steps: ({ desktop }) => [
      stop(
        "[data-tour=balance]",
        "Your total asset value",
        "Naira and crypto balances in one figure. Switch between NGN and USDT, or tap the eye to hide it.",
      ),
      stop(
        "[data-tour=add-funds]",
        "Add funds",
        "Top up your naira wallet by bank transfer. Deposits land here within minutes.",
        { side: desktop ? "left" : "bottom" },
      ),
      stop(
        "[data-tour=verification]",
        "Complete verification",
        "Finish these steps to unlock higher limits and transfers to other banks and wallets.",
      ),
      stop(
        "[data-tour=quick-actions]",
        "Quick actions",
        "Buy or sell crypto, and pay for airtime, data and electricity from here.",
        { side: "top" },
      ),
      stop(
        desktop ? "[data-tour=nav-wallet]" : "[data-tour=tab-wallet]",
        "Your wallet",
        "Every balance, deposit and withdrawal lives here. It has its own short tour.",
        { side: desktop ? "right" : "top" },
      ),
      stop(
        desktop ? "[data-tour=nav-crypto]" : "[data-tour=tab-crypto]",
        "Trade crypto",
        "Buy and sell BTC, ETH, USDT and USDC at live rates.",
        { side: desktop ? "right" : "top" },
      ),
      stop(
        "[data-tour=notifications]",
        "Notifications",
        "Deposit confirmations and security alerts land here.",
        { side: "bottom", align: "end" },
      ),
      stop(
        "[data-tour=profile-menu]",
        "Your profile",
        "Manage your details, security settings and verification status. You can replay any tour from here.",
        { side: "bottom", align: "end" },
      ),
    ],
  },

  wallet: {
    id: "wallet",
    label: "Wallet tour",
    steps: () => [
      stop(
        "[data-tour=wallet-tabs]",
        "Three views of your money",
        "Fiat is your naira wallet, Crypto is your coin holdings, and History lists every transaction across both.",
      ),
      stop(
        "[data-tour=wallet-fiat-balance]",
        "Available naira balance",
        "What you can spend or send right now. Tap the eye to hide it.",
      ),
      stop(
        "[data-tour=wallet-add-fund]",
        "Add funds",
        "Top up by bank transfer to your Xbanka funding account.",
      ),
      stop(
        "[data-tour=wallet-send]",
        "Send money",
        "Transfer naira to any bank account or Xbanka user. You will set a transaction PIN the first time.",
      ),
      stop(
        "[data-tour=wallet-crypto-balance]",
        "Crypto balance",
        "Deposit coins to your Xbanka address, send them out, or convert between assets.",
      ),
      stop(
        "[data-tour=wallet-holdings]",
        "Your holdings",
        "Every coin you hold, with its balance and quick actions.",
      ),
      stop(
        "[data-tour=wallet-history]",
        "Transaction history",
        "Search, filter by status or type, and tap any row for a receipt.",
        { side: "top" },
      ),
    ],
  },

  crypto: {
    id: "crypto",
    label: "Crypto tour",
    steps: () => [
      stop(
        "[data-tour=crypto-tabs]",
        "Buy & Sell, or Convert",
        "Trade crypto with naira here, or swap one coin for another under Convert.",
      ),
      stop(
        "[data-tour=crypto-mode]",
        "Buying or selling?",
        "Buy spends naira from your wallet. Sell turns crypto back into naira.",
      ),
      stop(
        "[data-tour=crypto-form]",
        "Set your amount",
        "Enter what you pay and pick the coin. What you receive updates with the live rate.",
      ),
      stop(
        "[data-tour=crypto-quote]",
        "Lock in a quote",
        "Get Quote freezes the rate for a short window while you confirm with your transaction PIN.",
        { side: "top" },
      ),
      stop(
        "[data-tour=crypto-convert-form]",
        "Convert between coins",
        "Pick what you have and what you want. Conversions carry no fee.",
      ),
      stop(
        "[data-tour=crypto-how-to]",
        "How a trade works",
        "A quick refresher on each step, from quote to confirmation.",
        { side: "top" },
      ),
    ],
  },

  bills: {
    id: "bills",
    label: "Bill payments tour",
    steps: () => [
      stop(
        "[data-tour=bills-search]",
        "Find a biller fast",
        "Search by name, like MTN, IKEDC or DSTV, across every category.",
      ),
      stop(
        "[data-tour=bills-categories]",
        "Browse by category",
        "Airtime, data, electricity, cable TV and betting. Pick one to see its providers.",
      ),
      stop(
        "[data-tour=bills-favourites]",
        "Your favourites",
        "Bills you save come back here with the details prefilled.",
      ),
      stop(
        "[data-tour=bills-recent]",
        "Recent payments",
        "Your latest bills with their status. Tap one for the receipt or to pay it again.",
        { side: "top" },
      ),
    ],
  },

  account: {
    id: "account",
    label: "Account tour",
    steps: () => [
      stop(
        "[data-tour=account-tabs]",
        "Your account, in three tabs",
        "Account Info holds your details, Security your password, PIN and devices, and Identity Verification your KYC.",
      ),
      stop(
        "[data-tour=account-profile]",
        "Profile",
        "Update your photo and personal details. Your UID is what other Xbanka users send money to.",
      ),
      stop(
        "[data-tour=account-funding]",
        "Deposit and withdrawal accounts",
        "Your Xbanka funding account for top-ups, and the bank accounts you withdraw to.",
        { side: "top" },
      ),
      stop(
        "[data-tour=account-security]",
        "Security controls",
        "Change your password, set a transaction PIN and turn on two-factor authentication.",
      ),
      stop(
        "[data-tour=account-identity]",
        "Verification progress",
        "Each completed step raises your tier and your limits.",
      ),
    ],
  },

  market: {
    id: "market",
    label: "Market tour",
    steps: () => [
      stop(
        "[data-tour=market-controls]",
        "Browse the market",
        "Switch between Spot and Futures, filter new listings, or search for a coin.",
      ),
      stop(
        "[data-tour=market-table]",
        "Live prices",
        "Prices update in real time. Star a coin to pin it under Favorites, or tap Buy to trade it straight away.",
      ),
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
};

export const tourForPath = (pathname: string): Tour | undefined => {
  const path = pathname.replace(/\/+$/, "") || "/";
  const id = TOUR_BY_PATH[path];
  return id ? TOURS[id] : undefined;
};
