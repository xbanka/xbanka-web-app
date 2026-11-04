"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { detectInstallState, type InstallEnv, type InstallState } from "@/lib/pwa/install";
import { trackPwaEvent } from "@/lib/pwa/telemetry";

// Not in lib.dom.d.ts; Chromium-only.
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type BrowserEnv = Omit<InstallEnv, "hasDeferredPrompt">;

// Read as a string so the snapshot is referentially stable between renders.
const readEnv = (): string =>
  JSON.stringify({
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints,
    displayModeStandalone: window.matchMedia("(display-mode: standalone)").matches,
    navigatorStandalone: (navigator as Navigator & { standalone?: boolean }).standalone,
  } satisfies BrowserEnv);

const subscribeNoop = () => () => {};

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [justInstalled, setJustInstalled] = useState(false);
  // "" on the server and first client render, so SSR markup always matches.
  const envJson = useSyncExternalStore(subscribeNoop, readEnv, () => "");

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault(); // keep the event so we can fire it from our own button
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setJustInstalled(true);
      trackPwaEvent("app_installed");
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    trackPwaEvent(outcome === "accepted" ? "install_accepted" : "install_dismissed");
    // A prompt event can only be used once.
    setDeferred(null);
  }, [deferred]);

  let state: InstallState = "unavailable";
  if (envJson) {
    state = justInstalled
      ? "installed"
      : detectInstallState({ ...(JSON.parse(envJson) as BrowserEnv), hasDeferredPrompt: !!deferred });
  }

  return { state, install };
}
