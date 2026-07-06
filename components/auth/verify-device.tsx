"use client";

import { useEffect, useState } from "react";
import { OtpInput } from "../ui/otp-input";
import { Button } from "../ui/button";
import { useVerifyDevice } from "@/lib/services/auth.service";
import { Card } from "../ui/FormCard";
import { FormHeader } from "../ui/FormHeader";
import { maskEmail } from "@/lib/maskEmail";
import { useOtpFlow } from "@/hooks/use-otp-flow";

export default function VerifyDevice() {
  const [code, setCode] = useState("");
  const { sendOtp, cooldown, canResend, startCooldown } = useOtpFlow();
  const verifyEmail =
    typeof window !== "undefined" ? localStorage.getItem("verifyEmail") : null;

  const { mutate, isPending, error } = useVerifyDevice();

  const handleVerify = async () => {
    const userId = localStorage.getItem("verifyUserId");
    const deviceId = localStorage.getItem("verifyDeviceId");

    if (!userId || !deviceId) return;
    const payload = {
      userId,
      deviceId,
      code,
    };

    mutate(payload, {
      onSuccess: () => {
        localStorage.removeItem("verifyUserId");
        localStorage.removeItem("verifyDeviceId");
        localStorage.removeItem("verifyEmail");
      },
    });
  };

  const handleChange = (otp: string) => {
    setCode(otp);
  };

  useEffect(() => {
  startCooldown();
}, []);

  return (
    <Card className="max-sm:justify-center max-sm:text-center">
      <FormHeader
        className="max-sm:text-center"
        title="Verify It’s You"
        subtitle={
          <>
            <span>
              We sent a 6-digit code to{" "}
              {verifyEmail ? maskEmail(verifyEmail) : "your email address"}
            </span>
          </>
        }
      />
      {/* <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="6-digit code"
      /> */}
      <OtpInput onChange={handleChange} error={error?.message} />
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
      <Button
        onClick={handleVerify}
        disabled={code.length !== 6 || isPending}
        className="w-full max-sm:h-14 max-sm:rounded-lg max-sm:text-base"
      >
        {isPending ? "Verifying..." : "Verify OTP"}
      </Button>
    </Card>
  );
}
