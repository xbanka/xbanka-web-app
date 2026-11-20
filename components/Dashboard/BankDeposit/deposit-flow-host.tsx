"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { useBankDeposits } from "@/hooks/use-bank-deposits";
import { BankDeposit, entryStep, parseAmountInput, planResultPopup } from "@/lib/bank-deposit";
import { readWatchedDeposits, writeWatchedDeposits } from "@/lib/deposit-memory";
import { DepositScreen, useDepositFlowStore } from "@/store/deposit-flow-store";
import { AddFundingAccount } from "./add-funding-account";
import { AmountAndSource } from "./amount-and-source";
import { AnotherDepositPrompt } from "./another-deposit-prompt";
import { DepositInProgress } from "./deposit-in-progress";
import { DepositResult } from "./deposit-result";
import { DepositStatus } from "./deposit-status";
import { QuickConfirm } from "./quick-confirm";
import { TransferDetails } from "./transfer-details";
import { useFundingAccounts } from "./use-deposit-data";

/** May a result pop up over what is on screen now? Not over a flow in
 *  progress for something else; yes when idle or already on that deposit. */
export const canInterruptWith = (screen: DepositScreen | null, depositId: string) =>
  !screen ||
  screen.name === "in_progress" ||
  (screen.name === "status" && screen.depositId === depositId);

function LoadingModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose} className="flex items-center justify-center py-16">
      <div
        role="status"
        aria-label="Loading"
        className="h-7 w-7 animate-spin rounded-full border-2 border-Green border-t-transparent"
      />
    </Modal>
  );
}

/**
 * The Add Fund (bank transfer) flow, mounted once in the dashboard layout.
 * Renders the screen in useDepositFlowStore, and pops up a deposit's result
 * the first time this browser sees it settle.
 */
export function DepositFlowHost() {
  const router = useRouter();
  const {
    screen,
    amount,
    sourceId,
    declared,
    go,
    openStatus,
    openResult,
    setAmount,
    setSourceId,
    setDeclared,
    startNew,
    close,
  } = useDepositFlowStore();
  const { deposits, pending, isLoading: depositsLoading, dataUpdatedAt } = useBankDeposits();
  const { accounts, isPending: accountsLoading } = useFundingAccounts();

  const findDeposit = (id: string): BankDeposit | null =>
    deposits.find((d) => d.id === id) ?? (declared?.id === id ? declared : null);

  // Result pop-ups (5a / 5b / 5c), once per watched deposit.
  useEffect(() => {
    if (!dataUpdatedAt) return;
    const current = useDepositFlowStore.getState().screen;
    const { show, watch } = planResultPopup(readWatchedDeposits(), deposits, (id) =>
      canInterruptWith(current, id),
    );
    writeWatchedDeposits(watch);
    if (show) openResult(show);
    // deposits changes exactly when dataUpdatedAt does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUpdatedAt, openResult]);

  // "Add Fund" lands on the right first screen once the data is in.
  useEffect(() => {
    if (screen?.name !== "entry" || depositsLoading || accountsLoading) return;
    const step = entryStep({ hasPending: pending.length > 0, fundingAccountCount: accounts.length });
    go(step === "add_account" ? { name: "add_account", back: null } : { name: step });
  }, [screen, depositsLoading, accountsLoading, pending.length, accounts.length, go]);

  // The pending deposit settled while its "in progress" screen was open.
  useEffect(() => {
    if ((screen?.name === "in_progress" || screen?.name === "another_prompt") && !depositsLoading && pending.length === 0) {
      go({ name: "entry" });
    }
  }, [screen, depositsLoading, pending.length, go]);

  if (!screen) return null;

  const source = accounts.find((a) => a.id === sourceId) ?? null;
  const numericAmount = parseAmountInput(amount);
  const newDeposit = () => {
    startNew();
    go(accounts.length ? { name: "amount" } : { name: "add_account", back: null });
  };

  switch (screen.name) {
    case "entry":
      return <LoadingModal onClose={close} />;

    case "add_account":
      return (
        <AddFundingAccount
          onBack={screen.back ? () => go({ name: "amount" }) : undefined}
          onClose={close}
          onAdded={(id) => {
            if (id) setSourceId(id);
            go({ name: "amount" });
          }}
        />
      );

    case "amount":
      return (
        <AmountAndSource
          amount={amount}
          setAmount={setAmount}
          accounts={accounts}
          sourceId={sourceId}
          setSourceId={setSourceId}
          onAddAccount={() => go({ name: "add_account", back: "amount" })}
          onClose={close}
          onContinue={() => go({ name: "details" })}
        />
      );

    case "details":
      return (
        <TransferDetails
          amount={numericAmount}
          source={source}
          onBack={() => go({ name: "amount" })}
          onClose={close}
          onSent={() => go({ name: "quick_confirm" })}
        />
      );

    case "quick_confirm":
      return (
        <QuickConfirm
          amount={numericAmount}
          source={source}
          onNotYet={() => go({ name: "details" })}
          onClose={close}
          onDeclared={(deposit) => {
            startNew();
            if (!deposit) {
              toast.success("Deposit request received");
              close();
              return;
            }
            setDeclared(deposit);
            openStatus(deposit.id);
          }}
        />
      );

    case "in_progress": {
      const deposit = pending[0];
      if (!deposit) return <LoadingModal onClose={close} />;
      return (
        <DepositInProgress
          deposit={deposit}
          onClose={close}
          onAnother={() => go({ name: "another_prompt" })}
          onViewStatus={() => openStatus(deposit.id)}
        />
      );
    }

    case "another_prompt": {
      const deposit = pending[0];
      if (!deposit) return <LoadingModal onClose={close} />;
      return (
        <AnotherDepositPrompt
          deposit={deposit}
          onBack={() => go({ name: "in_progress" })}
          onClose={close}
          onConfirm={newDeposit}
        />
      );
    }

    case "status":
    case "result": {
      const deposit = findDeposit(screen.depositId);
      if (!deposit) {
        if (depositsLoading) return <LoadingModal onClose={close} />;
        return null;
      }
      if (deposit.status === "PENDING") {
        return <DepositStatus deposit={deposit} onClose={close} />;
      }
      return (
        <DepositResult
          deposit={deposit}
          onClose={close}
          onViewTransaction={() => {
            close();
            router.push("/transactions");
          }}
          onNewDeposit={() => {
            startNew();
            go({ name: "entry" });
          }}
        />
      );
    }
  }
}
