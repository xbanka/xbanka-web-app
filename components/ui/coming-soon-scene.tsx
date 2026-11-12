"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export type SceneIcon = "gift" | "p2p" | "affiliate" | "referrals" | "bill";

/** The white mark painted on the card, in a 28×28 box. */
const ICON_PATHS: Record<SceneIcon, React.ReactNode> = {
  gift: <path d="M2 12h24v14H2zM0 6h28v6H0zM14 6v20M14 6c-3-6-10-4-6 0M14 6c3-6 10-4 6 0" />,
  p2p: <path d="M3 9h21M18 3l6 6-6 6M25 20H4M10 14l-6 6 6 6" />,
  affiliate: (
    <>
      <circle cx="5" cy="14" r="3.5" />
      <circle cx="23" cy="5" r="3.5" />
      <circle cx="23" cy="23" r="3.5" />
      <path d="M8.2 12.4l11.6-5.8M8.2 15.6l11.6 5.8" />
    </>
  ),
  referrals: (
    <>
      <circle cx="10" cy="8" r="4.5" />
      <path d="M1 26c0-5 4-8.5 9-8.5s9 3.5 9 8.5M23 9v9M18.5 13.5h9" />
    </>
  ),
  bill: <path d="M5 1h18v26l-4.5-3-4.5 3-4.5-3L5 27zM10 9h8M10 15h8" />,
};

/**
 * The "coming soon" build animation: a worker on a lift paints the
 * feature's card, then its details and the Xbanka logo pop on. Clicking the
 * illustration remounts it and plays it again. Styles: `.cs-*` in
 * globals.css.
 */
