// Biller catalogue for the Bill Payments page. Logos are local SVG brand
// marks in public/billers/ — swap any file for official artwork (same name) and
// the UI picks it up; a missing/broken logo falls back to an initials badge.
//
// Only the categories in LIVE_CATEGORIES are wired to the payments API; the
// rest render as “Coming soon”. Entries here are display metadata only — the
// payable catalogue (networks, data plans, prices) comes from the API and is
// never hardcoded.

export type BillerCategoryId =
  | "airtime"
  | "electricity"
  | "internet"
  | "cable"
  | "betting"
  | "government"
  | "education"
  | "others";

export type BillerPackage = { name: string; price: number };

export type Biller = {
  id: string;
  name: string;
  desc: string;
  category: BillerCategoryId;
  logo: string;
  fallbackColor: string;
  inputLabel: string;
  inputPlaceholder: string;
  /** Fixed-price plans; when present the amount comes from the chosen plan. */
  packages?: BillerPackage[];
  /** One-tap amounts for free-amount billers (airtime, betting, etc.). */
  quickAmounts?: number[];
};

const AIRTIME_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];
export const BETTING_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

export const BILLERS: Biller[] = [
  // ── Airtime & Data ──
  {
    id: "mtn",
    name: "MTN",
    desc: "Airtime & data bundles",
    category: "airtime",
    logo: "/billers/mtn.svg",
    fallbackColor: "bg-yellow-500",
    inputLabel: "Phone Number",
    inputPlaceholder: "0803 123 4567",
    quickAmounts: AIRTIME_AMOUNTS,
  },
  {
    id: "airtel",
    name: "Airtel",
    desc: "Airtime & data bundles",
    category: "airtime",
    logo: "/billers/airtel.svg",
    fallbackColor: "bg-red-600",
    inputLabel: "Phone Number",
    inputPlaceholder: "0802 123 4567",
    quickAmounts: AIRTIME_AMOUNTS,
  },
  {
    id: "glo",
    name: "Glo",
    desc: "Airtime & data bundles",
    category: "airtime",
    logo: "/billers/glo.svg",
    fallbackColor: "bg-green-600",
    inputLabel: "Phone Number",
    inputPlaceholder: "0805 123 4567",
    quickAmounts: AIRTIME_AMOUNTS,
  },
  {
    id: "9mobile",
    name: "9mobile",
    desc: "Airtime & data bundles",
    category: "airtime",
    logo: "/billers/9mobile.svg",
    fallbackColor: "bg-emerald-700",
    inputLabel: "Phone Number",
    inputPlaceholder: "0809 123 4567",
    quickAmounts: AIRTIME_AMOUNTS,
  },

  // ── Cable TV ──
  {
    id: "dstv",
    name: "DStv",
    desc: "Premium satellite TV",
    category: "cable",
    logo: "/billers/dstv.svg",
    fallbackColor: "bg-blue-600",
    inputLabel: "Smartcard / IUC Number",
    inputPlaceholder: "Enter your smartcard number",
    packages: [
      { name: "DStv Padi", price: 4400 },
      { name: "DStv Yanga", price: 6000 },
      { name: "DStv Confam", price: 11000 },
      { name: "DStv Compact", price: 19000 },
      { name: "DStv Compact Plus", price: 30000 },
      { name: "DStv Premium", price: 44500 },
    ],
  },
  {
    id: "gotv",
    name: "GOtv",
    desc: "Digital terrestrial TV",
    category: "cable",
    logo: "/billers/gotv.svg",
    fallbackColor: "bg-lime-600",
    inputLabel: "IUC Number",
    inputPlaceholder: "Enter your IUC number",
    packages: [
      { name: "GOtv Smallie", price: 1900 },
      { name: "GOtv Jinja", price: 3900 },
      { name: "GOtv Jolli", price: 5800 },
      { name: "GOtv Max", price: 8500 },
      { name: "GOtv Supa", price: 11400 },
    ],
  },
  {
    id: "startimes",
    name: "StarTimes",
    desc: "Affordable digital TV",
    category: "cable",
    logo: "/billers/startimes.svg",
    fallbackColor: "bg-orange-500",
    inputLabel: "Smartcard Number",
    inputPlaceholder: "Enter your smartcard number",
    packages: [
      { name: "Nova Bouquet", price: 1900 },
      { name: "Basic Bouquet", price: 3700 },
      { name: "Smart Bouquet", price: 5100 },
      { name: "Classic Bouquet", price: 6000 },
      { name: "Super Bouquet", price: 9000 },
    ],
  },
  {
    id: "showmax",
    name: "Showmax",
    desc: "Movies & series streaming",
    category: "cable",
    logo: "/billers/showmax.svg",
    fallbackColor: "bg-neutral-800",
    inputLabel: "Account Email",
    inputPlaceholder: "you@example.com",
    packages: [
      { name: "Showmax Mobile", price: 1600 },
      { name: "Showmax Standard", price: 3500 },
      { name: "Showmax Premier League Mobile", price: 2500 },
    ],
  },

  // ── Electricity ──
  {
    id: "ikedc",
    name: "Ikeja Electric (IKEDC)",
    desc: "Lagos — Ikeja disco",
    category: "electricity",
    logo: "/billers/ikedc.svg",
    fallbackColor: "bg-red-600",
    inputLabel: "Meter Number",
    inputPlaceholder: "Enter your meter number",
    quickAmounts: [1000, 2000, 5000, 10000, 20000],
  },
  {
    id: "ekedc",
    name: "Eko Electric (EKEDC)",
    desc: "Lagos — Eko disco",
    category: "electricity",
    logo: "/billers/ekedc.svg",
    fallbackColor: "bg-blue-700",
    inputLabel: "Meter Number",
    inputPlaceholder: "Enter your meter number",
    quickAmounts: [1000, 2000, 5000, 10000, 20000],
  },
  {
    id: "aedc",
    name: "Abuja Electric (AEDC)",
    desc: "FCT & environs disco",
    category: "electricity",
    logo: "/billers/aedc.svg",
    fallbackColor: "bg-green-700",
    inputLabel: "Meter Number",
    inputPlaceholder: "Enter your meter number",
    quickAmounts: [1000, 2000, 5000, 10000, 20000],
  },
  {
    id: "phed",
    name: "Port Harcourt Electric (PHED)",
    desc: "Rivers & environs disco",
    category: "electricity",
    logo: "/billers/phed.svg",
    fallbackColor: "bg-rose-700",
    inputLabel: "Meter Number",
    inputPlaceholder: "Enter your meter number",
    quickAmounts: [1000, 2000, 5000, 10000, 20000],
  },

  // ── Internet ──
  {
    id: "spectranet",
    name: "Spectranet",
    desc: "4G LTE internet plans",
    category: "internet",
    logo: "/billers/spectranet.svg",
    fallbackColor: "bg-red-600",
    inputLabel: "Customer ID",
    inputPlaceholder: "Enter your customer ID",
    packages: [
      { name: "Value 25GB", price: 8000 },
      { name: "Value 60GB", price: 14000 },
      { name: "Unlimited Silver", price: 17000 },
      { name: "Unlimited Gold", price: 19999 },
    ],
  },
  {
    id: "smile",
    name: "Smile",
    desc: "4G LTE broadband",
    category: "internet",
    logo: "/billers/smile.svg",
    fallbackColor: "bg-lime-600",
    inputLabel: "Account Number",
    inputPlaceholder: "Enter your Smile account number",
    packages: [
      { name: "FlexiDaily 1GB", price: 500 },
      { name: "FlexiWeekly 3GB", price: 1500 },
      { name: "20GB Monthly", price: 6000 },
      { name: "75GB Monthly", price: 15000 },
    ],
  },
  {
    id: "swift",
    name: "Swift Networks",
    desc: "Home & office broadband",
    category: "internet",
    logo: "/billers/swift.svg",
    fallbackColor: "bg-orange-600",
    inputLabel: "Customer ID",
    inputPlaceholder: "Enter your customer ID",
    packages: [
      { name: "Super Saver 25GB", price: 7000 },
      { name: "Platinum 60GB", price: 13500 },
      { name: "Unlimited Home", price: 18900 },
    ],
  },
  {
    id: "starlink",
    name: "Starlink",
    desc: "Satellite internet",
    category: "internet",
    logo: "/billers/starlink.svg",
    fallbackColor: "bg-neutral-800",
    inputLabel: "Account Number",
    inputPlaceholder: "Enter your Starlink account number",
    packages: [
      { name: "Residential Monthly", price: 38000 },
      { name: "Roam Monthly", price: 49000 },
    ],
  },

  // ── Betting ──
  {
    id: "bet9ja",
    name: "Bet9ja",
    desc: "Fund your betting wallet",
    category: "betting",
    logo: "/billers/bet9ja.svg",
    fallbackColor: "bg-green-700",
    inputLabel: "User ID",
    inputPlaceholder: "Enter your Bet9ja user ID",
    quickAmounts: BETTING_AMOUNTS,
  },
  {
    id: "sportybet",
    name: "SportyBet",
    desc: "Fund your betting wallet",
    category: "betting",
    logo: "/billers/sportybet.svg",
    fallbackColor: "bg-red-600",
    inputLabel: "Phone Number / User ID",
    inputPlaceholder: "Enter your SportyBet ID",
    quickAmounts: BETTING_AMOUNTS,
  },
  {
    id: "betking",
    name: "BetKing",
    desc: "Fund your betting wallet",
    category: "betting",
    logo: "/billers/betking.svg",
    fallbackColor: "bg-blue-900",
    inputLabel: "User ID",
    inputPlaceholder: "Enter your BetKing user ID",
    quickAmounts: BETTING_AMOUNTS,
  },
  {
    id: "1xbet",
    name: "1xBet",
    desc: "Fund your betting wallet",
    category: "betting",
    logo: "/billers/1xbet.svg",
    fallbackColor: "bg-blue-600",
    inputLabel: "Account ID",
    inputPlaceholder: "Enter your 1xBet account ID",
    quickAmounts: BETTING_AMOUNTS,
  },

  // ── Government ──
  {
    id: "firs",
    name: "FIRS",
    desc: "Federal taxes & levies",
    category: "government",
    logo: "/billers/firs.svg",
    fallbackColor: "bg-green-800",
    inputLabel: "Payment Reference / TIN",
    inputPlaceholder: "Enter your payment reference",
    quickAmounts: [5000, 10000, 25000, 50000],
  },
  {
    id: "lirs",
    name: "LIRS",
    desc: "Lagos state taxes",
    category: "government",
    logo: "/billers/lirs.svg",
    fallbackColor: "bg-red-700",
    inputLabel: "Payment Reference / Payer ID",
    inputPlaceholder: "Enter your payer ID",
    quickAmounts: [5000, 10000, 25000, 50000],
  },

  // ── Education ──
  {
    id: "waec",
    name: "WAEC",
    desc: "Result checker & registration",
    category: "education",
    logo: "/billers/waec.svg",
    fallbackColor: "bg-green-800",
    inputLabel: "Phone Number",
    inputPlaceholder: "Enter phone number for PIN delivery",
    packages: [
      { name: "Result Checker PIN", price: 3500 },
      { name: "GCE Registration PIN", price: 28000 },
    ],
  },
  {
    id: "jamb",
    name: "JAMB",
    desc: "UTME & DE ePINs",
    category: "education",
    logo: "/billers/jamb.svg",
    fallbackColor: "bg-green-600",
    inputLabel: "Profile Code",
    inputPlaceholder: "Enter your JAMB profile code",
    packages: [
      { name: "UTME ePIN", price: 7700 },
      { name: "Direct Entry ePIN", price: 7700 },
    ],
  },
  {
    id: "neco",
    name: "NECO",
    desc: "Result tokens",
    category: "education",
    logo: "/billers/neco.svg",
    fallbackColor: "bg-teal-800",
    inputLabel: "Phone Number",
    inputPlaceholder: "Enter phone number for token delivery",
    packages: [{ name: "Result Checker Token", price: 1300 }],
  },

  // ── Others ──
  {
    id: "lawma",
    name: "LAWMA",
    desc: "Waste management bills",
    category: "others",
    logo: "/billers/lawma.svg",
    fallbackColor: "bg-amber-500",
    inputLabel: "Customer ID",
    inputPlaceholder: "Enter your LAWMA customer ID",
    quickAmounts: [2000, 5000, 10000],
  },
  {
    id: "lwc",
    name: "Lagos Water Corporation",
    desc: "Water utility bills",
    category: "others",
    logo: "/billers/lwc.svg",
    fallbackColor: "bg-sky-600",
    inputLabel: "Account Number",
    inputPlaceholder: "Enter your account number",
    quickAmounts: [2000, 5000, 10000],
  },
];

