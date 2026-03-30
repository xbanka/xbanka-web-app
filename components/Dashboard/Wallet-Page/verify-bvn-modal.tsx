import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import {
  BvnForm,
  bvnSchema,
  ModalState,
  PinForm,
  pinSchema,
} from "@/lib/schema/bvn-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, IdCard, Lock, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface VerifyBvnModalProps {
  open: boolean;
  onClose: () => void;
  /** Called after BVN verified (and optionally PIN set / skipped) */
  onVerified: () => void;
  /** Connect to your real BVN mutation. Return true = success, false = error */
  onVerifyBvn?: (bvn: string) => Promise<boolean>;
  /** Connect to your real set-PIN mutation */
  onSetPin?: (pin: string) => Promise<void>;
}

const UNLOCKED_FEATURES = [
  { label: "Add Funds" },
  { label: "Send Money" },
  { label: "Gift Cards" },
  { label: "Bills Payment" },
];

export function VerifyBvnModal({
  open,
  onClose,
  onVerified,
  onVerifyBvn,
  onSetPin,
}: VerifyBvnModalProps) {
  const [state, setState] = useState<ModalState>("verify");
  const [isPending, setIsPending] = useState(false);

  const bvnForm = useForm<BvnForm>({
    resolver: zodResolver(bvnSchema),
    mode: "onSubmit",
  });

  const pinForm = useForm<PinForm>({
    resolver: zodResolver(pinSchema),
    mode: "onSubmit",
  });

  // Reset on open
  useEffect(() => {
    if (open) {
      setState("verify");
      bvnForm.reset();
      pinForm.reset();
    }
  }, [open]);

  // Close on Escape + body scroll lock
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  // ── BVN submit ────────────────────────────────────────────────────────────
  const handleBvnSubmit = async (data: BvnForm) => {
    setIsPending(true);
    setState("success");
  };

  // ── PIN submit ────────────────────────────────────────────────────────────
  const handlePinSubmit = async (data: PinForm) => {
    setIsPending(true);
    try {
      await onSetPin?.(data.pin);
      onVerified();
      onClose();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      {/* Backdrop */}

      {/* Panel */}
      {/* ── VERIFY / ERROR ─────────────────────────────────────────────── */}
      {(state === "verify" || state === "error") && (
        <form onSubmit={bvnForm.handleSubmit(handleBvnSubmit)}>
          <CloseBtn onClose={onClose} />

          <div className="pt-18 space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold leading-11 text-card-text">
                Verify Your BVN
              </h2>
              <p className="text-[16px] text-text font-normal leading-6  mx-auto">
                Your BVN helps us confirm your name and date of birth. We'll
                never share it with anyone.
              </p>
            </div>

            <div className="text-left">
              <FormField
                id="bvn"
                icon={IdCard}
                placeholder="Enter BVN"
                error={bvnForm.formState.errors.bvn}
                register={bvnForm.register}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={onClose}
                disabled={isPending}
              >
                Back
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={isPending}
                variant={isPending ? "disabled" : "default"}
              >
                {isPending ? "Verifying..." : "Continue"}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* ── SUCCESS ──────────────────────────────────────────────────────── */}
      {state === "success" && (
        <div className="pt-18 space-y-5 text-center">
          <CloseBtn onClose={onClose} />

          {/* Icon */}
            <Image alt="badge" src={"/badge 2.svg"} width={60} height={60} className="mx-auto" />

          <div className="space-y-1">
            <h2 className="text-4xl font-bold leading-11 text-card-text">
              BVN Verified Successfully
            </h2>
            <p className="text-sm text-text">Your wallet is now unlocked</p>
          </div>

          {/* Unlocked features — 2-column grid */}
          <div className="grid border border-dashed border-disabled-background bg-input-background rounded-lg w-full py-3 px-4 grid-cols-2 gap-y-2.5 gap-x-4 mx-auto">
            {UNLOCKED_FEATURES.map((f) => (
              <div key={f.label} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-Green shrink-0" />
                <span className="text-sm font-medium text-card-text">
                  {f.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[16px] text-text font-normal leading-6  mx-auto">
            Set your transaction PIN to secure your account &amp; start
            transacting
          </p>

          <div className="space-y-2">
            <Button
              size="lg"
              className="w-full"
              onClick={() => setState("pin")}
            >
              Set PIN Now
            </Button>
            <button
              onClick={() => {
                onVerified();
                onClose();
              }}
              className="w-full text-sm font-medium text-Green hover:opacity-75 transition-opacity py-1"
            >
              Skip for later
            </button>
          </div>
        </div>
      )}

      {/* ── SET PIN ──────────────────────────────────────────────────────── */}
      {state === "pin" && (
        <form onSubmit={pinForm.handleSubmit(handlePinSubmit)}>
          <CloseBtn onClose={onClose} />

          <div className="pt-18 space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold leading-11 text-card-text">Set-Up PIN</h2>
              <p className="text-[16px] text-text font-normal leading-6 mx-auto">
                Your BVN helps us confirm your name and date of birth. We’ll never share it with anyone.
              </p>
            </div>

            <div className="text-left">
              <FormField
                id="pin"
                icon={Lock}
                type="password"
                placeholder="Enter PIN"
                error={pinForm.formState.errors.pin}
                register={pinForm.register}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setState("success")}
                disabled={isPending}
              >
                Back
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={isPending}
                variant={isPending ? "disabled" : "default"}
              >
                {isPending ? "Setting PIN..." : "Continue"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}

export function CloseBtn({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="w-10 h-10 absolute top-4 right-4 rounded-[36px] flex items-center justify-center text-text bg-border border border-disabled-background hover:bg-border/70 hover:text-card-text transition-colors"
    >
      <X className="w-5 h-5 text-text" />
    </div>
  );
}
