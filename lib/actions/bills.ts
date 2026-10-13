import AxiosInstance from "../AxiosInstance/AxiosInstance";
import {
  BillPayment,
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

// Nomba doesn't fully specify the discos list shape: accept bare strings or
// objects and pull out the code we send back as `disco`.
const toDisco = (raw: unknown): Disco | null => {
  if (typeof raw === "string") return { code: raw, name: raw };
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const pick = (...keys: string[]) =>
    keys.map((k) => item[k]).find((v) => typeof v === "string" && v) as
      string | undefined;
  const code = pick("disco", "code", "id", "name");
  if (!code) return null;
  return { code, name: pick("name", "label", "disco", "code") ?? code };
};

export const getDiscos = async (): Promise<Disco[]> => {
  const response = await AxiosInstance.get("/wallets/bills/electricity/discos");
  const list: unknown[] = Array.isArray(response.data.data)
    ? response.data.data
    : [];
  return list.map(toDisco).filter((d): d is Disco => d !== null);
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
