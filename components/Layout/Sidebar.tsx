import { NAV } from "@/lib/nav";
import { useLogoutStore } from "@/store/logout.store";
import {
  Bitcoin,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  User,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useThemeStore } from "@/store/theme.store";

const BOTTOM_NAV_ITEMS = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard, route: "/" },
  { id: "wallet", label: "Wallet", icon: Wallet, route: "/wallet" },
  { id: "crypto", label: "Crypto", icon: Bitcoin, route: "/crypto" },
  { id: "account", label: "Account", icon: User, route: "/account" },
];

const BOTTOM_NAV_IDS = new Set(["dashboard", "wallet", "crypto", "account"]);
const MORE_NAV_ITEMS = NAV.flatMap((s) => s.items).filter(
  (item) => !BOTTOM_NAV_IDS.has(item.id),
);

export function Sidebar({
  activePage,
  setActivePage,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: {
  activePage: PageId;
  setActivePage: (id: PageId) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const { theme } = useThemeStore();

  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const navigate = (id: PageId) => {
    setActivePage(id);
    setMobileOpen(false);
  };

  // const route = item.id === "dashboard" ? "/" : `/${item.id}`;

  // const active = pathname === route;
  const { openModal } = useLogoutStore();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card-background text-text select-none border-r border-border">
      {/* Logo + collapse */}
      <div className="flex items-center justify-between py-2 px-4 border-b border-border">
        {!collapsed && (
          <div className="w-20">
            { theme === "dark" ? (
              <img
                src="/xbanka_white.png"
                className="w-full object-cover"
                loading="lazy"
                alt="xBanka"
              />
            ) : (
              <img
                src="/xbanka_logo.png"
                className="w-full object-cover"
                loading="lazy"
                alt="xBanka"
              />
          )}
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center border border-input rounded-lg p-3 bg-border transition-colors text-card-text hover:bg-border/40"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/10 text-white/60"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4.5 px-4 space-y-3">
        {NAV.map((section) => (
          <div key={section.title} className="space-y-2">
            {!collapsed && (
              <p className="text-[12px] font-normal leading-4.5 tracking-widest text-text">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;

                const route = item.id === "dashboard" ? "/" : `/${item.id}`;

                const active = pathname === route;

                const content = (
                  <div
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex font-medium leading-5.5 items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors
      ${
        item.disabled
          ? "opacity-50 cursor-not-allowed bg-card-background text-text"
          : active
            ? "border border-input bg-border text-card-text"
            : "bg-card-background text-text hover:bg-text/8 hover:text-text"
      }
      ${collapsed ? "justify-center" : ""}`}
                  >
                    <Icon
                      className={`${active ? "text-Green" : "text-card-text"} w-4 h-4 shrink-0`}
                    />

                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>

                        {item.badge && (
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );

                if (item.disabled) {
                  return <div key={item.id}>{content}</div>;
                }

                return (
                  <Link href={route} key={item.id}>
                    {content}
                  </Link>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-white/10">
        <button
          onClick={() => openModal()}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay (opened via "More") */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 md:hidden flex flex-col">
            {sidebarContent}
          </aside>
        </>
      )}

      {/* More panel — card grid that slides up above bottom nav */}
      <div
        className={`fixed inset-x-0 z-20 md:hidden bg-card-background border-t border-border transition-all duration-300 ease-in-out ${
          showMore
            ? "bottom-16 opacity-100 translate-y-0"
            : "bottom-16 opacity-0 pointer-events-none translate-y-4"
        }`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <span className="text-xs font-semibold tracking-widest text-text uppercase">
            More
          </span>
          <button
            onClick={() => setShowMore(false)}
            className="flex items-center gap-1 text-[11px] font-medium text-card-text hover:text-text transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            View Less
          </button>
        </div>

        {/* Grid of page cards */}
        <div className="grid grid-cols-4 gap-2 px-4 pb-4">
          {MORE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const route = `/${item.id}`;
            const active = pathname === route;
            const cardClassName = `relative flex min-h-[74px] flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2.5 transition-colors ${
              item.disabled
                ? "cursor-not-allowed bg-border/20 text-card-text/60"
                : active
                  ? "bg-border text-Green"
                  : "bg-border/30 text-card-text hover:bg-border/60"
            }`;

            const cardContent = (
              <>
                {item.badge && (
                  <span className="absolute right-1 top-1 rounded-[4px] border border-[#A27D00]/80 bg-[#3E2E00] px-1 py-px text-[7px] font-semibold uppercase leading-3 tracking-normal text-[#FEC84B] shadow-[0_0_10px_rgba(254,200,75,0.14)]">
                    {item.badge}
                  </span>
                )}
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-[9px] font-medium text-center leading-tight">
                  {item.label}
                </span>
              </>
            );

            if (item.disabled) {
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled
                  aria-label={`${item.label}${item.badge ? ` ${item.badge}` : ""}`}
                  className={cardClassName}
                >
                  {cardContent}
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                href={route}
                onClick={() => setShowMore(false)}
                className={cardClassName}
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-30 md:hidden flex items-center justify-around bg-card-background border-t border-border h-16 px-2">
        {BOTTOM_NAV_ITEMS.map(({ id, label, icon: Icon, route }) => {
          const active = pathname === route;
          return (
            <Link
              key={id}
              href={route}
              onClick={() => setShowMore(false)}
              className={`flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${active ? "text-Green" : "text-card-text"}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setShowMore((v) => !v)}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${showMore ? "text-Green" : "text-card-text"}`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>
    </>
  );
}
