import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Tab } from "@/lib/types/notification-types";
import { TABS } from "@/lib/MockData";
Modal;
import { Check } from "lucide-react";
import { NotifItem } from "./NotifItem";
import { cn } from "@/lib/utils";
import { ModalHeader } from "../ui/modal-header";
import { Button } from "../ui/button";
import {
  UseGetNotifications,
  useReadAllNotifications,
  useReadSingleNotification,
} from "@/lib/services/notification.service";

interface NotificationsModalProps {
  onClose: () => void;
  onSeeAll?: () => void;
}

export function NotificationsModal({
  onClose,
  onSeeAll,
}: NotificationsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const { data, isPending, error } = UseGetNotifications();
  const {
    mutate: readAllNotifications,
    isPending: readAllPending,
    error: readAllError,
  } = useReadAllNotifications();
  const {
    mutate: readSingleNotification,
    isPending: readSinglePending,
    error: readSingleError,
  } = useReadSingleNotification();

  const notifications = data?.data?.notifications ?? [];

  return (
    <div className="max-w-150 bg-card-background border-8 border-border rounded-[20px] shadow-2xl animate-in fade-in zoom-in-95 duration-150 ">
      <ModalHeader
        className="px-8 py-6 max-sm:px-5 max-sm:py-5 border-b border-input items-center"
        title="Notifications"
        onClose={onClose}
      />
      <div className="px-8 pt-6 space-y-6 max-sm:px-5 max-sm:pb-6 max-sm:pt-2 max-sm:space-y-6">
        {/* Tabs */}
        <div className="flex items-center border-b border-border">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={cn(
                "text-[13px] font-medium px-3 pb-2.5 pt-1 relative border-none bg-transparent cursor-pointer transition-colors",
                activeTab === t.key
                  ? "text-card-text after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-Green after:rounded-t"
                  : "text-placeholder hover:text-text",
              )}
            >
              {t.label}
            </button>
          ))}

          <button
            disabled={readAllPending}
            onClick={() => readAllNotifications()}
            className="ml-auto flex items-center gap-1 text-[12px] text-Green bg-transparent border-none cursor-pointer pb-2.5 pt-1 hover:opacity-80 transition-opacity"
          >
            <Check className="w-3.5 h-3.5" />
            {readAllPending ? "Updating..." : "Mark all as read"}
          </button>
        </div>

        {/* Feed */}
        <div className="overflow-y-auto max-h-[420px] pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border space-y-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-text mb-4 first:mt-0">
                Today
              </p>
              <div className="space-y-3">
                {notifications.map((n: any) => (
                  <NotifItem
                    key={n.id}
                    n={n}
                    onClick={() => readSingleNotification(n.id)}
                  />
                ))}
              </div>
            </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-6 px-8 text-center mt-10">
        <Button
          onClick={onSeeAll}
          variant="notification"
          className="px-4 py-3.25 w-full"
        >
          See all notifications
        </Button>
      </div>
    </div>
  );
}
