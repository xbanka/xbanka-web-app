"use client";

import { useNotificationModalStore } from "@/store/notification-modal-store";
import { NotificationsModal } from "./NotificationLayout";


export function GlobalNotificationsModal() {
  const { isOpen, close } = useNotificationModalStore();

  if (!isOpen) return null;

  return <NotificationsModal onClose={close} />;
}