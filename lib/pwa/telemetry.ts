// Install funnel events. Allowlisted so the endpoint cannot be used to write
// arbitrary text into server logs.

export const PWA_EVENTS = [
  "install_accepted",
  "install_dismissed",
  "app_installed",
  "standalone_session",
] as const;

export type PwaEvent = (typeof PWA_EVENTS)[number];

export function isPwaEvent(value: unknown): value is PwaEvent {
  return typeof value === "string" && (PWA_EVENTS as readonly string[]).includes(value);
}

export const PWA_EVENTS_ENDPOINT = "/api/pwa-events";

/** Fire-and-forget. Never throws, never blocks the UI. */
export function trackPwaEvent(event: PwaEvent): void {
  try {
    const body = JSON.stringify({ event });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(PWA_EVENTS_ENDPOINT, new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch(PWA_EVENTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // telemetry must never break the app
  }
}
