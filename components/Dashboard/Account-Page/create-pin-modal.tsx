import { Button } from "@/components/ui/button";
import { ErrorField } from "@/components/ui/field-error";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { UNLOCKED_FEATURES } from "@/lib/MockData";
import { PinForm, pinSchema } from "@/lib/schema/bvn-schema";
import { useCreatePin } from "@/lib/services/security.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Lock, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

export interface CreatePinModalProps {
  handleClose: () => void;
  open: boolean;
}

export const CreatePinModal = ({ handleClose, open }: CreatePinModalProps) => {
  const [success, setSuccess] = useState(false);
  const {
    mutate: mutatePin,
    isPending: pinPending,
    error: pinError,
  } = useCreatePin();
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<PinForm>({
    resolver: zodResolver(pinSchema),
    mode: "onSubmit",
  });

  const onsubmit = async (data: PinForm) => {
    const payload = {
      otp: data.otp,
      pin: data.pin,
    };

    mutatePin(payload, {
      onSuccess: () => {
        reset();
        setSuccess(true);
      },
    });
  };
  if (!open) return null;
  return (
    <Modal onClose={handleClose}>
      {/* Backdrop */}

      {/* ── SET PIN ──────────────────────────────────────────────────────── */}
      {!success ? (
        <form onSubmit={handleSubmit(onsubmit)}>
          <CloseBtn onClose={handleClose} />

          <div className="pt-18 space-y-6 text-center">
            <h2 className="text-4xl font-bold leading-11 text-card-text">
              Set-Up PIN
            </h2>

            {/* OTP */}
            <FormField
              id="otp"
              icon={Lock}
              type="text"
              placeholder="Enter OTP"
              register={register}
              error={errors.otp}
            />

            {/* PIN */}
            <FormField
              id="pin"
              icon={Lock}
              type="password"
              placeholder="Enter PIN"
              register={register}
              error={errors.pin}
            />

            { pinError && <ErrorField message={pinError.message} /> }

            <div className="flex gap-4 w-full items-center">
              <Button type="button" variant={"outline"} className="flex-1" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-3" disabled={pinPending}>
                {pinPending ? "Setting PIN..." : "Continue"}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        // ✅ SUCCESS SCREEN (your existing UI)
        <div className="pt-18 space-y-5 text-center">
          <CloseBtn onClose={handleClose} />

          <Image
            alt="badge"
            src={"/badge 2.svg"}
            width={60}
            height={60}
            className="mx-auto"
          />

          <h2 className="text-4xl font-bold leading-11 text-card-text">
            PIN Verified Successfully
          </h2>

          <Button className="w-full" onClick={handleClose}>Confirm</Button>
        </div>
      )}
    </Modal>
  );
};

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
