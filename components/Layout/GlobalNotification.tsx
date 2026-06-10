"use client";

import { useNotificationModalStore } from "@/store/notification-modal-store";
import { NotificationsModal } from "./NotificationLayout";

export function GlobalNotificationsModal() {
  const { isOpen, close } = useNotificationModalStore();

  if (!isOpen) return null;

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 z-40 max-sm:bg-black/50 max-sm:backdrop-blur-sm"
        onClick={close}
      />

      {/* notification panel */}
      <div
        className="
          fixed z-50
          top-[72px] right-8
          max-sm:top-3 max-sm:right-3 max-sm:left-3
        "
      >
        <NotificationsModal onClose={close} />
      </div>
    </>
  );
}
