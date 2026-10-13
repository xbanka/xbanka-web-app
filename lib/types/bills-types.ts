// Contract types for the bill payments API (/wallets/bills/*).
// Amounts are plain NGN numbers (5000 = ₦5,000), never kobo.

export type BillProduct =
  "AIRTIME" | "DATA" | "ELECTRICITY" | "CABLE_TV" | "BETTING";

/** Route 2 list item. Nomba passes these through; the backend reads
 *  `productId` when paying but also accepts `id` where Nomba names it that. */
export type DataPlan = {
  productId?: string;
  id?: string;
  plan: string;
  amount: number;
};

/** A payable provider from one of the catalogue routes. The API reference
 *  doesn't pin the raw list shapes, so the action layer normalises each item
 *  to `code` (the value sent on initiate) + `name`. */
export type BillProvider = {
  code: string;
  name: string;
};

/** /wallets/bills/electricity/discos — `code` is sent as `disco`. */
export type Disco = BillProvider;

/** /wallets/bills/betting/providers — `code` is sent as `bettingProvider`. */
export type BettingProvider = BillProvider;

/** dstv, gotv, startimes or ShowMax — sent as `cableTvType`. */
export type CableProvider = BillProvider;

/** /wallets/bills/cable/plans item. `code` is the plan's `subScriptionType`,
 *  sent as `planCode` on initiate. */
export type CablePlan = {
  code: string;
  name: string;
  amount: number;
};

export type MeterType = "PREPAID" | "POSTPAID";

export type InitiateAirtimePayload = {
  product: "AIRTIME";
  network: string;
  phoneNumber: string;
  amount: number;
};

export type InitiateDataPayload = {
  product: "DATA";
  network: string;
  phoneNumber: string;
  productId: string;
};

export type InitiateElectricityPayload = {
  product: "ELECTRICITY";
  disco: string;
  customerId: string;
  meterType: MeterType;
  amount: number;
};

export type InitiateCableTvPayload = {
  product: "CABLE_TV";
  cableTvType: string;
  customerId: string;
  planCode: string;
};

export type InitiateBettingPayload = {
  product: "BETTING";
  bettingProvider: string;
  customerId: string;
  phoneNumber: string;
  amount: number;
};

export type InitiateBillPayload =
  | InitiateAirtimePayload
  | InitiateDataPayload
  | InitiateElectricityPayload
  | InitiateCableTvPayload
  | InitiateBettingPayload;

export type InitiateBillResponse = {
  /** Opaque, valid for 10 minutes. Pass to confirm unchanged. */
  paymentToken: string;
  product: BillProduct;
  description: string;
  /** Present for ELECTRICITY, CABLE_TV and BETTING. */
  customerName?: string;
  /** The exact amount that will be charged. */
  amount: number;
  currency: string;
  expiresAt: string;
};

export type ConfirmBillPayload = {
  paymentToken: string;
  pin: string;
};

export type BillPaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

/** Returned by both confirm and the status route. */
export type BillPayment = {
  reference: string;
  status: BillPaymentStatus;
  product: BillProduct;
  amount: number;
  currency: string;
  customerName?: string;
  /** Prepaid electricity only, once the biller has issued them. */
  token?: string;
  units?: string;
  /** Only while PENDING, while the provider is still confirming. Show as is. */
  message?: string;
  /** Same text as `description` from initiate. */
  note: string;
  createdAt: string;
  updatedAt: string;
};
