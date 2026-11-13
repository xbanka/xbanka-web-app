/**
 * Push notifications: alerts that reach the user while Xbanka is closed.
 *
 * The browser hands us a push subscription (an endpoint plus two keys) for
 * this device; we send it to the backend, which pushes to it whenever it
 * creates a notification for the user. public/sw.js shows each push.
 *
 * Backend contract (to build on their side):
 *   POST   /notifications/push/subscriptions  { endpoint, keys: { p256dh, auth }, deviceId, userAgent }
 *   DELETE /notifications/push/subscriptions  { endpoint }
 *   Push payload (JSON): { title, body, url?, tag?, badgeCount?, notificationId? }
 * The VAPID public key comes from NEXT_PUBLIC_VAPID_PUBLIC_KEY; the backend
 * keeps the matching private key.
 *
 * iPhone and iPad only allow push once Xbanka is added to the Home Screen
 * (iOS 16.4+), and every browser only asks for permission after a tap.
 */
import AxiosInstance from "@/lib/AxiosInstance/AxiosInstance";
import { getDeviceId } from "@/lib/device";
import { isIOS } from "@/lib/pwa/install";

export const PUSH_SUBSCRIPTIONS_PATH = "/notifications/push/subscriptions";

export type PushStatus =
  /** This browser has no push support at all. */
  | "unsupported"
  /** iPhone/iPad in Safari: works only from the Home Screen app. */
  | "needs-install"
  /** No VAPID key configured for this deployment yet. */
  | "not-configured"
  /** The service worker isn't running (local dev, or still installing). */
  | "unavailable"
  /** The user blocked notifications for this site. */
  | "denied"
  | "off"
  | "on";

export const vapidPublicKey = () => process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim() || "";

/** VAPID keys are URL-safe base64; PushManager wants the raw bytes. */
export const urlBase64ToUint8Array = (base64: string) => {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const raw = atob(padded);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
};

const isStandalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const hasPushApi = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

/** The registration for /sw.js, or null if none is active (e.g. in dev). */
const activeRegistration = async () => {
  if (!("serviceWorker" in navigator)) return null;
  const registration = await navigator.serviceWorker.getRegistration("/");
  return registration?.active ? registration : null;
};

export const getPushStatus = async (): Promise<PushStatus> => {
  if (typeof window === "undefined") return "unsupported";
  const ios = isIOS({
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints,
  });
  if (ios && !isStandalone()) return "needs-install";
  if (!hasPushApi()) return "unsupported";
  if (!vapidPublicKey()) return "not-configured";
  if (Notification.permission === "denied") return "denied";
  const registration = await activeRegistration();
  if (!registration) return "unavailable";
  const subscription = await registration.pushManager.getSubscription();
  return subscription && Notification.permission === "granted" ? "on" : "off";
};

const subscriptionBody = (subscription: PushSubscription) => {
  const json = subscription.toJSON();
  return {
    endpoint: subscription.endpoint,
    keys: { p256dh: json.keys?.p256dh ?? "", auth: json.keys?.auth ?? "" },
    deviceId: getDeviceId(),
    userAgent: navigator.userAgent,
  };
};

/**
 * Asks for permission (call this from a tap or click), subscribes this
 * device and registers it with the backend. Resolves to the new status.
 */
export const enablePush = async (): Promise<PushStatus> => {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return permission === "denied" ? "denied" : "off";

  const registration = await activeRegistration();
  if (!registration) return "unavailable";

  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey()),
    }));

  try {
    await AxiosInstance.post(PUSH_SUBSCRIPTIONS_PATH, subscriptionBody(subscription));
  } catch (error) {
    // The backend didn't take it, so pushes could never arrive: undo.
    await subscription.unsubscribe().catch(() => {});
    throw error;
  }
  return "on";
};

/** Stops push on this device and tells the backend to forget it. */
export const disablePush = async (): Promise<PushStatus> => {
  const registration = await activeRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  if (subscription) {
    await AxiosInstance.delete(PUSH_SUBSCRIPTIONS_PATH, {
      data: { endpoint: subscription.endpoint },
    }).catch(() => {});
    await subscription.unsubscribe().catch(() => {});
  }
  return "off";
};

/**
 * On sign-out: stop pushes to this device so the next person to use it
 * doesn't get this account's alerts. Takes the token explicitly because the
 * session is cleared straight after; best effort, never blocks sign-out.
 */
export const forgetPushOnSignOut = (accessToken: string | null) => {
  if (typeof window === "undefined" || !hasPushApi()) return;
  void (async () => {
    const registration = await activeRegistration();
    const subscription = await registration?.pushManager.getSubscription();
    if (!subscription) return;
    if (accessToken) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}${PUSH_SUBSCRIPTIONS_PATH}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
        keepalive: true,
      }).catch(() => {});
    }
    await subscription.unsubscribe().catch(() => {});
  })();
};

/** The unread count on the installed app's icon (where supported). */
export const setAppBadge = (count: number) => {
  if (typeof navigator === "undefined") return;
  const nav = navigator as Navigator & {
    setAppBadge?: (n: number) => Promise<void>;
    clearAppBadge?: () => Promise<void>;
  };
  if (!nav.setAppBadge || !nav.clearAppBadge) return;
  void (count > 0 ? nav.setAppBadge(count) : nav.clearAppBadge()).catch(() => {});
};
