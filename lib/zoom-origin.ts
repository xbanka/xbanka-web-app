// lib/zoom-origin.ts
//
// Remembers where the user last tapped so a modal can grow out of that spot
// (and shrink back into it on close), the way an app opens from its icon.

type Origin = { rect: DOMRect; at: number };

// A modal opening more than this long after the tap was not caused by it.
const MAX_AGE_MS = 1000;
const TRIGGERS = 'button, a, [role="button"], .cursor-pointer';

let last: Origin | null = null;

/** Starts watching taps document-wide. Returns the function that stops it. */
export const trackZoomOrigins = () => {
  const onClick = (event: MouseEvent) => {
    const target = event.target as Element | null;
    const trigger = target?.closest?.(TRIGGERS);
    // A tap inside an open modal moves between its steps; the next modal to
    // mount then replaces this one in place rather than zooming from a tile.
    if (!trigger || trigger.closest("[data-modal]")) {
      last = null;
      return;
    }
    last = { rect: trigger.getBoundingClientRect(), at: Date.now() };
  };
  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
};

/** The rect of the tap that just opened a modal, if there was one. */
export const takeZoomOrigin = (): DOMRect | null => {
  const origin = last;
  last = null;
  if (!origin || Date.now() - origin.at > MAX_AGE_MS) return null;
  if (origin.rect.width === 0 || origin.rect.height === 0) return null;
  return origin.rect;
};
