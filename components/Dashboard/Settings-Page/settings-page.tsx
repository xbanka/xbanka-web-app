"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronDown, ChevronRight, Loader2, Mail, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { useSettings } from "@/hooks/use-settings";
import { UseProfileUser } from "@/lib/services/profile.service";
import {
  AUTO_SIGN_OUT_OPTIONS,
  LANGUAGES,
  NOTIFICATION_CATEGORIES,
  isLocked,
  languageByCode,
} from "@/lib/settings";
import { UseSendSupportRequest } from "@/lib/services/support.service";
import { previewChime } from "@/lib/transaction-sounds";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import type { PushStatus } from "@/lib/push/push-notifications";
import { SUPPORT_EMAIL, mailtoLink } from "@/lib/supportContacts";
import { cn } from "@/lib/utils";
import { useBalanceVisibilityStore } from "@/store/balance-visibility.store";
import { useCurrencyViewStore } from "@/store/currency-view.store";
import { useThemeStore } from "@/store/theme.store";

type SettingsTab = "general" | "notifications" | "privacy";

const TABS: { id: SettingsTab; label: string }[] = [
  { id: "general", label: "General" },
  { id: "notifications", label: "Notifications" },
  { id: "privacy", label: "Privacy" },
];

const saved = () => toast.success("Preference saved", { id: "settings-saved" });

/* ---------- building blocks ---------- */

function Switch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-border-active/30",
        checked ? "bg-Green" : "bg-input",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <span
        className={cn(
          "inline-block h-[18px] w-[18px] rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[23px]" : "translate-x-[3px]",
        )}
      />
    </button>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex shrink-0 rounded-md border border-input bg-input-background p-0.5"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "h-8 px-3.5 rounded text-sm font-medium transition-colors",
            value === o.value
              ? "bg-card-background text-card-text shadow-xs"
              : "text-text hover:text-card-text",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function NativeSelect({
  id,
  value,
  onChange,
  children,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full sm:w-64 shrink-0">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full appearance-none rounded-lg border border-input bg-input-background pl-3.5 pr-9 text-base md:text-sm text-card-text cursor-pointer outline-none focus:border-border-active focus:ring-[3px] focus:ring-border-active/20"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder" />
    </div>
  );
}

function Section({
  title,
  description,
  children,
  danger,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <DashboardCard
      className={cn("p-0 max-sm:p-0 space-y-0 overflow-hidden", danger && "border-error-text/40")}
    >
      <div className="px-5 py-4 border-b border-border">
        <h2 className={cn("text-[15px] font-semibold", danger ? "text-error-text" : "text-card-text")}>
          {title}
        </h2>
        {description && <p className="mt-0.5 text-[13px] text-text">{description}</p>}
      </div>
      <div className="divide-y divide-border">{children}</div>
    </DashboardCard>
  );
}

function Row({
  label,
  hint,
  htmlFor,
  inline,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  htmlFor?: string;
  /** Keep the control beside the label on phones too; for switches. */
  inline?: boolean;
  children: React.ReactNode;
}) {
  const Title = htmlFor ? "label" : "span";
  return (
    <div
      className={cn(
        "flex px-5 py-4",
        inline
          ? "flex-row items-center justify-between gap-4 sm:gap-6"
          : "flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
      )}
    >
      <div className="min-w-0">
        <Title htmlFor={htmlFor} className="block text-sm font-medium text-card-text">
          {label}
        </Title>
        {hint && <div className="mt-0.5 text-[13px] text-text">{hint}</div>}
      </div>
      {children}
    </div>
  );
}

/* ---------- tabs ---------- */

function GeneralTab() {
  const settings = useSettings();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const view = useCurrencyViewStore((s) => s.view);
  const setView = useCurrencyViewStore((s) => s.setView);
  const language = languageByCode(settings.language);

  return (
    <Section title="General" description="How Xbanka looks and reads for you.">
      <Row
        label="Language"
        htmlFor="settings-language"
        hint={
          language.available
            ? "Used across the app."
            : `Xbanka is in English for now. We’ll switch to ${language.name} as soon as it’s ready.`
        }
      >
        <NativeSelect
          id="settings-language"
          value={language.code}
          onChange={(code) => {
            settings.set({ language: code });
            saved();
          }}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name === l.english ? l.name : `${l.name} · ${l.english}`}
              {l.available ? "" : " (coming soon)"}
            </option>
          ))}
        </NativeSelect>
      </Row>
      <Row label="Show balances in" hint="The currency your total and wallet balances are shown in.">
        <Segmented
          label="Show balances in"
          value={view}
          options={[
            { value: "NGN", label: "Naira" },
            { value: "CRYPTO", label: "Crypto" },
          ]}
          onChange={(v) => {
            setView(v);
            saved();
          }}
        />
      </Row>
      <Row label="Theme" inline>
        <Segmented
          label="Theme"
          value={theme}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
          onChange={(v) => {
            setTheme(v);
            saved();
          }}
        />
      </Row>
    </Section>
  );
}