export const billersByCategory = (category: BillerCategoryId) =>
  BILLERS.filter((b) => b.category === category);

export const findBiller = (id: string) => BILLERS.find((b) => b.id === id);

/** Categories wired to the payments API; the rest render as “Coming soon”. */
export const LIVE_CATEGORIES: BillerCategoryId[] = [
  "airtime",
  "electricity",
  "cable",
  "betting",
];

export const isCategoryLive = (category: BillerCategoryId) =>
  LIVE_CATEGORIES.includes(category);

/** Display metadata for a network code from the API ("MTN" → the mtn biller). */
export const networkBiller = (network: string) =>
  findBiller(network.toLowerCase());

/** Display metadata for a provider code returned by the API. Codes aren't
 *  guaranteed to match our ids exactly ("IKEDC" vs "IKEJA_ELECTRIC"), so fall
 *  back to a substring match; an unmatched provider just renders with an
 *  initials badge. */
export const categoryBiller = (category: BillerCategoryId, code: string) => {
  const key = code.toLowerCase();
  const billers = billersByCategory(category);
  return (
    billers.find((b) => b.id === key) ?? billers.find((b) => key.includes(b.id))
  );
};

export const discoBiller = (code: string) =>
  categoryBiller("electricity", code);

/** The cable providers are fixed by the API reference, so they're listed here
 *  rather than fetched. `code` is the `cableTvType` value — note ShowMax is the
 *  only one the API wants in mixed case. */
export const CABLE_PROVIDERS = billersByCategory("cable").map((b) => ({
  code: b.id === "showmax" ? "ShowMax" : b.id,
  name: b.name,
}));

export const ELECTRICITY_QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000];

/** A row in the Recent Transactions list. `reference` ties a row back to a
 *  real payment so status updates (PENDING → COMPLETED) can replace it. */
export type BillTransaction = {
  billerId: string;
  name: string;
  number: string;
  time: string;
  amount: string;
  status: string;
  reference?: string;
};

export const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
