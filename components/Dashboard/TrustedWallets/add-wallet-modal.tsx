"use client";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, CircleAlert, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorField } from "@/components/ui/field-error";
import { ErrorLayout } from "@/components/ui/error-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectFieldWithValue } from "@/components/ui/select-with-value";
import { CoinIcon } from "@/components/ui/coin-icon";
import { UseActiveNetworksCrypto } from "@/lib/services/wallet.service";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { UseProfileUser } from "@/lib/services/profile.service";
import {
  UseAddTrustedWallet,
  UseTrustedWalletsSupported,
  UseValidateTrustedWalletAddress,
} from "@/lib/services/trusted-wallets.service";
import {
  addressesMatch,
  assetsFromActiveNetworks,
  classifyTrustedWalletError,
  DEFAULT_COOLING_OFF_HOURS,
  DEFAULT_LABEL_MAX_LENGTH,
  formatUnlockTime,
  isCompleteCode,
  isCompletePin,
  labelError,
  networkName,
  readApiError,
  shortAddress,
  TrustedWallet,
} from "@/lib/trusted-wallets";
import { ProgressBar } from "../Wallet-Page/progress-bar";
import { SecuritySetupGate } from "./security-setup-gate";
import { PinAndCodeFields } from "./pin-and-code-fields";
import {
  DetailRows,
  StateIcon,
  WalletStatusBadge,
  WalletSummaryCard,
  WarningNote,
} from "./shared";

type Step = "asset" | "address" | "confirm" | "verify" | "success";

const STEPS: Partial<Record<Step, { n: number; label: string }>> = {
  asset: { n: 1, label: "Asset and network" },
  address: { n: 2, label: "Address and label" },
  confirm: { n: 3, label: "Confirm address" },
  verify: { n: 4, label: "Confirm" },
};

// The guide asks for about 400 ms between keystrokes and the address check.
const VALIDATE_DEBOUNCE_MS = 400;

type AddressCheck =
  | { address: string; state: "checking" }
  | { address: string; state: "valid" }
  | { address: string; state: "invalid"; reason: string };

