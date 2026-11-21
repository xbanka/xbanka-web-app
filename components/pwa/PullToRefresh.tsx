"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Loader2, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

/** How far (px) the indicator travels before a release reloads. */
export const PULL_THRESHOLD = 64;
/** The indicator stops here however far the finger goes. */
export const PULL_MAX = 96;

/** Finger travel → indicator travel: half speed, so it feels weighted. */
export const pullDistance = (fingerDy: number) =>
  fingerDy <= 0 ? 0 : Math.min(PULL_MAX, fingerDy * 0.5);

/**
 * Pull down at the top of a page to reload the app.
 *
 * Installed on a Home Screen, Xbanka has no browser bar and so no reload
 * button, and the browser's own pull-to-refresh never fires because the page
 * scrolls inside `<main>`, not the document. This restores the gesture on
 * touch screens: drag down from the top of `scrollRef`, release past the
 * threshold, and the app reloads (fresh balances, and the latest release).
 */
export function PullToRefresh({ scrollRef }: { scrollRef: RefObject<HTMLElement | null> }) {
  const [distance, setDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const gesture = useRef<{ x: number; y: number; active: boolean } | null>(null);
  const distanceRef = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !window.matchMedia("(pointer: coarse)").matches) return;

    const set = (d: number) => {
      distanceRef.current = d;
      setDistance(d);
    };

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1 || el.scrollTop > 0) {
        gesture.current = null;
        return;
      }
      gesture.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: false };
    };

    const onMove = (e: TouchEvent) => {
      const g = gesture.current;
      if (!g) return;
      const dx = e.touches[0].clientX - g.x;
      const dy = e.touches[0].clientY - g.y;
      // A sideways swipe (tabs, carousels) or scrolling away: not a pull.
      if (!g.active && (Math.abs(dx) > Math.abs(dy) || dy <= 0)) {
        if (Math.abs(dx) > 8 || dy < -8) gesture.current = null;
        return;
      }
      if (el.scrollTop > 0) {
        gesture.current = null;
        set(0);
        return;
      }
      g.active = true;
      set(pullDistance(dy));
    };

    const onEnd = () => {
      const pulled = distanceRef.current;
      gesture.current = null;
      if (pulled >= PULL_THRESHOLD) {
        setRefreshing(true);
        set(PULL_THRESHOLD);
        window.location.reload();
      } else {
        set(0);
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [scrollRef]);

  if (distance === 0 && !refreshing) return null;

  const ready = distance >= PULL_THRESHOLD;
  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center"
      style={{ transform: `translateY(${distance - 28}px)` }}
    >
      <span
        className={cn(
          "grid h-10 w-10 place-items-center rounded-full border bg-card-background shadow-md transition-colors",
          ready || refreshing ? "border-teal-border text-Green" : "border-border text-text",
        )}
        style={{ opacity: Math.min(1, distance / (PULL_THRESHOLD * 0.6)) }}
      >
        {refreshing ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <RotateCw className="h-5 w-5" style={{ transform: `rotate(${distance * 3.5}deg)` }} />
        )}
      </span>
      <span className="sr-only">
        {refreshing ? "Reloading" : ready ? "Release to reload" : "Pull to reload"}
      </span>
    </div>
  );
}
