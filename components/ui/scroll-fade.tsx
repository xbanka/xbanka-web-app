"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A scroll box whose bottom edge fades out while there is more below, so a
 * half-visible row reads as "scroll for more" rather than a layout fault.
 * The fade disappears once the end is reached.
 */
export function ScrollFade({
  children,
  className,
}: {
  children: ReactNode;
  /** Sizing for the scroll box itself, e.g. a max height. */
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () =>
      setMore(el.scrollTop + el.clientHeight < el.scrollHeight - 1);

    el.addEventListener("scroll", measure, { passive: true });
    // ResizeObserver reports once on observe, which is the initial measure.
    const resize =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    resize?.observe(el);
    // Content swaps (a new plan category) change the height without resizing
    // the box.
    const content = new MutationObserver(measure);
    content.observe(el, { childList: true, subtree: true });
    if (!resize) measure();

    return () => {
      el.removeEventListener("scroll", measure);
      resize?.disconnect();
      content.disconnect();
    };
  }, []);

  return (
    <div className="relative">
      <div ref={ref} className={cn("overflow-y-auto", className)}>
        {children}
      </div>
      {more && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-card-background to-transparent"
        />
      )}
    </div>
  );
}
