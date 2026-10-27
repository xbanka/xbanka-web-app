"use client";

import { cn } from "@/lib/utils";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const OUT_MS = 320;
// Starts moving at once and eases to a stop, with no abrupt start or end.
const EASE_OUT_PANEL = "cubic-bezier(0.4, 0, 0.6, 1)";

interface SidebarProps {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  open: boolean;
}

export function SidebarWrapper({
  onClose,
  children,
  className,
  open,
}: SidebarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);
  // Mounted already open (Edit Profile): the panel slides in as it appears.
  // Mounted closed and opened later: the transition on `open` does that.
  const [slideInOnMount] = useState(open);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Callers unmount the drawer the moment it closes, so the slide-out plays
  // on a snapshot of it. Layout cleanups run before React detaches the node.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;

    return () => {
      if (
        !openRef.current ||
        typeof panel.animate !== "function" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !panel.getBoundingClientRect().width
      )
        return;

      const ghost = root.cloneNode(true) as HTMLElement;
      const overlay = ghost.firstElementChild as HTMLElement | null;
      const ghostPanel = ghost.lastElementChild as HTMLElement | null;
      if (!overlay || !ghostPanel) return;
      ghost.setAttribute("aria-hidden", "true");
      ghost.style.pointerEvents = "none";
      overlay.style.animation = "none";
      ghostPanel.style.animation = "none";

      requestAnimationFrame(() => {
        // Still on the page: this was React's development-mode remount, not
        // a close, and the real drawer is sliding in. No snapshot then.
        if (root.isConnected) return;
        document.body.appendChild(ghost);

        const opts = { duration: OUT_MS, fill: "forwards" as const };
        overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
          ...opts,
          easing: "ease-in",
        });
        ghostPanel.animate(
          [{ transform: "translateX(0)" }, { transform: "translateX(100%)" }],
          { ...opts, easing: EASE_OUT_PANEL },
        ).onfinish = () => ghost.remove();
      });
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`fixed inset-0 z-50 transition ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
          slideInOnMount && "motion-safe:animate-modal-backdrop-in",
        )}
        onClick={onClose}
      />

      {/* sidebar */}
      <div
        ref={panelRef}
        className={cn(
          "absolute right-0 top-0 flex h-full w-full flex-col overflow-hidden bg-card-background border-8 border-border rounded-bl-[20px] rounded-tl-[20px] shadow-2xl md:max-w-150",
          "transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "max-sm:h-dvh max-sm:border-0 max-sm:rounded-none max-sm:px-0 max-sm:pb-0",
          open ? "translate-x-0" : "translate-x-full",
          slideInOnMount && "motion-safe:animate-drawer-in",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
