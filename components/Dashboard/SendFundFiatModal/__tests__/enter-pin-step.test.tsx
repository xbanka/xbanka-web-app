// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { NombaWithdrawal } from "@/lib/types/wallet-types";
import { useOnboardingModalStore } from "@/store/onboarding-modal-store";
import { EnterPinStep, UNKNOWN_OUTCOME_MESSAGE } from "../enter-pin-step";

const confirmMock = vi.fn();
vi.mock("@/lib/services/wallet.service", () => ({
  UseConfirmNombaWithdrawal: () => ({ mutateAsync: confirmMock }),
}));

// Retries run without the real 1s / 2s waits; traces are captured.
const traceMock = vi.fn();
vi.mock("@/lib/nomba-withdrawal", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/nomba-withdrawal")>();
  return {
    ...actual,
    traceWithdrawal: (...args: unknown[]) => traceMock(...args),
    confirmWithRetry: (fn: () => Promise<unknown>, opts: object) =>
      actual.confirmWithRetry(fn, { ...opts, wait: () => Promise.resolve() }),
  };
});

vi.mock("@/components/Layout/ResetPinModal", () => ({ ResetPinModal: () => null }));
vi.mock("@/components/Dashboard/Account-Page/create-pin-modal", () => ({
  CreatePinModal: ({ open }: { open: boolean }) => (open ? <div>create-pin-modal</div> : null),
}));

const err = (status: number, message: string) => ({ success: false, status, message });
const TIMEOUT = err(408, "Network timeout. Please check your connection.");

const withdrawal: NombaWithdrawal = {
  reference: "NWD-1",
  status: "PENDING",
  amount: 5000,
  currency: "NGN",
  accountName: "JOHN DOE",
  accountNumber: "0123456789",
  bankCode: "058",
  createdAt: "2026-10-05T10:31:02.000Z",
  updatedAt: "2026-10-05T10:31:02.000Z",
};

const setup = () => {
  const props = {
    withdrawalToken: "token-abc",
    onBack: vi.fn(),
    onClose: vi.fn(),
    onExpired: vi.fn(),
    onConfirmed: vi.fn(),
  };
  render(<EnterPinStep {...props} />);
  return props;
};

const digits = () => screen.getAllByLabelText(/Digit \d of 4/) as HTMLInputElement[];
const withdrawButton = () => screen.getByRole("button", { name: /Withdraw|Processing/ });

const enterPinAndSubmit = (pin = "1234") => {
  // OtpInput fills forward when several digits land in the first box.
  fireEvent.change(digits()[0], { target: { value: pin } });
  fireEvent.click(withdrawButton());
};

beforeEach(() => {
  confirmMock.mockReset();
  traceMock.mockReset();
  useOnboardingModalStore.setState({ activeModal: null });
});
afterEach(cleanup);

