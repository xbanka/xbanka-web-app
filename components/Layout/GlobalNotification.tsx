"use client";

import { useNotificationModalStore } from "@/store/notification-modal-store";
import { NotificationsModal } from "./NotificationLayout";

export function GlobalNotificationsModal() {
  const { isOpen, close } = useNotificationModalStore();

  if (!isOpen) return null;

  return (
    <>
      {/* backdrop */}
      <div className="fixed inset-0 z-40" onClick={close} />

      {/* notification panel */}
      <div
        className="
          fixed
          top-[72px]
          right-8
          z-50
        "
      >
        <NotificationsModal onClose={close} />
      </div>
    </>
  );
}
