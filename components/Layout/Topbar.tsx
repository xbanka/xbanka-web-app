import { Bell, Menu } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";

export function Topbar({
  setMobileOpen,
}: {
  setMobileOpen: (v: boolean) => void;
}) {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-card-background shrink-0">
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden text-card-text p-1 rounded-md hover:bg-border transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button className="relative p-2 rounded-lg hover:bg-border transition-colors text-text">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-Green rounded-full" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-Green flex items-center justify-center text-white text-sm font-semibold">
            CJ
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-card-text leading-none">
              CoolJoe
            </p>
            <p className="text-[10px] text-text mt-0.5">UID: 22345678</p>
          </div>
        </div>
      </div>
    </header>
  );
}
