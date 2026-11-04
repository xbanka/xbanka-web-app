"use client";

import { useNotificationModalStore } from "@/store/notification-modal-store";
import { NotificationsModal } from "./NotificationLayout";
import { cn } from "@/lib/utils";
import { useState, type AnimationEvent } from "react";

export function GlobalNotificationsModal() {
  const { isOpen, close } = useNotificationModalStore();
  // Expanding grows the panel in place — it stays anchored under the bell
  // rather than becoming a centred dialog.
  const [expanded, setExpanded] = useState(false);
  // Stays rendered after the store closes it, so the panel can pop back in
  // under the bell before it leaves.
  const [shown, setShown] = useState(isOpen);
  if (isOpen && !shown) setShown(true);

  if (!shown) return null;
  const closing = !isOpen;

  const handleClose = () => {
    setExpanded(false);
    close();
  };

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (closing && event.target === event.currentTarget) setShown(false);
  };

  return (
    <>
      {/* backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 max-sm:bg-black/50 max-sm:backdrop-blur-sm",
          closing ? "animate-fade-out" : "motion-safe:animate-modal-backdrop-in",
        )}
        onClick={closing ? undefined : handleClose}
      />

      {/* notification panel */}
      <div
        className={cn(
          "fixed z-50 top-[72px] right-8 origin-top-right",
          "max-sm:top-3 max-sm:right-3 max-sm:left-3",
          closing ? "animate-popover-out pointer-events-none" : "motion-safe:animate-popover-in",
        )}
        onAnimationEnd={handleAnimationEnd}
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
