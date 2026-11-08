"use client";

import { useEffect } from "react";
import { trackPwaEvent } from "@/lib/pwa/telemetry";

const SESSION_KEY = "pwa-standalone-tracked";

/**
 * Registers /sw.js (production only, so it never fights HMR in dev) and
 * records one `standalone_session` per tab session when the app was opened
 * from the installed icon.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch((err) => console.warn("Service worker registration failed", err));
    }

    try {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true;
      if (standalone && !sessionStorage.getItem(SESSION_KEY)) {
        sessionStorage.setItem(SESSION_KEY, "1");
        trackPwaEvent("standalone_session");
      }
    } catch {
      // storage can throw in private modes; telemetry is optional
    }
  }, []);

  return null;
}
