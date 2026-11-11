"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Copy, Loader2, Pencil, TriangleAlert } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorField } from "@/components/ui/field-error";
import { UseProfileUser } from "@/lib/services/profile.service";
import {
  TRUSTED_WALLETS_KEY,
  UseRemoveTrustedWallet,
  UseRenameTrustedWallet,
  UseTrustedWalletsSupported,
} from "@/lib/services/trusted-wallets.service";
import {
  classifyTrustedWalletError,
  DEFAULT_COOLING_OFF_HOURS,
  DEFAULT_LABEL_MAX_LENGTH,
  formatAddedDate,
  formatUnlockTime,
  isCompleteCode,
  isCompletePin,
  isCoolingOff,
  labelError,
  networkName,
  readApiError,
  shortAddress,
  TrustedWallet,
} from "@/lib/trusted-wallets";
import { DetailRows, StateIcon, WalletStatusBadge } from "./shared";
import { PinAndCodeFields } from "./pin-and-code-fields";
import { SecuritySetupGate } from "./security-setup-gate";

export function WalletDetailModal({
  wallet,
  onClose,
}: {
  wallet: TrustedWallet;
  onClose: () => void;
}) {
  const [view, setView] = useState<"detail" | "remove">("detail");
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(wallet.label);
  const [copied, setCopied] = useState(false);
  const [pin, setPin] = useState("");
  const [code, setCode] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [error, setError] = useState<string>();
  const [locked, setLocked] = useState<string>();

  const queryClient = useQueryClient();
  const { data: profile } = UseProfileUser();
  const { data: supported } = UseTrustedWalletsSupported();
  const rename = UseRenameTrustedWallet();
  const remove = UseRemoveTrustedWallet();

  const labelMax = supported?.labelMaxLength ?? DEFAULT_LABEL_MAX_LENGTH;
  const coolingHours = supported?.coolingOffHours ?? DEFAULT_COOLING_OFF_HOURS;
  const netName = networkName(wallet.network, supported);
  const renameProblem = labelError(label, labelMax);

  const copy = () => {
    navigator.clipboard?.writeText(wallet.address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveLabel = () => {
    if (renameProblem || label.trim() === wallet.label) {
      setEditing(false);
      setLabel(wallet.label);
      return;
    }
    rename.mutate(
      { id: wallet.id, label: label.trim() },
      { onSuccess: () => setEditing(false) },
    );
  };

  const submitRemove = () => {
    if (!isCompletePin(pin) || !isCompleteCode(code) || locked) return;
    setError(undefined);
    remove.mutate(
      { id: wallet.id, pin, code },
      {
        onSuccess: onClose,
        onError: (err) => {
          setPin("");
          setCode("");
          setResetKey((k) => k + 1);
          const action = classifyTrustedWalletError(err);
          if (action.kind === "locked") setLocked(action.message);
          else if (action.kind === "refetch") {
            // Already removed, or not this customer's: the list is stale.
            queryClient.invalidateQueries({ queryKey: TRUSTED_WALLETS_KEY });
            onClose();
          } else {
            if (action.kind === "setup-2fa" || action.kind === "setup-pin") {
              queryClient.invalidateQueries({ queryKey: ["user-profile"] });
            }
            setError(action.message);
          }
        },
      },
    );
  };

  if (view === "remove") {
    const needs2fa = profile?.data ? !profile.data.isTwoFactorEnabled : false;
    const needsPin = profile?.data ? !profile.data.hasTransactionPin : false;
    if (needs2fa || needsPin) {
      return (
        <SecuritySetupGate
          needs2fa={needs2fa}
          needsPin={needsPin}
          onClose={() => setView("detail")}
        />
      );
    }
    const canRemove =
      isCompletePin(pin) && isCompleteCode(code) && !remove.isPending && !locked;
    return (
      <Modal className="px-8 pt-6 pb-8" onClose={onClose}>
        <div className="space-y-6">
          <div className="space-y-3 text-center">
            <StateIcon tone="danger">
              <TriangleAlert className="h-6 w-6" />
            </StateIcon>
            <h3 className="text-2xl font-semibold leading-8 text-card-text">
              Remove {wallet.label}?
            </h3>
            <p className="text-sm leading-6 text-text">
              You&apos;ll need to register it again, and it will wait{" "}
              {coolingHours} hours before use.
            </p>
          </div>
          <PinAndCodeFields
            resetKey={resetKey}
            onPinChange={setPin}
            onCodeChange={setCode}
            error={locked ?? error}
            disabled={!!locked}
          />
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setView("detail")}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              className="flex-3"
              variant={canRemove ? "red" : "disabled"}
              disabled={!canRemove}
              onClick={submitRemove}
            >
              {remove.isPending && <Loader2 className="animate-spin" />}
              Remove wallet
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-8"
        title={wallet.label}
        subtitle={`${wallet.currency} · ${netName}`}
        onClose={onClose}
      />
      <div className="space-y-5 px-8 pb-8">
        <DetailRows
          rows={[
            {
              label: "Label",
              value: editing ? (
                <span className="flex items-center gap-2">
                  <Input
                    autoFocus
                    aria-label="Wallet label"
                    maxLength={labelMax}
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveLabel()}
                    className="h-8 w-40 text-right"
                  />
                  <button
                    type="button"
                    aria-label="Save label"
                    onClick={saveLabel}
                    disabled={rename.isPending}
                    className="text-Green"
                  >
                    {rename.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 hover:text-Green"
                >
                  {wallet.label} <Pencil className="h-3.5 w-3.5 text-Green" />
                </button>
              ),
            },
            {
              label: "Address",
              value: (
                <button
                  type="button"
                  onClick={copy}
                  title={wallet.address}
                  className="inline-flex items-center gap-1.5 hover:text-Green"
                >
                  {shortAddress(wallet.address, 10, 5)}
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-Green" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-Green" />
                  )}
                </button>
              ),
            },
            { label: "Network", value: netName },
            { label: "Added", value: formatAddedDate(wallet.createdAt) },
            { label: "Status", value: <WalletStatusBadge status={wallet.status} /> },
            ...(isCoolingOff(wallet)
              ? [{ label: "Unlocks", value: formatUnlockTime(wallet.unlocksAt) }]
              : []),
          ]}
        />
        {editing && renameProblem && <ErrorField message={renameProblem} />}
        {rename.error && (
          <ErrorField message={readApiError(rename.error).message} />
        )}
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            size="lg"
            variant="red"
            className="flex-3"
            onClick={() => setView("remove")}
          >
            Remove wallet
          </Button>
        </div>
      </div>
    </Modal>
  );
}
