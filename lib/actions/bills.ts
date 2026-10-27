import AxiosInstance from "../AxiosInstance/AxiosInstance";
import {
  BettingProvider,
  BillPayment,
  BillProvider,
  CablePlan,
  ConfirmBillPayload,
  DataPlan,
  Disco,
  InitiateBillPayload,
  InitiateBillResponse,
} from "../types/bills-types";

// Every response is enveloped as { message, details, errorGroup, data };
// the payload is always `data`.

export const getBillNetworks = async (): Promise<string[]> => {
  const response = await AxiosInstance.get("/wallets/bills/networks");
  return response.data.data;
};

export const getDataPlans = async (network: string): Promise<DataPlan[]> => {
  const response = await AxiosInstance.get(
    `/wallets/bills/data-plans/${network}`,
  );
  return response.data.data;
};

// Nomba doesn't fully specify the discos, betting-provider or cable-plan list
// shapes: accept bare strings or objects and pull out the fields we send back.
const pickString = (item: Record<string, unknown>, keys: string[]) =>
  keys.map((k) => item[k]).find((v) => typeof v === "string" && v) as
    string | undefined;

const toProvider = (raw: unknown, codeKeys: string[]): BillProvider | null => {
  if (typeof raw === "string") return { code: raw, name: raw };
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const code = pickString(item, [...codeKeys, "code", "id", "name"]);
  if (!code) return null;
  return {
    code,
    name: pickString(item, ["name", "label", ...codeKeys, "code"]) ?? code,
  };
};

const toList = (data: unknown): unknown[] => (Array.isArray(data) ? data : []);

export const getDiscos = async (): Promise<Disco[]> => {
  const response = await AxiosInstance.get("/wallets/bills/electricity/discos");
  return toList(response.data.data)
    .map((raw) => toProvider(raw, ["disco"]))
    .filter((d): d is Disco => d !== null);
};

export const getBettingProviders = async (): Promise<BettingProvider[]> => {
  const response = await AxiosInstance.get("/wallets/bills/betting/providers");
  return toList(response.data.data)
    .map((raw) => toProvider(raw, ["bettingProvider", "provider"]))
    .filter((p): p is BettingProvider => p !== null);
};

export const getCablePlans = async (
  cableTvType: string,
): Promise<CablePlan[]> => {
  const response = await AxiosInstance.get("/wallets/bills/cable/plans", {
    params: { cableTvType },
  });
  return toList(response.data.data).flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const item = raw as Record<string, unknown>;
    const code = pickString(item, [
      "subScriptionType",
      "planCode",
      "productId",
      "id",
    ]);
    const amount = Number(item.amount);
    if (!code || !Number.isFinite(amount)) return [];
    return [
      {
        code,
        name:
          pickString(item, ["name", "plan", "description", "title"]) ?? code,
        amount,
      },
    ];
  });
};

/** Step 1: validates, prices and verifies the customer. No money moves. */
export const initiateBillPayment = async (
  payload: InitiateBillPayload,
): Promise<InitiateBillResponse> => {
  const response = await AxiosInstance.post("/wallets/bills/initiate", payload);
  return response.data.data;
};

/** Step 2: checks the PIN, debits the NGN wallet and places the payment.
 *  Idempotent per paymentToken — the same token never charges twice. */
export const confirmBillPayment = async (
  payload: ConfirmBillPayload,
): Promise<BillPayment> => {
  const response = await AxiosInstance.post("/wallets/bills/confirm", payload);
  return response.data.data;
};

export const getBillPaymentStatus = async (
  reference: string,
): Promise<BillPayment> => {
  const response = await AxiosInstance.get(
    `/wallets/bills/status/${reference}`,
  );
  return response.data.data;
};