const PUSH_HINTS: Record<PushStatus, string> = {
  on: "On for this device. You’ll get alerts even when Xbanka is closed.",
  off: "Money in and out, bill payments and security alerts, even when Xbanka is closed.",
  denied:
    "Notifications are blocked for Xbanka. Allow them in your browser or phone settings, then come back here.",
  "needs-install":
    "On iPhone and iPad, add Xbanka to your Home Screen first (Share › Add to Home Screen), then open it from there.",
  unsupported: "This browser can’t show notifications. Try Chrome, Edge or Safari.",
  "not-configured": "Not available yet. We’re switching this on soon.",
  unavailable: "Not available right now. Reload Xbanka and try again.",
};

function PushNotificationsSection() {
  const push = usePushNotifications();
  const canToggle = push.status === "on" || push.status === "off";

  return (
    <Section
      title="Push notifications"
      description="Alerts on this phone or computer, like any other app."
    >
      <Row
        label="Notifications on this device"
        inline
        hint={push.status ? PUSH_HINTS[push.status] : "Checking this device…"}
      >
        {canToggle && (
          <Switch
            label="Notifications on this device"
            checked={push.status === "on"}
            disabled={push.busy}
            onChange={async (on) => {
              try {
                const next = await (on ? push.enable() : push.disable());
                if (next === "on") toast.success("Notifications are on for this device");
                else if (next === "denied") toast.error("Notifications are blocked for Xbanka");
              } catch {
                toast.error("We couldn’t turn on notifications. Try again.");
              }
            }}
          />
        )}
      </Row>
    </Section>
  );
}