describe("EnterPinStep", () => {
  it("keeps Withdraw disabled until 4 digits are entered", () => {
    setup();
    expect(withdrawButton()).toBeDisabled();
    fireEvent.change(digits()[0], { target: { value: "123" } });
    expect(withdrawButton()).toBeDisabled();
    fireEvent.change(digits()[3], { target: { value: "4" } });
    expect(withdrawButton()).toBeEnabled();
  });

  it("confirms with the token and PIN, then hands over the withdrawal", async () => {
    confirmMock.mockResolvedValue(withdrawal);
    const props = setup();
    enterPinAndSubmit();
    await waitFor(() => expect(props.onConfirmed).toHaveBeenCalledWith(withdrawal));
    expect(confirmMock).toHaveBeenCalledExactlyOnceWith({
      withdrawalToken: "token-abc",
      pin: "1234",
    });
    expect(traceMock).toHaveBeenCalledWith({
      event: "confirm_succeeded",
      reference: "NWD-1",
      status: "PENDING",
    });
  });

  it("ignores a second tap while the first is in flight", async () => {
    let resolve!: (w: NombaWithdrawal) => void;
    confirmMock.mockReturnValue(new Promise((r) => (resolve = r)));
    const props = setup();
    enterPinAndSubmit();
    fireEvent.click(withdrawButton());
    resolve(withdrawal);
    await waitFor(() => expect(props.onConfirmed).toHaveBeenCalled());
    expect(confirmMock).toHaveBeenCalledTimes(1);
  });

  it("clears the boxes on a wrong PIN so the user can retry", async () => {
    confirmMock.mockRejectedValue(err(403, "Invalid transaction PIN"));
    const props = setup();
    enterPinAndSubmit();
    expect(await screen.findByText("Invalid transaction PIN")).toBeInTheDocument();
    expect(digits().map((d) => d.value)).toEqual(["", "", "", ""]);
    expect(withdrawButton()).toBeDisabled();
    expect(digits()[0]).toBeEnabled();
    expect(props.onConfirmed).not.toHaveBeenCalled();
    expect(traceMock).toHaveBeenCalledWith({ event: "confirm_failed", kind: "wrong-pin" });
  });

  it("locks PIN entry after too many wrong PINs", async () => {
    confirmMock.mockRejectedValue(err(429, "Too many incorrect PIN attempts. Try again in 15 minutes"));
    setup();
    enterPinAndSubmit();
    expect(await screen.findByText(/Too many incorrect PIN attempts/)).toBeInTheDocument();
    digits().forEach((d) => expect(d).toBeDisabled());
    expect(withdrawButton()).toBeDisabled();
  });

  it("retries a timeout with the same token and succeeds", async () => {
    confirmMock.mockRejectedValueOnce(TIMEOUT).mockResolvedValue(withdrawal);
    const props = setup();
    enterPinAndSubmit();
    await waitFor(() => expect(props.onConfirmed).toHaveBeenCalledWith(withdrawal));
    expect(confirmMock).toHaveBeenCalledTimes(2);
    expect(confirmMock.mock.calls.every(([p]) => p.withdrawalToken === "token-abc")).toBe(true);
    expect(traceMock).toHaveBeenCalledWith({ event: "confirm_retry", attempt: 1 });
  });

  it("never says 'failed' when the outcome stays unknown", async () => {
    confirmMock.mockRejectedValue(TIMEOUT);
    const props = setup();
    enterPinAndSubmit();
    expect(await screen.findByText(UNKNOWN_OUTCOME_MESSAGE)).toBeInTheDocument();
    expect(confirmMock).toHaveBeenCalledTimes(3);
    expect(screen.queryByText(/fail/i)).not.toBeInTheDocument();
    expect(props.onConfirmed).not.toHaveBeenCalled();
    expect(props.onExpired).not.toHaveBeenCalled();
  });

  it("does not restart the flow when a retry after a timeout says expired", async () => {
    confirmMock
      .mockRejectedValueOnce(TIMEOUT)
      .mockRejectedValue(err(400, "Withdrawal request expired. Please start again"));
    const props = setup();
    enterPinAndSubmit();
    expect(await screen.findByText(UNKNOWN_OUTCOME_MESSAGE)).toBeInTheDocument();
    expect(props.onExpired).not.toHaveBeenCalled();
  });

  it("sends the user back to initiate when the token has expired", async () => {
    confirmMock.mockRejectedValue(err(400, "Withdrawal request expired. Please start again"));
    const props = setup();
    enterPinAndSubmit();
    await waitFor(() =>
      expect(props.onExpired).toHaveBeenCalledWith("Withdrawal request expired. Please start again"),
    );
  });

  it("closes and opens BVN verification when the tier is too low", async () => {
    confirmMock.mockRejectedValue(err(403, "Withdrawal blocked: TIER_REQUIRED"));
    const props = setup();
    enterPinAndSubmit();
    await waitFor(() => expect(props.onClose).toHaveBeenCalled());
    expect(useOnboardingModalStore.getState().activeModal).toBe("bvn");
  });

  it("opens PIN setup when the user has no transaction PIN", async () => {
    confirmMock.mockRejectedValue(err(403, "Withdrawal blocked: PIN_SETUP_REQUIRED"));
    setup();
    enterPinAndSubmit();
    expect(await screen.findByText("create-pin-modal")).toBeInTheDocument();
    expect(digits().map((d) => d.value)).toEqual(["", "", "", ""]);
  });

  it("shows readable text for the daily limit", async () => {
    confirmMock.mockRejectedValue(err(403, "Withdrawal blocked: LIMIT_EXCEEDED"));
    setup();
    enterPinAndSubmit();
    expect(await screen.findByText(/daily withdrawal limit/)).toBeInTheDocument();
    expect(screen.queryByText(/LIMIT_EXCEEDED/)).not.toBeInTheDocument();
  });
});
