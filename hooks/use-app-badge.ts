"use client";

import { useEffect } from "react";
import { UseGetNotifications } from "@/lib/services/notification.service";
import { setAppBadge } from "@/lib/push/push-notifications";

/**
 * Keeps the unread count on the installed app's icon in step with the
 * notification list while the app is open (pushes update it while closed).
 */
export const useAppBadge = () => {
  const { data } = UseGetNotifications();
  const list = data?.data;
  const unread = Array.isArray(list)
    ? list.filter((n: { isRead?: boolean }) => !n.isRead).length
    : null;

  useEffect(() => {
    if (unread !== null) setAppBadge(unread);
  }, [unread]);
};
