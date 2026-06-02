import { Bell } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import UserDropdown from "./dropDownMenu";
import { useNotificationModalStore } from "@/store/notification-modal-store";
import { UseGetNotifications } from "@/lib/services/notification.service";

export function Topbar({
  setMobileOpen,
}: {
  setMobileOpen: (v: boolean) => void;
}) {
  const { data } = UseGetNotifications();

  const notifications = data?.data ?? [];
  const openNotifications = useNotificationModalStore((state) => state.open);

  const hasUnreadNotifications = notifications.some(
    (notification: any) => !notification.isRead,
  );

  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-2 border-b border-border bg-card-background shrink-0">
      <div className="md:hidden w-7" />
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button
          onClick={openNotifications}
          className="relative border border-input rounded-lg p-3 bg-border text-card-text hover:bg-border/40 transition-colors"
        >
          <Bell className="w-3 h-3" />
          {hasUnreadNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-Green rounded-full" />
          )}
        </button>
        <UserDropdown />
      </div>
    </header>
  );
}
