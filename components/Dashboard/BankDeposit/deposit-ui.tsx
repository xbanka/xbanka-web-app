"use client";

import { ReactNode } from "react";
import { Copy, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { cn } from "@/lib/utils";

/**
 * The card every deposit screen sits in: pinned header, scrolling body,
 * pinned footer. The card is height-capped so the CTAs never fall below a
 * short viewport (see the scroll regression test).
 */
export function DepositModal({
  title,
  subtitle,
  onBack,
  onClose,
  children,
  footer,
  testId,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  testId?: string;
}) {
  return (
    <Modal
      className="flex flex-col p-0 max-h-[85dvh] overflow-hidden max-sm:max-h-[85dvh] max-sm:overflow-hidden"
      onClose={onClose}
    >
      <ModalHeader
        className="shrink-0 border-b border-border px-8 pt-6 pb-5 max-sm:px-5 max-sm:pt-5 max-sm:pb-4"
        title={title}
        subtitle={subtitle}
        onBack={onBack}
        onClose={onClose}
      />
      <div
        data-testid={testId ? `${testId}-body` : undefined}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-8 pt-6 pb-4 space-y-5 max-sm:px-5"
      >
        {children}
      </div>
      {footer && (
        <div
          data-testid={testId ? `${testId}-footer` : undefined}
          className="shrink-0 space-y-3 px-8 pt-3 pb-7 max-sm:px-5 max-sm:pb-[calc(env(safe-area-inset-bottom)+16px)]"
        >
          {footer}
        </div>
      )}
    </Modal>
  );
}

const NOTICE_TONES = {
  teal: "border-teal-border bg-teal-light text-teal-text",
  warning: "border-yellow-warning-border bg-yellow-warning-light text-yellow-warning-text",
  danger: "border-input-border-error/60 bg-red-error-light text-error-text",
  info: "border-blue-border bg-blue-light text-blue-text",
  success: "border-green-success-border bg-green-success-light text-green-success-text",
} as const;

export type NoticeTone = keyof typeof NOTICE_TONES;

/** A coloured box with an icon, a title and a line or two of explanation. */
export function Notice({
  tone,
  icon: Icon,
  title,
  children,
  role,
}: {
  tone: NoticeTone;
  icon: LucideIcon;
  title: ReactNode;
  children?: ReactNode;
  role?: "alert" | "status";
}) {
  return (
    <div
      role={role}
      className={cn("flex items-start gap-3 rounded-xl border px-4 py-3.5", NOTICE_TONES[tone])}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="min-w-0 space-y-1 text-sm leading-6">
        <p className="font-medium">{title}</p>
        {children && <div className="opacity-90">{children}</div>}
      </div>
    </div>
  );
}

export type DetailRow = { label: string; value: ReactNode; testId?: string };

/** Label / value rows in a bordered card ("From", "To", "Request ID"). */
export function DetailRows({ rows, className }: { rows: DetailRow[]; className?: string }) {
  return (
    <dl className={cn("rounded-xl border border-border bg-background/40 px-5 py-2", className)}>
      {rows.map((row) => (
        <div
          key={row.label}
          data-testid={row.testId}
          className="flex items-center justify-between gap-4 py-2.5 text-sm"
        >
          <dt className="shrink-0 text-text">{row.label}</dt>
          <dd className="min-w-0 truncate text-right font-medium text-card-text">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** "• Waiting" / "• Delayed". */
export function StatusPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-warning-dark/60 bg-yellow-warning-light px-3 py-1 text-xs font-medium text-yellow-warning-text">
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {label}
    </span>
  );
}

export const copyToClipboard = async (text: string, label: string) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  } catch {
    toast.error(`Couldn't copy ${label.toLowerCase()}`);
  }
};

/** A copyable value, e.g. the Request ID. */
export function CopyValue({ value, label }: { value: string; label: string }) {
  return (
    <button
      type="button"
      onClick={() => copyToClipboard(value, label)}
      className="inline-flex max-w-full items-center gap-1.5 font-medium text-card-text hover:text-Green"
      aria-label={`Copy ${label.toLowerCase()}`}
    >
      <span className="truncate">{value}</span>
      <Copy className="h-3.5 w-3.5 shrink-0 text-Green" aria-hidden />
    </button>
  );
}

const ICON_TONES = {
  success: "border-green-success-border bg-green-success-light text-green-success-text",
  info: "border-blue-border bg-blue-light text-blue-text",
  danger: "border-input-border-error/60 bg-red-error-light text-error-text",
} as const;

/** The big icon, amount and caption at the top of a result screen. */
export function ResultHero({
  tone,
  icon: Icon,
  amount,
  caption,
}: {
  tone: keyof typeof ICON_TONES;
  icon: LucideIcon;
  amount: string;
  caption: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-2 text-center">
      <span
        className={cn("flex h-16 w-16 items-center justify-center rounded-full border", ICON_TONES[tone])}
      >
        <Icon className="h-7 w-7" aria-hidden />
      </span>
      <p className="text-4xl font-bold text-card-text max-sm:text-3xl">{amount}</p>
      <p className="text-sm text-text">{caption}</p>
    </div>
  );
}

/** Two footer buttons side by side, secondary narrower than primary. */
export function FooterButtons({ secondary, primary }: { secondary?: ReactNode; primary: ReactNode }) {
  return (
    <div className="flex gap-4 max-sm:gap-3 [&>*:first-child:not(:only-child)]:flex-1 [&>*:last-child]:flex-[2]">
      {secondary}
      {primary}
    </div>
  );
}
