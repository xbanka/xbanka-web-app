import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildSupportEmail, HELP_PAGE_TOPICS } from "@/lib/support/support-request";
import {
  handleSupportRequest,
  resetSupportThrottle,
  type OutgoingMail,
  type SupportRouteDeps,
} from "@/lib/support/support-route";

const ACCOUNT = {
  userId: "XB12345",
  firstName: "Ada",
  lastName: "Obi",
  email: "ada@example.com",
  phoneNumber: "+2348012345678",
};

const post = (body: unknown, token: string | null = "Bearer abc") =>
  new Request("http://localhost/api/support", {
    method: "POST",
    headers: token ? { authorization: token } : {},
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const setup = (overrides: Partial<SupportRouteDeps> = {}) => {
  const sent: OutgoingMail[] = [];
  const deps: SupportRouteDeps = {
    fetchAccount: vi.fn(async () => ACCOUNT),
    sendMail: async (mail) => {
      sent.push(mail);
    },
    ...overrides,
  };
  return { deps, sent };
};

const valid = { topic: "Deposit", message: "My transfer hasn’t arrived." };

describe("support email", () => {
  it("puts the UID and account details in the email", () => {
    const { subject, text } = buildSupportEmail({
      ...valid,
      topic: "Deposit",
      account: ACCOUNT,
      sentAt: new Date("2026-11-12T10:00:00Z"),
    });
    expect(subject).toBe("[Deposit] Ada Obi · UID XB12345");
    expect(text).toContain("UID: XB12345");
    expect(text).toContain("Email: ada@example.com");
    expect(text).toContain("Phone: +2348012345678");
    expect(text).toContain("My transfer hasn’t arrived.");
  });

  it("keeps line breaks out of the subject", () => {
    const { subject } = buildSupportEmail({
      ...valid,
      topic: "Deposit",
      account: { ...ACCOUNT, firstName: "Ada\r\nBcc: x@evil.test" },
    });
    expect(subject).not.toMatch(/[\r\n]/);
  });

  it("does not offer Close account on the help page", () => {
    expect(HELP_PAGE_TOPICS).not.toContain("Close account");
  });
});

describe("POST /api/support", () => {
  beforeEach(() => resetSupportThrottle());

  it("emails the request with the account details and reply-to", async () => {
    const { deps, sent } = setup();
    const res = await handleSupportRequest(post(valid), deps);
    expect(res.status).toBe(200);
    expect(sent).toHaveLength(1);
    expect(sent[0].replyTo).toBe("ada@example.com");
    expect(sent[0].text).toContain("UID: XB12345");
  });

  it("takes the UID from the session, not the request body", async () => {
    const { deps, sent } = setup();
    await handleSupportRequest(post({ ...valid, uid: "SOMEONE-ELSE" }), deps);
    expect(sent[0].text).toContain("UID: XB12345");
    expect(sent[0].text).not.toContain("SOMEONE-ELSE");
  });

  it("refuses without a session", async () => {
    const { deps, sent } = setup();
    expect((await handleSupportRequest(post(valid, null), deps)).status).toBe(401);
    const rejected = setup({ fetchAccount: async () => null });
    expect((await handleSupportRequest(post(valid), rejected.deps)).status).toBe(401);
    expect(sent).toHaveLength(0);
    expect(rejected.sent).toHaveLength(0);
  });

  it("validates topic and message", async () => {
    const { deps, sent } = setup();
    const bad = [
      { topic: "Nope", message: "hi" },
      { topic: "Deposit", message: "   " },
      { topic: "Deposit", message: "x".repeat(2001) },
      "not json",
    ];
    for (const body of bad) {
      expect((await handleSupportRequest(post(body), deps)).status).toBe(400);
    }
    expect(sent).toHaveLength(0);
  });

  it("answers 503 when email isn't configured", async () => {
    const { deps } = setup({ sendMail: null });
    expect((await handleSupportRequest(post(valid), deps)).status).toBe(503);
  });

  it("reports a failed send without counting it against the limit", async () => {
    const failing = setup({
      sendMail: async () => {
        throw new Error("smtp down");
      },
    });
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await handleSupportRequest(post(valid), failing.deps)).status).toBe(502);

    const { deps } = setup();
    for (let i = 0; i < 5; i++) {
      expect((await handleSupportRequest(post(valid), deps)).status).toBe(200);
    }
  });

  it("limits each account to five requests per ten minutes", async () => {
    let now = 0;
    const { deps, sent } = setup({ now: () => now });
    for (let i = 0; i < 5; i++) await handleSupportRequest(post(valid), deps);
    expect((await handleSupportRequest(post(valid), deps)).status).toBe(429);
    now += 10 * 60 * 1000;
    expect((await handleSupportRequest(post(valid), deps)).status).toBe(200);
    expect(sent).toHaveLength(6);
  });
});
