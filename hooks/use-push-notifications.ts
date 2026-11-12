"use client";

import { useCallback, useEffect, useState } from "react";
import {
  disablePush,
  enablePush,
  getPushStatus,
  type PushStatus,
} from "@/lib/push/push-notifications";

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
