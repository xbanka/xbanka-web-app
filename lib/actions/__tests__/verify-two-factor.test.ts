import { beforeEach, describe, expect, it, vi } from "vitest";

const post = vi.fn();
vi.mock("../../AxiosInstance/AxiosInstance", () => ({
  default: { post: (...args: unknown[]) => post(...args) },
}));

import { verifyTwoFactor } from "../auth";

describe("verifyTwoFactor", () => {
  beforeEach(() => {
    post.mockReset();
    post.mockResolvedValue({ data: { access_token: "a" }, status: 200 });
  });

  // Regression: we sent `code`, the backend reads `token`, so every 2FA
  // login failed with 401 "Invalid 2FA token".
  it("sends the authenticator code as `token`", async () => {
    await verifyTwoFactor({ userId: "user-1", code: "123456" });

    const [url, body] = post.mock.calls[0];
    expect(url).toBe("/auth/2fa/login");
    expect(body).toEqual({ userId: "user-1", token: "123456" });
    expect(body).not.toHaveProperty("code");
  });

  it("returns the response body as data", async () => {
    const result = await verifyTwoFactor({ userId: "user-1", code: "123456" });
    expect(result).toEqual({
      success: true,
      data: { access_token: "a" },
      status: 200,
    });
  });
});
