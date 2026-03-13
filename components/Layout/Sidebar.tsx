import { NAV } from "@/lib/nav";
import { ChevronLeft, ChevronRight, LogOut, X } from "lucide-react";

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
  const navigate = (id: PageId) => {
    setActivePage(id);
    setMobileOpen(false);
  };

const sidebarContent = (
    <div className="flex flex-col h-full bg-card-background text-text select-none border-r border-border">
      {/* Logo + collapse */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <span className="text-xl font-bold tracking-tight text-white">
            xbanka
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center rounded-lg transition-colors text-card-text"
        >
          {collapsed ? (
            <ChevronRight className="w-6 h-6 border border-input rounded-lg p-3 bg-border text-card-text" />
          ) : (
            <ChevronLeft className="w-6 h-6 border border-input rounded-lg p-3 bg-border text-card-text" />
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
                const active = activePage === item.id;
                return (
                  <li key={item.id}>
                    <div
                      onClick={() => navigate(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex font-medium leading-5.5 items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors
                        ${
                          active
                            ? "border border-input bg-border text-card-text"
                            : "bg-card-background text-text hover:bg-text/8 hover:text-text"
                        }
                        ${collapsed ? "justify-center" : ""}`}
                    >
                      <Icon className={ `${active ? "text-Green" : "text-card-text"} w-4 h-4 shrink-0`} />
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
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-white/10">
        <button
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

      {/* Mobile overlay */}
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
    </>
  );
}
