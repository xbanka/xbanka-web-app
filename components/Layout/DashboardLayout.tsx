"use client"

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useUserProfile } from "@/lib/services/onboarding.service";
import { useDepositAlerts } from "@/hooks/use-deposit-alerts";
import { SplashGate } from "./splash-gate";
import { ProductTour } from "./product-tour";
import { SettingsEffects } from "./settings-effects";
 
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  useDepositAlerts();

 
  return (
    <SplashGate>
    {/* First-visit tour of whichever section is open; renders nothing. */}
    <ProductTour />
    <SettingsEffects />
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-y-auto p-4 pb-[calc(env(safe-area-inset-bottom)+88px)] sm:py-6 sm:px-8 md:pb-6">
          {/* Keyed by route so each section fades in as it is opened. */}
          <div key={pathname} className="motion-safe:animate-page-in">
            {children}
          </div>
        </main>
      </div>
    </div>
    </SplashGate>
  );
}