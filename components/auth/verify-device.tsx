"use client";

import { useEffect, useState } from "react";
import { OtpInput } from "../ui/otp-input";
import { Button } from "../ui/button";
import { useVerifyDevice } from "@/lib/services/auth.service";
import { Card } from "../ui/FormCard";
import { FormHeader } from "../ui/FormHeader";
import { useOtpFlow } from "@/hooks/use-otp-flow";

export default function VerifyDevice() {
  const [code, setCode] = useState("");
  const { sendOtp, cooldown, canResend } = useOtpFlow();

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
      },
    });
  };

  const handleChange = (otp: string) => {
    setCode(otp);
    console.log("otp", otp);
  };

  useEffect(() => {
    sendOtp();
  }, []);

  return (
    <Card>
      <FormHeader
        title="Verify It’s You"
        subtitle={
          <>
            <span>
              We sent a 6-digit code to your phone number ending in ••••
              seph1@gmail.com
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
      <Button onClick={handleVerify} className="w-full">
        {isPending ? "Verifying..." : "Verify OTP"}
      </Button>
    </Card>
  );
}
