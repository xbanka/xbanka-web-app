"use client";

import { useNotificationModalStore } from "@/store/notification-modal-store";
import { NotificationsModal } from "./NotificationLayout";
import { useState } from "react";

export function GlobalNotificationsModal() {
  const { isOpen, close } = useNotificationModalStore();
  // Expanding grows the panel in place — it stays anchored under the bell
  // rather than becoming a centred dialog.
  const [expanded, setExpanded] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setExpanded(false);
    close();
  };

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 z-40 max-sm:bg-black/50 max-sm:backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* notification panel */}
      <div
        className="
          fixed z-50
          top-[72px] right-8
          max-sm:top-3 max-sm:right-3 max-sm:left-3
        "
      >
        <NotificationsModal
          onClose={handleClose}
          expanded={expanded}
          onToggleExpand={() => setExpanded((value) => !value)}
        />
      </div>
    </>
  );
}
