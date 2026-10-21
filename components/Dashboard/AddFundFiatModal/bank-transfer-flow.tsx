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
import { UseProfileUser } from "@/lib/services/profile.service";
import { accountNameMatchesProfile } from "@/lib/accountNameMatch";

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

import { QUICK_AMOUNTS } from "@/lib/wallet-page";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { UseDeclareBankTransferIntent } from "@/lib/services/wallet.service";

type TransferStep = "amount" | "add_account" | "details" | "submitted";

export function BankTransferFlow({
  onBack,
  onClose,
}: {
  onBack?: () => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<TransferStep>("amount");
  const [amount, setAmount] = useState<string>("");
  const { data: fundingData, isPending: fundingPending } =
    UseGetFundingAccounts();

  const fundingAccounts: FundingAccount[] = fundingData?.data?.data ?? [];

  if (step === "add_account") {
    return (
      <AddFundingAccountStep
        onBack={() => setStep(amount ? "details" : "amount")}
        onClose={onClose}
        onAdded={() => setStep(amount ? "details" : "amount")}
      />
    );
  }

  if (step === "details") {
    return (
      <TransferDetailsStep
        amount={amount}
        fundingAccounts={fundingAccounts}
        onBack={() => setStep("amount")}
        onClose={onClose}
        onAddAccount={() => setStep("add_account")}
        onSuccess={() => setStep("submitted")}
      />
    );
  }

  if (step === "submitted") {
    return (
      <TransferSubmittedStep
        amount={amount}
        onClose={onClose}
      />
    );
  }

  return (
    <EnterAmountStep
      amount={amount}
      setAmount={setAmount}
      fundingAccounts={fundingAccounts}
      fundingPending={fundingPending}
      onBack={onBack}
      onClose={onClose}
      onAddAccount={() => setStep("add_account")}
      onContinue={() => setStep("details")}
    />
  );
}

function EnterAmountStep({
  amount,
  setAmount,
  fundingAccounts,
  fundingPending,
  onBack,
  onClose,
  onAddAccount,
  onContinue,
}: {
  amount: string;
  setAmount: (v: string) => void;
  fundingAccounts: FundingAccount[];
  fundingPending: boolean;
  onBack?: () => void;
  onClose: () => void;
  onAddAccount: () => void;
  onContinue: () => void;
}) {
  const numeric = parseFloat(amount.replace(/,/g, "")) || 0;
  const isValid = numeric >= 1000;
  const hasFundingAccount = fundingAccounts.length > 0;

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6 max-sm:px-5 max-sm:py-5"
        title="Bank Transfer"
        subtitle="Enter the amount you would like to transfer."
        onBack={onBack}
        onClose={onClose}
      />

      <div className="px-10 pb-10 pt-2 space-y-6 max-sm:px-5 max-sm:pb-6">
        {/* Amount Input */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-text uppercase tracking-wide">
            Amount to fund
          </label>
          <div className="flex items-center gap-2 py-3 px-4 border rounded-xl border-input h-17.5 max-sm:h-15 max-sm:px-3 bg-background">
            <span className="text-2xl font-bold text-card-text max-sm:text-xl">
              ₦
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                setAmount(raw ? Number(raw).toLocaleString() : "");
              }}
              placeholder="0.00"
              autoFocus
              className="flex-1 bg-transparent text-2xl font-bold text-card-text outline-none placeholder:text-text/30 min-w-0 max-sm:text-xl"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-text">
            <span>Minimum transfer: ₦1,000</span>
          </div>

          {/* Quick amounts */}
          <div className="flex gap-2 overflow-x-auto pb-1 max-sm:-mx-1 max-sm:px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {QUICK_AMOUNTS.map((q) => (
              <button
                type="button"
                key={q}
                onClick={() => setAmount(q.toLocaleString())}
                className={cn(
                  "px-4 py-2.5 rounded-lg text-xs font-normal border transition-colors shrink-0 max-sm:px-3 max-sm:py-2",
                  amount === q.toLocaleString()
                    ? "border-Green bg-Green/10 text-Green font-medium"
                    : "border-input text-text hover:border-border-active",
                )}
              >
                ₦{q.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Funding accounts preview / warning */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text uppercase tracking-wide">
              Your funding accounts
            </span>
            {hasFundingAccount && (
              <button
                type="button"
                onClick={onAddAccount}
                className="text-xs text-Green hover:underline font-medium"
              >
                + Add another
              </button>
            )}
          </div>

          {fundingPending ? (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !hasFundingAccount ? (
            <div className="p-4 rounded-xl border border-dashed border-border bg-border/20 space-y-3">
              <p className="text-xs text-text leading-relaxed">
                You haven&apos;t linked a funding bank account yet. You must transfer from your verified account so we can match your deposit.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-2"
                onClick={onAddAccount}
              >
                <Plus className="w-4 h-4 text-Green" />
                Add a funding account
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {fundingAccounts.slice(0, 2).map((account) => (
                <div
                  key={account.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background"
                >
                  <BankLogo
                    bankName={account.bankName}
                    bankCode={account.bankCode}
                    size={32}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-card-text truncate">
                      {account.bankName} - {maskAccount(account.accountNumber)}
                    </p>
                    <p className="text-[11px] text-text truncate">
                      {account.accountName}
                    </p>
                  </div>
                </div>
              ))}
              {fundingAccounts.length > 2 && (
                <p className="text-[11px] text-text text-center">
                  +{fundingAccounts.length - 2} more linked funding accounts
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-4 max-sm:gap-3 pt-2">
          {onBack && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={onBack}
            >
              Back
            </Button>
          )}
          <Button
            type="button"
            size="lg"
            className={onBack ? "flex-2" : "w-full"}
            disabled={!isValid || !hasFundingAccount}
            variant={isValid && hasFundingAccount ? "default" : "disabled"}
            onClick={onContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function TransferDetailsStep({
  amount,
  fundingAccounts,
  onBack,
  onClose,
  onAddAccount,
  onSuccess,
}: {
  amount: string;
  fundingAccounts: FundingAccount[];
  onBack: () => void;
  onClose: () => void;
  onAddAccount: () => void;
  onSuccess: () => void;
}) {
  const {
    data: xbankaData,
    isPending: xbankaPending,
    error: xbankaError,
  } = UseGetXbankaFundingAccount();

  const { mutate: declareIntent, isPending: isDeclaring } =
    UseDeclareBankTransferIntent();

  const xbanka = xbankaData?.data?.data;
  const numericAmount = parseFloat(amount.replace(/,/g, "")) || 0;

  const handleConfirmSent = () => {
    declareIntent(numericAmount, {
      onSuccess: () => {
        toast.success("Transfer intent recorded");
        onSuccess();
      },
    });
  };

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6 max-sm:px-5 max-sm:py-5"
        title="Bank Transfer"
        subtitle="Transfer the exact amount to the account below."
        onBack={onBack}
        onClose={onClose}
      />

      <div className="px-10 pb-10 pt-2 space-y-6 max-sm:px-5 max-sm:pb-6">
        {/* Amount to transfer banner */}
        <div className="bg-border/40 rounded-2xl p-4 flex items-center justify-between border border-border">
          <div>
            <p className="text-xs text-text">Amount to send</p>
            <p className="text-xl font-bold text-card-text mt-0.5">
              ₦{amount}
            </p>
          </div>
          <button
            onClick={() => handleCopy(numericAmount.toString(), "Amount")}
            className="flex items-center gap-1.5 text-xs text-Green hover:opacity-80 transition-opacity font-medium px-2.5 py-1.5 rounded-lg bg-Green/10"
          >
            <span>Copy</span>
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>

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
              <div className="flex items-center justify-between gap-3 px-1 py-2.5">
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
              <div className="flex items-center justify-between gap-3 px-1 py-2.5">
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

        {/* Linked funding accounts disclaimer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-text uppercase tracking-wide">
              Your registered funding accounts
            </p>
            <button
              type="button"
              onClick={onAddAccount}
              className="text-xs text-Green hover:underline font-medium"
            >
              + Add another
            </button>
          </div>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {fundingAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background"
              >
                <BankLogo
                  bankName={account.bankName}
                  bankCode={account.bankCode}
                  size={32}
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-card-text truncate">
                    {account.bankName} - {maskAccount(account.accountNumber)}
                  </p>
                  <p className="text-[11px] text-text truncate">
                    {account.accountName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-2.5 bg-Green/5 border border-Green/40 rounded-lg px-4 py-3">
          <Info className="w-4 h-4 text-Green shrink-0 mt-0.5" />
          <p className="text-xs font-normal leading-5 text-Green">
            Transfer only from <strong>any of your registered funding accounts</strong> listed above. We will match the payment and credit your wallet.
          </p>
        </div>

        <div className="flex gap-4 max-sm:gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onBack}
            disabled={isDeclaring}
          >
            Back
          </Button>
          <Button
            type="button"
            size="lg"
            className="flex-2"
            onClick={handleConfirmSent}
            disabled={isDeclaring || !xbanka}
          >
            {isDeclaring ? "Submitting..." : "I have sent the money"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function TransferSubmittedStep({
  amount,
  onClose,
}: {
  amount: string;
  onClose: () => void;
}) {
  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6 max-sm:px-5 max-sm:py-5"
        title="Transfer Submitted"
        onClose={onClose}
      />

      <div className="px-10 pb-10 pt-4 space-y-6 max-sm:px-5 max-sm:pb-6 text-center">
        <div className="w-16 h-16 rounded-full bg-Green/10 border border-Green/30 text-Green mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-Green" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-card-text">
            ₦{amount} Pending Confirmation
          </h3>
          <p className="text-xs text-text leading-relaxed max-w-sm mx-auto">
            We&apos;ve recorded your transfer notification. Once our team confirms the incoming deposit from your funding account, your NGN wallet will be credited automatically.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-border/20 text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-text">Status</span>
            <span className="font-semibold text-amber-500">Pending</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text">Expected Amount</span>
            <span className="font-semibold text-card-text">₦{amount}</span>
          </div>
        </div>

        <Button size="lg" className="w-full" onClick={onClose}>
          Done
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

  // Only the user's own bank accounts may fund the wallet: a transfer from
  // someone else's account cannot be matched to them, so it is refused here
  // rather than left pending after the money has moved.
  const { data: profileData } = UseProfileUser();
  const nameCheck = accountNameMatchesProfile(resolvedName, {
    firstName: profileData?.data?.firstName,
    lastName: profileData?.data?.lastName,
  });
  const isThirdParty = nameCheck === "mismatch";

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
    if (!resolvedName || isThirdParty) return;
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

  const canSubmit =
    isValid && !!resolvedName && !isThirdParty && !isResolving && !isAdding;

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
                  {isThirdParty ? (
                    <p className="text-xs text-error-text pt-1">
                      This account is not in your name. Only a bank account in
                      your own name can be added, so that a transfer from it
                      can be matched to you.
                    </p>
                  ) : (
                    <p className="text-xs text-text pt-1">
                      Confirm this is your account before adding it.
                    </p>
                  )}
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
