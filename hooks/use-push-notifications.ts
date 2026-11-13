"use client";

import { useCallback, useEffect, useState } from "react";
import {
  disablePush,
  enablePush,
  getPushStatus,
  syncPushSubscription,
  type PushStatus,
} from "@/lib/push/push-notifications";

/** Once per signed-in app start: re-sends this device's push subscription
 *  if push is on here (keeps it fresh and tied to the current account). */
export const usePushSync = () => {
  useEffect(() => {
    syncPushSubscription().catch(() => {
      // Best effort; the next start tries again.
    });
  }, []);
};

/** This device's push status, with actions to turn it on and off. */
export const usePushNotifications = () => {
  const [status, setStatus] = useState<PushStatus | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getPushStatus()
      .then((next) => !cancelled && setStatus(next))
      .catch(() => !cancelled && setStatus("unsupported"));
    return () => {
      cancelled = true;
    };
  }, []);

  const run = useCallback(async (action: () => Promise<PushStatus>) => {
    setBusy(true);
    try {
      const next = await action();
      setStatus(next);
      return next;
    } finally {
      setBusy(false);
    }
  }, []);

  return {
    status,
    busy,
    enable: () => run(enablePush),
    disable: () => run(disablePush),
  };
};
