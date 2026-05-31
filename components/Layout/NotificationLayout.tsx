import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Tab } from "@/lib/types/notification-types";
import { TABS } from "@/lib/MockData";
import { Check } from "lucide-react";
import { NotifItem } from "./NotifItem";
import { cn } from "@/lib/utils";

interface NotificationsModalProps {
  onClose: () => void;
  onSeeAll?: () => void;
}
 
export function NotificationsModal({ onClose, onSeeAll }: NotificationsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [readAll, setReadAll] = useState(false);
 
  const currentGroups = TABS.find((t) => t.key === activeTab)!.groups;
 
  return (
    <Modal onClose={onClose} className="!px-8 !pb-8 max-w-[480px]">
      {/* Header */}
      <div className="flex items-center justify-between pt-7 pb-4">
        <h2 className="text-[16px] font-bold text-card-text">Notifications</h2>
      </div>
 
      {/* Tabs */}
      <div className="flex items-center border-b border-border mb-4">
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
          onClick={() => setReadAll(true)}
          className="ml-auto flex items-center gap-1 text-[12px] text-Green bg-transparent border-none cursor-pointer pb-2.5 pt-1 hover:opacity-80 transition-opacity"
        >
          <Check className="w-3.5 h-3.5" />
          Mark all as read
        </button>
      </div>
 
      {/* Feed */}
      <div className="overflow-y-auto max-h-[420px] pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
        {currentGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-placeholder mt-3 mb-1 first:mt-0">
              {group.label}
            </p>
            {group.items.map((n) => (
              <NotifItem
                key={n.id}
                n={readAll ? { ...n, unread: false } : n}
              />
            ))}
          </div>
        ))}
      </div>
 
      {/* Footer */}
      <div className="border-t border-border mt-3 pt-4 text-center">
        <button
          onClick={onSeeAll}
          className="text-[13px] font-medium text-Green bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
        >
          See all notifications
        </button>
      </div>
    </Modal>
  );
}
 