import nodemailer from "nodemailer";
import { handleSupportRequest, type OutgoingMail } from "@/lib/support/support-route";
import type { SupportAccount } from "@/lib/support/support-request";
import { SUPPORT_EMAIL } from "@/lib/supportContacts";

// nodemailer needs Node's net/tls, not the edge runtime.
export const runtime = "nodejs";

/**
 * Email settings (server-only, never NEXT_PUBLIC_):
 *   SMTP_HOST, SMTP_PORT (465 = TLS, else STARTTLS), SMTP_USER, SMTP_PASS
 *   SUPPORT_INBOX  where requests go      (default support@xbankang.com)
 *   SUPPORT_FROM   the sending address    (default SMTP_USER)
 * Without SMTP_HOST/USER/PASS the route answers 503 and the page falls back
 * to the user's own mail app.
 */
const makeSender = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  const port = Number(SMTP_PORT) || 465;
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  const to = process.env.SUPPORT_INBOX || SUPPORT_EMAIL;
  const from = process.env.SUPPORT_FROM || SMTP_USER;

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
