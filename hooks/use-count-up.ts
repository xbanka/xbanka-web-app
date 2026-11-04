// hooks/use-count-up.ts
"use client";

import { useEffect, useRef, useState } from "react";

// Decimal places of the target, so the in-between values never show more
// precision than the final amount will.
const decimalsOf = (n: number) => {
  const [, fraction = ""] = n.toString().split(".");
  return Math.min(fraction.length, 8);
};

/**
 * Animates a number from its previous value to `target` with an ease-out,
 * so amounts appear to tick up rather than snap into place.
 *
 * Starts from 0 on mount. When the target changes later (a refetch, a
 * currency switch) it counts from the current value instead. Users who prefer
 * reduced motion get the final value on the next frame.
 */
export const useCountUp = (target: number, duration = 900) => {
  const [value, setValue] = useState(0);
  const valueRef = useRef(0);

  useEffect(() => {
    if (!Number.isFinite(target)) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ms = reduce ? 0 : duration;
    const start = valueRef.current;
    const factor = 10 ** decimalsOf(target);
    let startedAt: number | undefined;
    let frame: number;

    const tick = (now: number) => {
      startedAt ??= now;
      const progress = ms === 0 ? 1 : Math.min((now - startedAt) / ms, 1);
      const eased = 1 - (1 - progress) ** 3;
      const next =
        progress === 1
          ? target
          : Math.round((start + (target - start) * eased) * factor) / factor;

      valueRef.current = next;
      setValue(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
};
