import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { BvnForm, bvnSchema, ModalState, PinForm, pinSchema } from "@/lib/schema/bvn-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, IdCard, Lock, X } from "lucide-react";
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
    try {
      const ok = onVerifyBvn
        ? await onVerifyBvn(data.bvn)
        : data.bvn === "11111111111"; // demo: any 11-digit number passes except this one
      if (ok) {
        setState("success");
      } else {
        setState("error");
        bvnForm.setError("bvn", { message: "We couldn't verify your BVN" });
      }
    } finally {
      setIsPending(false);
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-150"
        onClick={onClose}
      />
 
      {/* Panel */}
      <div className="relative w-full max-w-md bg-card-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
 
        {/* ── VERIFY / ERROR ─────────────────────────────────────────────── */}
        {(state === "verify" || state === "error") && (
          <form onSubmit={bvnForm.handleSubmit(handleBvnSubmit)}>
            <CloseBtn onClose={onClose} />
 
            <div className="px-6 pt-8 pb-6 space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-card-text">Verify Your BVN</h2>
                <p className="text-sm text-text leading-relaxed max-w-xs mx-auto">
                  Your BVN helps us confirm your name and date of birth.
                  We'll never share it with anyone.
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
          <div className="px-6 pt-8 pb-6 space-y-5 text-center">
            <CloseBtn onClose={onClose} />
 
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-Green/10 border-[3px] border-Green flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-Green" />
            </div>
 
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-card-text">BVN Verified Successfully</h2>
              <p className="text-sm text-text">Your wallet is now unlocked</p>
            </div>
 
            {/* Unlocked features — 2-column grid */}
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 w-fit mx-auto">
              {UNLOCKED_FEATURES.map((f) => (
                <div key={f.label} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-Green shrink-0" />
                  <span className="text-sm font-medium text-card-text">{f.label}</span>
                </div>
              ))}
            </div>
 
            <p className="text-xs text-text leading-relaxed max-w-xs mx-auto">
              Set your transaction PIN to secure your account &amp; start transacting
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
                onClick={() => { onVerified(); onClose(); }}
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
 
            <div className="px-6 pt-8 pb-6 space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-card-text">Set-Up PIN</h2>
                <p className="text-sm text-text leading-relaxed max-w-xs mx-auto">
                  Create a secure PIN to authorise transactions on your account.
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
      </div>
    </div>
  );
}

function CloseBtn({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-text hover:bg-border transition-colors z-10"
      aria-label="Close"
    >
      <X className="w-4 h-4" />
    </button>
  );
}