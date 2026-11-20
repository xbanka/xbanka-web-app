"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BankLogo } from "@/components/ui/bank-logo";
import { FormField } from "@/components/ui/FormField";
import { SearchSelectField } from "@/components/ui/search-select-field";
import {
  UseAddFundingAccount,
  UseGetAllBanks,
  UseLookupAccountName,
} from "@/lib/services/wallet.service";
import { UseProfileUser } from "@/lib/services/profile.service";
import { accountNameMatchesProfile } from "@/lib/accountNameMatch";
import { DepositModal, FooterButtons, Notice } from "./deposit-ui";

const fundingAccountSchema = z.object({
  bankCode: z.string().min(1, "Please select a bank"),
  accountNumber: z.string().regex(/^\d{10}$/, "Account number must be 10 digits"),
});
type FundingAccountForm = z.infer<typeof fundingAccountSchema>;

/**
 * Frames A / A2: register the bank account the user will pay from. Only an
 * account in the user's verified name can be added: a transfer from anyone
 * else's account cannot be matched to them.
 *
 * Also used on its own from the Account page (account-info-tab).
 */
export function AddFundingAccount({
  onBack,
  onCancel,
  onClose,
  onAdded,
}: {
  /** Shows the header back arrow. */
  onBack?: () => void;
  /** "Cancel" button; defaults to onBack, then onClose. */
  onCancel?: () => void;
  onClose: () => void;
  onAdded: (accountId: string | null) => void;
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

  const { mutateAsync: lookupName, isPending: isResolving } = UseLookupAccountName();
  const { mutateAsync: addAccount, isPending: isAdding } = UseAddFundingAccount();

  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [resolveFailed, setResolveFailed] = useState(false);

  const { data: profileData } = UseProfileUser();
  const firstName: string | undefined = profileData?.data?.firstName;
  const lastName: string | undefined = profileData?.data?.lastName;
  const verifiedName = [firstName, lastName].filter(Boolean).join(" ").toUpperCase();
  const nameCheck = accountNameMatchesProfile(resolvedName, { firstName, lastName });
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
    const bankName = bankOptions.find((b) => b.value === data.bankCode)?.label ?? "";
    try {
      const res = await addAccount({
        bankName,
        bankCode: data.bankCode,
        accountNumber: data.accountNumber,
        accountName: resolvedName,
      });
      toast.success("Funding account added");
      const created = res?.data?.data;
      onAdded(typeof created?.id === "string" ? created.id : null);
    } catch {
      // Error toast is shown by the mutation's onError handler.
    }
  };

  const canSubmit = isValid && !!resolvedName && !isThirdParty && !isResolving && !isAdding;
  const cancel = onCancel ?? onBack ?? onClose;

  return (
    <DepositModal
      title="Add the account you'll pay from"
      subtitle="You can only fund your wallet from a bank account in your name."
      onBack={onBack}
      onClose={onClose}
      testId="add-funding-account"
      footer={
        <FooterButtons
          secondary={
            <Button type="button" variant="outline" size="lg" onClick={cancel}>
              Cancel
            </Button>
          }
          primary={
            <Button
              type="submit"
              form="add-funding-account-form"
              size="lg"
              disabled={!canSubmit}
              variant={canSubmit ? "default" : "disabled"}
            >
              {isAdding ? "Adding..." : "Add account"}
            </Button>
          }
        />
      }
    >
      <form
        id="add-funding-account-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <SearchSelectField
          id="bankCode"
          label="Bank"
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
          label="Account number"
          placeholder="0123456789"
          register={register}
          error={errors.accountNumber}
        />

        {isResolving && (
          <p className="text-sm text-text" role="status">
            Verifying account...
          </p>
        )}

        {resolveFailed && !isResolving && (
          <Notice tone="danger" icon={XCircle} title="We couldn't verify this account" role="alert">
            Check the bank and account number.
          </Notice>
        )}

        {resolvedName && isThirdParty && (
          <Notice tone="danger" icon={XCircle} title="This account isn't in your name" role="alert">
            The bank shows this account belongs to {resolvedName}. You can only add accounts in
            your verified name{verifiedName ? `, ${verifiedName}` : ""}.
          </Notice>
        )}

        {resolvedName && nameCheck === "match" && (
          <Notice tone="success" icon={CheckCircle2} title={resolvedName} role="status">
            Matches your verified name.
          </Notice>
        )}

        {resolvedName && nameCheck === "unknown" && (
          <Notice tone="teal" icon={CheckCircle2} title={resolvedName} role="status">
            Confirm this is your account before adding it.
          </Notice>
        )}

        {!isThirdParty && (
          <Notice tone="teal" icon={Info} title="Why this matters">
            We match each deposit to the account it was sent from. Money sent from an account
            that isn&apos;t registered here can&apos;t be credited automatically.
          </Notice>
        )}
      </form>
    </DepositModal>
  );
}
