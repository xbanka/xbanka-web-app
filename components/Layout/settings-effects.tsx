"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isIdleTooLong } from "@/lib/settings";
import { clearSession } from "@/lib/signOut";
import { useBalanceVisibilityStore } from "@/store/balance-visibility.store";
import { useSettingsStore } from "@/store/settings.store";

const LAST_ACTIVITY_KEY = "xbanka:last-activity";
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

const readLastActivity = (fallback: number) => {
  try {
    const saved = Number(localStorage.getItem(LAST_ACTIVITY_KEY));
    return Number.isFinite(saved) && saved > 0 ? Math.max(saved, fallback) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Applies the Settings that act on the whole app rather than one page.
 * Renders nothing; mounted once in the dashboard layout.
 */
export function SettingsEffects() {
  const router = useRouter();
  const minutes = useSettingsStore((s) => s.autoSignOutMinutes);
  const appliedOnOpen = useRef(false);

  // "Hide balances when the app opens": once per page load, after both stores
  // have read storage, so a balance card's own rehydrate can't undo it.
  useEffect(() => {
    if (appliedOnOpen.current) return;
    appliedOnOpen.current = true;
    void (async () => {
      await useSettingsStore.persist.rehydrate();
      await useBalanceVisibilityStore.persist.rehydrate();
      if (useSettingsStore.getState().hideBalancesOnOpen) {
        useBalanceVisibilityStore.getState().setHidden(true);
      }
    })();
  }, []);

  // Auto sign-out. Activity is shared through storage so an idle second tab
  // doesn't sign out someone who is busy in the first.
  useEffect(() => {
    if (minutes <= 0) return;
    let lastLocal = Date.now();
    let lastWrite = 0;

    const onActivity = () => {
      lastLocal = Date.now();
      if (lastLocal - lastWrite < 5_000) return;
      lastWrite = lastLocal;
      try {
        localStorage.setItem(LAST_ACTIVITY_KEY, String(lastLocal));
      } catch {
        // Storage blocked: this tab's own activity still counts.
      }
    };
    onActivity();

    const check = () => {
      if (!isIdleTooLong(readLastActivity(lastLocal), Date.now(), minutes)) return;
      clearSession();
      toast.info("You were signed out after a period of inactivity.");
      router.push("/sign-in");
    };

    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    // Coming back to a tab that slept past the limit signs out straight away.
    document.addEventListener("visibilitychange", check);
    const timer = window.setInterval(check, 30_000);
    return () => {
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
      document.removeEventListener("visibilitychange", check);
      window.clearInterval(timer);
    };
  }, [minutes, router]);

  return null;
}
