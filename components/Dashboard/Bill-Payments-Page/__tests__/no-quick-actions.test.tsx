// @vitest-environment happy-dom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const idle = { data: undefined, isPending: false, isError: false, error: null };

vi.mock("@/lib/services/bills.service", () => ({
  useBettingProviders: () => idle,
  useBillNetworks: () => idle,
  useDiscos: () => idle,
}));
vi.mock("@/lib/services/wallet.service", () => ({
  UseGetTransactionHistory: () => idle,
}));
vi.mock("../bill-checkout-modal", () => ({ BillCheckoutModal: () => null }));

import BillPaymentsPage from "../bill-payments-page";

afterEach(cleanup);

// The Quick Action card was four "Coming soon" buttons. It is gone, and
// Recent Transaction now spans the full width on its own.
describe("Bill payments page has no Quick Action section", () => {
  it("does not render the Quick Action card or its placeholder actions", () => {
    render(<BillPaymentsPage />);
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/quick action/i);
    for (const label of [
      "Repeat Last Payment",
      "Schedule Payment",
      "Set Reminders",
      "View Analytics",
    ]) {
      expect(screen.queryByText(label)).toBeNull();
    }
  });

  it("renders Recent Transaction outside a two-column grid", () => {
    render(<BillPaymentsPage />);
    const recent = document.querySelector('[data-tour="bills-recent"]');
    expect(recent).not.toBeNull();
    expect(recent?.parentElement?.className ?? "").not.toMatch(/grid-cols-2/);
  });
});
