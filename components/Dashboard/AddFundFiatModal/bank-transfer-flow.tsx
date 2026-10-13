"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Copy, Info, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { BankLogo } from "@/components/ui/bank-logo";
import { FormField } from "@/components/ui/FormField";
import { SearchSelectField } from "@/components/ui/search-select-field";
import {
  UseAddFundingAccount,
  UseGetAllBanks,
  UseGetFundingAccounts,
  UseGetXbankaFundingAccount,
  UseLookupAccountName,
} from "@/lib/services/wallet.service";
import { FundingAccount } from "@/lib/types/wallet-types";

const fundingAccountSchema = z.object({
  bankCode: z.string().min(1, "Please select a bank"),
  accountNumber: z.string().regex(/^\d{10}$/, "Account number must be 10 digits"),
});
type FundingAccountForm = z.infer<typeof fundingAccountSchema>;

const maskAccount = (accountNumber: string) =>
  accountNumber?.length > 4
    ? `${"*".repeat(accountNumber.length - 4)}${accountNumber.slice(-4)}`
    : accountNumber;

const handleCopy = (text: string, label: string) => {
  if (!text) return;
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied to clipboard`);
};

type TransferStep = "overview" | "add";

export function BankTransferFlow({
  onBack,
  onClose,
}: {
  onBack?: () => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<TransferStep>("overview");

  if (step === "add") {
    return (
      <AddFundingAccountStep
        onBack={() => setStep("overview")}
        onClose={onClose}
        onAdded={() => setStep("overview")}
      />
    );
  }

  return (
    <OverviewStep
      onBack={onBack}
      onClose={onClose}
      onAdd={() => setStep("add")}
    />
  );
}

function OverviewStep({
  onBack,
  onClose,
  onAdd,
}: {
  onBack?: () => void;
  onClose: () => void;
  onAdd: () => void;
}) {
  const {
    data: xbankaData,
    isPending: xbankaPending,
    error: xbankaError,
  } = UseGetXbankaFundingAccount();
  const { data: fundingData, isPending: fundingPending } =
    UseGetFundingAccounts();

  const xbanka = xbankaData?.data?.data;
  const fundingAccounts: FundingAccount[] = fundingData?.data?.data ?? [];

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6 max-sm:px-5 max-sm:py-5"
        title="Bank Transfer"
        subtitle="Send money from your own bank account to xBanka."
        onBack={onBack}
        onClose={onClose}
      />

      <div className="px-10 pb-10 pt-2 space-y-6 max-sm:px-5 max-sm:pb-6">
        {/* xBanka account */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-text uppercase tracking-wide">
            Send money to
          </p>
          {xbankaPending ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : xbankaError || !xbanka ? (
            <p className="text-sm text-text bg-border rounded-2xl p-5">
              Bank transfer funding isn&apos;t available right now. Please try
              again later.
            </p>
          ) : (
            <div className="bg-border rounded-2xl p-5 space-y-1">
              <div className="flex items-center justify-between gap-3 px-1 py-3">
                <span className="text-xs font-normal text-text">Bank Name</span>
                <span className="text-sm font-semibold text-card-text text-right">
                  {xbanka.bankName}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 bg-background rounded-xl px-4 py-3.5">
                <span className="text-xs font-normal text-text">
                  Account Number
                </span>
                <button
                  onClick={() =>
                    handleCopy(xbanka.accountNumber, "Account number")
                  }
                  className="flex items-center gap-2 text-Green hover:opacity-80 transition-opacity"
                  title="Copy account number"
                >
                  <span className="text-base font-semibold">
                    {xbanka.accountNumber}
                  </span>
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between gap-3 px-1 py-3">
                <span className="text-xs font-normal text-text">
                  Account Name
                </span>
                <span className="text-sm font-semibold text-card-text text-right">
                  {xbanka.accountName}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Linked funding accounts */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-text uppercase tracking-wide">
            Your funding accounts
          </p>
          <div className="space-y-3">
            {fundingPending && (
              <p className="text-sm text-text">Loading your accounts...</p>
            )}
            {!fundingPending && fundingAccounts.length === 0 && (
              <p className="text-sm text-text">
                You haven&apos;t added a funding account yet. Add the account
                you&apos;ll send money from.
              </p>
            )}
            {fundingAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-border"
              >
                <BankLogo
                  bankName={account.bankName}
                  bankCode={account.bankCode}
                  size={40}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-card-text truncate">
                    {account.bankName} - {maskAccount(account.accountNumber)}
                  </p>
                  <p className="text-xs text-text truncate mt-1">
                    {account.accountName}
                  </p>
                </div>
              </div>
            ))}
            <button
              onClick={onAdd}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-dashed border-border hover:border-border-active transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-Green/60 flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4 text-Green" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-card-text">
                  Add a funding account
                </p>
                <p className="text-xs text-text mt-1">
                  The bank account you send money from
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2.5 bg-Green/5 border border-Green/40 rounded-lg px-4 py-3">
          <Info className="w-4 h-4 text-Green shrink-0 mt-0.5" />
          <p className="text-xs font-normal leading-5 text-Green">
            Transfer only from one of your funding accounts so we can match the
            payment to you. Your wallet is credited once we confirm the
            transfer.
          </p>
        </div>

        <Button variant="outline" size="lg" className="w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}

function AddFundingAccountStep({
  onBack,
  onClose,
  onAdded,
}: {
  onBack: () => void;
  onClose: () => void;
  onAdded: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FundingAccountForm>({
    resolver: zodResolver(fundingAccountSchema),
    mode: "onTouched",
  });

  const bankCode = watch("bankCode");
  const accountNumber = watch("accountNumber");

  const { data: banksResponse, isPending: isLoadingBanks } = UseGetAllBanks();
  const rawBanks = banksResponse?.data?.data;
  const bankOptions = Array.isArray(rawBanks)
    ? [...rawBanks]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((bank: { name: string; code: string }) => ({
          label: bank.name,
          value: bank.code,
        }))
    : [];

  const { mutateAsync: lookupName, isPending: isResolving } =
    UseLookupAccountName();
  const { mutateAsync: addAccount, isPending: isAdding } =
    UseAddFundingAccount();

  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [resolveFailed, setResolveFailed] = useState(false);

  // Resolve the account name whenever bank + 10-digit number are present.
  useEffect(() => {
    setResolvedName(null);
    setResolveFailed(false);
    if (!bankCode || !/^\d{10}$/.test(accountNumber ?? "")) return;

    let cancelled = false;
    lookupName({ accountNumber, bankCode })
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data;
        const record = Array.isArray(payload) ? payload[0] : payload;
        const name: string | undefined = record?.account_name;
        if (name) setResolvedName(name);
        else setResolveFailed(true);
      })
      .catch(() => {
        if (!cancelled) setResolveFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [bankCode, accountNumber, lookupName]);

  const onSubmit = async (data: FundingAccountForm) => {
    if (!resolvedName) return;
    const bankName =
      bankOptions.find((b) => b.value === data.bankCode)?.label ?? "";
    try {
      await addAccount({
        bankName,
        bankCode: data.bankCode,
        accountNumber: data.accountNumber,
        accountName: resolvedName,
      });
      toast.success("Funding account added");
      onAdded();
    } catch {
      // Error toast is shown by the mutation's onError handler.
    }
  };

  const canSubmit = isValid && !!resolvedName && !isResolving && !isAdding;

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6 max-sm:px-5 max-sm:py-5"
        title="Add funding account"
        subtitle="The bank account you'll send money from."
        onBack={onBack}
        onClose={onClose}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 px-10 pb-10 pt-2 max-sm:px-5 max-sm:pb-6"
      >
        <div className="space-y-4">
          <SearchSelectField
            id="bankCode"
            label="Bank Name"
            placeholder={isLoadingBanks ? "Loading banks..." : "Select bank"}
            options={bankOptions}
            register={register}
            error={errors.bankCode}
            disabled={isLoadingBanks}
            renderIcon={(code) => (
              <BankLogo
                bankName={bankOptions.find((b) => b.value === code)?.label ?? ""}
                bankCode={code}
                size={20}
              />
            )}
          />

          <FormField
            id="accountNumber"
            label="Account Number"
            placeholder="0123456789"
            register={register}
            error={errors.accountNumber}
          />

          {(isResolving || resolvedName || resolveFailed) && (
            <div className="bg-border rounded-xl px-4 py-3.5 space-y-1">
              <p className="text-xs text-text">Account Name</p>
              {isResolving && (
                <p className="text-sm text-text">Verifying account...</p>
              )}
              {resolvedName && (
                <>
                  <p className="text-sm font-semibold text-card-text">
                    {resolvedName}
                  </p>
                  <p className="text-xs text-text pt-1">
                    Confirm this is your account before adding it.
                  </p>
                </>
              )}
              {resolveFailed && !isResolving && (
                <p className="text-sm text-error-text">
                  We couldn&apos;t verify this account. Check the bank and
                  account number.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-4 max-sm:gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            type="submit"
            size="lg"
            className="flex-3"
            disabled={!canSubmit}
            variant={canSubmit ? "default" : "disabled"}
          >
            {isAdding ? "Adding..." : "Confirm & Add"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
