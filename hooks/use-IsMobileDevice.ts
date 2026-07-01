// hooks/useIsMobileDevice.ts
import { useEffect, useState } from "react";

export function useIsMobileDevice() {
  const [isMobileDevice, setIsMobileDevice] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const mobileUA = /Android|iPhone|iPad|iPod/i.test(
        navigator.userAgent,
      );

      const touchDevice = navigator.maxTouchPoints > 1;

      setIsMobileDevice(mobileUA && touchDevice);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobileDevice;
}