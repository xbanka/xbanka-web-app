import { Button } from "@/components/ui/button";
import { ErrorField } from "@/components/ui/field-error";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { useOtpFlow } from "@/hooks/use-otp-flow";
import { UNLOCKED_FEATURES } from "@/lib/MockData";
import { PinForm, pinSchema } from "@/lib/schema/bvn-schema";
import { useCreatePin } from "@/lib/services/security.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Lock, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export interface CreatePinModalProps {
  handleClose: () => void;
  open: boolean;
}

export const CreatePinModal = ({ handleClose, open }: CreatePinModalProps) => {
  const [success, setSuccess] = useState(false);
  const { sendOtp, cooldown, canResend } = useOtpFlow();
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

  useEffect(() => {
    if (open) {
      sendOtp();
    }
  }, [open]);
  if (!open) return null;
  return (
    <Modal className="p-0" onClose={handleClose}>
      {/* Backdrop */}

      {/* ── SET PIN ──────────────────────────────────────────────────────── */}
      {!success ? (
        <form onSubmit={handleSubmit(onsubmit)}>
          <ModalHeader
            className="px-8"
            title="Create Pin"
            subtitle="OTP sent to your mail to change account pin"
            onClose={handleClose}
          />

          <div className="px-8 pt-4 pb-8 text-center space-y-8">
            <div className="space-y-4">
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
            </div>
            <div className="flex items-center justify-between">
              <p className="text-text ont-normal text-sm leading-6">
                Code expires in 00:{cooldown}
              </p>
              <p
                onClick={sendOtp}
                className={` font-normal text-sm leading-6 ${canResend ? "text-Green cursor-pointer" : "text-text cursor-not-allowed"} `}
              >
                Resend code
              </p>
            </div>
            {/* OTP */}

            {pinError && <ErrorField message={pinError.message} />}

            <div className="flex gap-4 w-full items-center">
              <Button
                type="button"
                variant={"outline"}
                className="flex-1"
                onClick={handleClose}
              >
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
        <div className="px-8 pt-4 pb-8 space-y-5 text-center">
          <ModalHeader className="px-8" onClose={handleClose} />

          <Image
            alt="badge"
            src={"/badge 2.svg"}
            width={60}
            height={60}
            className="mx-auto"
          />

          <h2 className="text-3xl font-bold text-card-text">
            PIN Verified Successfully
          </h2>

          <p className="text-sm text-text">
            Your account pin has been updated successfully
          </p>

          <Button className="w-full" onClick={handleClose}>
            Confirm
          </Button>
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
