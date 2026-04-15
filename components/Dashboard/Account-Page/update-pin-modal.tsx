"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { UpdatePinForm, updatePinSchema } from "@/lib/schema/bvn-schema";
import { useUpdatePin } from "@/lib/services/security.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const UpdatePinModal = ({ open, handleClose }: any) => {
  const [success, setSuccess] = useState(false);

  const { mutate, isPending, error } = useUpdatePin();

  const { handleSubmit, register, reset } = useForm<UpdatePinForm>({
    resolver: zodResolver(updatePinSchema),
    mode: "onSubmit",
  });

  const onSubmit = (data: any) => {
    const payload = {
      otp: data.otp,
      oldPin: data.oldPin,
      newPin: data.newPin,
    };
    mutate(payload, {
      onSuccess: () => {
        reset();
        handleClose();
      },
    });
  };

  if (!open) return null;

  return (
    <Modal onClose={handleClose}>
      {!success ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <CloseBtn onClose={handleClose} />

          <div className="pt-18 space-y-6 text-center">
            <h2 className="text-3xl font-bold leading-11 text-card-text">
              Change PIN
            </h2>

            {/* OTP */}
            <FormField
              id="otp"
              icon={Lock}
              type="text"
              placeholder="Enter OTP"
              register={register}
            />

            {/* Old PIN */}
            <FormField
              id="oldPin"
              icon={Lock}
              type="password"
              placeholder="Current PIN"
              register={register}
            />

            {/* New PIN */}
            <FormField
              id="newPin"
              icon={Lock}
              type="password"
              placeholder="New PIN"
              register={register}
            />

            <div className="flex gap-3">
              <Button type="button" onClick={handleClose}>
                Cancel
              </Button>

              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update PIN"}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        // ✅ SUCCESS STATE
        <div className="pt-18 space-y-5 text-center">
          <CloseBtn onClose={handleClose} />

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

function CloseBtn({ onClose }: any) {
  return (
    <div onClick={onClose} className="absolute top-4 right-4 cursor-pointer">
      <X />
    </div>
  );
}
