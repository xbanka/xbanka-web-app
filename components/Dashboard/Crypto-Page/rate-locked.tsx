"use client"
import { useEffect, useState } from "react";

export function RateLocked({ seconds = 30, onExpire }: { seconds?: number, onExpire?: () => void; }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) {
      onExpire?.(); // 🔥 trigger refetch
      setRemaining(seconds);
      return;
    }

    const t = setTimeout(() => {
      setRemaining((s) => s - 1);
    }, 1000);

    return () => clearTimeout(t);
  }, [remaining, seconds, onExpire]);
  const pct = (remaining / seconds) * 100;
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium leading-6 text-card-text">Rate Locked</span>
      <div className="flex items-center gap-1.5 bg-yellow-warning-light border border-yellow-warning-border rounded-sm px-2 py-0.5">
        <div className="relative w-3.5 h-3.5">
          <svg className="w-3.5 h-3.5 -rotate-90" viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-500/30" />
            <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 5.5}`}
              strokeDashoffset={`${2 * Math.PI * 5.5 * (1 - pct / 100)}`}
              className="text-yellow-warning-text transition-all duration-1000"
            />
          </svg>
        </div>
        <span className="text-[12px] font-normal leading-4.5 text-yellow-warning-text">{remaining}s</span>
      </div>
    </div>
  );
}