"use client";

import { useState } from "react";
import {
  ChevronDown,
  Copy,
  Fingerprint,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  MoveLeft,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { UseProfileUser } from "@/lib/services/profile.service";
import {
  SUPPORT_TOPICS,
  buildSupportMessage,
  supportWhatsAppNumber,
  whatsAppLink,
  type SupportTopic,
} from "@/lib/supportWhatsApp";
import {
  INFO_EMAIL,
  OFFICE_ADDRESS,
  SUPPORT_EMAIL,
  WEBSITE_LABEL,
  WEBSITE_URL,
  formatPhoneNumber,
  mailtoLink,
} from "@/lib/supportContacts";
import { cn } from "@/lib/utils";

const QUICK_ANSWERS: { q: string; a: string }[] = [
  {
    q: "My bank transfer hasn’t arrived",
    a: "Transfers to your Xbanka funding account usually land within minutes. Check that you sent to the account number shown under Add Fund. If it is still missing, message us with your bank’s session ID.",
  },
  {
    q: "I paid for electricity but have no token",
    a: "Open the payment in Transactions and view the receipt. The token is listed there once your disco issues it.",
  },
  {
    q: "How do I raise my limits?",
    a: "Complete BVN, then ID and selfie, under Account › Identity Verification. Each step moves you up a tier.",
  },
  {
    q: "I forgot my transaction PIN",
    a: "Go to Account › Security and choose Change next to Transaction PIN.",
  },
];

/**
 * Help & Support: the user picks a topic and describes the problem, and we
 * hand them to WhatsApp with the message filled in. There is no ticketing on
 * our side; the conversation lives in WhatsApp.
 */
export default function HelpPage() {
  const { data: profileData } = UseProfileUser();
  const uid: string | undefined = profileData?.data?.userId;
  const number = supportWhatsAppNumber();

  const [topic, setTopic] = useState<SupportTopic>(SUPPORT_TOPICS[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const text = buildSupportMessage({ topic, message, uid });
  const link = number ? whatsAppLink(number, text) : null;
  const canSend = !!link && message.trim().length > 0;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Message copied");
    } catch {
      toast.error("Couldn’t copy. Select the message and copy it instead.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="space-y-1">
        <h1 className="font-display text-xl sm:text-2xl font-semibold leading-8 text-card-text">
          Help &amp; Support
        </h1>
        <p className="text-sm text-text">
          Tell us what’s wrong and finish on WhatsApp, or reach us by email. The
          support team replies in the same chat.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <DashboardCard className="w-full lg:flex-1 min-w-0 p-5 sm:p-7 space-y-6">
          {sent ? (
            /* Handoff: WhatsApp has been opened in a new tab. */
            <div className="space-y-5">
              <div className="flex flex-col items-center text-center gap-3 pt-2">
                <span className="grid place-items-center w-14 h-14 rounded-xl bg-teal-light border border-teal-border text-teal-text">
                  <MessageCircle className="w-6 h-6" />
                </span>
                <h2 className="font-display text-lg font-semibold text-card-text">
                  Your message is ready in WhatsApp
                </h2>
                <p className="text-sm text-text max-w-sm">
                  Tap send there and the support team will reply in the same
                  chat.
                </p>
              </div>
              <pre className="whitespace-pre-wrap break-words rounded-lg border border-border bg-background p-4 text-[13px] leading-6 text-card-text font-sans">
                {text}
              </pre>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={link ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 h-12 rounded-md border border-abstract-green bg-Green px-5 text-[15px] font-medium text-white hover:bg-Green/90"
                >
                  <MessageCircle className="w-4 h-4" />
                  Open WhatsApp again
                </a>
                <button
                  type="button"
                  onClick={copy}
                  className="inline-flex flex-1 items-center justify-center gap-2 h-12 rounded-md border border-input bg-card-background px-5 text-[15px] font-medium text-card-text hover:bg-border"
                >
                  <Copy className="w-4 h-4" />
                  Copy message
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setMessage("");
                }}
                className="inline-flex items-center gap-2 text-sm text-text hover:text-card-text"
              >
                <MoveLeft className="w-4 h-4" />
                Start a new request
              </button>
            </div>
          ) : (
            <>
              <fieldset className="space-y-3">
                <legend className="mb-3 text-[13px] text-text">
                  1. What is it about?
                </legend>
                <div className="flex flex-wrap gap-2">
                  {SUPPORT_TOPICS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={topic === t}
                      onClick={() => setTopic(t)}
                      className={cn(
                        "h-10 px-4 rounded-md border text-sm font-medium transition-colors",
                        topic === t
                          ? "border-Green bg-teal-light text-teal-text"
                          : "border-input bg-input-background text-card-text hover:bg-border",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="space-y-2">
                <label htmlFor="help-message" className="block text-[13px] text-text">
                  2. Describe the problem
                </label>
                <textarea
                  id="help-message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="For example: I paid for electricity on 16 Oct but didn’t get a token."
                  className="w-full rounded-lg border border-input bg-input-background px-3.5 py-3 text-base md:text-[15px] leading-6 text-card-text placeholder:text-placeholder outline-none focus:border-border-active focus:ring-[3px] focus:ring-border-active/20 transition-[border-color,box-shadow] resize-y"
                />
                <p className="text-xs text-text">
                  Include amounts, dates or a reference if you have them. Never
                  share your PIN or password.
                </p>
              </div>

              <div className="space-y-2">
                <span className="block text-[13px] text-text">
                  What we’ll send on WhatsApp
                </span>
                <pre className="whitespace-pre-wrap break-words rounded-lg border border-dashed border-input bg-background p-4 text-[13px] leading-6 text-card-text font-sans">
                  {message.trim() ? text : `${text}[your message]`}
                </pre>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <a
                  href={canSend ? link! : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!canSend}
                  onClick={(e) => {
                    if (!canSend) {
                      e.preventDefault();
                      return;
                    }
                    setSent(true);
                  }}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 h-12 rounded-md px-6 text-[15px] font-medium transition-colors",
                    canSend
                      ? "border border-abstract-green bg-Green text-white hover:bg-Green/90"
                      : "bg-border text-disabled-text cursor-not-allowed",
                  )}
                >
                  <MessageCircle className="w-4 h-4" />
                  Continue on WhatsApp
                </a>
                <span className="text-xs text-text">
                  {!number
                    ? "WhatsApp support isn’t set up yet."
                    : message.trim()
                      ? "Opens WhatsApp in a new tab with your message filled in."
                      : "Describe the problem to continue."}
                </span>
              </div>
            </>
          )}
        </DashboardCard>

        <div className="w-full lg:w-80 shrink-0 space-y-5">
          <ContactCard number={number} uid={uid} />
          <DashboardCard className="p-5 space-y-1">
            <h2 className="text-base font-medium text-card-text pb-1">
              Quick answers
            </h2>
            {QUICK_ANSWERS.map(({ q, a }) => (
              <details
                key={q}
                className="group border-b border-border last:border-0 py-3"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-medium text-card-text [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronDown className="mt-0.5 w-4 h-4 shrink-0 text-text transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-[13px] leading-5 text-text">{a}</p>
              </details>
            ))}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

const copyText = async (value: string, what: string) => {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(`${what} copied`);
  } catch {
    toast.error(`Couldn’t copy. Select the ${what.toLowerCase()} and copy it instead.`);
  }
};

/** Every way to reach Xbanka, plus the UID support asks for. */
function ContactCard({ number, uid }: { number: string | null; uid?: string }) {
  const emailBody = uid ? `\n\n\nUID: ${uid}` : undefined;

  return (
    <DashboardCard className="p-5 space-y-3">
      <h2 className="text-base font-medium text-card-text">Contact us</h2>
      <div className="divide-y divide-border rounded-xl border border-border bg-input-background">
        {number && (
          <ContactRow
            icon={MessageCircle}
            label="WhatsApp"
            value={formatPhoneNumber(number)}
            href={whatsAppLink(number, uid ? `Hi Xbanka\n\nUID: ${uid}` : "Hi Xbanka")}
            external
            onCopy={() => copyText(`+${number}`, "Number")}
          />
        )}
        <ContactRow
          icon={Mail}
          label="Customer support"
          value={SUPPORT_EMAIL}
          href={mailtoLink(SUPPORT_EMAIL, { subject: "Xbanka support request", body: emailBody })}
          onCopy={() => copyText(SUPPORT_EMAIL, "Email")}
        />
        <ContactRow
          icon={Mail}
          label="General enquiries"
          value={INFO_EMAIL}
          href={mailtoLink(INFO_EMAIL)}
          onCopy={() => copyText(INFO_EMAIL, "Email")}
        />
        <ContactRow
          icon={Globe}
          label="Website"
          value={WEBSITE_LABEL}
          href={WEBSITE_URL}
          external
        />
        <ContactRow icon={MapPin} label="Office" value={OFFICE_ADDRESS} />
        {uid && (
          <ContactRow
            icon={Fingerprint}
            label="Your UID"
            value={uid}
            hint="Share it with support so we can find your account."
            onCopy={() => copyText(uid, "UID")}
          />
        )}
      </div>
    </DashboardCard>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  hint,
  href,
  external,
  onCopy,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  href?: string;
  external?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-Green" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium tracking-wide text-text uppercase">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="text-sm leading-6 break-words text-Green hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm leading-6 break-words text-card-text">{value}</p>
        )}
        {hint && <p className="text-xs leading-5 text-text">{hint}</p>}
      </div>
      {onCopy && (
        <button
          type="button"
          onClick={onCopy}
          aria-label={`Copy ${label.toLowerCase()}`}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-text hover:bg-border hover:text-card-text transition-colors"
        >
          <Copy className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
