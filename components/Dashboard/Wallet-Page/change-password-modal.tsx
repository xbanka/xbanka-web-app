"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Lock, X } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useChangePassword } from "@/lib/services/security.service";
import { CloseBtn } from "../Account-Page/create-pin-modal";
import {
  ChangePasswordForm,
  changePasswordSchema,
} from "@/lib/schema/security-schema";
import { zodResolver } from "@hookform/resolvers/zod";

export const ChangePasswordModal = ({ open, handleClose }: any) => {
  const { mutate, isPending } = useChangePassword();
  const { handleSubmit, register, reset } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onSubmit",
  });

  const [success, setSuccess] = useState(false);

  const onSubmit = (data: any) => {
    mutate(
      {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        otp: data.otp,
      },
      {
        onSuccess: () => {
          reset();
          setSuccess(true); // ✅ SHOW SUCCESS
        },
      },
    );
  };

  if (!open) return null;

  return (
    <Modal onClose={handleClose}>
      {!success ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <CloseBtn onClose={handleClose} />

          <div className="pt-18 space-y-6 text-center">
            <h2 className="text-3xl font-bold text-card-text">
              Change Password
            </h2>

            {/* OTP */}
            <FormField
              id="otp"
              icon={Lock}
              type="text"
              placeholder="Enter OTP"
              register={register}
            />

            {/* Old Password */}
            <FormField
              id="oldPassword"
              icon={Lock}
              type="password"
              placeholder="Current Password"
              register={register}
            />

            {/* New Password */}
            <FormField
              id="newPassword"
              icon={Lock}
              type="password"
              placeholder="New Password"
              register={register}
            />

            <div className="flex gap-4">
              <Button type="button" variant={"outline"} className="flex-1" onClick={handleClose}>
                Cancel
              </Button>

              <Button type="submit" className="flex-3" disabled={isPending}>
                {isPending ? "Updating..." : "Update Password"}
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
            Password Changed Successfully
          </h2>

          <p className="text-sm text-text">
            Your account password has been updated successfully
          </p>

          <Button onClick={handleClose} className="w-full">
            Confirm
          </Button>
        </div>
      )}
    </Modal>
  );
};
