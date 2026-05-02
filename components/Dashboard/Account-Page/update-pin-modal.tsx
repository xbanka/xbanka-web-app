"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { UpdatePinForm, updatePinSchema } from "@/lib/schema/bvn-schema";
import { useUpdatePin } from "@/lib/services/security.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorField } from "@/components/ui/field-error";
import { ModalHeader } from "@/components/ui/modal-header";
import { useOtpFlow } from "@/hooks/use-otp-flow";

interface UpdatePinModalProps {
  open: boolean;
  handleClose: () => void;
}

export const UpdatePinModal = ({ open, handleClose }: UpdatePinModalProps) => {
  const [success, setSuccess] = useState(false);
  const { sendOtp, cooldown, canResend } = useOtpFlow();
  const { mutate, isPending, error } = useUpdatePin();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<UpdatePinForm>({
    resolver: zodResolver(updatePinSchema),
    mode: "onSubmit",
  });

  const onSubmit = (data: UpdatePinForm) => {
    const payload = {
      otp: data.otp,
      oldPin: data.oldPin,
      newPin: data.newPin,
    };
    mutate(payload, {
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
  }, [open, sendOtp]);

  if (!open) return null;

  return (
    <Modal className="p-0" onClose={handleClose}>
      {!success ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            className="px-8"
            title="Update Pin"
            subtitle="OTP sent to your mail to update account pin"
            onClose={handleClose}
          />

          <div className="px-8 pt-4 pb-8 text-center space-y-8">
            <div className="space-y-4">
              {/* OTP */}
              <FormField
                id="otp"
                icon={Lock}
                type="text"
                placeholder="Enter OTP"
                register={register}
                error={errors.otp}
              />

              {/* Old PIN */}
              <FormField
                id="oldPin"
                icon={Lock}
                type="password"
                placeholder="Current PIN"
                register={register}
                error={errors.oldPin}
              />

              {/* New PIN */}
              <FormField
                id="newPin"
                icon={Lock}
                type="password"
                placeholder="New PIN"
                register={register}
                error={errors.newPin}
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

            {error && <ErrorField message={error.message} />}

            <div className="flex gap-3 w-full">
              <Button
                type="button"
                variant={"outline"}
                className="flex-1"
                onClick={handleClose}
              >
                Cancel
              </Button>

              <Button type="submit" className="flex-3" disabled={isPending}>
                {isPending ? "Updating..." : "Update PIN"}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        // ✅ SUCCESS STATE
        <div className="px-8 pt-4 pb-8 space-y-5 text-center">
          <ModalHeader className="px-8" onClose={handleClose} />

          <Image
            alt="success"
            src={"/badge 2.svg"}
            width={60}
            height={60}
            className="mx-auto"
          />

          <h2 className="text-3xl font-bold text-card-text">
            PIN Updated Successfully
          </h2>

          <p className="text-sm text-text">
            Your transaction PIN has been changed successfully
          </p>

          <Button onClick={handleClose} className="w-full">
            Confirm
          </Button>
        </div>
      )}
    </Modal>
  );
};
