"use client";

import { useState } from "react";
import Image from "next/image";
import { getCoinBadgeColor, getCoinImage } from "@/lib/coin-images";
import { cn } from "@/lib/utils";

/**
 * Renders a coin's logo, falling back to a coloured initials badge when the
 * ticker has no icon or the CDN request fails. Use this anywhere a coin logo is
 * shown so an unrecognised ticker never renders as a broken image.
 */
export function CoinIcon({
  currency,
  size = 32,
  className,
}: {
  currency?: string;
  size?: number;
  className?: string;
}) {
  const src = getCoinImage(currency);

  // Track which src failed rather than a boolean, so a new ticker automatically
  // gets a fresh attempt instead of inheriting the previous coin's failure.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = failedSrc !== null && failedSrc === src;

  const symbol = currency?.toUpperCase() ?? "";

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-semibold text-white shrink-0",
          className,
        )}
        style={{
          width: size,
          height: size,
          backgroundColor: getCoinBadgeColor(symbol),
          fontSize: Math.max(9, Math.round(size * 0.36)),
        }}
        aria-label={symbol}
      >
        {symbol.slice(0, 3) || "?"}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={symbol}
      width={size}
      height={size}
      className={cn("rounded-full shrink-0", className)}
      onError={() => setFailedSrc(src)}
      unoptimized
    />
  );
}
