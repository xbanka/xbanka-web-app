"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Lock, X } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useChangePassword } from "@/lib/services/security.service";
import {
  ChangePasswordForm,
  changePasswordSchema,
} from "@/lib/schema/security-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalHeader } from "@/components/ui/modal-header";
import { useOtpFlow } from "@/hooks/use-otp-flow";

export const ChangePasswordModal = ({ open, handleClose }: any) => {
  const { mutate, isPending } = useChangePassword();
  const [success, setSuccess] = useState(false);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onSubmit",
  });


  const { sendOtp, cooldown, canResend } = useOtpFlow();

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

  useEffect(() => {
    if (open) {
      sendOtp();
    }
  }, [open]);

  if (!open) return null;

  return (
    <Modal className="p-0" onClose={handleClose}>
      {!success ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            className="px-8"
            title="Change Password"
            subtitle="OTP sent to your mail to change login password"
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

              {/* Old Password */}
              <FormField
                id="oldPassword"
                icon={Lock}
                type="password"
                placeholder="Current Password"
                register={register}
                error={errors.oldPassword}
              />

              {/* New Password */}
              <FormField
                id="newPassword"
                icon={Lock}
                type="password"
                placeholder="New Password"
                register={register}
                error={errors.newPassword}
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

            <div className="flex gap-4">
              <Button
                type="button"
                variant={"outline"}
                className="flex-1"
                onClick={handleClose}
              >
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
        <div className="px-8 pt-4 pb-8 space-y-5 text-center">
          <ModalHeader
            className="px-8"
            onClose={handleClose}
          />

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
