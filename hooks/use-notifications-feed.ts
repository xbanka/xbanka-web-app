// hooks/use-notifications-feed.ts
"use client";

import { getNotificationCategory } from "@/lib/getNotificationIcon";
import {
  dismissNotification,
  getDismissedNotifications,
  restoreNotification,
} from "@/lib/dismissedNotifications";
import { groupNotificationsByDate } from "@/lib/groupNotifications";
import {
  UseGetNotifications,
  useReadAllNotifications,
  useReadSingleNotification,
} from "@/lib/services/notification.service";
import { Notification, Tab } from "@/lib/types/notification-types";
import { useUserStore } from "@/store/user.store";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

/**
 * The notification feed — fetching, tab/search filtering, date grouping,
 * read state and local dismissal.
 *
 * Shared by the dropdown panel in the topbar and the full notifications page so
 * the two cannot drift apart; the only difference between them is presentation.
 */
export const useNotificationsFeed = ({
  tab,
  search = "",
  unreadOnly = false,
  limit,
}: {
  tab: Tab;
  search?: string;
  unreadOnly?: boolean;
  /** Caps how many are shown, for a preview list. Omit to show every match. */
  limit?: number;
}) => {
  const { data, isPending, error } = UseGetNotifications();
  const {
    mutate: readAllNotifications,
    isPending: readAllPending,
  } = useReadAllNotifications();
  const { mutate: readSingleNotification } = useReadSingleNotification();

  // Dismissals live in localStorage until the API gains a delete route, and are
  // loaded after mount so server and client markup match on first render.
  const userId = useUserStore((state) => state.user?.userId);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    setDismissedIds(getDismissedNotifications(userId));
  }, [userId]);

  const dismiss = (id: string) => {
    setDismissedIds(dismissNotification(id, userId));
    toast.success("Notification removed", {
      action: {
        label: "Undo",
        onClick: () => setDismissedIds(restoreNotification(id, userId)),
      },
    });
  };

  const notifications: Notification[] = useMemo(
    () =>
      (data?.data ?? []).filter(
        (n: Notification) => !dismissedIds.includes(n.id),
      ),
    [data, dismissedIds],
  );

  const filtered = useMemo(() => {
    let list = notifications;

    if (tab !== "all") {
      list = list.filter((n) => getNotificationCategory(n) === tab);
    }

    if (unreadOnly) {
      list = list.filter((n) => !n.isRead);
    }

    const query = search.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (n) =>
          n.title?.toLowerCase().includes(query) ||
          n.message?.toLowerCase().includes(query),
      );
    }

    // Newest first, so a preview really shows the most recent few rather than
    // whatever order the API happened to return.
    return [...list].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [notifications, tab, search, unreadOnly]);

  const visible =
    typeof limit === "number" ? filtered.slice(0, limit) : filtered;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    isPending,
    error,
    /** Everything visible to the user, before tab/search filtering. */
    notifications,
    filtered,
    grouped: groupNotificationsByDate(visible),
    hasNotifications: visible.length > 0,
    /** How many matches the limit is holding back. */
    hiddenCount: filtered.length - visible.length,
    unreadCount,
    hasUnread: unreadCount > 0,
    readAllNotifications,
    readAllPending,
    readSingleNotification,
    dismiss,
  };
};
