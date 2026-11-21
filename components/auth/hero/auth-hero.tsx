"use client";

import { createElement, useEffect } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const POINTS = [
  "Fund with a bank transfer",
  "Trade BTC, ETH and USDT",
  "Pay airtime, data, power and TV",
];

/**
 * The 3D Xbanka hero from the Claude Design project "Xbanka hero 3D
 * redesign": a mint card with the logo, headline and the live <x-scene>
 * (./xscene.js), then the three things Xbanka does. Shown beside the sign-in
 * and sign-up forms on wide screens.
 */
export function AuthHero({ className }: { className?: string }) {
  useEffect(() => {
    // The scene is a custom element; register it in the browser only.
    import("./xscene").then((m) => m.defineXScene());
  }, []);

  return (
    <div className={cn("flex min-h-0 flex-col gap-6", className)}>
      {/* data-xcard: the scene follows the pointer anywhere over the card */}
      <div
        data-xcard="1"
        className="relative min-h-[480px] flex-1 overflow-hidden rounded-[32px] bg-[#D4E8E5] shadow-[inset_0_1px_0_rgba(255,255,255,.6)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_0%,rgba(255,255,255,.55),rgba(255,255,255,0)_60%)]"
        />
        <div className="relative flex flex-col gap-10 px-10 pt-9">
          <div className="flex items-center justify-between gap-4">
            <Image
              src="/xbanka_logo.png"
              alt="Xbanka"
              width={136}
              height={44}
              className="h-auto w-34"
              priority
              unoptimized
            />
            <span className="rounded-full bg-[#25272B] px-4 py-2 text-sm font-medium tracking-[-0.01em] text-white">
              Naira · Crypto · Bills
            </span>
          </div>
          <h2 className="max-w-[540px] font-display text-[clamp(40px,3.6vw,52px)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#0B4F4A] [text-wrap:balance]">
            Naira, crypto and bills.{" "}
            <span className="block text-[#0C9A8E]">One wallet.</span>
          </h2>
        </div>
        {/* The scene fills its box (it sets its own size to 100%), so the
            box sets the size: up to 500px tall, below the headline. */}
        <div className="absolute inset-x-6 bottom-[22px] h-[min(500px,calc(100%_-_300px))]">
          {createElement("x-scene", { motion: "on", parallax: "on", "aria-hidden": "true" })}
        </div>
      </div>

      <ul className="flex flex-col gap-3 px-2">
        {POINTS.map((point) => (
          <li key={point} className="flex items-center gap-3 text-base text-card-text">
            <Check className="h-[18px] w-[18px] shrink-0 text-[#2DD4BF]" strokeWidth={2.6} />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
