import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_NOTIFICATION_PREFS,
  isLocked,
  type Channel,
  type NotificationCategory,
  type NotificationPrefs,
} from "@/lib/settings";

type SettingsState = {
  language: string;
  hideBalancesOnOpen: boolean;
  hideAmountsInNotifications: boolean;
  /** Minutes of inactivity before signing out; 0 is never. */
  autoSignOutMinutes: number;
  /** Chime when money comes in or goes out while the app is open. */
  transactionSounds: boolean;
  notifications: NotificationPrefs;
  set: (patch: Partial<Omit<SettingsState, "set" | "setNotification">>) => void;
  setNotification: (category: NotificationCategory, channel: Channel, on: boolean) => void;
};

/**
 * The user's Settings, kept on this device.
 *
 * Rehydration is deferred to `useSettings` so the first client render matches
 * the server markup, the same way the balance-visibility store works.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: DEFAULT_LANGUAGE,
      hideBalancesOnOpen: false,
      hideAmountsInNotifications: false,
      autoSignOutMinutes: 0,
      transactionSounds: true,
      notifications: DEFAULT_NOTIFICATION_PREFS,
      set: (patch) => set(patch),
      setNotification: (category, channel, on) =>
        set((state) =>
          isLocked(category, channel)
            ? state
            : {
                notifications: {
                  ...state.notifications,
                  [category]: { ...state.notifications[category], [channel]: on },
                },
              },
        ),
    }),
    {
      name: "xbanka-settings",
      skipHydration: true,
      // Categories added later get their defaults instead of being undefined.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<SettingsState>;
        return {
          ...current,
          ...saved,
          notifications: { ...DEFAULT_NOTIFICATION_PREFS, ...saved.notifications },
        };
      },
    },
  ),
);
