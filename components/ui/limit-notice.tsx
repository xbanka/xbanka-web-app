import Link from "next/link";
import type { LimitCheck } from "@/lib/transaction-limit";

/** The message under an amount that breaks a tier limit, with the next step. */
export function LimitNotice({ check }: { check: LimitCheck }) {
  if (check.allowed) return null;
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-500 space-y-1"
    >
      <p>{check.message}</p>
      <Link
        href={check.action === "upgrade" ? "/account?tab=identity" : "/help"}
        className="font-semibold underline"
      >
        {check.action === "upgrade"
          ? `Upgrade to Tier ${check.nextTier}`
          : "Contact Support"}
      </Link>
    </div>
  );
}
