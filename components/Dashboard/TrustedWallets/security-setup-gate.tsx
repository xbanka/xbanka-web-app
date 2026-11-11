"use client";
import { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { Button } from "@/components/ui/button";
import { Enable2faModal } from "../Account-Page/enable2fa-modal";
import { CreatePinModal } from "../Account-Page/create-pin-modal";

/**
 * Adding or removing a trusted wallet needs both an authenticator app and a
 * transaction PIN. Shown instead of the flow when either is missing, so the
 * customer sets them up first rather than failing at the last step. Both
 * setup modals refresh the profile, which closes this gate on its own.
 */
export function SecuritySetupGate({
  needs2fa,
  needsPin,
  onClose,
}: {
  needs2fa: boolean;
  needsPin: boolean;
  onClose: () => void;
}) {
  const [open, setOpen] = useState<"2fa" | "pin" | null>(null);

  if (open === "2fa")
    return <Enable2faModal open onClose={() => setOpen(null)} />;
  if (open === "pin")
    return <CreatePinModal open handleClose={() => setOpen(null)} />;

  const items = [
    needs2fa && {
      key: "2fa" as const,
      icon: ShieldCheck,
      title: "Turn on two-factor authentication",
      desc: "Use Google Authenticator, Authy or a similar app.",
    },
    needsPin && {
      key: "pin" as const,
      icon: KeyRound,
      title: "Create a transaction PIN",
      desc: "A 4-digit PIN for withdrawals and wallet changes.",
    },
  ].filter(Boolean) as {
    key: "2fa" | "pin";
    icon: typeof ShieldCheck;
    title: string;
    desc: string;
  }[];

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-8"
        title="Secure your account first"
        subtitle="Adding or removing a wallet needs your PIN and an authenticator code."
        onClose={onClose}
      />
      <div className="space-y-3 px-8 pb-8">
        {items.map(({ key, icon: Icon, title, desc }) => (
          <div
            key={key}
            className="flex items-center gap-3 rounded-xl border border-input p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-light">
              <Icon className="h-5 w-5 text-Green" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-5 text-card-text">
                {title}
              </p>
              <p className="mt-0.5 text-xs leading-5 text-text">{desc}</p>
            </div>
            <Button size="sm" onClick={() => setOpen(key)}>
              Set up
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="lg"
          className="mt-3 w-full"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
