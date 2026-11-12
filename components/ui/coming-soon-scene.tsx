"use client";

import { useEffect, useState } from "react";
import { Bell, Check, CheckCircle2, Clock, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UseSendSupportRequest } from "@/lib/services/support.service";
import {
  launchNotifyMessage,
  readNotified,
  rememberNotified,
} from "@/lib/coming-soon";
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
 * The "coming soon" build animation: the Xbanka logo lands, a worker on a
 * lift paints the feature's card, then the copy arrives. Remounting it (the
 * Replay button bumps its key) plays it again. Styles: `.cs-*` in
 * globals.css.
 */
export function ComingSoonScene({
  title,
  accent,
  icon,
  description,
  features,
  notifyKey,
  compact = false,
}: {
  title: string;
  /** Paint colour of the card. */
  accent: string;
  icon: SceneIcon;
  description?: string;
  features?: readonly string[];
  /** Remembers a "notify me" per feature, e.g. "gift-cards". */
  notifyKey: string;
  /** Tighter spacing for use in a modal. */
  compact?: boolean;
}) {
  const [run, setRun] = useState(0);
  const [notified, setNotified] = useState(false);
  const { mutate: send, isPending } = UseSendSupportRequest();

  useEffect(() => {
    setNotified(readNotified().includes(notifyKey));
  }, [notifyKey]);

  const notify = () => {
    send(
      { topic: "Launch notification", message: launchNotifyMessage(title) },
      {
        onSuccess: () => {
          rememberNotified(notifyKey);
          setNotified(true);
          toast.success(`We’ll let you know when ${title} is live`);
        },
        onError: (error) => {
          toast.error(
            error.status === 503
              ? "We couldn’t sign you up right now. Please try again later."
              : error.message || "We couldn’t sign you up. Try again.",
          );
        },
      },
    );
  };

  return (
    <div
      key={run}
      className={cn(
        "cs-scene mx-auto flex w-full max-w-xl flex-col items-center text-center",
        compact ? "gap-4" : "gap-5",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/xbanka_logo.png" alt="Xbanka" className="cs-logo h-auto w-24 dark:hidden" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/xbanka_white.png" alt="Xbanka" className="cs-logo hidden h-auto w-24 dark:block" />

      <svg
        viewBox="0 0 400 250"
        className={cn("h-auto w-full overflow-visible", compact ? "max-w-80" : "max-w-md")}
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
        <text className="cs-pop" x="76" y="170" fill="#fff" fontSize="12" fontWeight="600" letterSpacing="2.5" style={{ animationDelay: "3.15s" }}>
          XBANKA
        </text>
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

      <span className="cs-badge inline-flex items-center gap-1.5 rounded-full border border-[#A27D00] bg-[#3E2E00] px-3 py-1 text-[13px] font-medium text-[#FEC84B]">
        <Clock className="h-3.5 w-3.5" />
        Coming soon
      </span>

      <div className="cs-fade space-y-2" style={{ animationDelay: "3.45s" }}>
        <h2 className={cn("font-display font-semibold leading-tight text-card-text", compact ? "text-lg" : "text-xl sm:text-2xl")}>
          We’re building {title}
        </h2>
        {description && (
          <p className="mx-auto max-w-md text-sm leading-6 text-text sm:text-[15px]">{description}</p>
        )}
      </div>

      <div className="cs-fade w-full max-w-sm space-y-2" style={{ animationDelay: "3.6s" }}>
        <div className="relative h-1.5 overflow-hidden rounded-full bg-border">
          <div className="cs-bar absolute inset-y-0 left-0 w-[38%] rounded-full bg-Green" />
        </div>
        <p className="text-xs text-text">Our team is working on it</p>
      </div>

      {features && features.length > 0 && (
        <ul className="cs-fade w-full max-w-md space-y-2.5 text-left" style={{ animationDelay: "3.75s" }}>
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-input-background px-3.5 py-3 text-sm text-card-text"
            >
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-Green" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      <div className="cs-fade flex w-full flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: "3.9s" }}>
        {notified ? (
          <span className="inline-flex h-12 items-center gap-2 rounded-md border border-teal-border bg-teal-light px-5 text-[15px] font-medium text-teal-text max-sm:w-full max-sm:justify-center">
            <Check className="h-4 w-4" />
            We’ll let you know
          </span>
        ) : (
          <Button onClick={notify} disabled={isPending} className="gap-2 px-5 text-[15px] max-sm:w-full">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
            {isPending ? "Signing you up…" : "Notify me when it’s live"}
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => setRun((n) => n + 1)}
          className="gap-2 px-5 text-[15px] text-card-text max-sm:w-full"
        >
          <RotateCcw className="h-4 w-4" />
          Replay
        </Button>
      </div>
    </div>
  );
}
