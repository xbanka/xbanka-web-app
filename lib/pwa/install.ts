// Pure install-state logic. No imports, so it runs under `node --test`.

export type InstallState =
  | "installed" // already running as an installed app
  | "promptable" // Chrome/Edge/Android: we hold a beforeinstallprompt event
  | "ios-manual" // iOS/iPadOS: no API, user must use Share > Add to Home Screen
  | "unavailable"; // nothing we can offer (unsupported browser, already dismissed, etc.)

export type InstallEnv = {
  userAgent: string;
  platform?: string;
  maxTouchPoints?: number;
  /** matchMedia("(display-mode: standalone)").matches */
  displayModeStandalone: boolean;
  /** iOS-only navigator.standalone */
  navigatorStandalone?: boolean;
  hasDeferredPrompt: boolean;
};

export function isIOS(env: Pick<InstallEnv, "userAgent" | "platform" | "maxTouchPoints">): boolean {
  if (/iPad|iPhone|iPod/.test(env.userAgent)) return true;
  // iPadOS 13+ reports itself as a Mac, but has a touch screen.
  return env.platform === "MacIntel" && (env.maxTouchPoints ?? 0) > 1;
}

export function detectInstallState(env: InstallEnv): InstallState {
  if (env.displayModeStandalone || env.navigatorStandalone === true) return "installed";
  if (env.hasDeferredPrompt) return "promptable";
  if (isIOS(env)) return "ios-manual";
  return "unavailable";
}
