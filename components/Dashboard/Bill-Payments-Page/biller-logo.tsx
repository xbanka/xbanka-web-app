"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Renders a biller's logo from public/billers/, falling back to a coloured
 * initials badge when the artwork is missing or fails to load — same
 * treatment as BankLogo.
 */
export function BillerLogo({
  logo,
  name,
  fallbackColor = "bg-Green",
  size = 40,
  rounded = "rounded-full",
  className,
}: {
  logo?: string;
  name: string;
  fallbackColor?: string;
  size?: number;
  rounded?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState<string | null>(null);

  if (!logo || failed === logo) {
    const initials = name
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, size < 32 ? 2 : 3);

    return (
      <div
        className={cn(
          "flex items-center justify-center shrink-0 text-white font-semibold uppercase",
          rounded,
          fallbackColor,
          className,
        )}
        style={{
          width: size,
          height: size,
          fontSize: Math.max(8, Math.round(size * 0.34)),
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={logo}
      alt={name}
      width={size}
      height={size}
      unoptimized
      onError={() => setFailed(logo)}
      className={cn("shrink-0 object-contain", rounded, className)}
      style={{ width: size, height: size }}
    />
  );
}
