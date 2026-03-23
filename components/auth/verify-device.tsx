"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyDevice } from "@/lib/actions/auth";
import { OtpInput } from "../ui/otp-input";
import { Button } from "../ui/button";
import { useVerifyDevice } from "@/lib/services/auth.service";

export default function VerifyDevice() {
  const [code, setCode] = useState("");
  const router = useRouter();

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

  return (
    <div>
      <h2 className="text-center text-card-text">Enter OTP</h2>
      {/* <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="6-digit code"
      /> */}
      <OtpInput onChange={handleChange}  error={error?.message}/>
      <Button onClick={handleVerify} className="w-full">
        { isPending ? "Verifying..." : "Verify"}
      </Button>
    </div>
  );
}
