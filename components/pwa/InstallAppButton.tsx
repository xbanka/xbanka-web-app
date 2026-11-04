"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { useInstallPrompt } from "./useInstallPrompt";

/**
 * Sidebar action to install the app. Renders nothing when the app is already
 * installed or the browser cannot install it.
 */
export function InstallAppButton({ collapsed = false }: { collapsed?: boolean }) {
  const { state, install } = useInstallPrompt();
  const [showIosHelp, setShowIosHelp] = useState(false);

  if (state === "installed" || state === "unavailable") return null;

  return (
    <div>
      <button
        type="button"
        title={collapsed ? "Install app" : undefined}
        onClick={() => (state === "promptable" ? install() : setShowIosHelp((v) => !v))}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text hover:bg-text/8 transition-colors ${collapsed ? "justify-center" : ""}`}
      >
        <Download className="w-4 h-4 shrink-0" />
        {!collapsed && <span>Install app</span>}
      </button>
      {state === "ios-manual" && showIosHelp && !collapsed && (
        <p className="px-3 pt-1 pb-2 text-xs text-text/70">
          Tap the Share button in Safari, then choose &ldquo;Add to Home Screen&rdquo;.
        </p>
      )}
    </div>
  );
}
