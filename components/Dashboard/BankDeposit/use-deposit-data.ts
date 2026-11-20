"use client";

import { useCallback } from "react";
import {
  UseGetFundingAccounts,
  UseGetXbankaFundingAccount,
} from "@/lib/services/wallet.service";
import { UseProfileUser } from "@/lib/services/profile.service";
import { FundingAccount } from "@/lib/types/wallet-types";
import {
  BankDeposit,
  depositSource,
  depositSupportMessage,
  sourceLabel,
} from "@/lib/bank-deposit";
import { recallDepositSource } from "@/lib/deposit-memory";
import {
  buildSupportMessage,
  supportWhatsAppNumber,
  whatsAppLink,
} from "@/lib/supportWhatsApp";

export const useFundingAccounts = () => {
  const { data, isPending } = UseGetFundingAccounts();
  const accounts: FundingAccount[] = data?.data?.data ?? [];
  return { accounts, isPending };
};

/** "GTBank ••••1815" for the account a deposit was paid from. */
export const useDepositSourceLabel = (deposit: BankDeposit | null) => {
  const { accounts } = useFundingAccounts();
  return sourceLabel(depositSource(deposit, accounts, recallDepositSource(deposit?.id)));
};

/** Xbanka's collection account, the one the user sends money to. */
export const useXbankaAccount = () => {
  const { data, isPending, error } = UseGetXbankaFundingAccount();
  const account = data?.data?.data as
    | { bankName: string; accountNumber: string; accountName: string }
    | undefined;
  return { account: error ? undefined : account, isPending };
};

/** "Stanbic IBTC Bank · XBANKA LTD", or "Xbanka" while it loads. */
export const useXbankaLabel = () => {
  const { account } = useXbankaAccount();
  return account ? `${account.bankName} · ${account.accountName}` : "Xbanka";
};

/** Opens WhatsApp support with the deposit's details and the user's UID. */
export const useDepositSupport = () => {
  const { data: profile } = UseProfileUser();
  const uid: string | undefined = profile?.data?.xbId;
  return useCallback(
    (deposit: BankDeposit | null, source: string) => {
      const message = deposit
        ? depositSupportMessage(deposit, source)
        : "I need help with a bank transfer deposit.";
      const link = whatsAppLink(
        supportWhatsAppNumber(),
        buildSupportMessage({ topic: "Deposit", message, uid }),
      );
      window.open(link, "_blank", "noopener,noreferrer");
    },
    [uid],
  );
};