export function ComingSoonScene({
  title,
  accent,
  icon,
  description,
  compact = false,
}: {
  title: string;
  /** Paint colour of the card. */
  accent: string;
  icon: SceneIcon;
  description?: string;
  /** Stacked, for use in a modal. Otherwise side by side from md up. */
  compact?: boolean;
}) {
  const [run, setRun] = useState(0);
  const accentVars = { "--cs-accent": accent } as React.CSSProperties;

  return (
    <div
      style={accentVars}
      className={cn(
        "cs-scene grid w-full items-center",
        compact
          ? "gap-5 text-center"
          : "gap-5 text-left md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:items-stretch md:gap-12 md:self-stretch xl:gap-16",
      )}
    >
      <button
        key={run}
        type="button"
        onClick={() => setRun((n) => n + 1)}
        aria-label={`Replay the ${title} animation`}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-2xl bg-input-background px-4 cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-border-active/40",
          compact ? "py-5" : "py-3 md:py-12 xl:py-16",
        )}
      >
          <svg
            viewBox="0 0 400 250"
            className={cn(
              "h-auto w-full max-w-[22rem] overflow-visible",
              !compact && "md:max-w-[30rem] xl:max-w-[36rem]",
            )}
            role="img"
            aria-label={`A worker on a lift paints the Xbanka ${title} card`}
          >
            <line x1="16" y1="236" x2="384" y2="236" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
            {/* the card's blueprint, then the card being painted over it */}
            <rect x="56" y="70" width="200" height="126" rx="14" fill="none" stroke="var(--input)" strokeWidth="1.5" strokeDasharray="6 5" />
            <rect className="cs-paint" x="56" y="70" width="200" height="126" rx="14" fill={accent} />
            <rect className="cs-outline" x="56" y="70" width="200" height="126" rx="14" fill="none" stroke={accent} strokeWidth="2" pathLength={1} />
            {/* card details */}
            <rect className="cs-pop" x="76" y="92" width="30" height="22" rx="4" fill="#FEC84B" style={{ animationDelay: "3s" }} />
            <line className="cs-pop" x1="76" y1="103" x2="106" y2="103" stroke="#A27D00" strokeWidth="1.2" style={{ animationDelay: "3s" }} />
            {/* the Xbanka logo on the card (white lettering reads on every accent) */}
            <image className="cs-pop" href="/xbanka_white.png" x="74" y="149" width="86" height="24" preserveAspectRatio="xMinYMid meet" style={{ animationDelay: "3.15s" }} />
            <rect className="cs-pop" x="76" y="178" width="72" height="5" rx="2.5" fill="#fff" fillOpacity=".45" style={{ animationDelay: "3.3s" }} />
            <g transform="translate(212 88)">
              <g className="cs-pop" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animationDelay: "3.05s" }}>
                {ICON_PATHS[icon]}
              </g>
            </g>
            {/* sparkles once the card is done */}
            <path className="cs-twinkle" d="M40 54l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6z" fill="#2DD4BF" style={{ animationDelay: "3.5s" }} />
            <path className="cs-twinkle" d="M262 44l1.3 3.7 3.7 1.3-3.7 1.3-1.3 3.7-1.3-3.7-3.7-1.3 3.7-1.3z" fill="#FEC84B" style={{ animationDelay: "3.9s" }} />
            <path className="cs-twinkle" d="M34 196l1.1 3 3 1.1-3 1.1-1.1 3-1.1-3-3-1.1 3-1.1z" fill="#2DD4BF" style={{ animationDelay: "4.3s" }} />
            {/* the lift */}
            <rect x="298" y="222" width="60" height="12" rx="3" fill="#4b5563" />
            <circle cx="308" cy="236" r="4.5" fill="#374151" stroke="#6b7280" strokeWidth="1.5" />
            <circle cx="348" cy="236" r="4.5" fill="#374151" stroke="#6b7280" strokeWidth="1.5" />
            <rect className="cs-pole" x="324" y="140" width="8" height="82" rx="2" fill="#6b7280" />
            {/* the worker, riding the platform */}
            <g className="cs-worker">
              <rect x="296" y="198" width="64" height="6" rx="2" fill="#a4aab4" />
              <path d="M356 198v-24h-22" fill="none" stroke="#a4aab4" strokeWidth="2" strokeLinecap="round" />
              <rect x="318" y="178" width="6" height="20" rx="2" fill="#374151" />
              <rect x="326" y="178" width="6" height="20" rx="2" fill="#374151" />
              <rect x="313" y="150" width="24" height="31" rx="6" fill="#0c9a8e" />
              <line x1="313" y1="166" x2="337" y2="166" stroke="#FEC84B" strokeWidth="2.5" />
              <circle cx="325" cy="139" r="9" fill="#C68B5E" />
              <path d="M315.5 137a9.5 9.5 0 0 1 19 0z" fill="#FEC84B" />
              <rect x="313" y="135.5" width="24" height="3" rx="1.5" fill="#FEC84B" />
              <line x1="316" y1="157" x2="292" y2="164" stroke="#C68B5E" strokeWidth="5" strokeLinecap="round" />
              <polyline points="292,164 258,164" fill="none" stroke="#a4aab4" strokeWidth="3" strokeLinecap="round" />
              <rect x="246" y="148" width="12" height="32" rx="4" fill={accent} stroke="#f9f9f9" strokeWidth="1.5" />
            </g>
          </svg>
      </button>

      <div
        className={cn(
          "flex flex-col",
          compact ? "items-center gap-4" : "items-start gap-3.5 md:gap-5 md:self-center",
        )}
      >
        <span
          className="cs-fade inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--cs-accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--cs-accent)_14%,transparent)] px-3 py-1 text-[13px] font-semibold md:px-3.5 md:py-1.5 md:text-sm text-[color-mix(in_srgb,var(--cs-accent)_60%,var(--card-text))]"
          style={{ animationDelay: "0.4s" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--cs-accent)] opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--cs-accent)]" />
          </span>
          Coming soon
        </span>

        <div className="cs-fade space-y-1.5 md:space-y-2" style={{ animationDelay: "0.55s" }}>
          <h2
            className={cn(
              "font-display font-semibold tracking-[-0.01em] text-card-text",
              compact
                ? "text-xl leading-7"
                : "text-[22px] leading-7 md:text-[32px] md:leading-10 xl:text-[38px] xl:leading-[46px]",
            )}
          >
            {title} is on its way
          </h2>
          {description && (
            <p
              className={cn(
                "max-w-md text-sm leading-[22px] text-text",
                !compact && "md:max-w-lg md:text-base md:leading-7 xl:text-lg xl:leading-8",
                compact && "mx-auto",
              )}
            >
              {description}
            </p>
          )}
        </div>

        <div className="cs-fade mt-1 w-full md:w-auto" style={{ animationDelay: "0.7s" }}>
          <p
            className={cn(
              "inline-flex items-center gap-2.5 text-sm font-medium text-card-text",
              !compact && "md:text-base",
            )}
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-teal-border bg-teal-light text-teal-text">
              <Bell className="h-4 w-4" />
            </span>
            We’ll notify you when it’s live
          </p>
        </div>
      </div>
    </div>
  );
}
