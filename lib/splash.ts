// lib/splash.ts
//
// The dashboard splash plays whenever the dashboard layout mounts. This flag
// only changes its greeting: set it before sending a brand-new user into the
// app so they are welcomed rather than welcomed back.

const KEY = "xb-splash-greeting";

export type SplashGreeting = "back" | "new";

export const requestSplashGreeting = (greeting: SplashGreeting) => {
  try {
    sessionStorage.setItem(KEY, greeting);
  } catch {}
};

/** Reads and clears the pending greeting; "back" when none was requested. */
export const consumeSplashGreeting = (): SplashGreeting => {
  try {
    const value = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return value === "new" ? "new" : "back";
  } catch {
    return "back";
  }
};
