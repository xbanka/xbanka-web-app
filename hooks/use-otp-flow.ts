import { useRequestOtp } from "@/lib/services/security.service";
import { useCallback, useEffect, useState } from "react";

export const useOtpFlow = () => {
  const { mutate: requestOtp, isPending, error } = useRequestOtp();

  const [cooldown, setCooldown] = useState(0);

  const sendOtp = useCallback(() => {
    console.log("sendOtp called", cooldown);
    if (cooldown > 0) return;

    requestOtp(undefined, {
      onSuccess: () => {
        console.log("OTP success");
        setCooldown(60); // 60 sec countdown
      },
    });
  }, [cooldown, requestOtp]);

  // countdown timer
  useEffect(() => {
    if (cooldown === 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  return {
    sendOtp,
    cooldown,
    isPending,
    error,
    canResend: cooldown === 0,
    startCooldown: (seconds = 60) => setCooldown(seconds),
  };
};
