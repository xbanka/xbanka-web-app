// Request handling for POST /api/support, kept free of next/server and of
// nodemailer so it is unit-testable: the profile lookup and the mail send
// are passed in.
import {
  buildSupportEmail,
  isSupportTopic,
  MAX_MESSAGE_LENGTH,
  type SupportAccount,
} from "./support-request";

export type OutgoingMail = {
  subject: string;
  text: string;
  replyTo?: string;
};

export type SupportRouteDeps = {
  /** The signed-in account for this bearer token, or null if the backend
   *  rejects it. */
  fetchAccount: (authorization: string) => Promise<SupportAccount | null>;
  /** Null when email isn't configured on this deployment. */
  sendMail: ((mail: OutgoingMail) => Promise<void>) | null;
  now?: () => number;
};

const MAX_BODY_BYTES = 8 * 1024;

/** Per-account throttle. Best effort: it lives in this server instance's
 *  memory, which is enough to stop a stuck button or a script from flooding
 *  the inbox. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recentSends = new Map<string, number[]>();

export const resetSupportThrottle = () => recentSends.clear();

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function handleSupportRequest(
  request: Request,
  { fetchAccount, sendMail, now = Date.now }: SupportRouteDeps,
): Promise<Response> {
  const authorization = request.headers.get("authorization") ?? "";
  if (!/^Bearer \S+$/.test(authorization)) {
    return json(401, { message: "Please sign in again." });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json(413, { message: "Your message is too long." });
  }

  let body: { topic?: unknown; message?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { message: "Invalid request." });
  }
  const { topic, message } = body;
  if (!isSupportTopic(topic)) {
    return json(400, { message: "Choose what your request is about." });
  }
  if (typeof message !== "string" || !message.trim()) {
    return json(400, { message: "Describe the problem first." });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return json(400, {
      message: `Keep your message under ${MAX_MESSAGE_LENGTH} characters.`,
    });
  }

  if (!sendMail) {
    return json(503, {
      message: "Email support isn’t available right now.",
    });
  }

  let account: SupportAccount | null;
  try {
    account = await fetchAccount(authorization);
  } catch {
    return json(502, { message: "We couldn’t reach Xbanka. Try again." });
  }
  if (!account?.userId) {
    return json(401, { message: "Please sign in again." });
  }

  const at = now();
  const recent = (recentSends.get(account.userId) ?? []).filter(
    (time) => at - time < WINDOW_MS,
  );
  if (recent.length >= MAX_PER_WINDOW) {
    return json(429, {
      message:
        "You’ve sent several requests just now. We’ll reply to those first.",
    });
  }

  const { subject, text } = buildSupportEmail({
    topic,
    message,
    account,
    sentAt: new Date(at),
  });

  try {
    await sendMail({
      subject,
      text,
      replyTo: account.email ?? undefined,
    });
  } catch (err) {
    console.error("[support] email send failed", err);
    return json(502, { message: "We couldn’t send your request. Try again." });
  }

  recentSends.set(account.userId, [...recent, at]);
  return json(200, { ok: true });
}
