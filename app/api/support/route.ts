import nodemailer from "nodemailer";
import { handleSupportRequest, type OutgoingMail } from "@/lib/support/support-route";
import type { SupportAccount } from "@/lib/support/support-request";
import { SUPPORT_EMAIL } from "@/lib/supportContacts";

// nodemailer needs Node's net/tls, not the edge runtime.
export const runtime = "nodejs";

/**
 * Email settings (server-only, never NEXT_PUBLIC_). Either:
 *   RESEND_API_KEY  the backend's Resend key; sends via smtp.resend.com
 *   RESEND_FROM     e.g. "Xbanka <notifications@xbankang.com>" (address used)
 * or any SMTP server:
 *   SMTP_HOST, SMTP_PORT (465 = TLS, else STARTTLS), SMTP_USER, SMTP_PASS
 *   SUPPORT_FROM    the sending address (default SMTP_USER)
 * Plus, optionally:
 *   SUPPORT_INBOX   where requests go (default support@xbankang.com)
 * With none of them the route answers 503 and the page falls back to the
 * user's own mail app.
 */

/** "Xbanka <notifications@x.com>" → "notifications@x.com"; a bare address as is. */
const addressOf = (value?: string) => value?.match(/<([^>]+)>/)?.[1] ?? value?.trim();

const makeSender = () => {
  const env = process.env;
  const resendKey = env.RESEND_API_KEY?.trim();
  // SMTP settings win when set; otherwise Resend's SMTP with its API key.
  const host = env.SMTP_HOST || (resendKey ? "smtp.resend.com" : "");
  const user = env.SMTP_USER || (resendKey ? "resend" : "");
  const pass = env.SMTP_PASS || resendKey || "";
  if (!host || !user || !pass) return null;

  const port = Number(env.SMTP_PORT) || 465;
  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  const to = env.SUPPORT_INBOX || SUPPORT_EMAIL;
  const from = addressOf(env.SUPPORT_FROM) || addressOf(env.RESEND_FROM) || user;

  return async ({ subject, text, replyTo }: OutgoingMail) => {
    await transport.sendMail({
      from: `Xbanka Support Form <${from}>`,
      to,
      replyTo,
      subject,
      text,
    });
  };
};

/** Confirms the session with the backend and returns the account on file. */
const fetchAccount = async (
  authorization: string,
): Promise<SupportAccount | null> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
    headers: { Authorization: authorization },
    cache: "no-store",
  });
  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) throw new Error(`profile lookup failed: ${res.status}`);
  const payload = await res.json();
  const data = payload?.data ?? payload;
  if (!data?.userId) return null;
  return {
    userId: String(data.userId),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phoneNumber: data.phoneNumber,
  };
};

export async function POST(request: Request) {
  return handleSupportRequest(request, {
    fetchAccount,
    sendMail: makeSender(),
  });
}
