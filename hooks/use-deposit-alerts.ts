"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { maskAmounts, notificationCategory } from "@/lib/settings";
import { useSettingsStore } from "@/store/settings.store";
import { UseGetNotifications } from "@/lib/services/notification.service";
import { findNewDeposits } from "@/lib/depositNotifications";
import { Notification } from "@/lib/types/notification-types";
import { useNotificationModalStore } from "@/store/notification-modal-store";

/**
 * Tells the user in-app the moment a deposit lands.
 *
 * The notification feed is polled (see UseGetNotifications). Whenever an
 * unread deposit notification appears that was not in the previous feed, we
 * toast it, offer to open the notifications panel, and refresh the balances
 * and transaction history so the new money is on screen without a reload.
 * The first feed we see is only recorded, never toasted: old notifications
 * already show on the bell.
 */
export const useDepositAlerts = () => {
  const { data } = UseGetNotifications();
  const queryClient = useQueryClient();
  const openNotifications = useNotificationModalStore((state) => state.open);
  const seenIds = useRef<Set<string> | null>(null);

  useEffect(() => {
    if (!data) return;
    const notifications: Notification[] = data?.data ?? [];

    if (seenIds.current === null) {
      seenIds.current = new Set(notifications.map((n) => n.id));
      return;
    }

    const fresh = findNewDeposits(seenIds.current, notifications);
    notifications.forEach((n) => seenIds.current?.add(n.id));
    if (fresh.length === 0) return;

    for (const key of [
      "all-wallet-balances",
      "fiat-wallet",
      "crypto-wallet",
      "transaction-history",
    ]) {
      queryClient.invalidateQueries({ queryKey: [key] });
    }

    // Balances still refresh above; Settings only decides whether to pop up.
    const { notifications: prefs, hideAmountsInNotifications: hide } =
      useSettingsStore.getState();
    const show = (text: string) => (hide ? maskAmounts(text) : text);
    fresh
      .filter((n) => prefs[notificationCategory(n)]?.inApp !== false)
      .forEach((notification) => {
      toast.success(show(notification.title || "Wallet funded"), {
        description: show(notification.message ?? ""),
        action: { label: "View", onClick: openNotifications },
      });
    });
  }, [data, queryClient, openNotifications]);
};
