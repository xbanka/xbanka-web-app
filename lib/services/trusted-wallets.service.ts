import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addTrustedWallet,
  getTrustedWallets,
  getTrustedWalletsSupported,
  removeTrustedWallet,
  renameTrustedWallet,
  validateTrustedWalletAddress,
} from "../actions/trusted-wallets";
import {
  AddTrustedWalletPayload,
  nextUnlockDelay,
  RemoveTrustedWalletPayload,
  ValidateAddressPayload,
} from "../trusted-wallets";

export const TRUSTED_WALLETS_KEY = ["trusted-wallets"] as const;
const SUPPORTED_KEY = ["trusted-wallets-supported"] as const;

// Errors are not toasted here: every caller shows them inline or routes the
// customer somewhere (see classifyTrustedWalletError), so a toast would double up.

/** Assets and networks Obiex can pay out on. The backend caches for 10 minutes. */
export const UseTrustedWalletsSupported = () =>
  useQuery({
    queryKey: SUPPORTED_KEY,
    queryFn: getTrustedWalletsSupported,
    staleTime: 1000 * 60 * 10,
  });

/**
 * The customer's saved wallets, newest first. Refetched when the page regains
 * focus and when the soonest cooling-off wallet unlocks, so a wallet turns
 * ACTIVE because the backend says so, never because of the device clock.
 */
export const UseTrustedWallets = () => {
  const query = useQuery({
    queryKey: TRUSTED_WALLETS_KEY,
    queryFn: () => getTrustedWallets(),
    refetchOnWindowFocus: true,
  });

  const { data, refetch } = query;
  useEffect(() => {
    const delay = nextUnlockDelay(data ?? []);
    if (delay === null) return;
    const timer = setTimeout(() => refetch(), delay);
    return () => clearTimeout(timer);
  }, [data, refetch]);

  return query;
};

/** Saves nothing and spends no PIN attempt. */
export const UseValidateTrustedWalletAddress = () =>
  useMutation({
    mutationFn: (payload: ValidateAddressPayload) =>
      validateTrustedWalletAddress(payload),
  });

export const UseAddTrustedWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddTrustedWalletPayload) => addTrustedWallet(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRUSTED_WALLETS_KEY });
      queryClient.invalidateQueries({ queryKey: ["get-notifications"] });
    },
  });
};

export const UseRenameTrustedWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: renameTrustedWallet,
    onSuccess: () => {
      toast.success("Wallet renamed");
      queryClient.invalidateQueries({ queryKey: TRUSTED_WALLETS_KEY });
    },
  });
};

export const UseRemoveTrustedWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RemoveTrustedWalletPayload & { id: string }) =>
      removeTrustedWallet(payload),
    onSuccess: () => {
      toast.success("Wallet removed");
      queryClient.invalidateQueries({ queryKey: TRUSTED_WALLETS_KEY });
      queryClient.invalidateQueries({ queryKey: ["get-notifications"] });
    },
  });
};
