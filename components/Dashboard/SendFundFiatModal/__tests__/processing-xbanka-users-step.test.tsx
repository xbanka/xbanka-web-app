// @vitest-environment happy-dom
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProcessingXbankaStep } from "../processing-xbanka-users-step";

type Opts = { onSuccess: (r: unknown) => void; onError: (e: { message: string }) => void };
const mutate = vi.hoisted(() => vi.fn<(payload: unknown, opts: Opts) => void>());
vi.mock("@/lib/services/send-fiat.service", () => ({
  useTransferFiatToXbankaUsers: () => ({ mutate }),
}));
vi.mock("@/components/ui/spinner", () => ({ Spinner: () => null }));

const recipient = { id: "user-2", name: "Ada Obi", uid: "xb-ab12c", amount: 5000 };

const setup = () => {
  const props = {
    amount: "5000",
    accountName: "Ada Obi",
    recipient,
    handleStep: vi.fn(),
    setReference: vi.fn(),
    setMessage: vi.fn(),
    onTierRequired: vi.fn(),
  };
  render(<ProcessingXbankaStep {...props} />);
  return props;
};

beforeEach(() => {
  mutate.mockReset();
});
afterEach(cleanup);

describe("ProcessingXbankaStep errors", () => {
  it.each(["Tier 2 required", "TIER_REQUIRED", "This action requires Tier 2 verification"])(
    "hands a tier error (%s) to onTierRequired, not back to PIN",
    (message) => {
      mutate.mockImplementation((_p, o) => o.onError({ message }));
      const props = setup();
      expect(props.onTierRequired).toHaveBeenCalledWith(message);
      expect(props.handleStep).not.toHaveBeenCalled();
    },
  );

  it("any other error goes back to the PIN step as before", () => {
    mutate.mockImplementation((_p, o) => o.onError({ message: "Insufficient balance" }));
    const props = setup();
    expect(props.handleStep).toHaveBeenCalledWith("enter_pin_xbanka");
    expect(props.onTierRequired).not.toHaveBeenCalled();
  });

  it("sends the target user and amount", () => {
    setup();
    expect(mutate.mock.calls[0][0]).toEqual({ targetUserId: "user-2", amount: 5000 });
  });
});
