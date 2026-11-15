"use client";
import { Clock } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { CloseBtn } from "@/components/ui/close-btn";
import { useTrustedWalletsSupportedHours } from "./use-cooling-hours";
import { formatUnlockTime } from "@/lib/trusted-wallets";
import { DetailRows, StateIcon, WalletStatusBadge } from "./shared";

/** Blocked: the chosen wallet is still in its cooling-off period. */
export function CoolingOffModal({
  label,
  unlocksAt,
  onClose,
}: {
  label: string;
  /** ISO time; from the wallet, or the `details` of a WALLET_COOLING_OFF error. */
  unlocksAt: string;
  onClose: () => void;
}) {
  const hours = useTrustedWalletsSupportedHours();
  return (
    <Modal className="px-8 pt-6 pb-8" onClose={onClose}>
      <div className="mb-2 flex justify-end">
        <CloseBtn onClose={onClose} />
      </div>
      <div className="flex flex-col items-center gap-5 text-center">
        <StateIcon tone="warning">
          <Clock className="h-6 w-6" />
        </StateIcon>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold leading-8 text-card-text">
            This wallet is cooling off
          </h3>
          <p className="text-sm leading-6 text-text">
            {unlocksAt
              ? `This wallet unlocks on ${formatUnlockTime(unlocksAt, { withYear: false })}. `
              : ""}
            New wallets wait {hours} hours before first use to protect your
            funds.
          </p>
        </div>
        <DetailRows
          rows={[
            { label: "Wallet", value: label },
            { label: "Status", value: <WalletStatusBadge status="COOLING_OFF" /> },
            ...(unlocksAt
              ? [{ label: "Unlocks", value: formatUnlockTime(unlocksAt) }]
              : []),
          ]}
        />
        <Button size="lg" className="w-full" onClick={onClose}>
          Got it
        </Button>
      </div>
    </Modal>
  );
}
