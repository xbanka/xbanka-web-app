"use client";

import { useState } from "react";
import { OtpInput } from "../ui/otp-input";
import { Button } from "../ui/button";
import { useVerifyDevice } from "@/lib/services/auth.service";
import { Card } from "../ui/FormCard";
import { FormHeader } from "../ui/FormHeader";
import { maskEmail } from "@/lib/maskEmail";

export default function VerifyDevice() {
  const [code, setCode] = useState("");
  const verifyEmail =
    typeof window !== "undefined" ? localStorage.getItem("verifyEmail") : null;

  const { mutate, isPending, error } = useVerifyDevice();

  const handleVerify = async () => {
    console.log("submit", code);
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
    console.log("otp", otp);
  };

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