export function AddWalletModal({
  onClose,
  initialCurrency,
}: {
  onClose: () => void;
  /** Preselects the asset, e.g. when opened from the Send screen. */
  initialCurrency?: string;
}) {
  const [step, setStep] = useState<Step>("asset");
  const [currency, setCurrency] = useState(initialCurrency ?? "");
  const [network, setNetwork] = useState("");
  const [address, setAddress] = useState("");
  const [label, setLabel] = useState("");
  const [labelTouched, setLabelTouched] = useState(false);
  const [check, setCheck] = useState<AddressCheck | null>(null);
  const [addressConfirm, setAddressConfirm] = useState("");
  const [ownershipConfirmed, setOwnershipConfirmed] = useState(false);
  const [pin, setPin] = useState("");
  const [code, setCode] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [submitError, setSubmitError] = useState<string>();
  const [locked, setLocked] = useState<string>();
  const [saved, setSaved] = useState<TrustedWallet | null>(null);

  const queryClient = useQueryClient();
  const { data: profile } = UseProfileUser();
  const supported = UseTrustedWalletsSupported();
  const validate = UseValidateTrustedWalletAddress();
  const add = UseAddTrustedWallet();

  // Same coin and network list as the Deposit "Select a coin" dropdown.
  const activeNetworks = UseActiveNetworksCrypto();
  const assets = assetsFromActiveNetworks(activeNetworks.data?.data?.data);
  const labelMax = supported.data?.labelMaxLength ?? DEFAULT_LABEL_MAX_LENGTH;
  const coolingHours =
    supported.data?.coolingOffHours ?? DEFAULT_COOLING_OFF_HOURS;
  const asset = assets.find((a) => a.currency === currency);
  const netName =
    asset?.networks.find((n) => n.code === network)?.name ??
    networkName(network, supported.data);
  const trimmedAddress = address.trim();

  // Check the address as it is typed or pasted. Answers for an address the
  // customer has since changed are dropped, so a slow reply cannot mark a
  // newer address valid.
  const debouncedAddress = useDebounce(trimmedAddress, VALIDATE_DEBOUNCE_MS);
  const latest = useRef("");
  latest.current = trimmedAddress;
  const { mutate: validateAddress } = validate;
  useEffect(() => {
    if (!debouncedAddress || !currency || !network) return;
    const target = debouncedAddress;
    setCheck({ address: target, state: "checking" });
    validateAddress(
      { currency, network, address: target },
      {
        onSuccess: (res) => {
          if (latest.current !== target) return;
          setCheck(
            res.valid
              ? { address: target, state: "valid" }
              : {
                  address: target,
                  state: "invalid",
                  reason: res.reason || "This address isn't valid.",
                },
          );
        },
        onError: (err) => {
          if (latest.current !== target) return;
          setCheck({
            address: target,
            state: "invalid",
            reason: readApiError(err).message,
          });
        },
      },
    );
  }, [debouncedAddress, currency, network, validateAddress]);

  const current = check?.address === trimmedAddress ? check : null;
  const addressValid = current?.state === "valid";
  const labelProblem = labelError(label, labelMax);
  const confirmMatches = addressesMatch(trimmedAddress, addressConfirm);
  const confirmMismatch = addressConfirm.trim().length > 0 && !confirmMatches;
  const canSubmit =
    isCompletePin(pin) && isCompleteCode(code) && !add.isPending && !locked;

  const needs2fa = profile?.data ? !profile.data.isTwoFactorEnabled : false;
  const needsPin = profile?.data ? !profile.data.hasTransactionPin : false;
  if ((needs2fa || needsPin) && step !== "success") {
    return (
      <SecuritySetupGate
        needs2fa={needs2fa}
        needsPin={needsPin}
        onClose={onClose}
      />
    );
  }

  const clearSecrets = () => {
    setPin("");
    setCode("");
    setResetKey((k) => k + 1);
  };

  const submit = () => {
    if (!canSubmit) return;
    setSubmitError(undefined);
    add.mutate(
      {
        currency,
        network,
        address: trimmedAddress,
        addressConfirm: addressConfirm.trim(),
        label: label.trim(),
        ownershipConfirmed: true,
        pin,
        code,
      },
      {
        onSuccess: (wallet) => {
          setSaved(wallet);
          setStep("success");
        },
        onError: (err) => {
          clearSecrets();
          const action = classifyTrustedWalletError(err);
          if (action.kind === "setup-2fa" || action.kind === "setup-pin") {
            // The cached profile was stale; refetching it opens the setup gate.
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
            setSubmitError(action.message);
          } else if (action.kind === "locked") {
            setLocked(action.message);
          } else {
            setSubmitError(action.message);
          }
        },
      },
    );
  };

  const restart = () => {
    setStep("asset");
    setNetwork("");
    setAddress("");
    setLabel("");
    setLabelTouched(false);
    setCheck(null);
    setAddressConfirm("");
    setOwnershipConfirmed(false);
    clearSecrets();
    setSubmitError(undefined);
    setSaved(null);
  };

  const progress = STEPS[step] && (
    <div className="px-8 pb-3">
      <ProgressBar current={STEPS[step].n} total={4} label={STEPS[step].label} />
    </div>
  );

  const footer = (
    back: { label: string; onClick: () => void },
    next: { label: string; onClick: () => void; enabled: boolean; busy?: boolean },
  ) => (
    <div className="flex gap-4">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="flex-1"
        onClick={back.onClick}
      >
        {back.label}
      </Button>
      <Button
        size="lg"
        className="flex-3"
        disabled={!next.enabled}
        variant={next.enabled ? "default" : "disabled"}
        onClick={next.onClick}
      >
        {next.busy && <Loader2 className="animate-spin" />}
        {next.label}
      </Button>
    </div>
  );

  if (step === "asset") {
    return (
      <Modal className="p-0" onClose={onClose}>
        <ModalHeader
          className="px-8"
          title="Add wallet"
          subtitle="Register a wallet you control to send crypto to it."
          onClose={onClose}
        />
        {progress}
        <div className="space-y-5 px-8 pt-4 pb-8">
          {activeNetworks.isPending ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full rounded-lg" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : activeNetworks.isError ? (
            <ErrorLayout message={readApiError(activeNetworks.error).message} />
          ) : (
            <>
              <SelectFieldWithValue
                label="Select a coin"
                placeholder="Select Currency"
                value={currency}
                onChange={(value) => {
                  setCurrency(value);
                  setNetwork("");
                  setCheck(null);
                }}
                options={assets.map((a) => ({
                  value: a.currency,
                  label: `${a.currency} - ${a.currencyName}`,
                }))}
                renderIcon={(code) => <CoinIcon currency={code} size={20} />}
              />
              {asset && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-card-text">Network</p>
                <div
                  role="radiogroup"
                  aria-label="Network"
                  className="max-h-[300px] space-y-3 overflow-y-auto"
                >
                  {asset.networks.map((n) => {
                    const active = network === n.code;
                    return (
                      <button
                        key={n.code}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => {
                          setNetwork(n.code);
                          setCheck(null);
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                          active
                            ? "border-border-active bg-teal-light"
                            : "border-border hover:border-border-active",
                        )}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-input bg-background text-[11px] font-medium text-card-text">
                          {n.code}
                        </div>
                        <p className="min-w-0 flex-1 text-sm font-semibold text-card-text">
                          {n.name}
                        </p>
                        <div
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                            active ? "border-Green" : "border-text",
                          )}
                        >
                          {active && (
                            <div className="h-2.5 w-2.5 rounded-full bg-Green" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                  {asset.networks.length === 0 && (
                    <p className="text-center text-sm text-text">
                      No networks available for this asset right now.
                    </p>
                  )}
                </div>
              </div>
              )}
              <WarningNote>
                Make sure the network matches the wallet you are adding.
                Sending to the wrong network may result in permanent loss of
                funds.
              </WarningNote>
            </>
          )}
          {footer(
            { label: "Cancel", onClick: onClose },
            {
              label: "Continue",
              enabled: !!currency && !!network,
              onClick: () => setStep("address"),
            },
          )}
        </div>
      </Modal>
    );
  }

  if (step === "address") {
    return (
      <Modal className="p-0" onClose={onClose}>
        <ModalHeader
          className="px-8"
          title="Add wallet"
          subtitle="Paste the address and give the wallet a name."
          onBack={() => setStep("asset")}
          onClose={onClose}
        />
        {progress}
        <div className="space-y-5 px-8 pt-4 pb-8">
          <div className="flex items-center gap-2 text-xs text-text">
            Adding to
            <span className="rounded-full border border-teal-border bg-teal-light px-2 py-0.5 text-teal-text">
              {currency} on {netName}
            </span>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="tw-address"
              className="text-sm font-medium text-card-text"
            >
              Wallet address
            </label>
            <div className="relative">
              <Input
                id="tw-address"
                autoComplete="off"
                spellCheck={false}
                placeholder="Paste the wallet address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                aria-invalid={current?.state === "invalid"}
                className={cn(
                  "h-11 pr-10 font-mono text-[13px]",
                  addressValid && "border-border-active",
                )}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {current?.state === "checking" && (
                  <Loader2 className="h-4 w-4 animate-spin text-text" />
                )}
                {current?.state === "valid" && (
                  <Check className="h-4 w-4 text-Green" />
                )}
                {current?.state === "invalid" && (
                  <CircleAlert className="h-4 w-4 text-error-text" />
                )}
              </span>
            </div>
            {current?.state === "valid" && (
              <p className="flex items-center gap-1 text-xs text-Green">
                <Check className="h-3.5 w-3.5" /> Valid {netName} address
              </p>
            )}
            {current?.state === "invalid" && (
              <ErrorField message={current.reason} />
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="tw-label"
              className="text-sm font-medium text-card-text"
            >
              Wallet label
            </label>
            <Input
              id="tw-label"
              placeholder="Name this wallet"
              maxLength={labelMax}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={() => setLabelTouched(true)}
              className="h-11"
            />
            <div className="flex justify-between text-xs text-text">
              <span>Only you can see this name</span>
              <span>
                {label.length} / {labelMax}
              </span>
            </div>
            {labelTouched && labelProblem && (
              <ErrorField message={labelProblem} />
            )}
          </div>

          {footer(
            { label: "Back", onClick: () => setStep("asset") },
            {
              label: "Continue",
              enabled: addressValid && !labelProblem,
              onClick: () => setStep("confirm"),
            },
          )}
        </div>
      </Modal>
    );
  }

  const summary = (
    <WalletSummaryCard
      currency={currency}
      title={label.trim()}
      subtitle={
        step === "confirm"
          ? `${currency} · ${netName}`
          : `${netName} · ${shortAddress(trimmedAddress)}`
      }
    />
  );

  if (step === "confirm") {
    return (
      <Modal className="p-0" onClose={onClose}>
        <ModalHeader
          className="px-8"
          title="Confirm your wallet address"
          subtitle="Check the address carefully before you continue."
          onBack={() => setStep("address")}
          onClose={onClose}
        />
        {progress}
        <div className="space-y-5 px-8 pt-4 pb-8">
          {summary}
          <div className="space-y-2">
            <p className="text-sm font-medium text-card-text">
              Address you entered
            </p>
            <p className="break-all rounded-lg border border-input bg-input-background px-4 py-2.5 font-mono text-[13px] text-card-text">
              {trimmedAddress}
            </p>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="tw-confirm"
              className="text-sm font-medium text-card-text"
            >
              Re-enter your wallet address
            </label>
            <div className="relative">
              <Input
                id="tw-confirm"
                autoComplete="off"
                spellCheck={false}
                value={addressConfirm}
                onChange={(e) => setAddressConfirm(e.target.value)}
                aria-invalid={confirmMismatch}
                className={cn(
                  "h-11 pr-10 font-mono text-[13px]",
                  confirmMatches && "border-border-active",
                )}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {confirmMatches && <Check className="h-4 w-4 text-Green" />}
                {confirmMismatch && (
                  <CircleAlert className="h-4 w-4 text-error-text" />
                )}
              </span>
            </div>
            {confirmMatches && (
              <p className="flex items-center gap-1 text-xs text-Green">
                <Check className="h-3.5 w-3.5" /> Addresses match
              </p>
            )}
            {confirmMismatch && (
              <ErrorField message="The addresses don't match. Check both and try again." />
            )}
          </div>
          <WarningNote title="Please read before you continue">
            Xbanka can&apos;t check who owns this wallet. Make sure the address
            and network are correct and that you control the wallet. Crypto
            sent to a wrong or unsupported address can&apos;t be recovered or
            reversed.
          </WarningNote>
          <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-card-text">
            <input
              type="checkbox"
              checked={ownershipConfirmed}
              onChange={(e) => setOwnershipConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-Green"
            />
            I confirm this wallet belongs to me and I&apos;ve checked the
            address and network.
          </label>
          {footer(
            { label: "Back", onClick: () => setStep("address") },
            {
              label: "Continue",
              enabled: confirmMatches && ownershipConfirmed,
              onClick: () => setStep("verify"),
            },
          )}
        </div>
      </Modal>
    );
  }

  if (step === "verify") {
    return (
      <Modal className="p-0" onClose={onClose}>
        <ModalHeader
          className="px-8"
          title="Confirm it's you"
          subtitle="Confirm with your PIN and authenticator code."
          onBack={() => setStep("confirm")}
          onClose={onClose}
        />
        {progress}
        <div className="space-y-5 px-8 pt-4 pb-8">
          {summary}
          <PinAndCodeFields
            resetKey={resetKey}
            onPinChange={setPin}
            onCodeChange={setCode}
            error={locked ?? submitError}
            disabled={!!locked}
          />
          {footer(
            { label: "Back", onClick: () => setStep("confirm") },
            {
              label: "Add wallet",
              enabled: canSubmit,
              busy: add.isPending,
              onClick: submit,
            },
          )}
        </div>
      </Modal>
    );
  }

  // Success: everything shown comes from the saved wallet the backend returned.
  const wallet = saved;
  return (
    <Modal className="px-8 pt-6 pb-8" onClose={onClose}>
      <div className="flex flex-col items-center gap-5 text-center">
        <StateIcon tone="success">
          <Check className="h-6 w-6" />
        </StateIcon>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold leading-8 text-card-text">
            Wallet added
          </h3>
          <p className="text-sm leading-6 text-text">
            For your security, you can send to {wallet?.label} after a{" "}
            {coolingHours}-hour cooling-off period.
          </p>
        </div>
        {wallet && (
          <DetailRows
            rows={[
              { label: "Wallet", value: wallet.label },
              {
                label: "Network",
                value: `${wallet.currency} · ${networkName(wallet.network, supported.data)}`,
              },
              { label: "Address", value: shortAddress(wallet.address) },
              { label: "Status", value: <WalletStatusBadge status={wallet.status} /> },
              { label: "Unlocks", value: formatUnlockTime(wallet.unlocksAt) },
            ]}
          />
        )}
        <div className="w-full space-y-3">
          <Button size="lg" className="w-full" onClick={onClose}>
            Done
          </Button>
          <button
            type="button"
            onClick={restart}
            className="w-full py-1 text-sm text-Green hover:underline"
          >
            Add another wallet
          </button>
        </div>
      </div>
    </Modal>
  );
}
