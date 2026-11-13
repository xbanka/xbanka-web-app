"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotificationModalStore } from "@/store/notification-modal-store";

/**
 * Where a tapped push notification lands when it has no more specific page
 * (the backend's default `url`). Notifications live in a panel, not a page,
 * so this opens the panel and moves to the dashboard behind it.
 */
export default function NotificationsPage() {
  const router = useRouter();
  const open = useNotificationModalStore((state) => state.open);

  useEffect(() => {
    open();
    router.replace("/");
  }, [open, router]);

  return null;
}
