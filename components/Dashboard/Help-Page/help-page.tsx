"use client";

import { useState, type FormEvent } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Copy,
  Fingerprint,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Loader2,
  MoveLeft,
  Send,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { UseProfileUser } from "@/lib/services/profile.service";
import { Button } from "@/components/ui/button";
import { UseSendSupportRequest } from "@/lib/services/support.service";
import {
  HELP_PAGE_TOPICS,
  MAX_MESSAGE_LENGTH,
  type SupportTopic,
} from "@/lib/support/support-request";
import { supportWhatsAppNumber, whatsAppLink } from "@/lib/supportWhatsApp";
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
    a: "Transfers to your Xbanka funding account usually land within minutes. Check that you sent to the account number shown under Add Fund. If it is still missing, send us a request with your bank’s session ID.",
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
 * email it to the support inbox from our server with their UID, name, email
 * and phone attached. Support replies to the user's own email.
 */
export default function HelpPage() {
  const { data: profileData } = UseProfileUser();
  const profile = profileData?.data;
  const uid: string | undefined = profile?.xbId;
  const email: string | undefined = profile?.email;
  const number = supportWhatsAppNumber();

  const [topic, setTopic] = useState<SupportTopic>(HELP_PAGE_TOPICS[0]);
  const [message, setMessage] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const { mutate: send, isPending, error, reset } = UseSendSupportRequest();

  const trimmed = message.trim();
  const tooLong = message.length > MAX_MESSAGE_LENGTH;
  const canSend = !!trimmed && !tooLong && !isPending;
  // The server only refuses with 503 when email isn't set up on this
  // deployment; then the user's own mail app is the way through.
  const emailUnavailable = error?.status === 503;
  const fallbackLink = mailtoLink(SUPPORT_EMAIL, {
    subject: `[${topic}] Xbanka support request`,
    body: [trimmed, uid ? `\nUID: ${uid}` : ""].join("\n"),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    send(
      { topic, message: trimmed },
      { onSuccess: () => setSentTo(email ?? "") },
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="space-y-1">
        <h1 className="font-display text-xl sm:text-2xl font-semibold leading-8 text-card-text">
          Help &amp; Support
        </h1>
        <p className="text-sm text-text">
          Tell us what’s wrong and we’ll email the support team for you. They
          reply to your email.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <DashboardCard className="w-full lg:flex-1 min-w-0 p-5 sm:p-7 space-y-6">
          {sentTo !== null ? (
            <div className="space-y-5">
              <div className="flex flex-col items-center text-center gap-3 pt-2">
                <span className="grid place-items-center w-14 h-14 rounded-xl bg-teal-light border border-teal-border text-teal-text">
                  <CheckCircle2 className="w-6 h-6" />
                </span>
                <h2 className="font-display text-lg font-semibold text-card-text">
                  Request sent
                </h2>
                <p className="text-sm text-text max-w-sm">
                  {sentTo
                    ? <>The support team will reply to <span className="font-medium text-card-text">{sentTo}</span>.</>
                    : "The support team has your request and will get back to you."}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4 space-y-1">
                <p className="text-[13px] text-text">{topic}</p>
                <p className="whitespace-pre-wrap break-words text-[14px] leading-6 text-card-text">
                  {trimmed}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSentTo(null);
                  setMessage("");
                  reset();
                }}
                className="inline-flex items-center gap-2 text-sm text-text hover:text-card-text"
              >
                <MoveLeft className="w-4 h-4" />
                Send another request
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              <fieldset className="space-y-3">
                <legend className="mb-3 text-[13px] text-text">
                  1. What is it about?
                </legend>
                <div className="flex flex-wrap gap-2">
                  {HELP_PAGE_TOPICS.map((t) => (
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
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="For example: I paid for electricity on 16 Oct but didn’t get a token."
                  className="w-full rounded-lg border border-input bg-input-background px-3.5 py-3 text-base md:text-[15px] leading-6 text-card-text placeholder:text-placeholder outline-none focus:border-border-active focus:ring-[3px] focus:ring-border-active/20 transition-[border-color,box-shadow] resize-y"
                />
                <div className="flex justify-between gap-4 text-xs text-text">
                  <p>
                    Include amounts, dates or a reference if you have them.
                    Never share your PIN or password.
                  </p>
                  <span className={cn("shrink-0 tabular-nums", tooLong && "text-error-text")}>
                    {message.length}/{MAX_MESSAGE_LENGTH}
                  </span>
                </div>
              </div>

              <p className="text-xs text-text">
                Your UID{uid ? ` (${uid})` : ""}, name, email and phone number
                are attached so the team can find your account.
              </p>

              {error && (
                <div className="rounded-lg border border-error-text/40 bg-error-text/5 px-4 py-3 text-sm text-error-text">
                  {emailUnavailable ? (
                    <>
                      We couldn’t send this from the app. You can{" "}
                      <a href={fallbackLink} className="font-medium underline">
                        email it to {SUPPORT_EMAIL}
                      </a>{" "}
                      instead.
                    </>
                  ) : (
                    error.message || "We couldn’t send your request. Try again."
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Button
                  type="submit"
                  size="lg"
                  disabled={!canSend}
                  className="gap-2 px-6"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isPending ? "Sending…" : "Send to support"}
                </Button>
                <span className="text-xs text-text">
                  {trimmed
                    ? `Goes straight to ${SUPPORT_EMAIL}.`
                    : "Describe the problem to continue."}
                </span>
              </div>
            </form>
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
