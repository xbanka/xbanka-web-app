import { describe, expect, it, vi } from "vitest";
import { TRACE_PREFIX, traceWithdrawal } from "@/lib/nomba-withdrawal";

describe("traceWithdrawal", () => {
  it("writes one prefixed JSON line", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    traceWithdrawal({
      event: "status_final",
      reference: "NWD-1",
      status: "COMPLETED",
      elapsedMs: 4200,
    });
    expect(info).toHaveBeenCalledTimes(1);
    const [prefix, line] = info.mock.calls[0];
    expect(prefix).toBe(TRACE_PREFIX);
    expect(JSON.parse(line as string)).toMatchObject({
      event: "status_final",
      reference: "NWD-1",
      status: "COMPLETED",
      elapsedMs: 4200,
      at: expect.any(Number),
    });
  });

  it("has no field that could carry the token or PIN", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    traceWithdrawal({ event: "confirm_failed", kind: "wrong-pin" });
    const line = info.mock.calls[0][1] as string;
    expect(Object.keys(JSON.parse(line)).sort()).toEqual(["at", "event", "kind"]);
  });
});
