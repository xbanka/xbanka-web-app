import { useState } from "react";
import { Tab } from "@/lib/types/notification-types";
import { Check, BellOff, Loader2 } from "lucide-react";
import { NotifItem } from "./NotifItem";
import { cn } from "@/lib/utils";
import { ModalHeader } from "../ui/modal-header";
import { Button } from "../ui/button";
import {
  UseGetNotifications,
  useReadAllNotifications,
  useReadSingleNotification,
} from "@/lib/services/notification.service";
import { groupNotificationsByDate } from "@/lib/groupNotifications";

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
  console.log("notifications data", data);
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

  const notifications = data?.data ?? [];

  const groupedNotifications = groupNotificationsByDate(notifications);
  const hasNotifications = notifications.length > 0;

  return (
    <div className="flex max-h-[calc(100vh-96px)] w-full max-w-150 flex-col overflow-hidden rounded-[20px] border-8 border-border bg-card-background shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-sm:max-h-[calc(100dvh-24px)] max-sm:rounded-2xl max-sm:border-4">
      <ModalHeader
        className="shrink-0 px-8 py-6 max-sm:px-5 max-sm:py-5 border-b border-input items-center"
        title="Notifications"
        onClose={onClose}
      />
      <div className="flex min-h-0 flex-1 flex-col px-8 pt-6 max-sm:px-5 max-sm:pt-4">
        {/* Tabs */}
        {/* <div className="flex items-center border-b border-border">
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
        </div> */}

        {/* Feed */}
        <div className="-mr-2 flex-1 space-y-6 overflow-y-auto pb-2 pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
          {isPending ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-text">
              <Loader2 className="h-6 w-6 animate-spin text-Green" />
              <p className="text-sm">Loading notifications…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <p className="text-sm font-medium text-card-text">
                Couldn&apos;t load notifications
              </p>
              <p className="text-xs text-text">
                Please check your connection and try again.
              </p>
            </div>
          ) : !hasNotifications ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-border text-text">
                <BellOff className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-card-text">
                You&apos;re all caught up
              </p>
              <p className="text-xs text-text">
                New notifications will show up here.
              </p>
            </div>
          ) : (
            Object.entries(groupedNotifications).map(
              ([label, items]) =>
                items.length > 0 && (
                  <div key={label}>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-text mb-4">
                      {label}
                    </p>

                    <div className="space-y-3">
                      {items.map((notification) => (
                        <NotifItem
                          key={notification.id}
                          n={notification}
                          onClick={() => {
                            if (!notification.isRead) {
                              readSingleNotification(notification.id);
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ),
            )
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-8 pb-6 pt-4 text-center max-sm:px-5 max-sm:pb-5">
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