function NotificationsTab() {
  const settings = useSettings();

  return (
    <div className="space-y-5">
      <PushNotificationsSection />

      <Section title="Sounds" description="Plays while Xbanka is open in this browser.">
        <Row
          label="Transaction sounds"
          inline
          hint={
            <>
              A chime when money comes in, a softer one when it goes out.{" "}
              <span className="inline-flex flex-wrap gap-x-3">
                <button
                  type="button"
                  onClick={() => previewChime("in")}
                  className="inline-flex items-center gap-1 text-Green hover:underline"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  Play money in
                </button>
                <button
                  type="button"
                  onClick={() => previewChime("out")}
                  className="inline-flex items-center gap-1 text-Green hover:underline"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  Play money out
                </button>
              </span>
            </>
          }
        >
          <Switch
            label="Transaction sounds"
            checked={settings.transactionSounds}
            onChange={(on) => {
              settings.set({ transactionSounds: on });
              if (on) previewChime("in");
              saved();
            }}
          />
        </Row>
      </Section>

      <Section
        title="What we tell you about"
        description="Choose where each alert goes. In-app alerts pop up while you’re using Xbanka; everything still lands in your notification list."
      >
        <div className="hidden sm:grid grid-cols-[1fr_5.5rem_5.5rem] px-5 py-3 text-[13px] text-text">
          <span>Alert</span>
          <span className="text-center">In app</span>
          <span className="text-center">Email</span>
        </div>
        {NOTIFICATION_CATEGORIES.map((c) => {
          const pref = settings.notifications[c.id];
          return (
            <div
              key={c.id}
              className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_5.5rem_5.5rem] items-center gap-x-4 sm:gap-x-0 px-5 py-4"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium text-card-text">{c.label}</div>
                <div className="text-[13px] text-text">{c.hint}</div>
              </div>
              {(["inApp", "email"] as const).map((channel) => {
                const locked = isLocked(c.id, channel);
                const name = channel === "inApp" ? "In app" : "Email";
                return (
                  <div key={channel} className="flex flex-col items-center gap-1">
                    <span className="text-[11px] text-text sm:hidden">{name}</span>
                    <Switch
                      label={`${c.label}, ${name}${locked ? ", always on" : ""}`}
                      checked={locked || pref[channel]}
                      disabled={locked}
                      onChange={(on) => {
                        settings.setNotification(c.id, channel, on);
                        saved();
                      }}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
        <p className="px-5 py-3 text-[13px] text-text">
          Security alerts always reach you by email.
        </p>
      </Section>
    </div>
  );
}

function PrivacyTab() {
  const settings = useSettings();
  const setHidden = useBalanceVisibilityStore((s) => s.setHidden);

  return (
    <div className="space-y-5">
      <Section title="On screen" description="What people around you can see.">
        <Row
          label="Hide balances when the app opens"
          inline
          hint="Balances start masked. Tap the eye on any balance to show them."
        >
          <Switch
            label="Hide balances when the app opens"
            checked={settings.hideBalancesOnOpen}
            onChange={(on) => {
              settings.set({ hideBalancesOnOpen: on });
              if (on) setHidden(true);
              saved();
            }}
          />
        </Row>
        <Row
          label="Hide amounts in notifications"
          inline
          hint="Shows •••• instead of amounts in alerts and the notification list."
        >
          <Switch
            label="Hide amounts in notifications"
            checked={settings.hideAmountsInNotifications}
            onChange={(on) => {
              settings.set({ hideAmountsInNotifications: on });
              saved();
            }}
          />
        </Row>
      </Section>

      <Section title="Session" description="Keep your account safe on shared or lost devices.">
        <Row
          label="Sign me out after inactivity"
          htmlFor="settings-auto-signout"
          hint="Applies to this device."
        >
          <NativeSelect
            id="settings-auto-signout"
            value={String(settings.autoSignOutMinutes)}
            onChange={(v) => {
              settings.set({ autoSignOutMinutes: Number(v) });
              saved();
            }}
          >
            {AUTO_SIGN_OUT_OPTIONS.map((o) => (
              <option key={o.minutes} value={o.minutes}>
                {o.label}
              </option>
            ))}
          </NativeSelect>
        </Row>
        <Link
          href="/account?tab=security"
          className="flex items-center justify-between gap-6 px-5 py-4 hover:bg-border/50 transition-colors"
        >
          <span className="min-w-0">
            <span className="block text-sm font-medium text-card-text">Devices and sessions</span>
            <span className="block mt-0.5 text-[13px] text-text">
              See where you’re signed in and sign out other devices.
            </span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-text" />
        </Link>
      </Section>

      <Section title="Danger zone" danger>
        <Row
          label="Close account"
          hint="Our team will help you withdraw your balance first. This can’t be undone."
        >
          <CloseAccountRequest />
        </Row>
      </Section>
    </div>
  );
}

const CLOSE_ACCOUNT_MESSAGE =
  "I’d like to close my Xbanka account. Please help me withdraw any remaining balance first.";

/**
 * Closing an account is handled by the support team, so this emails them a
 * closure request (with the account details attached by the server). It asks
 * once before sending.
 */
function CloseAccountRequest() {
  const { data: profileData } = UseProfileUser();
  const uid: string | undefined = profileData?.data?.xbId;
  const [confirming, setConfirming] = useState(false);
  const { mutate: send, isPending, isSuccess, error, reset } = UseSendSupportRequest();

  if (isSuccess) {
    return (
      <span className="inline-flex h-10 shrink-0 items-center gap-2 text-sm text-card-text">
        <CheckCircle2 className="h-4 w-4 text-Green" />
        Request sent
      </span>
    );
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-error-text/50 px-4 text-sm font-medium text-error-text transition-colors hover:bg-error-text/10"
      >
        <Mail className="h-4 w-4" />
        Request closure
      </button>
    );
  }

  const fallbackLink = mailtoLink(SUPPORT_EMAIL, {
    subject: "[Close account] Xbanka support request",
    body: [CLOSE_ACCOUNT_MESSAGE, uid ? `\nUID: ${uid}` : ""].join("\n"),
  });

  return (
    <div className="flex shrink-0 flex-col items-end gap-2 sm:max-w-xs">
      <p className="text-right text-[13px] text-text">
        Email a closure request to support? They’ll reply to confirm.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setConfirming(false);
            reset();
          }}
          className="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 text-sm font-medium text-card-text transition-colors hover:bg-border disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            send(
              { topic: "Close account", message: CLOSE_ACCOUNT_MESSAGE },
              { onSuccess: () => toast.success("Closure request sent to support") },
            )
          }
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-error-text px-4 text-sm font-medium text-white transition-colors hover:bg-error-text/90 disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Sending…" : "Send request"}
        </button>
      </div>
      {error && (
        <p className="text-right text-xs text-error-text">
          {error.status === 503 ? (
            <>
              Couldn’t send from the app.{" "}
              <a href={fallbackLink} className="underline">
                Email {SUPPORT_EMAIL}
              </a>
            </>
          ) : (
            error.message || "Couldn’t send. Try again."
          )}
        </p>
      )}
    </div>
  );
}

/* ---------- page ---------- */

/**
 * Settings: preferences only. Profile, password, PIN and 2FA stay in Account.
 * Preferences are kept on this device.
 */
export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("tab");
  const current: SettingsTab = TABS.some((t) => t.id === raw) ? (raw as SettingsTab) : "general";

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="space-y-1">
        <h1 className="font-display text-xl sm:text-2xl font-semibold leading-8 text-card-text">
          Settings
        </h1>
        <p className="text-sm text-text">
          How Xbanka looks and behaves for you. Profile and security live in{" "}
          <Link href="/account" className="text-Green hover:underline">
            Account
          </Link>
          .
        </p>
      </div>

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => router.replace(`/settings?tab=${t.id}`, { scroll: false })}
            className={cn(
              "pb-2.5 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px",
              current === t.id
                ? "border-Green text-Green"
                : "border-transparent text-text hover:text-card-text",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {current === "general" && <GeneralTab />}
      {current === "notifications" && <NotificationsTab />}
      {current === "privacy" && <PrivacyTab />}
    </div>
  );
}
