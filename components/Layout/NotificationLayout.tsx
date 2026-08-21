import { useState } from "react";
import { Tab } from "@/lib/types/notification-types";
import {
  Check,
  BellOff,
  Loader2,
  Maximize2,
  Minimize2,
  Search,
} from "lucide-react";
import { NotifItem } from "./NotifItem";
import { cn } from "@/lib/utils";
import { ModalHeader } from "../ui/modal-header";
import { Button } from "../ui/button";
import { useNotificationsFeed } from "@/hooks/use-notifications-feed";

interface NotificationsModalProps {
  onClose: () => void;
  /** Whether the panel is showing as a full-size dialog rather than a dropdown. */
  expanded: boolean;
  onToggleExpand: () => void;
}

/** How many notifications the collapsed panel previews before "See all". */
const PREVIEW_COUNT = 4;

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "transactions", label: "Transactions" },
  { key: "activities", label: "Activities" },
];

export function NotificationsModal({
  onClose,
  expanded,
  onToggleExpand,
}: NotificationsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const {
    isPending,
    error,
    grouped: groupedNotifications,
    hasNotifications,
    hasUnread,
    readAllNotifications,
    readAllPending,
    readSingleNotification,
    dismiss: handleDismiss,
    hiddenCount,
  } = useNotificationsFeed({
    tab: activeTab,
    // Searching and filtering only make sense with the room to show them.
    search: expanded ? search : "",
    unreadOnly: expanded ? unreadOnly : false,
    // Collapsed, the panel is a preview of the most recent few; expanding
    // reveals the rest of the history.
    limit: expanded ? undefined : PREVIEW_COUNT,
  });

  return (
    <div className="flex max-h-[calc(100vh-96px)] w-full max-w-150 flex-col overflow-hidden rounded-[20px] border-8 border-border bg-card-background shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-sm:max-h-[calc(100dvh-24px)] max-sm:rounded-2xl max-sm:border-4">
      <ModalHeader
        className="shrink-0 px-8 py-6 max-sm:px-5 max-sm:py-5 border-b border-input items-center"
        title="Notifications"
        onClose={onClose}
      />
      <div className="flex min-h-0 flex-1 flex-col px-8 pt-6 max-sm:px-5 max-sm:pt-4">
        {/* Tabs */}
        <div className="flex items-center justify-between gap-2 border-b border-border max-sm:gap-1">
          <div className="flex items-center overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={cn(
                  "relative cursor-pointer whitespace-nowrap border-none bg-transparent px-3 pb-2.5 pt-1 text-[13px] font-medium transition-colors max-sm:px-2 max-sm:text-[12px]",
                  activeTab === t.key
                    ? "text-card-text after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:rounded-t after:bg-Green"
                    : "text-placeholder hover:text-text",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            disabled={readAllPending || !hasUnread}
            onClick={() => readAllNotifications()}
            className="ml-auto flex shrink-0 items-center gap-1 border-none bg-transparent pb-2.5 pt-1 text-[12px] text-Green transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 max-sm:text-[11px]"
          >
            <Check className="h-3.5 w-3.5" />
            <span className="max-sm:hidden">
              {readAllPending ? "Updating..." : "Mark all as read"}
            </span>
            <span className="hidden max-sm:inline">
              {readAllPending ? "..." : "Mark all"}
            </span>
          </button>
        </div>

        {/* Search + unread filter — only once there is room for them */}
        {expanded && (
          <div className="flex items-center gap-2 pt-4 max-sm:pt-3">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-placeholder" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search notifications"
                className="h-9 w-full rounded-lg border border-input bg-card-background pr-3 pl-8 text-[14px] text-card-text transition-colors outline-none placeholder:text-placeholder focus:border-border-active"
              />
            </div>
            <button
              type="button"
              onClick={() => setUnreadOnly((value) => !value)}
              aria-pressed={unreadOnly}
              className={cn(
                "h-9 shrink-0 rounded-lg border px-3.5 text-[13px] font-medium transition-colors",
                unreadOnly
                  ? "border-Green bg-Green text-white"
                  : "border-border bg-background text-text hover:text-card-text",
              )}
            >
              Unread
            </button>
          </div>
        )}

        {/* Feed */}
        <div className="-mr-2 flex-1 space-y-6 overflow-y-auto pt-4 pr-2 pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
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
                {search.trim()
                  ? "No matching notifications"
                  : unreadOnly
                    ? "Nothing unread"
                    : activeTab === "all"
                      ? "You're all caught up"
                      : `No ${activeTab} yet`}
              </p>
              <p className="text-xs text-text">
                {search.trim()
                  ? "Try a different search term."
                  : activeTab === "all"
                    ? "New notifications will show up here."
                    : "Notifications in this category will show up here."}
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
                          onDismiss={() => handleDismiss(notification.id)}
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
          onClick={onToggleExpand}
          variant="notification"
          className="w-full gap-2 px-4 py-3.25"
        >
          {expanded ? (
            <>
              <Minimize2 className="h-4 w-4" />
              Show less
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4" />
              See all notifications
              {hiddenCount > 0 && ` (${hiddenCount} more)`}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
