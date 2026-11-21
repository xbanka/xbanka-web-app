"use client";

import { createElement, useEffect } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const POINTS = [
  "Fund with a bank transfer",
  "Trade BTC, ETH and USDT",
  "Pay airtime, data, power and TV",
];

/**
 * The 3D Xbanka hero from the Claude Design project "Xbanka hero 3D
 * redesign": a mint card with the logo, headline and the live <x-scene>
 * (./xscene.js), then the three things Xbanka does.
 *
 * - `desktop`: beside the auth forms on wide screens, the card fills the
 *   column.
 * - `mobile`: the phone Welcome screen; a shorter card so the three lines
 *   below get more room. `compact` shrinks it to a banner (still animating)
 *   above an open form, without the three lines.
 */
export function AuthHero({
  className,
  variant = "desktop",
  compact = false,
  fill = false,
  showPoints = true,
}: {
  className?: string;
  variant?: "desktop" | "mobile";
  compact?: boolean;
  /** Phone Welcome: the card grows to fill the space it's given. */
  fill?: boolean;
  showPoints?: boolean;
}) {
  const mobile = variant === "mobile";

  useEffect(() => {
    // The scene is a custom element; register it in the browser only.
    import("./xscene").then((m) => m.defineXScene());
  }, []);

  return (
    <div className={cn("flex min-h-0 flex-col", mobile ? "gap-5" : "gap-6", className)}>
      {/* data-xcard: the scene follows the pointer anywhere over the card */}
      <div
        data-xcard="1"
        className={cn(
          "relative overflow-hidden bg-[#D4E8E5] shadow-[inset_0_1px_0_rgba(255,255,255,.6)]",
          mobile
            ? cn(
                "shrink-0 rounded-[28px] transition-[height] duration-500 ease-out",
                compact
                  ? "h-[clamp(140px,19dvh,170px)]"
                  : fill
                    ? "min-h-[260px] flex-1"
                    : "h-[min(440px,50dvh)] min-h-[280px] [@media(max-height:700px)]:h-[44dvh]",
              )
            : "min-h-[480px] flex-1 rounded-[32px]",
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_0%,rgba(255,255,255,.55),rgba(255,255,255,0)_60%)]"
        />
        <div
          className={cn(
            "relative flex flex-col",
            mobile ? (compact ? "gap-1.5 px-4 pt-3" : "gap-4 px-5 pt-5") : "gap-10 px-10 pt-9",
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <Image
              src="/xbanka_logo.png"
              alt="Xbanka"
              width={136}
              height={44}
              className={cn("h-auto", mobile ? "w-24" : "w-34")}
              priority
              unoptimized
            />
            <span
              className={cn(
                "rounded-full bg-[#25272B] font-medium tracking-[-0.01em] text-white",
                mobile ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
              )}
            >
              Naira · Crypto · Bills
            </span>
          </div>
          <h2
            className={cn(
              "font-display font-extrabold leading-[1.02] tracking-[-0.04em] text-[#0B4F4A] [text-wrap:balance]",
              mobile
                ? compact
                  ? "text-[18px]"
                  : "text-[30px]"
                : "max-w-[540px] text-[clamp(40px,3.6vw,52px)]",
            )}
          >
            Naira, crypto and bills.{" "}
            <span className="block text-[#0C9A8E]">One wallet.</span>
          </h2>
        </div>
        {/* The scene fills its box (it sets its own size to 100%), so the
            box sets the size, below the headline. */}
        <div
          className={cn(
            "absolute",
            mobile
              ? compact
                ? "inset-x-2 bottom-0.5 h-[calc(100%_-_82px)]"
                : "inset-x-2 bottom-2 h-[calc(100%_-_150px)]"
              : "inset-x-6 bottom-[22px] h-[min(500px,calc(100%_-_300px))]",
          )}
        >
          {createElement("x-scene", {
            motion: "on",
            parallax: mobile ? "off" : "on",
            "aria-hidden": "true",
          })}
        </div>
      </div>

      <ul className={cn("flex flex-col", mobile ? "gap-3 px-1" : "gap-3 px-2", (compact || !showPoints) && "hidden")}>
        {POINTS.map((point) => (
          <li
            key={point}
            className={cn(
              "flex items-center gap-3 text-card-text",
              mobile ? "text-[15px]" : "text-base",
            )}
          >
            <Check
              className={cn("shrink-0 text-[#2DD4BF]", mobile ? "h-4 w-4" : "h-[18px] w-[18px]")}
              strokeWidth={2.6}
            />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
