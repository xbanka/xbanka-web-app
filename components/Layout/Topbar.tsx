import { Bell, Menu } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import UserDropdown from "./dropDownMenu";
import { useUserProfile } from "@/lib/services/onboarding.service";

export function Topbar({
  setMobileOpen,
}: {
  setMobileOpen: (v: boolean) => void;
}) {
  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-2 border-b border-border bg-card-background shrink-0">
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden text-card-text p-1 rounded-md hover:bg-border transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="relative border border-input rounded-lg p-3 bg-border text-card-text hover:bg-border/40 transition-colors">
          <Bell className="w-3 h-3" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-Green rounded-full" />
        </button>
        <UserDropdown
          name="CoolJoe"
          uid="22345678"
          tier={2}
          avatarInitials="CJ"
          onLogout={() => console.log("logout")}
        />
      </div>
    </header>
  );
}
