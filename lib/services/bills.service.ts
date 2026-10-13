import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  confirmBillPayment,
  getBettingProviders,
  getBillNetworks,
  getBillPaymentStatus,
  getCablePlans,
  getDataPlans,
  getDiscos,
  initiateBillPayment,
} from "../actions/bills";
import { ApiError } from "../types/error-types";
import {
  BettingProvider,
  BillPayment,
  CablePlan,
  ConfirmBillPayload,
  DataPlan,
  Disco,
  InitiateBillPayload,
  InitiateBillResponse,
} from "../types/bills-types";

// The server caches the catalogue routes for ~10 minutes; match that so we
// don't refetch lists that can't have changed.
const CATALOGUE_STALE_TIME = 10 * 60 * 1000;

export const useBillNetworks = (enabled = true) =>
  useQuery<string[], ApiError>({
    queryKey: ["bill-networks"],
    queryFn: getBillNetworks,
    enabled,
    staleTime: CATALOGUE_STALE_TIME,
  });

export const useDataPlans = (network: string | null) =>
  useQuery<DataPlan[], ApiError>({
    queryKey: ["bill-data-plans", network],
    queryFn: () => getDataPlans(network as string),
    enabled: !!network,
    staleTime: CATALOGUE_STALE_TIME,
  });

export const useBettingProviders = (enabled = true) =>
  useQuery<BettingProvider[], ApiError>({
    queryKey: ["bill-betting-providers"],
    queryFn: getBettingProviders,
    enabled,
    staleTime: CATALOGUE_STALE_TIME,
  });

export const useCablePlans = (cableTvType: string | null) =>
  useQuery<CablePlan[], ApiError>({
    queryKey: ["bill-cable-plans", cableTvType],
    queryFn: () => getCablePlans(cableTvType as string),
    enabled: !!cableTvType,
    staleTime: CATALOGUE_STALE_TIME,
  });

export const useDiscos = (enabled = true) =>
  useQuery<Disco[], ApiError>({
    queryKey: ["bill-discos"],
    queryFn: getDiscos,
    enabled,
    staleTime: CATALOGUE_STALE_TIME,
  });

// Checkout errors are shown inline in the modal (per the API reference's UI
// table), so neither mutation toasts through handleApiError.

export const useInitiateBill = () =>
  useMutation<InitiateBillResponse, ApiError, InitiateBillPayload>({
    mutationFn: initiateBillPayment,
  });

export const useConfirmBill = () => {
  const queryClient = useQueryClient();
  return useMutation<BillPayment, ApiError, ConfirmBillPayload>({
    mutationFn: confirmBillPayment,
    onSuccess: () => {
      // The NGN wallet is debited as soon as the payment is placed, and the
      // payment shows up in transaction history as BILL_PAYMENT.
      queryClient.invalidateQueries({ queryKey: ["all-wallet-balances"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-history"] });
    },
  });
};

/** Polls the status route every 4s while the payment is PENDING; the caller
 *  gates it with `enabled` (and should stop after ~1 minute per the API
 *  reference — an in-app notification is sent when the status changes). */
export const useBillPaymentStatus = (
  reference: string | null,
  enabled: boolean,
) =>
  useQuery<BillPayment, ApiError>({
    queryKey: ["bill-payment-status", reference],
    queryFn: () => getBillPaymentStatus(reference as string),
    enabled: !!reference && enabled,
    refetchInterval: (query) =>
      !query.state.data || query.state.data.status === "PENDING" ? 4000 : false,
  });

export type { DataPlan, Disco };
