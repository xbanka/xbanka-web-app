"use client";

import { cn } from "@/lib/utils";
import { takeZoomOrigin } from "@/lib/zoom-origin";
import { MouseEvent, useLayoutEffect, useRef } from "react";

const OPEN_MS = 400;
const CLOSE_MS = 240;
// Decelerates smoothly and settles, like a spring without the overshoot.
const EASE_OUT = "cubic-bezier(0.32, 0.72, 0, 1)";
const EASE_IN = "cubic-bezier(0.4, 0, 0.8, 0.4)";
// Flows such as Send Money mount a fresh Modal for each step. When one mounts
// right as another closed, it is the next step, and the backdrop stays put
// rather than fading in again.
const SWAP_WINDOW_MS = 100;
let lastClosed: { root: HTMLElement; at: number } | null = null;

/** The transform that lays the card's final box exactly over `from`. */
const transformOnto = (card: DOMRect, from: DOMRect) => {
  const dx = from.left + from.width / 2 - (card.left + card.width / 2);
  const dy = from.top + from.height / 2 - (card.top + card.height / 2);
  return `translate(${dx}px, ${dy}px) scale(${from.width / card.width}, ${from.height / card.height})`;
};

const canZoom = (el: HTMLElement) =>
  typeof el.animate === "function" &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Modal({
  onClose,
  children,
  className,
  backdropClassName,
}: {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  backdropClassName?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<DOMRect | null>(null);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Opened from a tap: grow out of the tapped element instead of the default
  // fade-and-settle, and on close shrink back into it. The close animates a
  // snapshot of the modal, since by then the parent has already dropped it.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const card = cardRef.current;
    if (!root || !card) return;

    if (
      lastClosed &&
      lastClosed.root !== root &&
      performance.now() - lastClosed.at < SWAP_WINDOW_MS
    ) {
      root.style.animation = "none";
    }

    originRef.current = takeZoomOrigin() ?? originRef.current;
    const origin = originRef.current;
    const zoom = !!origin && canZoom(card);

    if (origin && zoom) {
      const rect = card.getBoundingClientRect();
      if (rect.width && rect.height) {
        card.style.animation = "none";
        card.animate(
          [
            { transform: transformOnto(rect, origin), opacity: 0.4 },
            { transform: "none", opacity: 1 },
          ],
          { duration: OPEN_MS, easing: EASE_OUT },
        );
      }
    }

    return () => {
      lastClosed = { root, at: performance.now() };
      // Layout cleanups run before React detaches the node, so it can still
      // be measured and cloned here.
      if (!origin || !zoom || !card.getBoundingClientRect().width) return;
      const ghost = root.cloneNode(true) as HTMLElement;
      const ghostCard = ghost.firstElementChild as HTMLElement | null;
      if (!ghostCard) return;
      ghost.removeAttribute("data-modal");
      ghost.setAttribute("aria-hidden", "true");
      ghost.style.pointerEvents = "none";
      ghost.style.animation = "none";
      ghostCard.style.animation = "none";

      requestAnimationFrame(() => {
        // Another modal took over in the same breath (a step change): the
        // new one simply replaces this one, no zoom-out.
        if (document.querySelector("[data-modal]")) return;
        document.body.appendChild(ghost);
        const ghostRect = ghostCard.getBoundingClientRect();
        const opts = { duration: CLOSE_MS, fill: "forwards" as const };
        ghost.animate([{ opacity: 1 }, { opacity: 0 }], { ...opts, easing: "ease-in" });
        ghostCard.animate(
          [
            { transform: "none", opacity: 1 },
            { transform: transformOnto(ghostRect, origin), opacity: 0 },
          ],
          { ...opts, easing: EASE_IN },
        ).onfinish = () => ghost.remove();
      });
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-modal=""
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] motion-safe:animate-modal-backdrop-in",
        "max-sm:items-end max-sm:p-0 ",
        backdropClassName,
      )}
      onClick={handleBackdropClick}
    >
      <div
        ref={cardRef}
        className={cn(
          "relative z-10 w-full max-w-150 bg-card-background px-10 pb-10 border-8 border-border rounded-[20px] shadow-2xl motion-safe:animate-modal-card-in",
          "max-sm:max-w-full max-sm:max-h-[90vh] max-sm:overflow-y-auto max-sm:rounded-b-none max-sm:border-x-0 max-sm:border-b-0 max-sm:motion-safe:animate-modal-sheet-in",
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
