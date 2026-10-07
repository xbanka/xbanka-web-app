// @vitest-environment happy-dom
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { STATUS_POLL_WINDOW_MS } from "@/lib/nomba-withdrawal";
import type { NombaWithdrawal } from "@/lib/types/wallet-types";
import { WithdrawalResultStep } from "../withdrawal-result-step";

const statusHook = vi.fn();
vi.mock("@/lib/services/wallet.service", () => ({
  UseNombaWithdrawalStatus: (...args: unknown[]) => statusHook(...args),
}));

const traceMock = vi.fn();
vi.mock("@/lib/nomba-withdrawal", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/nomba-withdrawal")>()),
  traceWithdrawal: (...args: unknown[]) => traceMock(...args),
}));

vi.mock("../success-step", () => ({
  SuccessStep: ({ reference }: { reference: string }) => <div>success {reference}</div>,
}));

const base: NombaWithdrawal = {
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
const recipient = {
  accountNumber: "0123456789",
  bankCode: "058",
  bankName: "GTBank",
  accountName: "JOHN DOE",
  amount: 5000,
  narration: "",
};

const renderStep = (withdrawal: NombaWithdrawal) =>
  render(
    <WithdrawalResultStep
      withdrawal={withdrawal}
      recipient={recipient}
      onDone={vi.fn()}
      onAddMore={vi.fn()}
    />,
  );

beforeEach(() => {
  statusHook.mockReset().mockReturnValue({ data: undefined });
  traceMock.mockReset();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("WithdrawalResultStep", () => {
  it("shows success with the real reference for COMPLETED", () => {
    renderStep({ ...base, status: "COMPLETED" });
    expect(screen.getByText("success NWD-1")).toBeInTheDocument();
    expect(traceMock).toHaveBeenCalledWith(
      expect.objectContaining({ event: "status_final", status: "COMPLETED", reference: "NWD-1" }),
    );
  });

  it("does not poll a withdrawal that is already final", () => {
    renderStep({ ...base, status: "COMPLETED" });
    expect(statusHook.mock.calls[0][0]).toBeUndefined();
  });

  it("says the money was returned for FAILED", () => {
    renderStep({ ...base, status: "FAILED" });
    expect(screen.getByText("Withdrawal failed")).toBeInTheDocument();
    expect(screen.getByText("₦5,000 has been returned to your wallet.")).toBeInTheDocument();
    expect(screen.getByText("NWD-1")).toBeInTheDocument();
  });

  it("polls a PENDING withdrawal by reference and shows processing", () => {
    renderStep(base);
    expect(screen.getByText("Processing your withdrawal")).toBeInTheDocument();
    const [reference, pollUntil] = statusHook.mock.calls[0];
    expect(reference).toBe("NWD-1");
    expect(pollUntil - Date.now()).toBeGreaterThan(STATUS_POLL_WINDOW_MS - 1_000);
    expect(traceMock).not.toHaveBeenCalled();
  });

  it("switches to success when polling reports COMPLETED", () => {
    const { rerender } = renderStep(base);
    statusHook.mockReturnValue({ data: { ...base, status: "COMPLETED" } });
    rerender(
      <WithdrawalResultStep withdrawal={base} recipient={recipient} onDone={vi.fn()} onAddMore={vi.fn()} />,
    );
    expect(screen.getByText("success NWD-1")).toBeInTheDocument();
    expect(traceMock).toHaveBeenCalledTimes(1);
  });

  it("hands off to the notification after the poll window", () => {
    vi.useFakeTimers();
    renderStep(base);
    expect(screen.queryByText(/We'll notify you/)).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(STATUS_POLL_WINDOW_MS));
    expect(screen.getByText(/We'll notify you when it completes/)).toBeInTheDocument();
    expect(traceMock).toHaveBeenCalledExactlyOnceWith({
      event: "poll_window_ended",
      reference: "NWD-1",
    });
  });
});
